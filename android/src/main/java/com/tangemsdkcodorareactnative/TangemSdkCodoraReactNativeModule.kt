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

    CoroutineScope(Dispatchers.IO).launch {
      TangemSdkProvider.init(currentActivity as AppCompatActivity)
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

  @ReactMethod
  fun sign(
    unsignedHex: String,
    pubKeyBase58: String,
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { operations.sign(unsignedHex, pubKeyBase58, accessCode, cardId, msgHeader, msgBody, promise) }

  @ReactMethod
  fun purgeAllWallets(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { operations.purgeAllWallets(accessCode, cardId, msgHeader, msgBody, promise) }

  @ReactMethod
  fun createAllWallets(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { operations.createAllWallets(accessCode, cardId, msgHeader, msgBody, promise) }
}
