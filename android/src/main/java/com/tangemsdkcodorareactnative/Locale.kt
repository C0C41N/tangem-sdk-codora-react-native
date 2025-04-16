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

      println("languageCode $languageCode")
      AppCompatDelegate.setApplicationLocales(LocaleListCompat.create(Locale.forLanguageTag(languageCode)))
      promise.resolve(true)

    } catch (err: Error) {

      module.handleReject(promise, err.toString())

    } }

  }
}
