"use strict";

import bs58 from 'bs58';
import keccak from 'keccak';
import { Buffer } from 'buffer';
import { createHash } from 'crypto';
import { TronWeb } from 'tronweb';
import { TronEndpoint } from "./index.js";
import { Chain } from "../index.js";
export class Tron extends Chain {
  constructor(pubKeyBase58, endpoint = TronEndpoint.nile) {
    super(pubKeyBase58);
    this.endpoint = endpoint;
    this.publicAddress = this.calculatePublicAddress();
    this.connection = new TronWeb({
      fullHost: this.endpoint,
      privateKey: ''
    });
  }
  calculatePublicAddress() {
    const decompressedPubKeyBuffer = this.decompressPublicKey();
    const decompressedPubKeyBufferDropFirst = decompressedPubKeyBuffer.subarray(1);
    const keccakHash = keccak('keccak256').update(decompressedPubKeyBufferDropFirst).digest();
    const addressPayload = Buffer.concat([Buffer.from([0x41]), keccakHash.subarray(-20)]); // 0x41 prefix

    const checksum = createHash('sha256').update(addressPayload).digest();
    const checksumFinal = createHash('sha256').update(checksum).digest().subarray(0, 4);
    const finalAddress = Buffer.concat([addressPayload, checksumFinal]);
    return bs58.encode(finalAddress);
  }
  getPublicAddress() {
    return this.publicAddress;
  }
  async createTransaction(params) {
    const {
      amount,
      receiverAddress
    } = params;
    const amountInSun = +this.connection.toSun(amount);
    const transaction = await this.connection.transactionBuilder.sendTrx(receiverAddress, amountInSun, this.publicAddress);
    const extendedTransaction = await this.connection.transactionBuilder.extendExpiration(transaction, 600);
    return {
      transaction: extendedTransaction,
      unsignedHex: extendedTransaction.raw_data_hex
    };
  }
  async sendTransaction(params) {
    const {
      signedHex,
      transaction
    } = params;
    const signedHex65 = this.signatureHex64To65(signedHex, transaction.txID);
    transaction.signature = [signedHex65];
    const broadcast = await this.connection.trx.sendRawTransaction(transaction);
    return broadcast.transaction.txID;
  }
}
//# sourceMappingURL=tron.js.map