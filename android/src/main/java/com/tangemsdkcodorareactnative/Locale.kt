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

    val locale = Locale(languageCode)
    Locale.setDefault(locale)
    val config = Configuration(context.resources.configuration)
    config.setLocale(locale)
    context.resources.updateConfiguration(config, context.resources.displayMetrics)

  } catch (err: Error) {

    module.handleReject(promise, err.toString())

  } }

}
