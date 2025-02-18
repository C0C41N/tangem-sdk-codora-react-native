import { Buffer } from 'node:buffer';
import { ec as EC } from 'elliptic';
export declare abstract class Chain {
    protected pubKeyBase58: string;
    protected secp256k1: EC;
    constructor(pubKeyBase58: string);
    abstract getPublicAddress(): string;
    protected decompressPublicKey(): Buffer;
}
export declare class Secp {
    private static secp256k1;
    static isSecp(pubKeyBase58: string): boolean;
    static toSigHex65(pubKeyBase58: string, sigHex64: string, digestHex: string): string;
}
//# sourceMappingURL=chain.d.ts.map