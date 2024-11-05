import TangemSdk_Codora

public extension TangemSdkCodoraReactNative {

  private func backupSvcGetInfo() -> [String: Any] {
    return [
      "accessCodeIsSet": backupSvc.accessCodeIsSet,
      "addedBackupCardsCount": backupSvc.addedBackupCardsCount,
      "backupCardIds": backupSvc.backupCardIds,
      "canAddBackupCards": backupSvc.canAddBackupCards,
      "canProceed": backupSvc.canProceed,
      "currentState": String(describing: backupSvc.currentState),
      "hasIncompletedBackup": backupSvc.hasIncompletedBackup,
      "primaryCard": backupSvc.primaryCard?.cardId ?? NSNull(),
      "primaryCardIsSet": backupSvc.primaryCardIsSet,
    ]
  }

  @objc(backupSvcInit:reject:)
  func backupSvcInit(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {

    backupSvc.discardIncompletedBackup()
    resolve(backupSvcGetInfo())

  }

  @objc(readPrimaryCard:reject:)
  func backupSvcReadPrimaryCard(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let readPrimaryCardResult = await backupSvc.readPrimaryCardAsync()

    guard readPrimaryCardResult.success else {
      handleReject(reject, readPrimaryCardResult.error!.localizedDescription)
      return
    }

    resolve(backupSvcGetInfo())

  } }

  @objc(backupSvcSetAccessCode:resolve:reject:)
  func backupSvcSetAccessCode(
    accessCode: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { do {
    try backupSvc.setAccessCode(accessCode)
    resolve(backupSvcGetInfo())
  } catch {
    handleReject(reject, error.localizedDescription)
  } }

  @objc(backupSvcAddBackupCard:reject:)
  func backupSvcAddBackupCard(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let addBackupCardResult = await backupSvc.addBackupCardAsync()

    guard addBackupCardResult.success else {
      handleReject(reject, addBackupCardResult.error!.localizedDescription)
      return
    }

    resolve(backupSvcGetInfo())

  } }

  @objc(backupSvcProceedBackup:reject:)
  func backupSvcProceedBackup(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let proceedBackupResult = await backupSvc.proceedBackupAsync()

    guard proceedBackupResult.success else {
      handleReject(reject, proceedBackupResult.error!.localizedDescription)
      return
    }

    resolve(backupSvcGetInfo())

  } }

}
