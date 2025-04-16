import type { INativeResponse } from '@types';

export enum LanguageCodes {
  English = 'en',
  Chinese = 'zh',
}

export interface ISetAppLangResponse extends INativeResponse<true> {}
