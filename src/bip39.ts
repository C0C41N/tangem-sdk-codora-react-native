import { TangemSdkCodoraReactNative } from './nativeModule';
import type { WordCount } from './types';

export function generateMnemonic(wordCount: WordCount): Promise<string[]> {
  return TangemSdkCodoraReactNative.generateMnemonic(wordCount);
}
