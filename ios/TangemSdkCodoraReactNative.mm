#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TangemSdkCodoraReactNative, NSObject)

+ (BOOL)requiresMainQueueSetup { return NO; }

RCT_EXTERN_METHOD(
  scan:(NSString * _Nullable)cardId
  accessCode:(NSString * _Nullable)accessCode
  resolver:(RCTPromiseResolveBlock)resolve
  rejecter:(RCTPromiseRejectBlock)reject
)

@end
