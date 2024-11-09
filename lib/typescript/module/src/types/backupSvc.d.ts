export declare enum BackupState {
    preparing = "preparing",
    finalizingPrimaryCard = "finalizingPrimaryCard",
    finalizingBackupCard = "finalizingBackupCard",
    finished = "finished"
}
export interface IBackupState {
    id: BackupState;
    data: string | undefined;
}
export interface IBackupSvcInfo<T = IBackupState> {
    accessCodeIsSet: boolean;
    addedBackupCardsCount: number;
    backupCardIds: string[];
    canAddBackupCards: boolean;
    canProceed: boolean;
    currentState: T;
    hasIncompletedBackup: boolean;
    primaryCard: string;
    primaryCardIsSet: boolean;
}
//# sourceMappingURL=backupSvc.d.ts.map