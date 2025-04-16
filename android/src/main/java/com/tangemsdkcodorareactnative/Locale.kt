package com.tangemsdkcodorareactnative
import android.content.Context
import android.content.res.Configuration
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import com.facebook.react.bridge.Promise
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.Locale

class Locale (private val module: TangemModule) {

  @OptIn(DelicateCoroutinesApi::class)
  fun setAppLanguage(
    context: Context,
    languageCode: String,
    promise: Promise
  ) { GlobalScope.launch(Dispatchers.Main) { try {

    AppCompatDelegate.setApplicationLocales(LocaleListCompat.create(Locale.forLanguageTag(languageCode)))

//    val (language, country) = languageCode.split("-")
//
//    println("languageCode_1 $languageCode") ///
//
//    val locale = Locale(language, country)
//    Locale.setDefault(locale)
//    val config = Configuration(context.resources.configuration)
//    config.setLocale(locale)
//    context.resources.updateConfiguration(config, context.resources.displayMetrics)

    val currentLocale: Locale = context.resources.configuration.locales.get(0) ///
    println("Current locale: ${currentLocale.language}-${currentLocale.country}") ///

    val localizedString = context.getString(com.tangem.sdk.R.string.view_delegate_scan) ///
    println("Sample locale string: $localizedString") ///

    promise.resolve(true)

  } catch (err: Error) {

    module.handleReject(promise, err.toString())

  } } }

}
