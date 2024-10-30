#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TangemSdkCodoraReactNative, NSObject)

+ (BOOL)requiresMainQueueSetup { return NO; }

RCT_EXTERN_METHOD(
  scan:(NSString * _Nullable)cardId
  accessCode:(NSString * _Nullable)accessCode
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

RCT_EXTERN_METHOD(
  sign:(NSString *)unsignedHex
  pubKeyBase58:(NSString *)pubKeyBase58
  cardId:(NSString * _Nullable)cardId
  accessCode:(NSString * _Nullable)accessCode
  resolve:(RCTPromiseResolveBlock)resolve
  reject:(RCTPromiseRejectBlock)reject
)

@end
