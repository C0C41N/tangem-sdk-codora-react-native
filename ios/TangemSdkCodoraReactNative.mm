#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TangemSdkCodoraReactNative, NSObject)

+ (BOOL)requiresMainQueueSetup { return NO; }

RCT_EXTERN_METHOD(
  scan:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  sign:(NSString *)unsignedHex
  pubKeyBase58:(NSString *)pubKeyBase58
  accessCode:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  purgeAllWallets:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  createAllWallets:(NSString * _Nullable)accessCode
  cardId:(NSString * _Nullable)cardId
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

@end
