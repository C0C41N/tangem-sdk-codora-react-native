interface ISessionParams {
  accessCode?: string;
  cardId?: string;
  msgHeader?: string;
  msgBody?: string;
}

// Scan Card

export interface IScanParams extends ISessionParams {}

export interface IScanResult {
  card: string;
  publicKeysBase58: string[];
}

// Sign Hex

export interface ISignParams extends ISessionParams {
  unsignedHex: string;
  pubKeyBase58: string;
}

// Sign Multiple Hex

export interface ISignTask {
  pubKeyBase58: string;
  unsignedHex: string;
}

export interface ISignMulParams extends ISessionParams {
  signPayloads: ISignTask[];
}

export type ISignMulResult = {
  pubKeyBase58: string;
  signedHex: string;
}[];

// Purge All Wallets

export interface IPurgeAllWalletsParams extends ISessionParams {}

interface IPurgeWalletResult {
  curve: string;
  publicKey: string;
}

export type PurgeAllWalletsResult = IPurgeWalletResult[];

// Create All Wallets

export interface ICreateAllWalletsParams extends ISessionParams {}

interface ICreateWalletResult {
  curve: string;
  publicKey: string;
}

export type CreateAllWalletsResult = ICreateWalletResult[];

// Set Access Code

export interface ISetAccessCodeParams extends ISessionParams {
  newAccessCode: string;
}

// Reset Backup

export interface IResetBackupParams extends ISessionParams {}

// Reset Codes

export interface IResetCodesParams extends ISessionParams {}
