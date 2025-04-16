package com.tangemsdkcodorareactnative
import android.content.Context
import android.content.res.Configuration
import com.facebook.react.bridge.Promise
import java.util.Locale

@Suppress("DEPRECATION")
class Locale (private val module: TangemModule) {

  fun setAppLanguage(
    context: Context,
    languageCode: String,
    promise: Promise
  ) { try {

    println("languageCode_1 $languageCode")

    val locale = Locale("zh", "TW")
    Locale.setDefault(locale)
    val config = Configuration(context.resources.configuration)
    config.setLocale(locale)
    context.resources.updateConfiguration(config, context.resources.displayMetrics)

    val currentLocale: Locale = context.resources.configuration.locales.get(0)
    println("Current locale: ${currentLocale.language}-${currentLocale.country}")

    val localizedString = context.getString(com.tangem.sdk.R.string.view_delegate_scan)
    println("Sample locale string: $localizedString")

    promise.resolve(true)

  } catch (err: Error) {

    module.handleReject(promise, err.toString())

  } }

}
