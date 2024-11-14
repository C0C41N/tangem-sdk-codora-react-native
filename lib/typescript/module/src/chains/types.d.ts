export type CreateTrxRet<T> = {
    transaction: T;
    unsignedHex: string;
};
export type CreateTrxParams = {
    receiverAddress: string;
    amount: number;
    gasLimit?: number;
    maxFeePerGas?: number;
};
export type SendTrxParams<T> = {
    transaction: T;
    signedHex: string;
};
//# sourceMappingURL=types.d.ts.map