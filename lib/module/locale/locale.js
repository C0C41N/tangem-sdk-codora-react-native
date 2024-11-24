"use strict";

import { NativeModule } from '@nativeModule';
import { withNativeResponse } from '@withNativeResponse';
export async function setAppLanguage(languageCode) {
  return withNativeResponse(() => NativeModule.setAppLanguage(languageCode));
}
//# sourceMappingURL=locale.js.map