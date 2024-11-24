"use strict";

import { NativeModule } from '@nativeModule';
import { withNativeResponse } from '@withNativeResponse';
export function generateMnemonic(wordCount) {
  return withNativeResponse(() => NativeModule.generateMnemonic(wordCount));
}
//# sourceMappingURL=bip39.js.map