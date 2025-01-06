"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAllWallets = createAllWallets;
exports.deriveHDKey = deriveHDKey;
exports.enableBiometrics = enableBiometrics;
exports.purgeAllWallets = purgeAllWallets;
exports.resetBackup = resetBackup;
exports.resetCodes = resetCodes;
exports.scan = scan;
exports.setAccessCode = setAccessCode;
exports.sign = sign;
exports.signMultiple = signMultiple;
var _nativeModule = require("../nativeModule.js");
var _withNativeResponse = require("../withNativeResponse.js");
async function scan(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return (0, _withNativeResponse.withNativeResponse)(async () => {
    const {
      card: cardJson,
      publicKeysBase58
    } = await _nativeModule.NativeModule.scan(accessCode, cardId, msgHeader, msgBody);
    const card = JSON.parse(cardJson);
    card.wallets.forEach((w, i) => w.publicKeyBase58 = publicKeysBase58[i]);
    return card;
  });
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
  return (0, _withNativeResponse.withNativeResponse)(() => {
    return _nativeModule.NativeModule.sign(unsignedHex, pubKeyBase58, accessCode, cardId, msgHeader, msgBody);
  });
}
async function signMultiple(params) {
  const {
    signPayloads,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return (0, _withNativeResponse.withNativeResponse)(async () => {
    const pubKeyBase58List = signPayloads.map(e => e.pubKeyBase58);
    const unsignedHexList = signPayloads.map(e => e.unsignedHex);
    if (unsignedHexList.length !== pubKeyBase58List.length) throw new Error('signMultiple: unsignedHexList.length !== pubKeyBase58List.length');
    const signatures = await _nativeModule.NativeModule.signMultiple(unsignedHexList, pubKeyBase58List, accessCode, cardId, msgHeader, msgBody);
    if (signatures.length !== pubKeyBase58List.length) throw new Error('signMultiple: signatures.length !== pubKeyBase58List.length');
    return pubKeyBase58List.map((pubKeyBase58, i) => ({
      pubKeyBase58,
      signedHex: signatures[i]
    }));
  });
}
function purgeAllWallets(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.purgeAllWallets(accessCode, cardId, msgHeader, msgBody));
}
function createAllWallets(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.createAllWallets(accessCode, cardId, msgHeader, msgBody));
}
function setAccessCode(params) {
  const {
    newAccessCode,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.setAccessCode(newAccessCode, accessCode, cardId, msgHeader, msgBody));
}
function resetBackup(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.resetBackup(accessCode, cardId, msgHeader, msgBody));
}
function resetCodes(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.resetCodes(accessCode, cardId, msgHeader, msgBody));
}
function enableBiometrics(enable) {
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.enableBiometrics(enable));
}
function deriveHDKey() {
  const pubKeyBase58 = 'C9dZ4ekUeUUb1DRkSYBetZsuF4LCrhYYVTaQ7FEkR1HW';
  const path = `m/44'/501'/141414'/0'`;
  const accessCode = '141414';
  const cardId = undefined;
  const msgHeader = undefined;
  const msgBody = undefined;
  return _nativeModule.NativeModule.deriveHDKey(pubKeyBase58, path, accessCode, cardId, msgHeader, msgBody);
}
//# sourceMappingURL=operations.js.map