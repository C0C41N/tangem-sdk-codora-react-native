import type { INativeResponse } from '@types';

export type INativeAction<Response> = () => Promise<Response>;

export async function withNativeResponse<Response>(action: INativeAction<Response>): Promise<INativeResponse<Response>> {
  try {
    return {
      data: await action(),
      success: true,
      message: null,
    };
  } catch (error: any) {
    return {
      data: null,
      success: false,
      message: `${error.code}: ${error.message}`,
    };
  }
}
