import { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import { ToastAndroid } from "react-native";
import { APP_URLS } from "./network/urls";

export const shareSlipImage = async (viewRef) => {
  try {
    const uri = await captureRef(viewRef, {
      format: "jpg",
      quality: 0.8,
    });

    await Share.open({
      message: `Hi, I am sharing the transaction details using ${APP_URLS.AppName} App.`,
      url: uri,
    });
  } catch (error) {
    ToastAndroid.show(
      "Transaction details not shared",
      ToastAndroid.SHORT
    );
  }
};
