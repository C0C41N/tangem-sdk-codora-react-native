import type { IBackupSvcInfo } from './types';
export declare class BackupService {
    private static instance;
    static getInstance(): Promise<BackupService>;
    private constructor();
    currentState: IBackupSvcInfo;
    private sanitizeState;
    readPrimaryCard(): Promise<IBackupSvcInfo>;
    setAccessCode(accessCode: string): Promise<IBackupSvcInfo>;
    addBackupCard(): Promise<IBackupSvcInfo>;
    proceedBackup(): Promise<IBackupSvcInfo>;
}
//# sourceMappingURL=backupSvc.d.ts.map