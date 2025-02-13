"use strict";

import { NativeModule } from '../nativeModule.js';
import { withNativeResponse } from '../withNativeResponse.js';
export function generateMnemonic(wordCount) {
  return withNativeResponse(() => NativeModule.generateMnemonic(wordCount));
}
export function validateMnemonic(mnemonic) {
  return withNativeResponse(() => NativeModule.validateMnemonic(mnemonic));
}
//# sourceMappingURL=bip39.js.map