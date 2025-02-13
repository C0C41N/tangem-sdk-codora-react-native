"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMnemonic = generateMnemonic;
exports.validateMnemonic = validateMnemonic;
var _nativeModule = require("../nativeModule.js");
var _withNativeResponse = require("../withNativeResponse.js");
function generateMnemonic(wordCount) {
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.generateMnemonic(wordCount));
}
function validateMnemonic(mnemonic) {
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.validateMnemonic(mnemonic));
}
//# sourceMappingURL=bip39.js.map