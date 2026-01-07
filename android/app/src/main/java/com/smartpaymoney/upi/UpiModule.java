package com.himanshusrecharge.upi;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class UpiModule extends ReactContextBaseJavaModule {

  private static final int UPI_REQUEST = 2024;
  private Promise upiPromise;

  public UpiModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext.addActivityEventListener(activityEventListener);
  }

  @NonNull
  @Override
  public String getName() {
    return "UpiNative";
  }

  @ReactMethod
  public void pay(String upiUrl, Promise promise) {
    Activity activity = getCurrentActivity();
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity not attached");
      return;
    }

    Log.d("UPI_NATIVE", "UPI URL RECEIVED: " + upiUrl);

    upiPromise = promise;

    try {
      Intent intent = new Intent(Intent.ACTION_VIEW);
      intent.setData(Uri.parse(upiUrl));
      activity.startActivityForResult(intent, UPI_REQUEST);
    } catch (Exception e) {
      Log.e("UPI_NATIVE", "ERROR OPENING UPI", e);
      promise.reject("UPI_ERROR", e.getMessage());
    }
  }

  private final ActivityEventListener activityEventListener =
      new BaseActivityEventListener() {
        @Override
        public void onActivityResult(
            Activity activity,
            int requestCode,
            int resultCode,
            Intent data
        ) {
          if (requestCode != UPI_REQUEST || upiPromise == null) return;

          if (data == null) {
            upiPromise.resolve("CANCELLED");
            upiPromise = null;
            return;
          }

          String response = data.getStringExtra("response");
          Log.d("UPI_NATIVE", "UPI RESPONSE: " + response);

          upiPromise.resolve(response != null ? response : "NO_RESPONSE");
          upiPromise = null;
        }
      };
}
