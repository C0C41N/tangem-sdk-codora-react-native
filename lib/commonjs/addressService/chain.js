"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Chain = void 0;
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
}
exports.Chain = Chain;
//# sourceMappingURL=chain.js.map