"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tron = void 0;
var _bs = _interopRequireDefault(require("bs58"));
var _keccak = _interopRequireDefault(require("keccak"));
var _buffer = require("buffer");
var _crypto = require("crypto");
var _tronweb = require("tronweb");
var _index = require("./index.js");
var _index2 = require("../index.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Tron extends _index2.Chain {
  constructor(pubKeyBase58, endpoint = _index.TronEndpoint.nile) {
    super(pubKeyBase58);
    this.endpoint = endpoint;
    this.publicAddress = this.calculatePublicAddress();
    this.connection = new _tronweb.TronWeb({
      fullHost: this.endpoint,
      privateKey: ''
    });
  }
  calculatePublicAddress() {
    const decompressedPubKeyBuffer = this.decompressPublicKey();
    const decompressedPubKeyBufferDropFirst = decompressedPubKeyBuffer.subarray(1);
    const keccakHash = (0, _keccak.default)('keccak256').update(decompressedPubKeyBufferDropFirst).digest();
    const addressPayload = _buffer.Buffer.concat([_buffer.Buffer.from([0x41]), keccakHash.subarray(-20)]); // 0x41 prefix

    const checksum = (0, _crypto.createHash)('sha256').update(addressPayload).digest();
    const checksumFinal = (0, _crypto.createHash)('sha256').update(checksum).digest().subarray(0, 4);
    const finalAddress = _buffer.Buffer.concat([addressPayload, checksumFinal]);
    return _bs.default.encode(finalAddress);
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
exports.Tron = Tron;
//# sourceMappingURL=tron.js.map