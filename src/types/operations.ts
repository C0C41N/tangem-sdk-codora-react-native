// Scan Card

export interface IScanParams {
  accessCode?: string;
  cardId?: string;
  msgHeader?: string;
  msgBody?: string;
}

export interface IScanResult {
  card: string;
  publicKeysBase58: string[];
}

// Sign Hex

export interface ISignParams {
  unsignedHex: string;
  pubKeyBase58: string;
  accessCode?: string;
  cardId?: string;
  msgHeader?: string;
  msgBody?: string;
}

// Purge All Wallets

export interface IPurgeAllWalletsParams {
  accessCode?: string;
  cardId?: string;
  msgHeader?: string;
  msgBody?: string;
}

interface IPurgeWalletResult {
  curve: string;
  publicKey: string;
}

export type PurgeAllWalletsResult = IPurgeWalletResult[];

// Create All Wallets

export interface ICreateAllWalletsParams {
  accessCode?: string;
  cardId?: string;
  msgHeader?: string;
  msgBody?: string;
}

interface ICreateWalletResult {
  curve: string;
  publicKey: string;
}

export type CreateAllWalletsResult = ICreateWalletResult[];
