import { Chain } from '../chain';

export class Solana extends Chain {
  constructor(pubKeyBase58: string) {
    super(pubKeyBase58);
  }

  public getPublicAddress(): string {
    return this.pubKeyBase58;
  }
}
