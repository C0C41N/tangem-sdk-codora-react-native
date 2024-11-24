"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ethereum = void 0;
var _keccak = _interopRequireDefault(require("keccak"));
var _chain = require("@addressService/chain");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Ethereum extends _chain.Chain {
  constructor(pubKeyBase58) {
    super(pubKeyBase58);
    this.publicAddress = this.calculatePublicAddress();
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
}
exports.Ethereum = Ethereum;
//# sourceMappingURL=ethereum.js.map