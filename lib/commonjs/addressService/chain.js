"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Secp = exports.Chain = void 0;
var _bs = _interopRequireDefault(require("bs58"));
var _elliptic = require("elliptic");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class Chain {
  secp256k1 = new _elliptic.ec('secp256k1');
  constructor(pubKeyBase58) {
    this.pubKeyBase58 = pubKeyBase58;
  }
  decompressPublicKey() {
    const compressedPubKeyBuffer = Buffer.from(_bs.default.decode(this.pubKeyBase58));
    const key = this.secp256k1.keyFromPublic(compressedPubKeyBuffer, 'array');
    const decompressedPubKeyArray = key.getPublic(false, 'array');
    const decompressedPubKeyBuffer = Buffer.from(decompressedPubKeyArray);
    return decompressedPubKeyBuffer;
  }
  toSigHex65(sigHex64, digestHex) {
    const sig64 = Buffer.from(sigHex64, 'hex');
    const digest = Buffer.from(digestHex, 'hex');
    const pubKey = _bs.default.decode(this.pubKeyBase58);
    const r = sig64.subarray(0, 32);
    const s = sig64.subarray(32, 64);
    for (let v = 0; v < 2; v++) {
      const recKey = this.secp256k1.recoverPubKey(digest, {
        r,
        s
      }, v);
      const recPubKey = Buffer.from(recKey.encode('array', true));
      if (Buffer.from(recPubKey).equals(Buffer.from(pubKey))) {
        return Buffer.concat([sig64, Buffer.from([27 + v])]).toString('hex');
      }
    }
    throw new Error('Unable to recover public key');
  }
}
exports.Chain = Chain;
class Secp extends Chain {
  getPublicAddress() {
    throw new Error('Method not implemented.');
  }
}
exports.Secp = Secp;
//# sourceMappingURL=chain.js.map