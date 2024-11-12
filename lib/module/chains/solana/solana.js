"use strict";

import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { SolanaEndpoint } from "./index.js";
import { Chain } from "../index.js";
export class Solana extends Chain {
  constructor(pubKeyBase58, endpoint = SolanaEndpoint.dev) {
    super(pubKeyBase58);
    this.endpoint = endpoint;
    this.connection = new Connection(this.endpoint, 'confirmed');
    this.fromPubkey = new PublicKey(this.pubKeyBase58);
  }
  getPublicAddress() {
    return this.pubKeyBase58;
  }
  async createTransaction(params) {
    const {
      amount: amountInSol,
      receiverAddress
    } = params;
    const toPubkey = new PublicKey(receiverAddress);
    const lamports = LAMPORTS_PER_SOL * amountInSol;
    const transaction = new Transaction().add(SystemProgram.transfer({
      fromPubkey: this.fromPubkey,
      lamports,
      toPubkey
    }));
    const {
      blockhash
    } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = this.fromPubkey;
    const serializedTransaction = transaction.serializeMessage();
    const unsignedHex = serializedTransaction.toString('hex');
    return {
      transaction,
      unsignedHex
    };
  }
  async sendTransaction(params) {
    const {
      transaction,
      signedHex
    } = params;
    const signature = Buffer.from(signedHex, 'hex');
    transaction.addSignature(this.fromPubkey, signature);
    const rawTransaction = transaction.serialize();
    const txId = await this.connection.sendRawTransaction(rawTransaction);
    return txId;
  }
}
//# sourceMappingURL=solana.js.map