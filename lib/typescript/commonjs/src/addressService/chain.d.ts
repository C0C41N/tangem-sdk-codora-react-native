import { Buffer } from 'node:buffer';
import { ec as EC } from 'elliptic';
export declare abstract class Chain {
    protected pubKeyBase58: string;
    protected secp256k1: EC;
    constructor(pubKeyBase58: string);
    abstract getPublicAddress(): string;
    protected decompressPublicKey(): Buffer;
    toSigHex65(sigHex64: string, digestHex: string): string;
}
export declare class Secp extends Chain {
    getPublicAddress(): string;
    isSecp(): boolean;
}
//# sourceMappingURL=chain.d.ts.map