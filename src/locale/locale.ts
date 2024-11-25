import { NativeModule } from '@nativeModule';
import { withNativeResponse } from '@withNativeResponse';
import { LanguageCodes, type ISetAppLangResponse } from './types';
import { Platform } from 'react-native';

const languageCodeMap: Record<LanguageCodes, string> = {
  [LanguageCodes.Chinese]: Platform.select({ ios: 'zh-Hans', android: 'zh-rCN' })!,
  [LanguageCodes.English]: Platform.select({ ios: 'en', android: 'en' })!,
  [LanguageCodes.Indonesian]: Platform.select({ ios: 'in', android: 'in' })!,
  [LanguageCodes.Vitnamese]: Platform.select({ ios: 'vi', android: 'vi' })!,
};

export async function setAppLanguage(languageCode: LanguageCodes): Promise<ISetAppLangResponse> {
  return withNativeResponse(() => NativeModule.setAppLanguage(languageCodeMap[languageCode]));
}
