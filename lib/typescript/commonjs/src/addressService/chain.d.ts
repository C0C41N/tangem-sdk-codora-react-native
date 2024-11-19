import { ec as EC } from 'elliptic';
export declare abstract class Chain {
    protected pubKeyBase58: string;
    protected secp256k1: EC;
    constructor(pubKeyBase58: string);
    abstract getPublicAddress(): string;
    protected decompressPublicKey(): Buffer;
}
//# sourceMappingURL=chain.d.ts.map