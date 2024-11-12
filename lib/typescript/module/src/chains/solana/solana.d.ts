import { Transaction } from '@solana/web3.js';
import { SolanaEndpoint } from '.';
import { Chain } from '..';
import type { CreateTrxParams, CreateTrxRet, SendTrxParams } from '..';
export declare class Solana extends Chain<Transaction> {
    private endpoint;
    private connection;
    private fromPubkey;
    constructor(pubKeyBase58: string, endpoint?: SolanaEndpoint | string);
    getPublicAddress(): string;
    createTransaction(params: CreateTrxParams): Promise<CreateTrxRet<Transaction>>;
    sendTransaction(params: SendTrxParams<Transaction>): Promise<string>;
}
//# sourceMappingURL=solana.d.ts.map