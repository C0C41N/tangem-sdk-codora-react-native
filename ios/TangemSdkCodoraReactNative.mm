#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TangemSdkCodoraReactNative, NSObject)

+ (BOOL)requiresMainQueueSetup { return NO; }

/// Operations

RCT_EXTERN_METHOD(
  scan:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  msgHeader:(NSString * _Nullable)msgHeader
  msgBody:(NSString * _Nullable)msgBody
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  sign:(NSString *)unsignedHex
  pubKeyBase58:(NSString *)pubKeyBase58
  accessCode:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  msgHeader:(NSString * _Nullable)msgHeader
  msgBody:(NSString * _Nullable)msgBody
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  signMultiple:(NSArray<NSString *> *)unsignedHexArr
  pubKeyBase58Arr:(NSArray<NSString *> *)pubKeyBase58Arr
  accessCode:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  msgHeader:(NSString * _Nullable)msgHeader
  msgBody:(NSString * _Nullable)msgBody
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  purgeAllWallets:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  msgHeader:(NSString * _Nullable)msgHeader
  msgBody:(NSString * _Nullable)msgBody
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  createAllWallets:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  msgHeader:(NSString * _Nullable)msgHeader
  msgBody:(NSString * _Nullable)msgBody
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  setAccessCode:(NSString *)newAccessCode
  currentAccessCode:(NSString * _Nullable)currentAccessCode
  cardId:(NSString * _Nullable)cardId
  msgHeader:(NSString * _Nullable)msgHeader
  msgBody:(NSString * _Nullable)msgBody
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  resetBackup:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  msgHeader:(NSString * _Nullable)msgHeader
  msgBody:(NSString * _Nullable)msgBody
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  resetCodes:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  msgHeader:(NSString * _Nullable)msgHeader
  msgBody:(NSString * _Nullable)msgBody
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  enableBiometrics:(BOOL)enable
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

/// Backup Service

RCT_EXTERN_METHOD(
  backupSvcInit:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  backupSvcReadPrimaryCard:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  backupSvcSetAccessCode:(NSString *)accessCode
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  backupSvcAddBackupCard:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  backupSvcProceedBackup:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

/// BIP39

RCT_EXTERN_METHOD(
  generateMnemonic:(NSInteger)wordCount
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

/// Locale

RCT_EXTERN_METHOD(
  setAppLanguage:(NSString *)languageCode
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

@end
