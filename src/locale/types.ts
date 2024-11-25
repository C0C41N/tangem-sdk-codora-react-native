import type { INativeResponse } from '@types';

export enum LanguageCodes {
  English = 'en',
  Indonesian = 'id',
  Vitnamese = 'vi',
  Chinese = 'zh',
}

export interface ISetAppLangResponse extends INativeResponse<true> {}
