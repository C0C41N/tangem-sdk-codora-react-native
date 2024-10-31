"use strict";

import { TangemSdkCodoraReactNative } from "./nativeModule.js";
export async function scan(accessCode, cardId) {
  const cardJson = await TangemSdkCodoraReactNative.scan(accessCode, cardId);
  return JSON.parse(cardJson);
}
export function sign(unsignedHex, pubKeyBase58, accessCode, cardId) {
  return TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId);
}
export async function createAllWallets(accessCode, cardId) {
  const result = await TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId);
  return JSON.parse(result);
}
export async function purgeAllWallets(accessCode, cardId) {
  const result = await TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId);
  return JSON.parse(result);
}
//# sourceMappingURL=index.js.map