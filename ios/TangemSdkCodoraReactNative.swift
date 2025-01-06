import TangemSdk_Codora

@objc(TangemSdkCodoraReactNative)
public class TangemSdkCodoraReactNative: NSObject {

  internal let sdk = TangemProvider.getTangemSdk()
  internal let backupSvc: BackupService = { return BackupService(sdk: TangemProvider.getTangemSdk()) }()


  internal let nonceHDPath = "m/44'/501'/141414'/0'"



  internal func handleReject(
    _ reject: @escaping RCTPromiseRejectBlock,
    _ err: Error
  ) { reject (

      String(err.toTangemSdkError().code),
      String(describing: err),
      nil

  ) }



  internal func handleReject(
    _ reject: @escaping RCTPromiseRejectBlock,
    _ msg: String
  ) { reject (

    "NativeError",
    msg,
    nil

  ) }



}
