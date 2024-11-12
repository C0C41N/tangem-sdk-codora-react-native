interface ISessionParams {
    accessCode?: string;
    cardId?: string;
    msgHeader?: string;
    msgBody?: string;
}
export interface IScanParams extends ISessionParams {
}
export interface IScanResult {
    card: string;
    publicKeysBase58: string[];
}
export interface ISignParams extends ISessionParams {
    unsignedHex: string;
    pubKeyBase58: string;
}
export interface ISignMultipleParams extends ISessionParams {
    unsignedHexArr: string[];
    pubKeyBase58Arr: string[];
}
export interface IPurgeAllWalletsParams extends ISessionParams {
}
interface IPurgeWalletResult {
    curve: string;
    publicKey: string;
}
export type PurgeAllWalletsResult = IPurgeWalletResult[];
export interface ICreateAllWalletsParams extends ISessionParams {
}
interface ICreateWalletResult {
    curve: string;
    publicKey: string;
}
export type CreateAllWalletsResult = ICreateWalletResult[];
export interface ISetAccessCodeParams extends ISessionParams {
    newAccessCode: string;
}
export interface IResetBackupParams extends ISessionParams {
}
export interface IResetCodesParams extends ISessionParams {
}
export {};
//# sourceMappingURL=operations.d.ts.map