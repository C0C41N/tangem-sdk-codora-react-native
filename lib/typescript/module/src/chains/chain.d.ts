import { ec as EC } from 'elliptic';
import type { CreateTrxParams, CreateTrxRet, SendTrxParams } from './types';
export declare abstract class Chain<Trx> {
    protected pubKeyBase58: string;
    protected secp256k1: EC;
    constructor(pubKeyBase58: string);
    abstract getPublicAddress(): string;
    abstract createTransaction(params: CreateTrxParams): Promise<CreateTrxRet<Trx>>;
    abstract sendTransaction(params: SendTrxParams<Trx>): Promise<string>;
    decompressPublicKey(): Buffer;
    extractRS(signatureHex64: string): {
        buffer: {
            r: Buffer;
            s: Buffer;
        };
        hex: {
            r: string;
            s: string;
        };
    };
    signatureHex64To65(signatureHex64: string, trxId: string): string;
}
//# sourceMappingURL=chain.d.ts.map