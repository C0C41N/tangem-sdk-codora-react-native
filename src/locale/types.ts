import type { INativeResponse } from '@types';

export enum LanguageCodes {
  English = 'en',
  Indonesian = 'id',
  Vitnamese = 'vi',
  Chinese = 'zh-Hans',
}

export interface ISetAppLangResponse extends INativeResponse<true> {}
