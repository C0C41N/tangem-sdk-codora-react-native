export * from './card';

export interface IScanResult {
  card: string;
  publicKeysBase58: string[];
}

interface IPurgeWalletResult {
  curve: string;
  publicKey: string;
}

export type PurgeAllWalletsResult = IPurgeWalletResult[];

interface ICreateWalletResult {
  curve: string;
  publicKey: string;
}

export type CreateAllWalletsResult = ICreateWalletResult[];
