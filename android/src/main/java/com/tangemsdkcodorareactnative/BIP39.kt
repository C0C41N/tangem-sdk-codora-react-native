package com.tangemsdkcodorareactnative

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.tangem.common.core.TangemSdkError
import com.tangem.crypto.bip39.EntropyLength
import com.tangem.sdk.codora.TangemSdkProvider

class BIP39 {

  fun generateMnemonic(wordCount: Int, promise: Promise) {

    val bip39 = TangemSdkProvider.getBip39()

    val entropyMap: Map<Int, EntropyLength> = listOf(
      EntropyLength.Bits128Length,
      EntropyLength.Bits160Length,
      EntropyLength.Bits192Length,
      EntropyLength.Bits224Length,
      EntropyLength.Bits256Length
    ).associateBy { it.wordCount() }

    val entropy = entropyMap[wordCount]!!
    val mnemonicList = bip39.generateMnemonic(entropy)
    val mnemonic = Arguments.createArray()
    mnemonicList.forEach { word -> mnemonic.pushString(word) }
    promise.resolve(mnemonic)

  }

  fun validateMnemonic(
    mnemonicComponents: ReadableArray,
    promise: Promise
  ) { try {

    val bip39 = TangemSdkProvider.getBip39()
    val mnemonicList = mnemonicComponents.toArrayList().map { it as String }

    bip39.validate(mnemonicList)

    promise.resolve(true)

  } catch (e: TangemSdkError) {

    promise.resolve(false)

  } }

}
