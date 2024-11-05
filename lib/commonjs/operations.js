"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAllWallets = createAllWallets;
exports.enableBiometrics = enableBiometrics;
exports.purgeAllWallets = purgeAllWallets;
exports.resetBackup = resetBackup;
exports.resetCodes = resetCodes;
exports.scan = scan;
exports.setAccessCode = setAccessCode;
exports.sign = sign;
var _nativeModule = require("./nativeModule.js");
async function scan(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  const {
    card: cardJson,
    publicKeysBase58
  } = await _nativeModule.TangemSdkCodoraReactNative.scan(accessCode, cardId, msgHeader, msgBody);
  const card = JSON.parse(cardJson);
  card.wallets.forEach((w, i) => w.publicKeyBase58 = publicKeysBase58[i]);
  return card;
}
function sign(params) {
  const {
    unsignedHex,
    pubKeyBase58,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return _nativeModule.TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId, msgHeader, msgBody);
}
function purgeAllWallets(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return _nativeModule.TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId, msgHeader, msgBody);
}
function createAllWallets(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return _nativeModule.TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId, msgHeader, msgBody);
}
function setAccessCode(params) {
  const {
    newAccessCode,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return _nativeModule.TangemSdkCodoraReactNative.setAccessCode(newAccessCode, accessCode, cardId, msgHeader, msgBody);
}
function resetBackup(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return _nativeModule.TangemSdkCodoraReactNative.resetBackup(accessCode, cardId, msgHeader, msgBody);
}
function resetCodes(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return _nativeModule.TangemSdkCodoraReactNative.resetCodes(accessCode, cardId, msgHeader, msgBody);
}
function enableBiometrics(enable) {
  return _nativeModule.TangemSdkCodoraReactNative.enableBiometrics(enable);
}
//# sourceMappingURL=operations.js.map