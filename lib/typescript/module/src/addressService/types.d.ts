export declare enum AddressServiceChain {
    SOLANA = "solana",
    TRON = "tron",
    ETHEREUM = "ethereum"
}
export interface IAddressResolverPayload {
    chain: AddressServiceChain;
    pubKeyBase58: string;
}
export interface IResolvedAddress {
    chain: AddressServiceChain;
    pubKeyBase58: string;
    publicAddress: string;
}
//# sourceMappingURL=types.d.ts.map