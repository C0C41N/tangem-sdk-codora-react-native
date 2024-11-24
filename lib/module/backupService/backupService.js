"use strict";

import { NativeModule } from '../nativeModule.js';
import { withNativeResponse } from '../withNativeResponse.js';
export class BackupService {
  static async getInstance() {
    if (!this.instance) this.instance = new BackupService(await NativeModule.backupSvcInit());
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
    return withNativeResponse(async () => {
      const state = await NativeModule.backupSvcReadPrimaryCard();
      return this.sanitizeState(state);
    });
  }
  async setAccessCode(accessCode) {
    return withNativeResponse(async () => {
      const state = await NativeModule.backupSvcSetAccessCode(accessCode);
      return this.sanitizeState(state);
    });
  }
  async addBackupCard() {
    return withNativeResponse(async () => {
      const state = await NativeModule.backupSvcAddBackupCard();
      return this.sanitizeState(state);
    });
  }
  async proceedBackup() {
    return withNativeResponse(async () => {
      const state = await NativeModule.backupSvcProceedBackup();
      return this.sanitizeState(state);
    });
  }
}
//# sourceMappingURL=backupService.js.map