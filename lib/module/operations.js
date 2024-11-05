"use strict";

import { TangemSdkCodoraReactNative } from "./nativeModule.js";
export async function scan(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  const {
    card: cardJson,
    publicKeysBase58
  } = await TangemSdkCodoraReactNative.scan(accessCode, cardId, msgHeader, msgBody);
  const card = JSON.parse(cardJson);
  card.wallets.forEach((w, i) => w.publicKeyBase58 = publicKeysBase58[i]);
  return card;
}
export function sign(params) {
  const {
    unsignedHex,
    pubKeyBase58,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId, msgHeader, msgBody);
}
export function purgeAllWallets(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId, msgHeader, msgBody);
}
export function createAllWallets(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId, msgHeader, msgBody);
}
export function setAccessCode(params) {
  const {
    newAccessCode,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return TangemSdkCodoraReactNative.setAccessCode(newAccessCode, accessCode, cardId, msgHeader, msgBody);
}
export function resetBackup(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return TangemSdkCodoraReactNative.resetBackup(accessCode, cardId, msgHeader, msgBody);
}
export function resetCodes(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return TangemSdkCodoraReactNative.resetCodes(accessCode, cardId, msgHeader, msgBody);
}
export function enableBiometrics(enable) {
  return TangemSdkCodoraReactNative.enableBiometrics(enable);
}
//# sourceMappingURL=operations.js.map