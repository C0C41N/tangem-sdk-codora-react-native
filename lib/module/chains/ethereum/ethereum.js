"use strict";

import keccak from 'keccak';
import { Chain } from "../index.js";
export class Ethereum extends Chain {
  // private connection: null;

  constructor(pubKeyBase58) {
    super(pubKeyBase58);
    this.publicAddress = this.calculatePublicAddress();
    // this.connection = null;
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
  async createTransaction(_params) {
    return {
      transaction: null,
      unsignedHex: ''
    };
  }
  async sendTransaction(_params) {
    return '';
  }
}
//# sourceMappingURL=ethereum.js.map