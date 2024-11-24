import type { INativeResponse } from '@types';
import type { IBackupSvcInfo } from './types';
export declare class BackupService {
    private static instance;
    static getInstance(): Promise<BackupService>;
    private constructor();
    currentState: IBackupSvcInfo;
    private sanitizeState;
    readPrimaryCard(): Promise<INativeResponse<IBackupSvcInfo>>;
    setAccessCode(accessCode: string): Promise<INativeResponse<IBackupSvcInfo>>;
    addBackupCard(): Promise<INativeResponse<IBackupSvcInfo>>;
    proceedBackup(): Promise<INativeResponse<IBackupSvcInfo>>;
}
//# sourceMappingURL=backupService.d.ts.map