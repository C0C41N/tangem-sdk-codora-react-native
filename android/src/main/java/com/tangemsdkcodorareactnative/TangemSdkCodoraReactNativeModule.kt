package com.tangemsdkcodorareactnative

import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.tangem.TangemSdk
import com.tangem.sdk.codora.TangemSdkProvider
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class TangemSdkCodoraReactNativeModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext), TangemModule {

  companion object {
    const val NAME = "TangemSdkCodoraReactNative"
  }

  override lateinit var sdk: TangemSdk
  private lateinit var operations: Operations
  private lateinit var backupSvc: BackupSvc
  private lateinit var bip39: BIP39
  private lateinit var locale: Locale

  override fun getName(): String { return NAME }

  override fun initialize() {
    super.initialize()
    CoroutineScope(Dispatchers.IO).launch {
      TangemSdkProvider.init(currentActivity as AppCompatActivity)
      sdk = TangemSdkProvider.getSdk()
      operations = Operations(this@TangemSdkCodoraReactNativeModule)
      backupSvc = BackupSvc(this@TangemSdkCodoraReactNativeModule)
      locale = Locale(this@TangemSdkCodoraReactNativeModule)
      bip39 = BIP39()
    }
  }

  // Operations

  @ReactMethod
  fun scan(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    migratePublicKey: String?,
    promise: Promise
  ) { operations.scan(accessCode, cardId, msgHeader, msgBody, migratePublicKey, promise) }

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
  fun signMultiple(
    unsignedHexArr: ReadableArray,
    pubKeyBase58Arr: ReadableArray,
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { operations.signMultiple(unsignedHexArr, pubKeyBase58Arr, accessCode, cardId, msgHeader, msgBody, promise) }

  @ReactMethod
  fun purgeAllWallets(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    onlyEd25519: Boolean,
    promise: Promise
  ) { operations.purgeAllWallets(accessCode, cardId, msgHeader, msgBody, onlyEd25519, promise) }

  @ReactMethod
  fun createAllWallets(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { operations.createAllWallets(accessCode, cardId, msgHeader, msgBody, promise) }

  @ReactMethod
  fun setAccessCode(
    newAccessCode: String,
    currentAccessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { operations.setAccessCode(newAccessCode, currentAccessCode, cardId, msgHeader, msgBody, promise) }

  @ReactMethod
  fun resetBackup(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { operations.resetBackup(accessCode, cardId, msgHeader, msgBody, promise) }

  @ReactMethod
  fun resetCodes(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { operations.resetCodes(accessCode, cardId, msgHeader, msgBody, promise) }

  @ReactMethod
  fun resetCard(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    promise: Promise
  ) { operations.resetCard(accessCode, cardId, msgHeader, msgBody, promise) }

  @ReactMethod
  fun enableBiometrics(
    enable: Boolean,
    promise: Promise
  ) { operations.enableBiometrics(enable, promise) }

  // Backup Service

  @ReactMethod
  fun backupSvcInit(
    promise: Promise
  ) { backupSvc.backupSvcInit(promise) }

  @ReactMethod
  fun backupSvcReadPrimaryCard(
    promise: Promise
  ) { backupSvc.backupSvcReadPrimaryCard(promise) }

  @ReactMethod
  fun backupSvcSetAccessCode(
    accessCode: String,
    promise: Promise
  ) { backupSvc.backupSvcSetAccessCode(accessCode, promise) }

  @ReactMethod
  fun backupSvcAddBackupCard(
    promise: Promise
  ) { backupSvc.backupSvcAddBackupCard(promise) }

  @ReactMethod
  fun backupSvcProceedBackup(
    promise: Promise
  ) { backupSvc.backupSvcProceedBackup(promise) }

  // BIP39

  @ReactMethod
  fun generateMnemonic(
    wordCount: Int,
    promise: Promise
  ) { bip39.generateMnemonic(wordCount, promise) }

  // Locale

  @ReactMethod
  fun setAppLanguage(
    languageCode: String,
    promise: Promise
  ) { locale.setAppLanguage(reactApplicationContext, languageCode, promise) }

}
