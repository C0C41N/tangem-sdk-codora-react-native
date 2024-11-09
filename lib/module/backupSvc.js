"use strict";

import { TangemSdkCodoraReactNative } from "./nativeModule.js";
export class BackupService {
  static async getInstance() {
    if (!this.instance) this.instance = new BackupService(await TangemSdkCodoraReactNative.backupSvcInit());
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
    const state = await TangemSdkCodoraReactNative.backupSvcReadPrimaryCard();
    return this.sanitizeState(state);
  }
  async setAccessCode(accessCode) {
    const state = await TangemSdkCodoraReactNative.backupSvcSetAccessCode(accessCode);
    return this.sanitizeState(state);
  }
  async addBackupCard() {
    const state = await TangemSdkCodoraReactNative.backupSvcAddBackupCard();
    return this.sanitizeState(state);
  }
  async proceedBackup() {
    const state = await TangemSdkCodoraReactNative.backupSvcProceedBackup();
    return this.sanitizeState(state);
  }
}
//# sourceMappingURL=backupSvc.js.map