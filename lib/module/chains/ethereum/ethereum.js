"use strict";

import keccak from 'keccak';
import { ethers, Transaction } from 'ethers';
import { Chain } from "../index.js";
export class Ethereum extends Chain {
  constructor(pubKeyBase58, endpoint, chainId) {
    super(pubKeyBase58);
    this.endpoint = endpoint;
    this.chainId = chainId;
    this.publicAddress = this.calculatePublicAddress();
    this.connection = new ethers.JsonRpcProvider(this.endpoint);
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
  async createTransaction(params) {
    const {
      amount,
      receiverAddress,
      gasLimit,
      maxFeePerGas
    } = params;
    const tx = {
      to: receiverAddress,
      value: ethers.parseEther(amount.toString()),
      nonce: await this.connection.getTransactionCount(this.publicAddress),
      chainId: this.chainId
    };
    const txResolved = await ethers.resolveProperties(tx);
    const transaction = Transaction.from(txResolved);
    transaction.gasLimit = gasLimit || ethers.hexlify('0x5208');
    transaction.maxFeePerGas = maxFeePerGas || ethers.parseUnits('10', 'gwei');
    const unsignedHex = transaction.unsignedHash;
    return {
      unsignedHex,
      transaction
    };
  }
  async sendTransaction(params) {
    const {
      signedHex,
      transaction
    } = params;
    transaction.signature = signedHex;
    return await this.connection.send('eth_sendRawTransaction', [transaction.serialized]);
  }
}
//# sourceMappingURL=ethereum.js.map