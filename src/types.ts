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
