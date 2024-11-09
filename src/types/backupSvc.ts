export interface IBackupState {
  id: string;
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
