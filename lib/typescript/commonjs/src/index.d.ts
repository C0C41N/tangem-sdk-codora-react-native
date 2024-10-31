import type { Card, CreateAllWalletsResult, PurgeAllWalletsResult } from './types';
export declare function scan(accessCode?: string, cardId?: string): Promise<Card>;
export declare function sign(unsignedHex: string, pubKeyBase58: string, accessCode?: string, cardId?: string): Promise<string>;
export declare function purgeAllWallets(accessCode?: string, cardId?: string): Promise<PurgeAllWalletsResult>;
export declare function createAllWallets(accessCode?: string, cardId?: string): Promise<CreateAllWalletsResult>;
//# sourceMappingURL=index.d.ts.map