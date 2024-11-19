import { Chain } from '../chain';
export declare class Tron extends Chain {
    private publicAddress;
    constructor(pubKeyBase58: string);
    private calculatePublicAddress;
    getPublicAddress(): string;
}
//# sourceMappingURL=tron.d.ts.map