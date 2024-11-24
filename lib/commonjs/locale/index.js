"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _locale = require("./locale.js");
Object.keys(_locale).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _locale[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _locale[key];
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