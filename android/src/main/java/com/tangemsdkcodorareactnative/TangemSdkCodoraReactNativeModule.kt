package com.tangemsdkcodorareactnative

import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.tangem.TangemSdk
import com.tangem.sdk.codora.TangemSdkProvider
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class TangemSdkCodoraReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext), TangemModule {

  override lateinit var sdk: TangemSdk
  private lateinit var operations: Operations

  companion object {
    const val NAME = "TangemSdkCodoraReactNative"
  }

  override fun getName(): String { return NAME }

  override fun initialize() {
    super.initialize()

    val activity = currentActivity

    CoroutineScope(Dispatchers.IO).launch {
      TangemSdkProvider.init(activity as AppCompatActivity)
      sdk = TangemSdkProvider.getInstance()
      operations = Operations(this@TangemSdkCodoraReactNativeModule)
    }

  }

  // Operations

  @ReactMethod
  fun scan(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { operations.scan(accessCode, cardId, msgHeader, msgBody, promise) }

}
