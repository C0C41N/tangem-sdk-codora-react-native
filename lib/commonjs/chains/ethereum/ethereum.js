"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ethereum = void 0;
var _keccak = _interopRequireDefault(require("keccak"));
var _index = require("../index.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Ethereum extends _index.Chain {
  // private connection: null;

  constructor(pubKeyBase58) {
    super(pubKeyBase58);
    this.publicAddress = this.calculatePublicAddress();
    // this.connection = null;
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
exports.Ethereum = Ethereum;
//# sourceMappingURL=ethereum.js.map