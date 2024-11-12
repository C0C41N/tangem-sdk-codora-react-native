import type { TronWeb } from 'tronweb';

export type SendTrx = Awaited<ReturnType<InstanceType<typeof TronWeb>['transactionBuilder']['sendTrx']>> & {
  signature: string[];
};

export enum TronEndpoint {
  tronGrid = 'https://api.trongrid.io',
  tronStack = 'https://api.tronstack.io',
  shasta = 'https://api.shasta.trongrid.io',
  nile = 'https://api.nileex.io',
}
