"use strict";

import { NativeModule } from '../nativeModule.js';
import { withNativeResponse } from '../withNativeResponse.js';
export async function setAppLanguage(languageCode) {
  return withNativeResponse(() => NativeModule.setAppLanguage(languageCode));
}
//# sourceMappingURL=locale.js.map