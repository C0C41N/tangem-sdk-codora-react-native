import TangemSdk_Codora

public extension TangemSdkCodoraReactNative {



  @objc(scan:cardId:msgHeader:msgBody:resolve:reject:)
  func scan(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(
      cardId: cardId,
      accessCode: accessCode,
      msgHeader: msgHeader,
      msgBody: msgBody
    )

    guard startSessionResult.success, let session = startSessionResult.value else {
      handleReject(reject, startSessionResult.error!)
      return
    }

    let scan = ScanTask()
    let scanResult = await scan.runAsync(in: session)

    guard scanResult.success, let card = scanResult.value else {
      handleReject(reject, scanResult.error!)
      session.stop()
      return
    }

    session.stop()

    resolve([
      "card": card.json,
      "publicKeysBase58": card.wallets.map { $0.publicKey.base58EncodedString }
    ])

  } }



  @objc(sign:pubKeyBase58:accessCode:cardId:msgHeader:msgBody:resolve:reject:)
  func sign(
    unsignedHex: String,
    pubKeyBase58: String,
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(
      cardId: cardId,
      accessCode: accessCode,
      msgHeader: msgHeader,
      msgBody: msgBody
    )

    guard startSessionResult.success, let session = startSessionResult.value else {
      handleReject(reject, startSessionResult.error!)
      return
    }

    let pubKeyData = pubKeyBase58.base58DecodedData
    let hashData = Data(hexString: unsignedHex)

    let sign = SignCommand(hashes: [hashData], walletPublicKey: pubKeyData)
    let signResult = await sign.runAsync(in: session)

    guard signResult.success, let response = signResult.value else {
      handleReject(reject, signResult.error!)
      session.stop()
      return
    }

    session.stop()
    resolve(response.signatures[0].hexString)

  } }



  @objc(signMultiple:pubKeyBase58Arr:accessCode:cardId:msgHeader:msgBody:resolve:reject:)
  func signMultiple(
    unsignedHexArr: [String],
    pubKeyBase58Arr: [String],
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(
      cardId: cardId,
      accessCode: accessCode,
      msgHeader: msgHeader,
      msgBody: msgBody
    )

    guard startSessionResult.success, let session = startSessionResult.value else {
      handleReject(reject, startSessionResult.error!)
      return
    }

    var signatures: [String] = []

    for (unsignedHex, pubKeyBase58) in zip(unsignedHexArr, pubKeyBase58Arr) {

      let pubKeyData = pubKeyBase58.base58DecodedData
      let hashData = Data(hexString: unsignedHex)

      let sign = SignCommand(hashes: [hashData], walletPublicKey: pubKeyData)
      let signResult = await sign.runAsync(in: session)

      guard signResult.success, let response = signResult.value else {
        handleReject(reject, signResult.error!)
        session.stop()
        return
      }

      signatures.append(response.signatures[0].hexString)

    }

    session.stop()
    resolve(signatures)

  } }



  @objc(purgeAllWallets:cardId:msgHeader:msgBody:resolve:reject:)
  func purgeAllWallets(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(
      cardId: cardId,
      accessCode: accessCode,
      msgHeader: msgHeader,
      msgBody: msgBody
    )

    guard startSessionResult.success, let session = startSessionResult.value else {
      handleReject(reject, startSessionResult.error!)
      return
    }

    let scan = ScanTask()
    let scanResult = await scan.runAsync(in: session)

    guard scanResult.success, let card = scanResult.value else {
      handleReject(reject, scanResult.error!)
      session.stop()
      return
    }

    var purgedWallets: [[String: Any]] = []

    for wallet in card.wallets {
      let purge = PurgeWalletCommand(publicKey: wallet.publicKey)
      let purgeResult = await purge.runAsync(in: session)

      guard purgeResult.success else {
        handleReject(reject, purgeResult.error!)
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



  @objc(createAllWallets:cardId:msgHeader:msgBody:resolve:reject:)
  func createAllWallets(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(
      cardId: cardId,
      accessCode: accessCode,
      msgHeader: msgHeader,
      msgBody: msgBody
    )

    guard startSessionResult.success, let session = startSessionResult.value else {
      handleReject(reject, startSessionResult.error!)
      return
    }

    let curves: [EllipticCurve] = [.secp256k1, .ed25519, .bls12381_G2_AUG, .bip0340, .ed25519_slip0010]

    var createdWallets: [[String: Any]] = []

    for curve in curves {
      let createWallet = CreateWalletTask(curve: curve)
      let createWalletResult = await createWallet.runAsync(in: session)

      guard createWalletResult.success, let response = createWalletResult.value else {
        handleReject(reject, createWalletResult.error!)
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



  @objc(setAccessCode:currentAccessCode:cardId:msgHeader:msgBody:resolve:reject:)
  func setAccessCode(
    newAccessCode: String,
    currentAccessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(
      cardId: cardId,
      accessCode: currentAccessCode,
      msgHeader: msgHeader,
      msgBody: msgBody
    )

    guard startSessionResult.success, let session = startSessionResult.value else {
      handleReject(reject, startSessionResult.error!)
      return
    }

    let setAccessCode = SetUserCodeCommand(accessCode: newAccessCode)
    let setAccessCodeResult = await setAccessCode.runAsync(in: session)

    guard setAccessCodeResult.success else {
      handleReject(reject, setAccessCodeResult.error!)
      session.stop()
      return
    }

    session.stop()
    resolve(nil)

  } }



  @objc(resetBackup:cardId:msgHeader:msgBody:resolve:reject:)
  func resetBackup(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(
      cardId: cardId,
      accessCode: accessCode,
      msgHeader: msgHeader,
      msgBody: msgBody
    )

    guard startSessionResult.success, let session = startSessionResult.value else {
      handleReject(reject, startSessionResult.error!)
      return
    }

    let resetBackup = ResetBackupCommand()
    let resetBackupResult = await resetBackup.runAsync(in: session)

    guard resetBackupResult.success else {
      handleReject(reject, resetBackupResult.error!)
      session.stop()
      return
    }

    session.stop()
    resolve(nil)

  } }



  @objc(resetCodes:cardId:msgHeader:msgBody:resolve:reject:)
  func resetCodes(
    accessCode: String?,
    cardId: String?,
    msgHeader: String?,
    msgBody: String?,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { Task {

    let startSessionResult = await sdk.startSessionAsync(
      cardId: cardId,
      accessCode: accessCode,
      msgHeader: msgHeader,
      msgBody: msgBody
    )

    guard startSessionResult.success, let session = startSessionResult.value else {
      handleReject(reject, startSessionResult.error!)
      return
    }

    let resetCodesResult = await SetUserCodeCommand.resetUserCodes.runAsync(in: session)

    guard resetCodesResult.success else {
      handleReject(reject, resetCodesResult.error!)
      session.stop()
      return
    }

    session.stop()
    resolve(nil)

  } }



  @objc(enableBiometrics:resolve:reject:)
  func enableBiometrics(
    enable: Bool,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {

    let decisionMap: [Bool: AccessCodeRequestPolicy] = [
      true: .alwaysWithBiometrics,
      false: .always
    ]

    sdk.config.accessCodeRequestPolicy = decisionMap[enable]!

    resolve(nil)

  }



}
