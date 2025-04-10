import TangemSdk_Codora

public extension TangemSdkCodoraReactNative {



  private func backupSvcGetInfo() -> [String: Any] {

    func getState() -> String {
      switch backupSvc.currentState {
      case .preparing:
        return "preparing"
      case .finalizingPrimaryCard:
        return "finalizingPrimaryCard"
      case .finalizingBackupCard(let index):
        return "finalizingBackupCard:\(index)"
      case .finished:
        return "finished"
      }
    }

    return [
      "accessCodeIsSet": backupSvc.accessCodeIsSet,
      "addedBackupCardsCount": backupSvc.addedBackupCardsCount,
      "backupCardIds": backupSvc.backupCardIds,
      "canAddBackupCards": backupSvc.canAddBackupCards,
      "canProceed": backupSvc.canProceed,
      "currentState": getState(),
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



  @objc(backupSvcReadPrimaryCard:reject:)
  func backupSvcReadPrimaryCard(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    backupSvc.discardIncompletedBackup()

    let readPrimaryCardResult = await backupSvc.readPrimaryCardAsync()

    guard readPrimaryCardResult.success else {
      handleReject(reject, readPrimaryCardResult.error!)
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

    handleReject(reject, error)

  } }



  @objc(backupSvcAddBackupCard:reject:)
  func backupSvcAddBackupCard(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let addBackupCardResult = await backupSvc.addBackupCardAsync()

    guard addBackupCardResult.success else {
      handleReject(reject, addBackupCardResult.error!)
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
      handleReject(reject, proceedBackupResult.error!)
      return
    }

    resolve(backupSvcGetInfo())

  } }



}
