import { NativeModule } from '@nativeModule';
import { withNativeResponse } from '@withNativeResponse';
import { LanguageCodes, type ISetAppLangResponse } from './types';
import { Platform } from 'react-native';

const languageCodeMap: Record<LanguageCodes, string> = {
  [LanguageCodes.Chinese]: Platform.select({ ios: 'zh-Hans', android: 'zh-CN' })!,
  [LanguageCodes.English]: Platform.select({ ios: 'en', android: 'en-US' })!,
};

export async function setAppLanguage(languageCode: LanguageCodes): Promise<ISetAppLangResponse> {
  return withNativeResponse(() => NativeModule.setAppLanguage(languageCodeMap[languageCode]));
}

export function forceExitApp(): void {
  if (Platform.OS !== 'ios') return;
  NativeModule.forceExitApp();
}
