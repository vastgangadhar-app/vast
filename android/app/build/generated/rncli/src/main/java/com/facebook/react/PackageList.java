
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// @react-native-masked-view/masked-view
import org.reactnative.maskedview.RNCMaskedViewPackage;
// @shopify/flash-list
import com.shopify.reactnative.flash_list.ReactNativeFlashListPackage;
// lottie-react-native
import com.airbnb.android.react.lottie.LottiePackage;
// payu-core-pg-react
import com.payusdk.PayuSdkPackage;
// payu-custom-browser-react
import com.cbwrapper.CBPackage;
// payu-upi-react
import com.payuUpi.PayuUpiPackage;
// react-native-aes-crypto
import com.tectiv3.aes.RCTAesPackage;
// react-native-biometrics
import com.rnbiometrics.ReactNativeBiometricsPackage;
// react-native-bootsplash
import com.zoontek.rnbootsplash.RNBootSplashPackage;
// react-native-camera
import org.reactnative.camera.RNCameraPackage;
// react-native-compressor
import com.reactnativecompressor.CompressorPackage;
// react-native-contacts
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
// react-native-curved-bottom-bar
import com.curvedbottombar.CurvedBottomBarPackage;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-device-number
import com.reactlibrary.devicenumber.DeviceNumberPackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// react-native-get-location
import com.github.douglasjunior.reactNativeGetLocation.ReactNativeGetLocationPackage;
// react-native-get-random-values
import org.linusu.RNGetRandomValuesPackage;
// react-native-hash
import com.drazail.RNHash.RnHashPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-instantpay-mpos
import com.instantpaympos.InstantpayMposPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-localize
import com.zoontek.rnlocalize.RNLocalizePackage;
// react-native-otp-verify
import com.faizal.OtpVerify.OtpVerifyPackage;
// react-native-pager-view
import com.reactnativepagerview.PagerViewPackage;
// react-native-permissions
import com.zoontek.rnpermissions.RNPermissionsPackage;
// react-native-rdservice-fingerprintscanner
import com.rdservicefingerprintscanner.RdserviceFingerprintscannerPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-share
import cl.json.RNSharePackage;
// react-native-sim-cards-manager
import com.reactnativesimcardsmanager.SimCardsManagerPackage;
// react-native-splash-screen
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-video
import com.brentvatne.react.ReactVideoPackage;
// react-native-view-shot
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new AsyncStoragePackage(),
      new NetInfoPackage(),
      new RNCMaskedViewPackage(),
      new ReactNativeFlashListPackage(),
      new LottiePackage(),
      new PayuSdkPackage(),
      new CBPackage(),
      new PayuUpiPackage(),
      new RCTAesPackage(),
      new ReactNativeBiometricsPackage(),
      new RNBootSplashPackage(),
      new RNCameraPackage(),
      new CompressorPackage(),
      new ReactNativeContacts(),
      new CurvedBottomBarPackage(),
      new RNDeviceInfo(),
      new DeviceNumberPackage(),
      new RNFSPackage(),
      new RNGestureHandlerPackage(),
      new ReactNativeGetLocationPackage(),
      new RNGetRandomValuesPackage(),
      new RnHashPackage(),
      new ImagePickerPackage(),
      new InstantpayMposPackage(),
      new LinearGradientPackage(),
      new RNLocalizePackage(),
      new OtpVerifyPackage(),
      new PagerViewPackage(),
      new RNPermissionsPackage(),
      new RdserviceFingerprintscannerPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new RNSharePackage(),
      new SimCardsManagerPackage(),
      new SplashScreenReactPackage(),
      new SvgPackage(),
      new VectorIconsPackage(),
      new ReactVideoPackage(),
      new RNViewShotPackage(),
      new RNCWebViewPackage()
    ));
  }
}
