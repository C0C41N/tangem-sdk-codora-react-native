import TangemSdk_Codora
import Foundation

@objc(TangemSdkCodoraReactNative)
class TangemSdkCodoraReactNative: NSObject {

  let errorCode = "TANGEM_SDK_CODORA_ERROR"
  let errorObj = NSError(domain: "TangemSdkCodoraReactNative", code: 0, userInfo: nil)

  let sdk = TangemProvider.getTangemSdk()

  @objc(scan:cardId:resolve:reject:)
  public func scan(
    accessCode: String?,
    cardId: String?,
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
  
  @objc(sign:pubKeyBase58:accessCode:cardId:resolve:reject:)
  public func sign(
    unsignedHex: String,
    pubKeyBase58: String,
    accessCode: String?,
    cardId: String?,
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
  
  @objc(purgeAllWallets:cardId:resolve:reject:)
  func purgeAllWallets(
    accessCode: String?,
    cardId: String?,
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
    
    var purgedWallets: [[String: Any]] = []
    
    for wallet in card.wallets {
      let purge = PurgeWalletCommand(publicKey: wallet.publicKey)
      let purgeResult = await purge.runAsync(in: session)
      
      guard purgeResult.success else {
        print("PurgeWalletCommand failed: \(purgeResult.error!)")
        session.stop()
        return
      }

      purgedWallets.append([
        "curve": wallet.curve.rawValue,
        "publicKey": wallet.publicKey.base58EncodedString
      ])
    }
    
    session.stop()
    resolve(purgedWallets)
    
  } }

  @objc(createAllWallets:cardId:resolve:reject:)
  public func createAllWallets(
    accessCode: String?,
    cardId: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(cardId: cardId, accessCode: accessCode)

    guard startSessionResult.success, let session = startSessionResult.value else {
      reject(errorCode, "Start Session failed: \(startSessionResult.error!)", errorObj)
      return
    }

    let curves: [EllipticCurve] = [.secp256k1, .ed25519, .bls12381_G2_AUG, .bip0340, .ed25519_slip0010]
    
    var createdWallets: [[String: Any]] = []

    for curve in curves {
      let createWallet = CreateWalletTask(curve: curve)
      let createWalletResult = await createWallet.runAsync(in: session)

      guard createWalletResult.success, let response = createWalletResult.value else {
        reject(errorCode, "CreateWalletTask failed: \(createWalletResult.error!)", errorObj)
        session.stop()
        return
      }
      
      createdWallets.append([
        "curve": curve.rawValue,
        "publicKey": response.wallet.publicKey.base58EncodedString
      ])
    }

    session.stop()
    resolve(createdWallets)

  } }

}
