import { TangemSdkCodoraReactNative } from '../nativeModule';
import type { BIP39WordCount } from './types';

export function generateMnemonic(wordCount: BIP39WordCount): Promise<string[]> {
  return TangemSdkCodoraReactNative.generateMnemonic(wordCount);
}
