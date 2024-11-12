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
  extractRS(signatureHex64) {
    const r = signatureHex64.slice(0, 64);
    const s = signatureHex64.slice(64);
    const hex = {
      r,
      s
    };
    const buffer = {
      r: Buffer.from(r, 'hex'),
      s: Buffer.from(s, 'hex')
    };
    return {
      buffer,
      hex
    };
  }
  signatureHex64To65(signatureHex64, trxId) {
    const {
      r,
      s
    } = this.extractRS(signatureHex64).buffer;
    const publicKeyHex = this.decompressPublicKey().toString('hex');
    const trxIdBuffer = Buffer.from(trxId, 'hex');
    for (const v of [27, 28]) {
      try {
        const recoveredKey = this.secp256k1.recoverPubKey(trxIdBuffer, {
          r,
          s
        }, v - 27);
        const recoveredPublicKey = recoveredKey.encode('hex', false);
        if (recoveredPublicKey === publicKeyHex) return Buffer.concat([r, s, Buffer.from([v])]).toString('hex');
      } catch (err) {
        // ignore
      }
    }
    throw new Error('Failed to recover public key');
  }
}
exports.Chain = Chain;
//# sourceMappingURL=chain.js.map