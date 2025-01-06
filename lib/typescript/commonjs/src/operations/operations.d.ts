import type { INativeResponse } from '@types';
import type { Card } from './types/card';
import type { CreateAllWalletsResult, ICreateAllWalletsParams, IPurgeAllWalletsParams, IResetBackupParams, IResetCodesParams, IScanParams, ISetAccessCodeParams, ISignMulParams, ISignMulResult, ISignParams, PurgeAllWalletsResult } from './types';
export declare function scan(params: IScanParams): Promise<INativeResponse<Card>>;
export declare function sign(params: ISignParams): Promise<INativeResponse<string>>;
export declare function signMultiple(params: ISignMulParams): Promise<INativeResponse<ISignMulResult>>;
export declare function purgeAllWallets(params: IPurgeAllWalletsParams): Promise<INativeResponse<PurgeAllWalletsResult>>;
export declare function createAllWallets(params: ICreateAllWalletsParams): Promise<INativeResponse<CreateAllWalletsResult>>;
export declare function setAccessCode(params: ISetAccessCodeParams): Promise<INativeResponse<void>>;
export declare function resetBackup(params: IResetBackupParams): Promise<INativeResponse<void>>;
export declare function resetCodes(params: IResetCodesParams): Promise<INativeResponse<void>>;
export declare function enableBiometrics(enable: boolean): Promise<INativeResponse<void>>;
export declare function deriveHDKey(): Promise<void>;
//# sourceMappingURL=operations.d.ts.map