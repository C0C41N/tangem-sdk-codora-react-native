import { Chain } from '..';
import type { CreateTrxParams, SendTrxParams } from '..';
export declare class Ethereum extends Chain<null> {
    private publicAddress;
    constructor(pubKeyBase58: string);
    private calculatePublicAddress;
    getPublicAddress(): string;
    createTransaction(_params: CreateTrxParams): Promise<{
        transaction: null;
        unsignedHex: string;
    }>;
    sendTransaction(_params: SendTrxParams<null>): Promise<string>;
}
//# sourceMappingURL=ethereum.d.ts.map