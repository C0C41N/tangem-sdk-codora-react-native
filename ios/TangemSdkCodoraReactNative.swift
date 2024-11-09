import TangemSdk_Codora

@objc(TangemSdkCodoraReactNative)
public class TangemSdkCodoraReactNative: NSObject {

  internal let sdk = TangemProvider.getTangemSdk()
  internal let backupSvc: BackupService = { return BackupService(sdk: TangemProvider.getTangemSdk()) }()

  internal func handleReject(_ reject: @escaping RCTPromiseRejectBlock, _ err: Error) {
    reject(
      String(err.toTangemSdkError().code),
      String(describing: err),
      nil
    )
  }

}
