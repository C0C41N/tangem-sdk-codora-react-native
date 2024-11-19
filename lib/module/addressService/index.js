"use strict";

export * from "./types.js";
import { Ethereum } from "./ethereum/index.js";
import { Solana } from "./solana/index.js";
import { Tron } from "./tron/index.js";
import { AddressServiceChain } from "./types.js";
const chainNameToClass = {
  [AddressServiceChain.SOLANA]: Solana,
  [AddressServiceChain.TRON]: Tron,
  [AddressServiceChain.ETHEREUM]: Ethereum
};
export async function resolveAddresses(payloadList) {
  return payloadList.map(({
    chain,
    pubKeyBase58
  }) => {
    const serviceClass = chainNameToClass[chain];
    if (!serviceClass) throw new Error(`Unsupported chain ${chain}`);
    const instance = new serviceClass(pubKeyBase58);
    const publicAddress = instance.getPublicAddress();
    return {
      chain,
      pubKeyBase58,
      publicAddress
    };
  });
}
//# sourceMappingURL=index.js.map