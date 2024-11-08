@file:OptIn(DelicateCoroutinesApi::class, ExperimentalStdlibApi::class)
@file:Suppress("unused")

package com.tangemsdkcodorareactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.tangem.Message
import com.tangem.common.card.EllipticCurve
import com.tangem.common.extensions.toHexString
import com.tangem.crypto.decodeBase58
import com.tangem.crypto.encodeToBase58String
import com.tangem.operations.ScanTask
import com.tangem.operations.sign.SignCommand
import com.tangem.operations.wallet.CreateWalletTask
import com.tangem.operations.wallet.PurgeWalletCommand
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

  fun purgeAllWallets(
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

    val purgedWallets = Arguments.createArray()

    for (wallet in card.wallets) {
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

}
