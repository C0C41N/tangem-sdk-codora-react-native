"use strict";

import { TangemSdkCodoraReactNative } from "./nativeModule.js";
export function scan(accessCode, cardId) {
  return TangemSdkCodoraReactNative.scan(accessCode, cardId);
}
export function sign(unsignedHex, pubKeyBase58, accessCode, cardId) {
  return TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId);
}
export function createAllWallets(accessCode, cardId) {
  return TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId);
}
export function purgeAllWallets(accessCode, cardId) {
  return TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId);
}
//# sourceMappingURL=index.js.map