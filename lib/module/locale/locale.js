"use strict";

import { NativeModule } from '../nativeModule.js';
import { withNativeResponse } from '../withNativeResponse.js';
import { LanguageCodes } from "./types.js";
import { Platform } from 'react-native';
const languageCodeMap = {
  [LanguageCodes.Chinese]: Platform.select({
    ios: 'zh-Hans',
    android: 'zh-CN'
  }),
  [LanguageCodes.English]: Platform.select({
    ios: 'en',
    android: 'en-US'
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