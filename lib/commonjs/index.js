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
  const cardJson = await _nativeModule.TangemSdkCodoraReactNative.scan(accessCode, cardId);
  return JSON.parse(cardJson);
}
function sign(unsignedHex, pubKeyBase58, accessCode, cardId) {
  return _nativeModule.TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId);
}
async function createAllWallets(accessCode, cardId) {
  const result = await _nativeModule.TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId);
  return JSON.parse(result);
}
async function purgeAllWallets(accessCode, cardId) {
  const result = await _nativeModule.TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId);
  return JSON.parse(result);
}
//# sourceMappingURL=index.js.map