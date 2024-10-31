"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAllWallets = createAllWallets;
exports.purgeAllWallets = purgeAllWallets;
exports.scan = scan;
exports.sign = sign;
var _nativeModule = require("./nativeModule.js");
function scan(accessCode, cardId) {
  return _nativeModule.TangemSdkCodoraReactNative.scan(accessCode, cardId);
}
function sign(unsignedHex, pubKeyBase58, accessCode, cardId) {
  return _nativeModule.TangemSdkCodoraReactNative.sign(unsignedHex, pubKeyBase58, accessCode, cardId);
}
function createAllWallets(accessCode, cardId) {
  return _nativeModule.TangemSdkCodoraReactNative.createAllWallets(accessCode, cardId);
}
function purgeAllWallets(accessCode, cardId) {
  return _nativeModule.TangemSdkCodoraReactNative.purgeAllWallets(accessCode, cardId);
}
//# sourceMappingURL=index.js.map