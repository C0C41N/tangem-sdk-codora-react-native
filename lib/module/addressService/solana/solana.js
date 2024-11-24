"use strict";

import { Chain } from '@addressService/chain';
export class Solana extends Chain {
  constructor(pubKeyBase58) {
    super(pubKeyBase58);
  }
  getPublicAddress() {
    return this.pubKeyBase58;
  }
}
//# sourceMappingURL=solana.js.map