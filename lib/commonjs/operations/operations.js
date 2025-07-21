"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAllWallets = createAllWallets;
exports.enableBiometrics = enableBiometrics;
exports.enableUserCodeRecovery = enableUserCodeRecovery;
exports.forceDisableReaderMode = forceDisableReaderMode;
exports.forceEnableReaderMode = forceEnableReaderMode;
exports.purgeAllWallets = purgeAllWallets;
exports.resetBackup = resetBackup;
exports.resetCard = resetCard;
exports.resetCodes = resetCodes;
exports.scan = scan;
exports.setAccessCode = setAccessCode;
exports.sign = sign;
exports.signMultiple = signMultiple;
var _chain = require("../addressService/chain.js");
var _nativeModule = require("../nativeModule.js");
var _withNativeResponse = require("../withNativeResponse.js");
var _reactNative = require("react-native");
async function scan(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader,
    migratePublicKey
  } = params;
  const migrate = params.migrate ?? false;
  return (0, _withNativeResponse.withNativeResponse)(async () => {
    const {
      card: cardJson,
      publicKeysBase58,
      migrateStatus
    } = await _nativeModule.NativeModule.scan(accessCode, cardId, msgHeader, msgBody, migrate, migratePublicKey);
    const card = JSON.parse(cardJson);
    card.wallets.forEach((w, i) => w.publicKeyBase58 = publicKeysBase58[i]);
    return {
      card,
      migrateStatus
    };
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
  return (0, _withNativeResponse.withNativeResponse)(async () => {
    const sig = await _nativeModule.NativeModule.sign(unsignedHex, pubKeyBase58, accessCode, cardId, msgHeader, msgBody);
    if (!_chain.Secp.validate(pubKeyBase58)) return sig;
    return _chain.Secp.toSigHex65(pubKeyBase58, sig, unsignedHex);
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
    const signedHexList = signatures.map((sig, i) => {
      const pubKeyBase58 = pubKeyBase58List[i];
      const unsignedHex = unsignedHexList[i];
      if (!_chain.Secp.validate(pubKeyBase58)) return sig;
      return _chain.Secp.toSigHex65(pubKeyBase58, sig, unsignedHex);
    });
    return pubKeyBase58List.map((pubKeyBase58, i) => ({
      pubKeyBase58,
      unsignedHex: unsignedHexList[i],
      signedHex: signedHexList[i]
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
  const onlyEd25519 = params.onlyEd25519 ?? false;
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.purgeAllWallets(accessCode, cardId, msgHeader, msgBody, onlyEd25519));
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
function resetCard(params) {
  const {
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.resetCard(accessCode, cardId, msgHeader, msgBody));
}
function enableBiometrics(enable) {
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.enableBiometrics(enable));
}
function enableUserCodeRecovery(params) {
  const {
    enable,
    accessCode,
    cardId,
    msgBody,
    msgHeader
  } = params;
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.enableUserCodeRecovery(enable, accessCode, cardId, msgHeader, msgBody));
}
function forceEnableReaderMode() {
  if (_reactNative.Platform.OS !== 'android') return (0, _withNativeResponse.withNativeResponse)(() => {
    console.log('forceEnableReaderMode() is only for android devices.');
    return Promise.resolve(false);
  });
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.forceEnableReaderMode());
}
function forceDisableReaderMode() {
  if (_reactNative.Platform.OS !== 'android') return (0, _withNativeResponse.withNativeResponse)(() => {
    console.log('forceDisableReaderMode() is only for android devices.');
    return Promise.resolve(false);
  });
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.forceDisableReaderMode());
}
//# sourceMappingURL=operations.js.map