"use strict";

import bs58 from 'bs58';
import { ec as EC } from 'elliptic';
export class Chain {
  secp256k1 = new EC('secp256k1');
  constructor(pubKeyBase58) {
    this.pubKeyBase58 = pubKeyBase58;
  }
  decompressPublicKey() {
    const compressedPubKeyBuffer = Buffer.from(bs58.decode(this.pubKeyBase58));
    const key = this.secp256k1.keyFromPublic(compressedPubKeyBuffer, 'array');
    const decompressedPubKeyArray = key.getPublic(false, 'array');
    const decompressedPubKeyBuffer = Buffer.from(decompressedPubKeyArray);
    return decompressedPubKeyBuffer;
  }
}
//# sourceMappingURL=chain.js.map