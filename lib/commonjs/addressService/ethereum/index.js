"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ethereum = require("./ethereum.js");
Object.keys(_ethereum).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ethereum[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ethereum[key];
    }
  });
});
//# sourceMappingURL=index.js.map