"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateMnemonic = generateMnemonic;
var _nativeModule = require("./nativeModule.js");
function generateMnemonic(wordCount) {
  return _nativeModule.TangemSdkCodoraReactNative.generateMnemonic(wordCount);
}
//# sourceMappingURL=bip39.js.map