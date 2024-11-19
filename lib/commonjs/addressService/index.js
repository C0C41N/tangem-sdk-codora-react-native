"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  resolveAddresses: true
};
exports.resolveAddresses = resolveAddresses;
var _types = require("./types.js");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _index = require("./ethereum/index.js");
var _index2 = require("./solana/index.js");
var _index3 = require("./tron/index.js");
const chainNameToClass = {
  [_types.AddressSvcChain.SOLANA]: _index2.Solana,
  [_types.AddressSvcChain.TRON]: _index3.Tron,
  [_types.AddressSvcChain.ETHEREUM]: _index.Ethereum
};
async function resolveAddresses(payloadList) {
  return payloadList.map(({
    chain,
    pubKeyBase58
  }) => {
    const serviceClass = chainNameToClass[chain];
    if (!serviceClass) throw new Error(`Unsupported chain ${chain}`);
    const instance = new serviceClass(pubKeyBase58);
    const publicAddress = instance.getPublicAddress();
    return {
      chain,
      pubKeyBase58,
      publicAddress
    };
  });
}
//# sourceMappingURL=index.js.map