"use strict";

export async function withNativeResponse(action) {
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