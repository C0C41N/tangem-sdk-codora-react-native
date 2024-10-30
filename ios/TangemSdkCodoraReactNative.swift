import TangemSdk_Codora
import Foundation

@objc(TangemSdkCodoraReactNative)
class TangemSdkCodoraReactNative: NSObject {

  let errorCode = "TANGEM_SDK_CODORA_ERROR"
  let errorObj = NSError(domain: "TangemSdkCodoraReactNative", code: 0, userInfo: nil)

  let sdk = TangemProvider.getTangemSdk()

  @objc(scan:accessCode:resolve:reject:)
  public func scan(
    cardId: String?,
    accessCode: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(cardId: cardId, accessCode: accessCode)

    guard startSessionResult.success, let session = startSessionResult.value else {
      reject(errorCode, "Start Session failed: \(startSessionResult.error!)", errorObj)
      return
    }

    let scan = ScanTask()
    let scanResult = await scan.runAsync(in: session)

    guard scanResult.success, let card = scanResult.value else {
      reject(errorCode, "ScanTask failed: \(scanResult.error!)", errorObj)
      session.stop()
      return
    }

    session.stop()
    resolve(card.json)

  } }
  
  @objc(sign:pubKeyBase58:cardId:accessCode:resolve:reject:)
  public func sign(
    unsignedHex: String,
    pubKeyBase58: String,
    cardId: String?,
    accessCode: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(cardId: cardId, accessCode: accessCode)
    
    guard startSessionResult.success, let session = startSessionResult.value else {
      reject(errorCode, "Start Session failed: \(startSessionResult.error!)", errorObj)
      return
    }
    
    let pubKeyData = pubKeyBase58.base58DecodedData
    let hashData = Data(hexString: unsignedHex)
    
    let sign = SignCommand(hashes: [hashData], walletPublicKey: pubKeyData)
    let signResult = await sign.runAsync(in: session)
    
    guard signResult.success, let response = signResult.value else {
      reject(errorCode, "SignCommand failed: \(signResult.error!)", errorObj)
      session.stop()
      return
    }
    
    session.stop()
    resolve(response.signatures[0].hexString)

  } }

}
