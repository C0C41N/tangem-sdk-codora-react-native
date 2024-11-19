export declare enum AddressSvcChain {
    SOLANA = "solana",
    TRON = "tron",
    ETHEREUM = "ethereum"
}
export interface IAddressResolverPayload {
    chain: AddressSvcChain;
    pubKeyBase58: string;
}
export interface IResolvedAddress {
    chain: AddressSvcChain;
    pubKeyBase58: string;
    publicAddress: string;
}
//# sourceMappingURL=types.d.ts.map