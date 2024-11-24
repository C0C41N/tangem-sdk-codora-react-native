import { TangemSdkCodoraReactNative } from '@nativeModule';
import { withNativeResponse } from '@withNativeResponse';
import type { ISetAppLangResponse, LanguageCodes } from './types';

export async function setAppLanguage(languageCode: LanguageCodes): Promise<ISetAppLangResponse> {
  return withNativeResponse(() => TangemSdkCodoraReactNative.setAppLanguage(languageCode));
}
