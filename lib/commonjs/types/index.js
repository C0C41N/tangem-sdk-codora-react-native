"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _card = require("./card.js");
Object.keys(_card).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _card[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _card[key];
    }
  });
});
//# sourceMappingURL=index.js.map