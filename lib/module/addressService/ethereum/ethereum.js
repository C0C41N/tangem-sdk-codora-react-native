"use strict";

import keccak from 'keccak';
import { Chain } from "../chain.js";
export class Ethereum extends Chain {
  constructor(pubKeyBase58) {
    super(pubKeyBase58);
    this.publicAddress = this.calculatePublicAddress();
  }
  calculatePublicAddress() {
    const decompressedPubKeyBuffer = this.decompressPublicKey();
    const decompressedPubKeyBufferDropFirst = decompressedPubKeyBuffer.subarray(1);
    const keccakHash = keccak('keccak256').update(decompressedPubKeyBufferDropFirst).digest();
    const addressPayload = keccakHash.subarray(-20);
    const finalAddress = '0x' + addressPayload.toString('hex');
    return finalAddress;
  }
  getPublicAddress() {
    return this.publicAddress;
  }
}
//# sourceMappingURL=ethereum.js.map