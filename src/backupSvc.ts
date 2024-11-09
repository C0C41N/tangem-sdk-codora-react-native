import { TangemSdkCodoraReactNative } from './nativeModule';
import type { IBackupState, IBackupSvcInfo } from './types';

export class BackupService {
  private static instance: BackupService;

  public static async getInstance() {
    if (!this.instance) this.instance = new BackupService(await TangemSdkCodoraReactNative.backupSvcInit());
    return this.instance;
  }

  private constructor(state: IBackupSvcInfo<string>) {
    this.currentState = this.sanitizeState(state, false);
  }

  public currentState: IBackupSvcInfo;

  private sanitizeState(state: IBackupSvcInfo<string>, update = true): IBackupSvcInfo {
    const [id, data] = state.currentState.split(':');
    const currentState = { id, data } as IBackupState;
    const sanitizedState = { ...state, currentState } as IBackupSvcInfo;
    if (update) this.currentState = sanitizedState;
    return sanitizedState;
  }

  public async readPrimaryCard(): Promise<IBackupSvcInfo> {
    const state: IBackupSvcInfo<string> = await TangemSdkCodoraReactNative.backupSvcReadPrimaryCard();
    return this.sanitizeState(state);
  }

  public async setAccessCode(accessCode: string): Promise<IBackupSvcInfo> {
    const state: IBackupSvcInfo<string> = await TangemSdkCodoraReactNative.backupSvcSetAccessCode(accessCode);
    return this.sanitizeState(state);
  }

  public async addBackupCard(): Promise<IBackupSvcInfo> {
    const state: IBackupSvcInfo<string> = await TangemSdkCodoraReactNative.backupSvcAddBackupCard();
    return this.sanitizeState(state);
  }

  public async proceedBackup(): Promise<IBackupSvcInfo> {
    const state: IBackupSvcInfo<string> = await TangemSdkCodoraReactNative.backupSvcProceedBackup();
    return this.sanitizeState(state);
  }
}
