"use strict";

import { TangemSdkCodoraReactNative } from "./nativeModule.js";
import cloneDeep from 'lodash.clonedeep';
export class BackupService {
  constructor() {}
  static async init() {
    const instance = new BackupService();
    instance.currentState = await TangemSdkCodoraReactNative.backupSvcInit();
    return instance;
  }
  async readPrimaryCard() {
    this.currentState = await TangemSdkCodoraReactNative.backupSvcReadPrimaryCard();
    return cloneDeep(this.currentState);
  }
  async setAccessCode(accessCode) {
    this.currentState = await TangemSdkCodoraReactNative.backupSvcSetAccessCode(accessCode);
    return cloneDeep(this.currentState);
  }
  async addBackupCard() {
    this.currentState = await TangemSdkCodoraReactNative.backupSvcAddBackupCard();
    return cloneDeep(this.currentState);
  }
  async proceedBackup() {
    this.currentState = await TangemSdkCodoraReactNative.backupSvcProceedBackup();
    return cloneDeep(this.currentState);
  }
}
//# sourceMappingURL=backupSvc.js.map