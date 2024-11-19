"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tron = void 0;
var _bs = _interopRequireDefault(require("bs58"));
var _keccak = _interopRequireDefault(require("keccak"));
var _buffer = require("buffer");
var _crypto = require("crypto");
var _chain = require("../chain.js");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Tron extends _chain.Chain {
  constructor(pubKeyBase58) {
    super(pubKeyBase58);
    this.publicAddress = this.calculatePublicAddress();
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
}
exports.Tron = Tron;
//# sourceMappingURL=tron.js.map