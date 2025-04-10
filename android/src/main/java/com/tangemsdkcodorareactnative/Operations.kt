@file:OptIn(DelicateCoroutinesApi::class, ExperimentalStdlibApi::class)
@file:Suppress("unused")

package com.tangemsdkcodorareactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableMap
import com.tangem.Message
import com.tangem.common.UserCodeType
import com.tangem.common.card.Card
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



data class MigrateStatus(
  val status: String,
  val success: Boolean,
  val error: String? = null,
  val pubKeyBase58: String? = null,
  val pubKeyHex: String? = null
) {

  fun toWritableMap(): WritableMap {
    return Arguments.createMap().apply {
      putString("status", status)
      putBoolean("success", success)
      error?.let { putString("error", it) } ?: putNull("error")
      pubKeyBase58?.let { putString("pubKeyBase58", it) } ?: putNull("pubKeyBase58")
      pubKeyHex?.let { putString("pubKeyHex", it) } ?: putNull("pubKeyHex")
    }
  }

  companion object {
    fun success(status: String, pubKeyBase58: String, pubKeyHex: String) =
      MigrateStatus(status, true, pubKeyBase58 = pubKeyBase58, pubKeyHex = pubKeyHex)
    fun error(status: String, error: String) =
      MigrateStatus(status, false, error = error)
  }

}



class Operations(private val module: TangemModule) {

  fun scan(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    migrate: Boolean,
    migratePublicKey: String?,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) {

    /// utility functions

    fun resolveResponse(card: Card, migrateStatus: MigrateStatus?) {

      val resultMap = Arguments.createMap()
      val publicKeysArray = Arguments.createArray()

      card.wallets.map { it.publicKey.encodeToBase58String() }.forEach { publicKeysArray.pushString(it) }

      resultMap.putString("card", card.toJson())
      resultMap.putArray("publicKeysBase58", publicKeysArray)
      migrateStatus?.toWritableMap()?.let { resultMap.putMap("migrateStatus", it) } ?: resultMap.putNull("migrateStatus")

      promise.resolve(resultMap)

    }

    /// start session

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

    /// initiate scan task

    val scanTask = ScanTask()
    val scanResult = scanTask.runAsync(session)

    if (!scanResult.success || scanResult.value == null) {
      module.handleReject(promise, scanResult.error!!)
      session.stop()
      return@launch
    }

    var card = scanResult.value!!

    /// migration

    val migrateStatus: MigrateStatus? = run {

      if (!migrate) return@run null

      if (!card.wallets.any { it.curve == EllipticCurve.Secp256k1 }) {
        return@run MigrateStatus.error(
          "initiated",
          "card does not have any wallet of curve secp256k1"
        )
      }

      if (card.wallets.any { it.curve == EllipticCurve.Ed25519 }) {
        return@run MigrateStatus.error(
          "initiated",
          "card already contains a wallet of curve ed25519"
        )
      }

      if (migratePublicKey != null && card.wallets.any { it.curve == EllipticCurve.Secp256k1 && it.publicKey.toHexString() == migratePublicKey }) {
        return@run MigrateStatus.error(
          "initiated",
          "card does not contain a wallet of curve secp256k1 that matches the provided public key"
        )
      }

      /// Derive entropy

      @Suppress("LABEL_NAME_CLASH")
      val secpWallet = run {
        if (migratePublicKey != null)
          return@run card.wallets.first { it.publicKey.toHexString() == migratePublicKey }
        return@run card.wallets.first { it.curve == EllipticCurve.Secp256k1 }
      }

      val secpPubKeyData = secpWallet.publicKey

      val path = DerivationPath("m/44'/501'/141414'/0'")

      val deriveHDWallet = DeriveWalletPublicKeyTask(secpPubKeyData, path)
      val deriveHDWalletResult = deriveHDWallet.runAsync(session)

      if (!deriveHDWalletResult.success) {
        return@run MigrateStatus.error(
          "initiated",
          "${deriveHDWalletResult.error!!}"
        )
      }

      val hdWallet = deriveHDWalletResult.value!!
      val sourceOfEntropy = hdWallet.publicKey + hdWallet.chainCode
      val entropy = sourceOfEntropy.calculateSha256()

      /// Import new wallet

      val bip39 = TangemSdkProvider.getBip39()

      val mnemonicComponents = bip39.generateMnemonic(entropy, bip39.wordlist)
      val mnemonicString = mnemonicComponents.joinToString(" ")

      val mnemonic = DefaultMnemonic(mnemonicString, bip39.wordlist)
      val factory = AnyMasterKeyFactory(mnemonic, "")
      val privateKey = factory.makeMasterKey(EllipticCurve.Ed25519)

      val createWallet = CreateWalletTask(EllipticCurve.Ed25519, privateKey)
      val createWalletResult = createWallet.runAsync(session)

      if (!createWalletResult.success) {
        return@run MigrateStatus.error(
          "keypair_created",
          "${createWalletResult.error!!}"
        )
      }

      /// Include newly created wallet in scan result

      val migratedWallet = createWalletResult.value!!.wallet

      card = card.copy(wallets = card.wallets.plus(migratedWallet))

      return@run MigrateStatus.success(
        "keypair_created",
        migratedWallet.publicKey.encodeToBase58String(),
        migratedWallet.publicKey.toHexString()
      )

    }

    session.stop()

    resolveResponse(card, migrateStatus)

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
    val curves: List<EllipticCurve> = listOf(
      EllipticCurve.Bip0340,
      EllipticCurve.Bls12381G2,
      EllipticCurve.Bls12381G2Aug,
      EllipticCurve.Bls12381G2Pop,
      EllipticCurve.Ed25519,
      EllipticCurve.Ed25519Slip0010,
      EllipticCurve.Secp256k1,
      EllipticCurve.Secp256r1,
    )

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
      false to UserCodeRequestPolicy.Default
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
