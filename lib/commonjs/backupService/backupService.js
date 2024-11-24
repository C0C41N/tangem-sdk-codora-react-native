"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BackupService = void 0;
var _nativeModule = require("../nativeModule.js");
var _withNativeResponse = require("../withNativeResponse.js");
class BackupService {
  static async getInstance() {
    if (!this.instance) this.instance = new BackupService(await _nativeModule.NativeModule.backupSvcInit());
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
    return (0, _withNativeResponse.withNativeResponse)(async () => {
      const state = await _nativeModule.NativeModule.backupSvcReadPrimaryCard();
      return this.sanitizeState(state);
    });
  }
  async setAccessCode(accessCode) {
    return (0, _withNativeResponse.withNativeResponse)(async () => {
      const state = await _nativeModule.NativeModule.backupSvcSetAccessCode(accessCode);
      return this.sanitizeState(state);
    });
  }
  async addBackupCard() {
    return (0, _withNativeResponse.withNativeResponse)(async () => {
      const state = await _nativeModule.NativeModule.backupSvcAddBackupCard();
      return this.sanitizeState(state);
    });
  }
  async proceedBackup() {
    return (0, _withNativeResponse.withNativeResponse)(async () => {
      const state = await _nativeModule.NativeModule.backupSvcProceedBackup();
      return this.sanitizeState(state);
    });
  }
}
exports.BackupService = BackupService;
//# sourceMappingURL=backupService.js.map