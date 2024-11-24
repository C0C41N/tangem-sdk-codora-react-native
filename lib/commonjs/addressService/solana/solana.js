"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Solana = void 0;
var _chain = require("@addressService/chain");
class Solana extends _chain.Chain {
  constructor(pubKeyBase58) {
    super(pubKeyBase58);
  }
  getPublicAddress() {
    return this.pubKeyBase58;
  }
}
exports.Solana = Solana;
//# sourceMappingURL=solana.js.map