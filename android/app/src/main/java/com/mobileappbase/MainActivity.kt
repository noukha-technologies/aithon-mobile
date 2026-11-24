package com.mobileappbase

import android.graphics.Color
import android.os.Bundle
import androidx.core.view.WindowCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
    // Shows the green splash, then switches to AppTheme (white navigation bar).
    RNBootSplash.init(this, R.style.BootTheme)
    super.onCreate(savedInstanceState)
    // RN 0.87+ ignores StatusBar backgroundColor/translucent on Android. Set the white bar
    // with dark icons that every screen asks for.
    @Suppress("DEPRECATION")
    window.statusBarColor = Color.WHITE
    WindowCompat.getInsetsController(window, window.decorView).isAppearanceLightStatusBars = true
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "MobileAppBase"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
