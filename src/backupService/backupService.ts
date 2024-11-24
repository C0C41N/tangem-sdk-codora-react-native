import { NativeModule } from '@nativeModule';
import { withNativeResponse } from '@withNativeResponse';
import type { INativeResponse } from '@types';
import type { IBackupState, IBackupSvcInfo } from './types';

export class BackupService {
  private static instance: BackupService;

  public static async getInstance() {
    if (!this.instance) this.instance = new BackupService(await NativeModule.backupSvcInit());
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

  public async readPrimaryCard(): Promise<INativeResponse<IBackupSvcInfo>> {
    return withNativeResponse(async () => {
      const state: IBackupSvcInfo<string> = await NativeModule.backupSvcReadPrimaryCard();
      return this.sanitizeState(state);
    });
  }

  public async setAccessCode(accessCode: string): Promise<INativeResponse<IBackupSvcInfo>> {
    return withNativeResponse(async () => {
      const state: IBackupSvcInfo<string> = await NativeModule.backupSvcSetAccessCode(accessCode);
      return this.sanitizeState(state);
    });
  }

  public async addBackupCard(): Promise<INativeResponse<IBackupSvcInfo>> {
    return withNativeResponse(async () => {
      const state: IBackupSvcInfo<string> = await NativeModule.backupSvcAddBackupCard();
      return this.sanitizeState(state);
    });
  }

  public async proceedBackup(): Promise<INativeResponse<IBackupSvcInfo>> {
    return withNativeResponse(async () => {
      const state: IBackupSvcInfo<string> = await NativeModule.backupSvcProceedBackup();
      return this.sanitizeState(state);
    });
  }
}
