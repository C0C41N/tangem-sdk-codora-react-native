package com.tangemsdkcodorareactnative
import android.content.Context
import android.content.res.Configuration
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import java.util.Locale

@Suppress("DEPRECATION")
class Locale (private val module: TangemModule) {

  fun setAppLanguage(
    context: ReactApplicationContext,
    languageCode: String,
    promise: Promise
  ) { try {

    val (language, country) = languageCode.split("-")

    println("languageCode_1 $languageCode") ///

    val locale = Locale(language, country)
    Locale.setDefault(locale)
    val config = Configuration(context.resources.configuration)
    config.setLocale(locale)
    context.resources.updateConfiguration(config, context.resources.displayMetrics)

    val currentLocale: Locale = context.resources.configuration.locales.get(0) ///
    println("Current locale: ${currentLocale.language}-${currentLocale.country}") ///

    val localizedString = context.getString(com.tangem.sdk.R.string.view_delegate_scan) ///
    println("Sample locale string: $localizedString") ///

    val activity = context.currentActivity
    activity?.runOnUiThread { activity.recreate() }

    promise.resolve(true)

  } catch (err: Error) {

    module.handleReject(promise, err.toString())

  } }

}
