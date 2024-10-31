export interface Card {
    attestation: Attestation;
    supportedCurves: string[];
    userSettings: UserSettings;
    backupStatus: BackupStatus;
    manufacturer: Manufacturer;
    firmwareVersion: FirmwareVersion;
    cardPublicKey: string;
    settings: CardSettings;
    isPasscodeSet: boolean;
    linkedTerminalStatus: string;
    wallets: Wallet[];
    batchId: string;
    issuer: Issuer;
    cardId: string;
    isAccessCodeSet: boolean;
}
export interface Attestation {
    cardUniquenessAttestation: string;
    firmwareAttestation: string;
    walletKeysAttestation: string;
    cardKeyAttestation: string;
}
export interface BackupStatus {
    status: string;
    cardsCount: number;
}
export interface FirmwareVersion {
    major: number;
    type: string;
    patch: number;
    minor: number;
    stringValue: string;
}
export interface Issuer {
    publicKey: string;
    name: string;
}
export interface Manufacturer {
    manufactureDate: Date;
    name: string;
    signature: string;
}
export interface CardSettings {
    isRemovingUserCodesAllowed: boolean;
    isKeysImportAllowed: boolean;
    isSettingAccessCodeAllowed: boolean;
    isHDWalletAllowed: boolean;
    isBackupAllowed: boolean;
    isLinkedTerminalEnabled: boolean;
    securityDelay: number;
    maxWalletsCount: number;
    isSettingPasscodeAllowed: boolean;
    supportedEncryptionModes: string[];
    isFilesAllowed: boolean;
}
export interface UserSettings {
    isUserCodeRecoveryAllowed: boolean;
}
export interface Wallet {
    hasBackup: boolean;
    curve: string;
    isImported: boolean;
    chainCode?: string;
    publicKey: string;
    publicKeyBase58: string;
    derivedKeys: DerivedKeys;
    totalSignedHashes: number;
    settings: WalletSettings;
    index: number;
}
export interface DerivedKeys {
}
export interface WalletSettings {
    isPermanent: boolean;
}
//# sourceMappingURL=card.d.ts.map