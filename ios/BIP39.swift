//
//  BIP39.swift
//  tangem-sdk-codora-react-native
//
//  Created by Ali M. on 11/11/2024.
//

import TangemSdkCodora

public extension TangemSdkCodoraReactNative {



  @objc(generateMnemonic:resolve:reject:)
  func generateMnemonic(
    wordCount: Int,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { do {

    let bip39 = BIP39()
    let entropyMap: [Int: EntropyLength] = Dictionary(uniqueKeysWithValues: EntropyLength.allCases.map { ($0.wordCount, $0) })
    let entropy = entropyMap[wordCount]!
    let mnemonic = try bip39.generateMnemonic(entropyLength: entropy)

    resolve(mnemonic)

  } catch {

    handleReject(reject, error)

  } }



  @objc(validateMnemonic:resolve:reject:)
  func validateMnemonic(
    mnemonicComponents: [String],
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) { do {

    let bip39 = BIP39()
    try bip39.validate(mnemonicComponents: mnemonicComponents)

    resolve(true)

  } catch {

    resolve(false)

  } }



}
