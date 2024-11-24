//
//  Locale.swift
//  tangem-sdk-codora-react-native
//
//  Created by Ali M. on 24/11/2024.
//

import TangemSdk_Codora

public extension TangemSdkCodoraReactNative {



  @objc(setAppLanguage:resolve:reject:)
  func setAppLanguage(
    languageCode: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {

    guard let appDelegate = UIApplication.shared.delegate else {
      handleReject(reject, "UIApplication.shared.delegate is nil")
      return
    }

    Localization.localizationsBundle = Bundle(for: type(of: appDelegate))

    UserDefaults.standard.set([languageCode], forKey: "AppleLanguages")
    UserDefaults.standard.synchronize()

  }



}
