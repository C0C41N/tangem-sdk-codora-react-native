"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setAppLanguage = setAppLanguage;
var _nativeModule = require("@nativeModule");
var _withNativeResponse = require("@withNativeResponse");
async function setAppLanguage(languageCode) {
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.setAppLanguage(languageCode));
}
//# sourceMappingURL=locale.js.map