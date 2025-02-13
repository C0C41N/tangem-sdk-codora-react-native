import { NativeModule } from '@nativeModule';
import { withNativeResponse } from '@withNativeResponse';
import type { INativeResponse } from '@types';
import type { BIP39WordCount } from './types';

export function generateMnemonic(wordCount: BIP39WordCount): Promise<INativeResponse<string[]>> {
  return withNativeResponse(() => NativeModule.generateMnemonic(wordCount));
}

export function validateMnemonic(mnemonic: string[]): Promise<INativeResponse<boolean>> {
  return withNativeResponse(() => NativeModule.validateMnemonic(mnemonic));
}
