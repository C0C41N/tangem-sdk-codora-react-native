"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAllWallets = createAllWallets;
exports.purgeAllWallets = purgeAllWallets;
exports.scan = scan;
exports.sign = sign;
var _nativeModule = require("./nativeModule.js");
async function scan(accessCode, cardId) {
  const scanResponse = await _nativeModule.TangemSdkCodoraReactNative.scan(accessCode, cardId);
  console.log('scanResponse', scanResponse);
  const card = JSON.parse(scanResponse.card);
  card.wallets.map((w, i) => ({
    ...w,
    publicKeyBase58: scanResponse.publicKeysBase58[i]
  }));
  return card;
}
function sign(unsignedHex, pubKeyBase58, accessCode, cardId) {
  return _nativeModule.TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId);
}
function purgeAllWallets(accessCode, cardId) {
  return _nativeModule.TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId);
}
function createAllWallets(accessCode, cardId) {
  return _nativeModule.TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId);
}
//# sourceMappingURL=index.js.map