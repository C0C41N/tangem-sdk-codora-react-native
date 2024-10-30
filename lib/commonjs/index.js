"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scan = scan;
var _reactNative = require("react-native");
const LINKING_ERROR = `The package 'tangem-sdk-codora-react-native' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const TangemSdkCodoraReactNative = _reactNative.NativeModules.TangemSdkCodoraReactNative ? _reactNative.NativeModules.TangemSdkCodoraReactNative : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
function scan(cardId, accessCode) {
  return TangemSdkCodoraReactNative.scan(cardId, accessCode);
}
//# sourceMappingURL=index.js.map