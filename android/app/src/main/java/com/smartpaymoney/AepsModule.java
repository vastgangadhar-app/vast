package com.himanshusrecharge;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;
import android.util.Log;
import androidx.appcompat.app.AlertDialog;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import in.credopay.payment.sdk.CredopayPaymentConstants;
import in.credopay.payment.sdk.PaymentActivity;
import in.credopay.payment.sdk.Utils;
import it.services.pspwdmt.ui.DmtHostActivity;

import androidx.core.content.ContextCompat;




public class AepsModule extends ReactContextBaseJavaModule   {
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener();
   private int paymentStatusCode;
    String amount,password,loginId,uniqueid;
    private ReactApplicationContext context; 
    Promise appPromise;
    private static ReactApplicationContext rnContext;
    boolean isPurchase = false;
    boolean ismicrostm = false;
    Boolean isNewLogin = false;
    boolean chhkbalance = false;
    Boolean ChangePassword;

    private String Agent_email;
    private Activity activity = getReactApplicationContext().getCurrentActivity();
    private ActivityResultLauncher<Intent> dmtPwLauncher;
   AepsModule(ReactApplicationContext context) {
       super(context);
       this.context = context;
   
       context.addActivityEventListener(new ActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
           
            if (requestCode == 1111) { 
                if (resultCode == Activity.RESULT_OK) {
                   
                    String response = data.getStringExtra("response");
                   
                    appPromise.resolve(response);
                } else if (resultCode == Activity.RESULT_CANCELED) {
                    appPromise.resolve("response");
                   
                    new AlertDialog.Builder(context)
                            .setMessage("Transaction Aborted")
                            .setPositiveButton("OK", null)
                            .show();
                }
            }
        }

        @Override
        public void onNewIntent(Intent intent) {
           
        }
    });
   }
@Override
public String getName() {
   return "AepsModule";
}

@ReactMethod
public void initCredo(String merchantCode, String pApi, String partnerId, Promise promise) {

    appPromise = promise;
    Intent intent = new Intent(getReactApplicationContext().getCurrentActivity(), DmtHostActivity.class);
                intent.putExtra("partnerId", partnerId);
                intent.putExtra("partnerApiKey", pApi);
                intent.putExtra("merchantCode", merchantCode);
             
              getReactApplicationContext().getCurrentActivity().startActivityForResult(intent, 111);
             
}

}