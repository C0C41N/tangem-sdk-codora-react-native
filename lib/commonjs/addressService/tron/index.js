"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _tron = require("./tron.js");
Object.keys(_tron).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _tron[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tron[key];
    }
  });
});
//# sourceMappingURL=index.js.map