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
