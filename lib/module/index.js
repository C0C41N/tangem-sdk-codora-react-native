"use strict";

import { TangemSdkCodoraReactNative } from "./nativeModule.js";
export async function scan(accessCode, cardId) {
  const {
    card: cardJson,
    publicKeysBase58
  } = await TangemSdkCodoraReactNative.scan(accessCode, cardId);
  const card = JSON.parse(cardJson);
  card.wallets.forEach((w, i) => w.publicKeyBase58 = publicKeysBase58[i]);
  return card;
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