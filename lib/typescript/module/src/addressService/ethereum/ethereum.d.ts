import { Chain } from '@addressService/chain';
export declare class Ethereum extends Chain {
    private publicAddress;
    constructor(pubKeyBase58: string);
    private calculatePublicAddress;
    getPublicAddress(): string;
}
//# sourceMappingURL=ethereum.d.ts.map