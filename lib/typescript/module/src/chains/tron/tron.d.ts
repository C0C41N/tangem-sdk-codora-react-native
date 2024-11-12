import { TronEndpoint, type SendTrx } from '.';
import { Chain } from '..';
import type { CreateTrxParams, CreateTrxRet, SendTrxParams } from '..';
export declare class Tron extends Chain<SendTrx> {
    private endpoint;
    private publicAddress;
    private connection;
    constructor(pubKeyBase58: string, endpoint?: TronEndpoint | string);
    private calculatePublicAddress;
    getPublicAddress(): string;
    createTransaction(params: CreateTrxParams): Promise<CreateTrxRet<SendTrx>>;
    sendTransaction(params: SendTrxParams<SendTrx>): Promise<string>;
}
//# sourceMappingURL=tron.d.ts.map