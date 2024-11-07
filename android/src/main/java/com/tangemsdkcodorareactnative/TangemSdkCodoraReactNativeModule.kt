package com.tangemsdkcodorareactnative

import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.tangem.TangemSdk
import com.tangem.common.core.TangemError
import com.tangemsdkcodorareactnative.tangemExtensions.TangemSdkProvider

class TangemSdkCodoraReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  internal lateinit var sdk: TangemSdk

  companion object {
    const val NAME = "TangemSdkCodoraReactNative"
  }

  override fun getName(): String { return NAME }

  override fun initialize() {
    super.initialize()

    val activity = currentActivity
    TangemSdkProvider.init(activity as AppCompatActivity)
    sdk = TangemSdkProvider.getInstance()
  }

  internal fun handleReject(promise: Promise, err: TangemError) {
    promise.reject("TANGEM_SDK_CODORA_ERROR", err.toString())
  }

}
