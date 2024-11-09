"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BackupService = void 0;
var _nativeModule = require("./nativeModule.js");
class BackupService {
  static async getInstance() {
    if (!this.instance) this.instance = new BackupService(await _nativeModule.TangemSdkCodoraReactNative.backupSvcInit());
    return this.instance;
  }
  constructor(state) {
    this.currentState = this.sanitizeState(state, false);
  }
  sanitizeState(state, update = true) {
    const [id, data] = state.currentState.split(':');
    const currentState = {
      id,
      data
    };
    const sanitizedState = {
      ...state,
      currentState
    };
    if (update) this.currentState = sanitizedState;
    return sanitizedState;
  }
  async readPrimaryCard() {
    const state = await _nativeModule.TangemSdkCodoraReactNative.backupSvcReadPrimaryCard();
    return this.sanitizeState(state);
  }
  async setAccessCode(accessCode) {
    const state = await _nativeModule.TangemSdkCodoraReactNative.backupSvcSetAccessCode(accessCode);
    return this.sanitizeState(state);
  }
  async addBackupCard() {
    const state = await _nativeModule.TangemSdkCodoraReactNative.backupSvcAddBackupCard();
    return this.sanitizeState(state);
  }
  async proceedBackup() {
    const state = await _nativeModule.TangemSdkCodoraReactNative.backupSvcProceedBackup();
    return this.sanitizeState(state);
  }
}
exports.BackupService = BackupService;
//# sourceMappingURL=backupSvc.js.map