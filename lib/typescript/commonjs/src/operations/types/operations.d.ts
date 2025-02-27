import type { Card } from './card';
interface ISessionParams {
    accessCode?: string;
    cardId?: string;
    msgHeader?: string;
    msgBody?: string;
}
export interface IScanParams extends ISessionParams {
    migrate?: boolean;
    migratePublicKey?: string;
}
export interface IScanResult {
    card: string;
    publicKeysBase58: string[];
    migrateStatus: string;
}
export interface IScanResponse {
    card: Card;
    migrateStatus: string;
}
export interface ISignParams extends ISessionParams {
    unsignedHex: string;
    pubKeyBase58: string;
}
export interface ISignTask {
    pubKeyBase58: string;
    unsignedHex: string;
}
export interface ISignMulParams extends ISessionParams {
    signPayloads: ISignTask[];
}
export type ISignMulResult = {
    pubKeyBase58: string;
    unsignedHex: string;
    signedHex: string;
}[];
export interface IPurgeAllWalletsParams extends ISessionParams {
    onlyEd25519?: boolean;
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
export interface IResetCardParams extends ISessionParams {
}
export interface IEnableUserCodeRecoveryParams extends ISessionParams {
    enable: boolean;
}
export {};
//# sourceMappingURL=operations.d.ts.map