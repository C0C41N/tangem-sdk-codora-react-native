export type CreateTrxRet<T> = {
  transaction: T;
  unsignedHex: string;
};

export type CreateTrxParams = {
  receiverAddress: string;
  amount: number;
  gasLimit?: string;
  maxFeePerGas?: string;
};

export type SendTrxParams<T> = {
  transaction: T;
  signedHex: string;
};
