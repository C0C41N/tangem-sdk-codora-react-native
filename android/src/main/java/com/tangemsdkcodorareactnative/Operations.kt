@file:OptIn(DelicateCoroutinesApi::class, ExperimentalStdlibApi::class)
@file:Suppress("unused")

package com.tangemsdkcodorareactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.tangem.Message
import com.tangem.common.UserCodeType
import com.tangem.common.card.EllipticCurve
import com.tangem.common.core.UserCodeRequestPolicy
import com.tangem.common.extensions.calculateSha256
import com.tangem.common.extensions.toHexString
import com.tangem.crypto.bip39.DefaultMnemonic
import com.tangem.crypto.decodeBase58
import com.tangem.crypto.encodeToBase58String
import com.tangem.crypto.hdWallet.DerivationPath
import com.tangem.crypto.hdWallet.masterkey.AnyMasterKeyFactory
import com.tangem.operations.ScanTask
import com.tangem.operations.backup.ResetBackupCommand
import com.tangem.operations.derivation.DeriveWalletPublicKeyTask
import com.tangem.operations.pins.SetUserCodeCommand
import com.tangem.operations.sign.SignCommand
import com.tangem.operations.usersetttings.SetUserCodeRecoveryAllowedTask
import com.tangem.operations.wallet.CreateWalletTask
import com.tangem.operations.wallet.PurgeWalletCommand
import com.tangem.sdk.codora.TangemSdkProvider
import com.tangem.sdk.codora.runAsync
import com.tangem.sdk.codora.startSessionAsync
import com.tangem.sdk.codora.toJson
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch

class Operations(private val module: TangemModule) {

