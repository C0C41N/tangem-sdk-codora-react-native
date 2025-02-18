"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Secp = exports.Chain = void 0;
var _nodeBuffer = require("node:buffer");
var _bs = _interopRequireDefault(require("bs58"));
var _elliptic = require("elliptic");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Chain {
  secp256k1 = new _elliptic.ec('secp256k1');
  constructor(pubKeyBase58) {
    this.pubKeyBase58 = pubKeyBase58;
  }
  decompressPublicKey() {
    const compressedPubKeyBuffer = _nodeBuffer.Buffer.from(_bs.default.decode(this.pubKeyBase58));
    const key = this.secp256k1.keyFromPublic(compressedPubKeyBuffer, 'array');
    const decompressedPubKeyArray = key.getPublic(false, 'array');
    const decompressedPubKeyBuffer = _nodeBuffer.Buffer.from(decompressedPubKeyArray);
    return decompressedPubKeyBuffer;
  }
}
exports.Chain = Chain;
class Secp {
  static secp256k1 = new _elliptic.ec('secp256k1');
  static isSecp(pubKeyBase58) {
    const pubKeyHex = _nodeBuffer.Buffer.from(_bs.default.decode(pubKeyBase58)).toString('hex');
    const pubKey = this.secp256k1.keyFromPublic(pubKeyHex, 'hex');
    return pubKey.validate().result;
  }
  static toSigHex65(pubKeyBase58, sigHex64, digestHex) {
    const sig64 = _nodeBuffer.Buffer.from(sigHex64, 'hex');
    const digest = _nodeBuffer.Buffer.from(digestHex, 'hex');
    const pubKey = _bs.default.decode(pubKeyBase58);
    const r = sig64.subarray(0, 32);
    const s = sig64.subarray(32, 64);
    for (let v = 0; v < 2; v++) {
      const recKey = this.secp256k1.recoverPubKey(digest, {
        r,
        s
      }, v);
      const recPubKey = _nodeBuffer.Buffer.from(recKey.encode('array', true));
      if (_nodeBuffer.Buffer.from(recPubKey).equals(_nodeBuffer.Buffer.from(pubKey))) {
        return _nodeBuffer.Buffer.concat([sig64, _nodeBuffer.Buffer.from([27 + v])]).toString('hex');
      }
    }
    throw new Error('Unable to recover public key');
  }
}
exports.Secp = Secp;
//# sourceMappingURL=chain.js.map