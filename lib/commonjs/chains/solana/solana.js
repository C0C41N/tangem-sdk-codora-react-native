"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Solana = void 0;
var _web = require("@solana/web3.js");
var _index = require("./index.js");
var _index2 = require("../index.js");
class Solana extends _index2.Chain {
  constructor(pubKeyBase58, endpoint = _index.SolanaEndpoint.dev) {
    super(pubKeyBase58);
    this.endpoint = endpoint;
    this.connection = new _web.Connection(this.endpoint, 'confirmed');
    this.fromPubkey = new _web.PublicKey(this.pubKeyBase58);
  }
  getPublicAddress() {
    return this.pubKeyBase58;
  }
  async createTransaction(params) {
    const {
      amount: amountInSol,
      receiverAddress
    } = params;
    const toPubkey = new _web.PublicKey(receiverAddress);
    const lamports = _web.LAMPORTS_PER_SOL * amountInSol;
    const transaction = new _web.Transaction().add(_web.SystemProgram.transfer({
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
exports.Solana = Solana;
//# sourceMappingURL=solana.js.map