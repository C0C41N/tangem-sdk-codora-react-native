"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forceExitApp = forceExitApp;
exports.setAppLanguage = setAppLanguage;
var _nativeModule = require("../nativeModule.js");
var _withNativeResponse = require("../withNativeResponse.js");
var _types = require("./types.js");
var _reactNative = require("react-native");
const languageCodeMap = {
  [_types.LanguageCodes.Chinese]: _reactNative.Platform.select({
    ios: 'zh-Hans',
    android: 'zh'
  }),
  [_types.LanguageCodes.English]: _reactNative.Platform.select({
    ios: 'en',
    android: 'en'
  }),
  [_types.LanguageCodes.Indonesian]: _reactNative.Platform.select({
    ios: 'in',
    android: 'in'
  }),
  [_types.LanguageCodes.Vitnamese]: _reactNative.Platform.select({
    ios: 'vi',
    android: 'vi'
  })
};
async function setAppLanguage(languageCode) {
  return (0, _withNativeResponse.withNativeResponse)(() => _nativeModule.NativeModule.setAppLanguage(languageCodeMap[languageCode]));
}
function forceExitApp() {
  if (_reactNative.Platform.OS !== 'ios') return;
  _nativeModule.NativeModule.forceExitApp();
}
//# sourceMappingURL=locale.js.map