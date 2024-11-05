import type { IBackupSvcInfo } from './types';
export declare class BackupService {
    currentState: IBackupSvcInfo;
    private constructor();
    static init(): Promise<BackupService>;
    readPrimaryCard(): Promise<IBackupSvcInfo>;
    setAccessCode(accessCode: string): Promise<IBackupSvcInfo>;
    addBackupCard(): Promise<IBackupSvcInfo>;
    proceedBackup(): Promise<IBackupSvcInfo>;
}
//# sourceMappingURL=backupSvc.d.ts.map