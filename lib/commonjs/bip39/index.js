"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _bip = require("./bip39.js");
Object.keys(_bip).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _bip[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _bip[key];
    }
  });
});
var _types = require("./types.js");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
//# sourceMappingURL=index.js.map