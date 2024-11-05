export interface IBackupSvcInfo {
  accessCodeIsSet: boolean;
  addedBackupCardsCount: number;
  backupCardIds: string[];
  canAddBackupCards: boolean;
  canProceed: boolean;
  currentState: string;
  hasIncompletedBackup: boolean;
  primaryCard: string;
  primaryCardIsSet: boolean;
}
