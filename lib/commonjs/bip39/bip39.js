"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMnemonic = generateMnemonic;
var _nativeModule = require("../nativeModule.js");
var _withNativeResponse = require("../withNativeResponse.js");
function generateMnemonic(wordCount) {
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.generateMnemonic(wordCount));
}
//# sourceMappingURL=bip39.js.map