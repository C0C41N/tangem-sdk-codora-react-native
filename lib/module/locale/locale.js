"use strict";

import { NativeModule } from '../nativeModule.js';
import { withNativeResponse } from '../withNativeResponse.js';
import { LanguageCodes } from "./types.js";
import { Platform } from 'react-native';
const languageCodeMap = {
  [LanguageCodes.Chinese]: Platform.select({
    ios: 'zh-Hans',
    android: 'zh-rCN'
  }),
  [LanguageCodes.English]: Platform.select({
    ios: 'en',
    android: 'en'
  }),
  [LanguageCodes.Indonesian]: Platform.select({
    ios: 'in',
    android: 'in'
  }),
  [LanguageCodes.Vitnamese]: Platform.select({
    ios: 'vi',
    android: 'vi'
  })
};
export async function setAppLanguage(languageCode) {
  return withNativeResponse(() => NativeModule.setAppLanguage(languageCodeMap[languageCode]));
}
export function forceExitApp() {
  if (Platform.OS !== 'ios') return;
  NativeModule.forceExitApp();
}
//# sourceMappingURL=locale.js.map