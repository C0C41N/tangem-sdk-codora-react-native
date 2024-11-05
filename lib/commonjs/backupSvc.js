"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BackupService = void 0;
var _nativeModule = require("./nativeModule.js");
var _lodash = _interopRequireDefault(require("lodash.clonedeep"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class BackupService {
  constructor() {}
  static async init() {
    const instance = new BackupService();
    instance.currentState = await _nativeModule.TangemSdkCodoraReactNative.backupSvcInit();
    return instance;
  }
  async readPrimaryCard() {
    this.currentState = await _nativeModule.TangemSdkCodoraReactNative.backupSvcReadPrimaryCard();
    return (0, _lodash.default)(this.currentState);
  }
  async setAccessCode(accessCode) {
    this.currentState = await _nativeModule.TangemSdkCodoraReactNative.backupSvcSetAccessCode(accessCode);
    return (0, _lodash.default)(this.currentState);
  }
  async addBackupCard() {
    this.currentState = await _nativeModule.TangemSdkCodoraReactNative.backupSvcAddBackupCard();
    return (0, _lodash.default)(this.currentState);
  }
  async proceedBackup() {
    this.currentState = await _nativeModule.TangemSdkCodoraReactNative.backupSvcProceedBackup();
    return (0, _lodash.default)(this.currentState);
  }
}
exports.BackupService = BackupService;
//# sourceMappingURL=backupSvc.js.map