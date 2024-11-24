import type { INativeResponse } from './types';
export type INativeAction<Response> = () => Promise<Response>;
export declare function withNativeResponse<Response>(action: INativeAction<Response>): Promise<INativeResponse<Response>>;
//# sourceMappingURL=withNativeResponse.d.ts.map