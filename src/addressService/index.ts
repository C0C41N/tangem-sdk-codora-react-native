export * from './types';

import type { Chain } from './chain';
import { Ethereum } from './ethereum';
import { Solana } from './solana';
import { Tron } from './tron';
import { AddressServiceChain, type IAddressResolverPayload, type IResolvedAddress } from './types';

type ChainConstructor = new (pubKeyBase58: string) => Chain;

const chainNameToClass: Record<AddressServiceChain, ChainConstructor> = {
  [AddressServiceChain.SOLANA]: Solana,
  [AddressServiceChain.TRON]: Tron,
  [AddressServiceChain.ETHEREUM]: Ethereum,
};

export async function resolveAddresses(payloadList: IAddressResolverPayload[]) {
  return payloadList.map(({ chain, pubKeyBase58 }) => {
    const serviceClass = chainNameToClass[chain];

    if (!serviceClass) throw new Error(`Unsupported chain ${chain}`);

    const instance = new serviceClass(pubKeyBase58);
    const publicAddress = instance.getPublicAddress();
    return { chain, pubKeyBase58, publicAddress } as IResolvedAddress;
  });
}
