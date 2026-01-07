import React, { useEffect, useCallback, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ToastAndroid } from "react-native";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import AppBarSecond from "../../drawer/headerAppbar/AppBarSecond";
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from 'react-native-share';
import { APP_URLS } from "../../../utils/network/urls";

const AepsResponse = ({ route }) => {
  const { Date, openbal, Type, Amount,Name, closebal,mobileNumber,bankName, TransactionStatus, RequestTransactionTime, BankRrn, TransactionAmount, BalanceAmount, Aadhar } = route.params.ministate;
  const { mode } = route.params;

  const capRef = useRef();

  // Share function
  const onShare = useCallback(async () => {
    try {
      const uri = await captureRef(capRef, {
        format: "jpg",
        quality: 0.7,
      });
      await Share.open({
        message: `Hi, I am sharing the transaction details using ${APP_URLS.AppName} app.`,
        url: uri,
      });
    } catch (e) {
      ToastAndroid.show("Transaction details not shared", ToastAndroid.SHORT);
    }
  }, []);

  useEffect(() => {
    console.log(route.params);
  }, []);

  return (
    <View style={styles.main}>
      <AppBarSecond title={mode} />
      
      <ViewShot  style={{padding:5}} ref={capRef} options={{ fileName: "TransactionReciept", format: "jpg", quality: 0.9 }}>
        <View style={styles.container}>
          {mode === 'MINI' && (
            <View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.listItemText}>{Date}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Opening Balance</Text>
                <Text style={styles.listItemText}>{openbal}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Amount</Text>
                <Text style={styles.listItemText}>{Amount}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Closing Balance</Text>
                <Text style={styles.listItemText}>{closebal}</Text>
              </View>
            </View>
          )}

          {mode === 'AEPS' && (
            <View>
 <View style={styles.itemContainer}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.listItemText}>{Name}</Text>
              </View>
                <View style={styles.itemContainer}>
                <Text style={styles.label}>Aadhar Number</Text>
                <Text style={styles.listItemText}>{Aadhar}</Text>
              </View> 
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Mobile Number</Text>
                <Text style={styles.listItemText}>{mobileNumber}</Text>
              </View> 
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Bank Name</Text>
                <Text style={styles.listItemText}>{bankName}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Request Transaction Time</Text>
                <Text style={styles.listItemText}>{RequestTransactionTime}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>TransactionStatus</Text>
                <Text style={styles.listItemText}>{TransactionStatus}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Bank Rrn</Text>
                <Text style={styles.listItemText}>{BankRrn}</Text>
              </View>
             
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Transaction Amount</Text>
                <Text style={styles.listItemText}>{TransactionAmount}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Balance Amount</Text>
                <Text style={styles.listItemText}>{BalanceAmount}</Text>
              </View>
            </View>
          )}

          {mode === 'AP' && (
            <View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.listItemText}>{Name}</Text>
              </View>
                <View style={styles.itemContainer}>
                <Text style={styles.label}>Aadhar Number</Text>
                <Text style={styles.listItemText}>{Aadhar}</Text>
              </View> 
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Mobile Number</Text>
                <Text style={styles.listItemText}>{mobileNumber}</Text>
              </View> 
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Bank Name</Text>
                <Text style={styles.listItemText}>{bankName}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Request Transaction Time</Text>
                <Text style={styles.listItemText}>{RequestTransactionTime}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Transaction Status</Text>
                <Text style={styles.listItemText}>{TransactionStatus}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Bank Rrn</Text>
                <Text style={styles.listItemText}>{BankRrn}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Balance Amount</Text>
                <Text style={styles.listItemText}>{BalanceAmount}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Transaction Amount</Text>
                <Text style={styles.listItemText}>{TransactionAmount}</Text>
              </View>
            </View>
          )}

          {mode === 'BAL CHECK' && (
            <View>
                <View style={styles.itemContainer}>
                <Text style={styles.label}>Name</Text>
                <Text style={styles.listItemText}>{Name}</Text>
              </View>
                <View style={styles.itemContainer}>
                <Text style={styles.label}>Aadhar Number</Text>
                <Text style={styles.listItemText}>{Aadhar}</Text>
              </View> 
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Mobile Number</Text>
                <Text style={styles.listItemText}>{mobileNumber}</Text>
              </View> 
                  <View style={styles.itemContainer}>
                <Text style={styles.label}>Bank Name</Text>
                <Text style={styles.listItemText}>{bankName}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Request Transaction Time</Text>
                <Text style={styles.listItemText}>{RequestTransactionTime}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Transaction Status</Text>
                <Text style={styles.listItemText}>{TransactionStatus}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Bank Rrn</Text>
                <Text style={styles.listItemText}>{BankRrn}</Text>
              </View>
              <View style={styles.itemContainer}>
                <Text style={styles.label}>Balance Amount</Text>
                <Text style={styles.listItemText}>{BalanceAmount}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={onShare}>
            <Text style={styles.buttonText}>Share Transaction Details</Text>
          </TouchableOpacity>
        </View>
      </ViewShot>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#ffffff',

    flex: 1,
  },
  container: {
    paddingHorizontal: wScale(15),
    paddingVertical: hScale(20),
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    marginBottom: hScale(1),
    padding: hScale(5),
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: hScale(12),
    borderRadius: 6,
    marginTop: hScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AepsResponse;
