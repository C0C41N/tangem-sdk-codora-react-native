import { ethers, Transaction } from 'ethers';
import { Chain } from '..';
import type { CreateTrxParams, SendTrxParams } from '..';
export declare class Ethereum extends Chain<Transaction> {
    private endpoint;
    private chainId;
    private publicAddress;
    private connection;
    constructor(pubKeyBase58: string, endpoint: string, chainId: number);
    private calculatePublicAddress;
    getPublicAddress(): string;
    createTransaction(params: CreateTrxParams): Promise<{
        unsignedHex: string;
        transaction: ethers.Transaction;
    }>;
    sendTransaction(params: SendTrxParams<Transaction>): Promise<any>;
}
//# sourceMappingURL=ethereum.d.ts.map