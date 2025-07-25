"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withNativeResponse = withNativeResponse;
async function withNativeResponse(action) {
  try {
    return {
      data: await action(),
      success: true,
      message: null
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      message: `${error.code}: ${error.message}`
    };
  }
}
//# sourceMappingURL=withNativeResponse.js.map