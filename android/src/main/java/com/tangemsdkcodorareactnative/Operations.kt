@file:OptIn(DelicateCoroutinesApi::class)

package com.tangemsdkcodorareactnative

import com.facebook.react.bridge.*
import com.tangem.*
import com.tangem.operations.*
import com.tangemsdkcodorareactnative.tangemExtensions.*
import kotlinx.coroutines.*

@ReactMethod
suspend fun TangemSdkCodoraReactNativeModule.scan(
  accessCode: String?,
  cardId: String?,
  msgHeader: String?,
  msgBody: String?,
  promise: Promise
) { GlobalScope.launch(Dispatchers.Main) {

  val startSessionResult = sdk.startSessionAsync(
    cardId,
    initialMessage = Message(header = msgHeader, body = msgBody),
    accessCode
  )

  if (!startSessionResult.success || startSessionResult.value == null) {
    handleReject(promise, startSessionResult.error!!)
    return@launch
  }

  val session = startSessionResult.value

  val scanTask = ScanTask()
  val scanResult = scanTask.runAsync(session)

  if (!scanResult.success || scanResult.value == null) {
    handleReject(promise, scanResult.error!!)
    session.stop()
    return@launch
  }

  promise.resolve(scanResult.value)
  session.stop()

} }