  fun scan(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    migratePublicKey: String?,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val startSessionResult = module.sdk.startSessionAsync(
      cardId,
      initialMessage = Message(header = msgHeader, body = msgBody),
      accessCode
    )

    if (!startSessionResult.success || startSessionResult.value == null) {
      module.handleReject(promise, startSessionResult.error!!)
      return@launch
    }

    val session = startSessionResult.value!!

    val scanTask = ScanTask()
    val scanResult = scanTask.runAsync(session)

    if (!scanResult.success || scanResult.value == null) {
      module.handleReject(promise, scanResult.error!!)
      session.stop()
      return@launch
    }

    var card = scanResult.value!!

    val shouldMigrate = run {
      if (migratePublicKey == null) return@run false

      val hasSecp = card.wallets.any { it.curve == EllipticCurve.Secp256k1 && it.publicKey.toHexString() == migratePublicKey }

      if (!hasSecp) {
        module.handleReject(promise, "initiated: migratePublicKey not found or isn't of secp256k1")
        return@run false
      }

      val hasEd = card.wallets.any { it.curve == EllipticCurve.Ed25519 }

      if (hasEd) {
        module.handleReject(promise, "initiated: card already contains a wallet of curve ed25519")
        return@run false
      }

      true
    }

    if (!shouldMigrate && migratePublicKey != null) {
      session.stop()
      return@launch
    }

    if (shouldMigrate) {

      // Derive entropy

      val secpWallet = card.wallets.first { it.publicKey.toHexString() == migratePublicKey }
      val secpPubKeyData = secpWallet.publicKey

      val path = DerivationPath("m/44'/501'/141414'/0'")

      val deriveHDWallet = DeriveWalletPublicKeyTask(secpPubKeyData, path)
      val deriveHDWalletResult = deriveHDWallet.runAsync(session)

      if (!deriveHDWalletResult.success) {
        module.handleReject(promise, "initiated: ${deriveHDWalletResult.error!!}")
        session.stop()
        return@launch
      }

      val hdWallet = deriveHDWalletResult.value!!
      val sourceOfEntropy = hdWallet.publicKey + hdWallet.chainCode
      val entropy = sourceOfEntropy.calculateSha256()

      // Import new wallet

      val bip39 = TangemSdkProvider.getBip39()

      val mnemonicComponents = bip39.generateMnemonic(entropy, bip39.wordlist)
      val mnemonicString = mnemonicComponents.joinToString(" ")

      val mnemonic = DefaultMnemonic(mnemonicString, bip39.wordlist)
      val factory = AnyMasterKeyFactory(mnemonic, "")
      val privateKey = factory.makeMasterKey(EllipticCurve.Ed25519)

      val createWallet = CreateWalletTask(EllipticCurve.Ed25519, privateKey)
      val createWalletResult = createWallet.runAsync(session)

      if (!createWalletResult.success) {
        module.handleReject(promise, "keypair_created: ${createWalletResult.error!!}")
        session.stop()
        return@launch
      }

      // Include newly created wallet in scan result

      card = card.copy(wallets = card.wallets.plus(createWalletResult.value!!.wallet))

    }


    val resultMap = Arguments.createMap()
    val publicKeysArray = Arguments.createArray()

    card.wallets.map { it.publicKey.encodeToBase58String() }.forEach { publicKeysArray.pushString(it) }

    resultMap.putString("card", card.toJson())
    resultMap.putArray("publicKeysBase58", publicKeysArray)

    session.stop()
    promise.resolve(resultMap)

  } }

  fun sign(
    unsignedHex: String,
    pubKeyBase58: String,
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val publicKey = pubKeyBase58.decodeBase58()
    val unsignedBytes = unsignedHex.hexToByteArray()

    val startSessionResult = module.sdk.startSessionAsync(
      cardId,
      initialMessage = Message(header = msgHeader, body = msgBody),
      accessCode
    )

    if (!startSessionResult.success || startSessionResult.value == null) {
      module.handleReject(promise, startSessionResult.error!!)
      return@launch
    }

    val session = startSessionResult.value!!

    val signTask = SignCommand(arrayOf(unsignedBytes), publicKey)
    val signResult = signTask.runAsync(session)

    if (!signResult.success || signResult.value == null) {
      module.handleReject(promise, signResult.error!!)
      session.stop()
      return@launch
    }

    session.stop()
    promise.resolve(signResult.value!!.signatures[0].toHexString())

  } }

  fun signMultiple(
    unsignedHexArr: ReadableArray,
    pubKeyBase58Arr: ReadableArray,
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val startSessionResult = module.sdk.startSessionAsync(
      cardId,
      initialMessage = Message(header = msgHeader, body = msgBody),
      accessCode
    )

    if (!startSessionResult.success || startSessionResult.value == null) {
      module.handleReject(promise, startSessionResult.error!!)
      return@launch
    }

    val session = startSessionResult.value!!
    val signatures = Arguments.createArray()

    val unsignedHexList = unsignedHexArr.toArrayList().map { it as String }
    val pubKeyBase58List = pubKeyBase58Arr.toArrayList().map { it as String }

    for ((unsignedHex, pubKeyBase58) in unsignedHexList.zip(pubKeyBase58List)) {

      val publicKey = pubKeyBase58.decodeBase58()
      val unsignedBytes = unsignedHex.hexToByteArray()

      val signTask = SignCommand(arrayOf(unsignedBytes), publicKey)
      val signResult = signTask.runAsync(session)

      if (!signResult.success || signResult.value == null) {
        module.handleReject(promise, signResult.error!!)
        session.stop()
        return@launch
      }

      signatures.pushString(signResult.value!!.signatures[0].toHexString())

    }

    session.stop()
    promise.resolve(signatures)

  } }

  fun purgeAllWallets(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    onlyEd25519: Boolean,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val startSessionResult = module.sdk.startSessionAsync(
      cardId,
      initialMessage = Message(header = msgHeader, body = msgBody),
      accessCode
    )

    if (!startSessionResult.success || startSessionResult.value == null) {
      module.handleReject(promise, startSessionResult.error!!)
      return@launch
    }

    val session = startSessionResult.value!!

    val scanTask = ScanTask()
    val scanResult = scanTask.runAsync(session)

    if (!scanResult.success || scanResult.value == null) {
      module.handleReject(promise, scanResult.error!!)
      session.stop()
      return@launch
    }

    val card = scanResult.value!!

    val purgedWallets = Arguments.createArray()

    for (wallet in card.wallets) {

      if (onlyEd25519 && wallet.curve != EllipticCurve.Ed25519) continue

      val purgeTask = PurgeWalletCommand(wallet.publicKey)
      val purgeResult = purgeTask.runAsync(session)

      if (!purgeResult.success || purgeResult.value == null) {
        module.handleReject(promise, purgeResult.error!!)
        session.stop()
        return@launch
      }

      val purgedWallet = Arguments.createMap()

      val curve = wallet.curve.name
      val publicKey = wallet.publicKey.encodeToBase58String()

      purgedWallet.putString("curve", curve)
      purgedWallet.putString("publicKey", publicKey)

      purgedWallets.pushMap(purgedWallet)
    }

    session.stop()
    promise.resolve(purgedWallets)

  } }

  fun createAllWallets(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val startSessionResult = module.sdk.startSessionAsync(
      cardId,
      initialMessage = Message(header = msgHeader, body = msgBody),
      accessCode
    )

    if (!startSessionResult.success || startSessionResult.value == null) {
      module.handleReject(promise, startSessionResult.error!!)
      return@launch
    }

    val session = startSessionResult.value!!
    val curves: List<EllipticCurve> = listOf(EllipticCurve.Secp256k1, EllipticCurve.Ed25519, EllipticCurve.Bls12381G2Aug, EllipticCurve.Bip0340, EllipticCurve.Ed25519Slip0010)

    val createdWallets = Arguments.createArray()

    for(curve in curves) {
      val createWallet = CreateWalletTask(curve)
      val createWalletResult = createWallet.runAsync(session)

      if (!createWalletResult.success || createWalletResult.value == null) {
        module.handleReject(promise, startSessionResult.error!!)
        session.stop()
        return@launch
      }

      val createdWallet = Arguments.createMap()

      val publicKey = createWalletResult.value!!.wallet.publicKey.encodeToBase58String()

      createdWallet.putString("curve", curve.name)
      createdWallet.putString("publicKey", publicKey)

      createdWallets.pushMap(createdWallet)
    }

    session.stop()
    promise.resolve(createdWallets)

  } }

  fun setAccessCode(
    newAccessCode: String,
    currentAccessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val startSessionResult = module.sdk.startSessionAsync(
      cardId,
      initialMessage = Message(header = msgHeader, body = msgBody),
      currentAccessCode
    )

    if (!startSessionResult.success || startSessionResult.value == null) {
      module.handleReject(promise, startSessionResult.error!!)
      return@launch
    }

    val session = startSessionResult.value!!

    val setAccessCode = SetUserCodeCommand.changeAccessCode(newAccessCode)
    val setAccessCodeResult = setAccessCode.runAsync(session)

    if (!setAccessCodeResult.success || setAccessCodeResult.value == null) {
      module.handleReject(promise, setAccessCodeResult.error!!)
      session.stop()
      return@launch
    }

    session.stop()
    promise.resolve(null)

  } }

  fun resetBackup(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val startSessionResult = module.sdk.startSessionAsync(
      cardId,
      initialMessage = Message(header = msgHeader, body = msgBody),
      accessCode
    )

    if (!startSessionResult.success || startSessionResult.value == null) {
      module.handleReject(promise, startSessionResult.error!!)
      return@launch
    }

    val session = startSessionResult.value!!

    val resetBackup = ResetBackupCommand()
    val resetBackupResult = resetBackup.runAsync(session)

    if (!resetBackupResult.success || resetBackupResult.value == null) {
      module.handleReject(promise, resetBackupResult.error!!)
      session.stop()
      return@launch
    }

    session.stop()
    promise.resolve(null)

  } }

  fun resetCodes(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val startSessionResult = module.sdk.startSessionAsync(
      cardId,
      initialMessage = Message(header = msgHeader, body = msgBody),
      accessCode
    )

    if (!startSessionResult.success || startSessionResult.value == null) {
      module.handleReject(promise, startSessionResult.error!!)
      return@launch
    }

    val session = startSessionResult.value!!

    val resetCodes = SetUserCodeCommand.resetUserCodes()
    val resetCodesResult = resetCodes.runAsync(session)

    if (!resetCodesResult.success || resetCodesResult.value == null) {
      module.handleReject(promise, resetCodesResult.error!!)
      session.stop()
      return@launch
    }

    session.stop()
    promise.resolve(null)

  } }

  fun resetCard(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val startSessionResult = module.sdk.startSessionAsync(
      cardId,
      initialMessage = Message(header = msgHeader, body = msgBody),
      accessCode
    )

    if (!startSessionResult.success || startSessionResult.value == null) {
      module.handleReject(promise, startSessionResult.error!!)
      return@launch
    }

    val session = startSessionResult.value!!

    val scanTask = ScanTask()
    val scanResult = scanTask.runAsync(session)

    if (!scanResult.success || scanResult.value == null) {
      module.handleReject(promise, scanResult.error!!)
      session.stop()
      return@launch
    }

    val card = scanResult.value!!

    for (wallet in card.wallets) {
      val purgeTask = PurgeWalletCommand(wallet.publicKey)
      val purgeResult = purgeTask.runAsync(session)

      if (!purgeResult.success || purgeResult.value == null) {
        module.handleReject(promise, purgeResult.error!!)
        session.stop()
        return@launch
      }
    }

    ResetBackupCommand().runAsync(session)

    val resetCodes = SetUserCodeCommand.resetUserCodes()
    val resetCodesResult = resetCodes.runAsync(session)

    if (!resetCodesResult.success || resetCodesResult.value == null) {
      module.handleReject(promise, resetCodesResult.error!!)
      session.stop()
      return@launch
    }

    session.stop()
    promise.resolve(null)

  } }

  fun enableBiometrics(
    enable: Boolean,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val decisionMap: Map<Boolean, UserCodeRequestPolicy> = mapOf(
      true to UserCodeRequestPolicy.AlwaysWithBiometrics(UserCodeType.AccessCode),
      false to UserCodeRequestPolicy.Always(UserCodeType.AccessCode)
    )

    module.sdk.config.userCodeRequestPolicy = decisionMap[enable]!!

    promise.resolve(null)

  } }

  fun enableUserCodeRecovery(
    enable: Boolean,
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    val startSessionResult = module.sdk.startSessionAsync(
      cardId,
      initialMessage = Message(header = msgHeader, body = msgBody),
      accessCode
    )

    if (!startSessionResult.success || startSessionResult.value == null) {
      module.handleReject(promise, startSessionResult.error!!)
      return@launch
    }

    val session = startSessionResult.value!!

    val userCodeRecovery = SetUserCodeRecoveryAllowedTask(enable)
    val userCodeRecoveryResult = userCodeRecovery.runAsync(session)

    if (!userCodeRecoveryResult.success || userCodeRecoveryResult.value == null) {
      module.handleReject(promise, userCodeRecoveryResult.error!!)
      session.stop()
      return@launch
    }

    session.stop()
    promise.resolve(null)

  } }

}
