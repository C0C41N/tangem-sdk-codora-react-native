@file:OptIn(DelicateCoroutinesApi::class)

package com.tangemsdkcodorareactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.tangem.Message
import com.tangem.crypto.encodeToBase58String
import com.tangem.operations.ScanTask
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

    promise.resolve(resultMap)
    session.stop()

  } }
}
