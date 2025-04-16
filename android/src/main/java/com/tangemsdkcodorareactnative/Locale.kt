package com.tangemsdkcodorareactnative
import android.content.Context
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import com.facebook.react.bridge.Promise
import java.util.Locale

class Locale (private val module: TangemModule) {

  fun setAppLanguage(
    context: Context,
    languageCode: String,
    promise: Promise
  ) {

    val mainHandler = Handler(Looper.getMainLooper())

    mainHandler.post { try {

      AppCompatDelegate.setApplicationLocales(LocaleListCompat.create(Locale.forLanguageTag(languageCode)))

      val currentLocale: Locale = context.resources.configuration.locales.get(0) ///
      println("Current locale: ${currentLocale.language}-${currentLocale.country}") ///

      val localizedString = context.getString(com.tangem.sdk.R.string.view_delegate_scan) ///
      println("Sample locale string: $localizedString") ///

      promise.resolve(true)

    } catch (err: Error) {

      module.handleReject(promise, err.toString())

    } }

  }
}
