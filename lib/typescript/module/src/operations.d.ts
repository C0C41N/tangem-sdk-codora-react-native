import type { Card, CreateAllWalletsResult, ICreateAllWalletsParams, IPurgeAllWalletsParams, IResetBackupParams, IResetCodesParams, IScanParams, ISetAccessCodeParams, ISignMultipleParams, ISignParams, PurgeAllWalletsResult } from './types';
export declare function scan(params: IScanParams): Promise<Card>;
export declare function sign(params: ISignParams): Promise<string>;
export declare function signMultiple(params: ISignMultipleParams): Promise<string[]>;
export declare function purgeAllWallets(params: IPurgeAllWalletsParams): Promise<PurgeAllWalletsResult>;
export declare function createAllWallets(params: ICreateAllWalletsParams): Promise<CreateAllWalletsResult>;
export declare function setAccessCode(params: ISetAccessCodeParams): Promise<void>;
export declare function resetBackup(params: IResetBackupParams): Promise<void>;
export declare function resetCodes(params: IResetCodesParams): Promise<void>;
export declare function enableBiometrics(enable: boolean): Promise<void>;
//# sourceMappingURL=operations.d.ts.map