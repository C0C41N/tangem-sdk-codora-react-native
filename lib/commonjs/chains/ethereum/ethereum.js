"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ethereum = void 0;
var _keccak = _interopRequireDefault(require("keccak"));
var _ethers = require("ethers");
var _index = require("../index.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Ethereum extends _index.Chain {
  constructor(pubKeyBase58, endpoint, chainId) {
    super(pubKeyBase58);
    this.endpoint = endpoint;
    this.chainId = chainId;
    this.publicAddress = this.calculatePublicAddress();
    this.connection = new _ethers.ethers.JsonRpcProvider(this.endpoint);
  }
  calculatePublicAddress() {
    const decompressedPubKeyBuffer = this.decompressPublicKey();
    const decompressedPubKeyBufferDropFirst = decompressedPubKeyBuffer.subarray(1);
    const keccakHash = (0, _keccak.default)('keccak256').update(decompressedPubKeyBufferDropFirst).digest();
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
      value: _ethers.ethers.parseEther(amount.toString()),
      nonce: await this.connection.getTransactionCount(this.publicAddress),
      chainId: this.chainId
    };
    const txResolved = await _ethers.ethers.resolveProperties(tx);
    const transaction = _ethers.Transaction.from(txResolved);
    transaction.gasLimit = gasLimit || _ethers.ethers.hexlify('0x5208');
    transaction.maxFeePerGas = maxFeePerGas || _ethers.ethers.parseUnits('10', 'gwei');
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
    transaction.signature = this.signatureHex64To65(signedHex, transaction.unsignedHash);
    return await this.connection.send('eth_sendRawTransaction', [transaction.serialized]);
  }
}
exports.Ethereum = Ethereum;
//# sourceMappingURL=ethereum.js.map