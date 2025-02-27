import type { INativeResponse } from '../types';
import type { CreateAllWalletsResult, ICreateAllWalletsParams, IEnableUserCodeRecoveryParams, IPurgeAllWalletsParams, IResetBackupParams, IResetCardParams, IResetCodesParams, IScanParams, IScanResponse, ISetAccessCodeParams, ISignMulParams, ISignMulResult, ISignParams, PurgeAllWalletsResult } from './types';
export declare function scan(params: IScanParams): Promise<INativeResponse<IScanResponse>>;
export declare function sign(params: ISignParams): Promise<INativeResponse<string>>;
export declare function signMultiple(params: ISignMulParams): Promise<INativeResponse<ISignMulResult>>;
export declare function purgeAllWallets(params: IPurgeAllWalletsParams): Promise<INativeResponse<PurgeAllWalletsResult>>;
export declare function createAllWallets(params: ICreateAllWalletsParams): Promise<INativeResponse<CreateAllWalletsResult>>;
export declare function setAccessCode(params: ISetAccessCodeParams): Promise<INativeResponse<void>>;
export declare function resetBackup(params: IResetBackupParams): Promise<INativeResponse<void>>;
export declare function resetCodes(params: IResetCodesParams): Promise<INativeResponse<void>>;
export declare function resetCard(params: IResetCardParams): Promise<INativeResponse<void>>;
export declare function enableBiometrics(enable: boolean): Promise<INativeResponse<void>>;
export declare function enableUserCodeRecovery(params: IEnableUserCodeRecoveryParams): Promise<INativeResponse<void>>;
//# sourceMappingURL=operations.d.ts.map