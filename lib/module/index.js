"use strict";

import { TangemSdkCodoraReactNative } from "./nativeModule.js";
export async function scan(accessCode, cardId) {
  const cardJson = await TangemSdkCodoraReactNative.scan(accessCode, cardId);
  return JSON.parse(cardJson);
}
export function sign(unsignedHex, pubKeyBase58, accessCode, cardId) {
  return TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId);
}
export function purgeAllWallets(accessCode, cardId) {
  return TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId);
}
export function createAllWallets(accessCode, cardId) {
  return TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId);
}
//# sourceMappingURL=index.js.map