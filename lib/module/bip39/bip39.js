"use strict";

import { NativeModule } from '../nativeModule.js';
import { withNativeResponse } from '../withNativeResponse.js';
export function generateMnemonic(wordCount) {
  return withNativeResponse(() => NativeModule.generateMnemonic(wordCount));
}
//# sourceMappingURL=bip39.js.map