export type CreateTrxRet<T> = {
  transaction: T;
  unsignedHex: string;
};

export type CreateTrxParams = {
  receiverAddress: string;
  amount: number;
};

export type SendTrxParams<T> = {
  transaction: T;
  signedHex: string;
};
