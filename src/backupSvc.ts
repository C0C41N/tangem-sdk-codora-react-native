import { TangemSdkCodoraReactNative } from './nativeModule';
import type { IBackupSvcInfo } from './types';
import cloneDeep from 'lodash.clonedeep';

export class BackupService {
  public currentState!: IBackupSvcInfo;

  private constructor() {}

  public static async init() {
    const instance = new BackupService();
    instance.currentState = await TangemSdkCodoraReactNative.backupSvcInit();
    return instance;
  }

  public async readPrimaryCard(): Promise<IBackupSvcInfo> {
    this.currentState = await TangemSdkCodoraReactNative.backupSvcReadPrimaryCard();
    return cloneDeep(this.currentState);
  }

  public async setAccessCode(accessCode: string): Promise<IBackupSvcInfo> {
    this.currentState = await TangemSdkCodoraReactNative.backupSvcSetAccessCode(accessCode);
    return cloneDeep(this.currentState);
  }

  public async addBackupCard(): Promise<IBackupSvcInfo> {
    this.currentState = await TangemSdkCodoraReactNative.backupSvcAddBackupCard();
    return cloneDeep(this.currentState);
  }

  public async proceedBackup(): Promise<IBackupSvcInfo> {
    this.currentState = await TangemSdkCodoraReactNative.backupSvcProceedBackup();
    return cloneDeep(this.currentState);
  }
}
