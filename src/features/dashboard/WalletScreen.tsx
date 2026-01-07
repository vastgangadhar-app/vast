
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TextInput, Button, TouchableOpacity, ScrollView, Alert, ToastAndroid } from 'react-native';
import { APP_URLS } from '../../utils/network/urls';
import useAxiosHook from '../../utils/network/AxiosClient';

import FlotingInput from '../drawer/securityPages/FlotingInput';
import { colors, FontFamily, FontSize } from '../../utils/styles/theme';
import { hScale, wScale } from '../../utils/styles/dimensions';
import DynamicButton from '../drawer/button/DynamicButton';
import { useNavigation } from '@react-navigation/native';
import { decryptData } from '../../utils/encryptionUtils';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import WalletSvg from '../drawer/svgimgcomponents/Walletsvg';
import Walletansvg from '../drawer/svgimgcomponents/Walletansvg';
import OnelineDropdownSvg from '../drawer/svgimgcomponents/simpledropdown';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { fonts } from '@rneui/base';
import {
  getDeviceInfo,
  captureFinger,
} from 'react-native-rdservice-fingerprintscanner';
import { FlashList } from '@shopify/flash-list';
const WalletScreen = () => {

  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`
  const [balanceInfo, setBalanceInfo] = useState();
  const [amount, setAmount] = useState('');
  const { get } = useAxiosHook();
  const [charges, setCharges] = useState([]);
  const [isload, setisload] = useState(false);
  const [upich, setupichs] = useState(null);
  const [texterror, setTexterror] = useState(false)
  const [height, setHeight] = useState(false)
  const navigation = useNavigation<any>();
  const [decryptedWalletCharges, setDecryptedWalletCharges] = useState(null);


  const handlePress = () => {
    setHeight(!height)
  }
  const getData = useCallback(async () => {
    try {

      const userInfo = await get({ url: APP_URLS.getUserInfo });
      const response = await get({ url: APP_URLS.balanceInfo });
      const wallet = await get({ url: 'Common/api/data/Wallet_ALL_Charges_Show' });
      const walletCharges = JSON.parse(decryptData(wallet.kkkk, wallet.vvvv, wallet.WalletCharges));

      console.log(JSON.parse(decryptData(wallet.kkkk, wallet.vvvv, wallet.WalletCharges)))
      setDecryptedWalletCharges(walletCharges);


      const res = await get({ url: APP_URLS.getProfile })
      if (res.data) {
        console.log(JSON.parse(decryptData(res.value1, res.value2, res.data)))
      }

      setBalanceInfo(response.data[0]);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [get]);
  const onpressbtn = () => {
    if (amount.length === 0) {
      ToastAndroid.show('Please enter an amount', ToastAndroid.SHORT); // Show a toast message
    } else {
      navigation.navigate("AddMoneyOptions", { amount, jsonData: charges });
      setAmount('')
    }

  }




  const getCharges = useCallback(async (amount) => {
    try {
      const userInfo = await get({ url: `${APP_URLS.addmoneyChg}${amount}` });
      setCharges(Object.entries(userInfo.WalletChargesenc));
      console.log(userInfo);
      console.log(userInfo.WalletChargesenc, '**/*/*/');
      setisload(false);
      ;
    } catch (error) {
      console.error('Error fetching charges:', error);
    }
  }, [get, amount]);

  const upiCharges = useCallback(async () => {
    try {
      const userInfo = await get({ url: `${APP_URLS.upicharges}` });
      setupichs(userInfo);
      console.log('upichargesssss', userInfo);
    } catch (error) {
      console.error('Error fetching charges--:', error);
    }
  }, [get,]);
  useEffect(() => {
    setCharges([])
    upiCharges();
    getData();
  }, [
    getData,
    upiCharges]);
  const upiCharges2 = useCallback(async () => {
    try {
      const d = JSON.stringify(getDeviceInfo());

      Alert.alert('Device Info', d);

      console.log(d);
    } catch (error) {
      console.error('Error fetching device info:', error);

      // त्रुटि संदेश को अलर्ट में दिखाएं
      Alert.alert('Error', 'Failed to fetch device information.');
    }
  }, []);


  const chargeData = decryptedWalletCharges ? [
    { title: 'Self UPI', value: `${decryptedWalletCharges.data.UPI}%` },
    { title: 'UPI Charge in ₹', value: `₹ ${decryptedWalletCharges.data.UPI}` },
    { title: 'Credit Card', value: `${decryptedWalletCharges.data.creditcard}%` },
    { title: 'Debit Up to 2000', value: `${decryptedWalletCharges.data.debitupto2000}%` },
    { title: 'Debit Above 2000', value: `${decryptedWalletCharges.data.debitabove2000}%` },
    { title: 'Rupay Debit Card', value: 'Free' },
    { title: 'Net Banking (HDFC/ICIC)', value: `${decryptedWalletCharges.data.netbanking}%` },
    { title: 'Net Banking (AXIS/SBI/KOTAK)', value: `${decryptedWalletCharges.data.axis}%` },
    { title: 'Net Banking (Others Bank)', value: `${decryptedWalletCharges.data.others}%` },
    { title: 'Wallet', value: `${decryptedWalletCharges.data.wallet}%` },
  ] : [];

  return (
    <View style={styles.main}>

      <AppBarSecond title={''} />
      <View style={[styles.headerview, { backgroundColor: color1, }]}>
        <View style={styles.headertop}>
          <View style={styles.imgview}>
            <WalletSvg size={wScale(30)} />
          </View>
          <View style={{ paddingTop: 8, flex: 1 }}>
            <View style={styles.headertop}>
              <Text style={styles.balanceValue}>Wallet Blance</Text>
              <TouchableOpacity style={[styles.dropbtn, height ? { transform: [{ rotate: '180deg' }] } : null]}
                onPress={() => handlePress()}>
                <OnelineDropdownSvg />
              </TouchableOpacity>
              <Text style={styles.total}>₹{balanceInfo?.posremain + balanceInfo?.remainbal}</Text>

            </View>
            {height ? <View>
              <View style={styles.balanceCard}>
                <Text style={styles.balanceTitle}>Poss Blance</Text>
                <Text style={styles.balanceValue}>₹{balanceInfo?.posremain}</Text>
              </View>
              <View style={styles.balanceCard}>
                <Text style={styles.balanceTitle}>Main Wallet</Text>
                <Text style={styles.balanceValue}>₹{balanceInfo?.remainbal}</Text>
              </View>
            </View> : null}

          </View>
        </View>
      </View>

      <View style={styles.container}>
        <View>
          <FlotingInput
            keyboardType="numeric"
            maxLength={6}
            label="Enter Amount"
            value={amount}
            onChangeTextCallback={(text) => {
              setAmount(String(text));
              setTexterror(true)

              if (text !== '') {
                getCharges(text);
              }
              if (amount.length === 0) {
                setTexterror(true)
              } else {
                setTexterror(false)
              }
            }}
            autoFocus={texterror}
          />

          {texterror ? <Text style={styles.errortext}>
            Please enter an amount  Between ₹ 1 & ₹ 100000
          </Text> : null}
          <View>
            <DynamicButton styleoveride={{ marginTop: hScale(8) }}
              onPress={() => {
                upiCharges();
                onpressbtn();


                // if (amount.length === 0) {
                //   'Please Enter Amount'
                // } else { onpressbtn() }
              }}
              title={'Add Money'}
            />
          </View>
        </View>
        <View >
          <Text style={styles.chargesTitle}>Charges Information</Text>
        </View>
        <ScrollView>
          {isload ? <ActivityIndicator size={'large'} /> : <View style={styles.chargesContainer}>


            {/* <View>
              <FlatList
                data={charges}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={[styles.chargeItem, { backgroundColor: color1 }]}>
                    <View>
                      <Text style={styles.chargevalue}>{item[0]}</Text>
                      <Text style={styles.chargeText}>Net Received</Text>
                      <Text style={styles.chargevalue}>{item[1].netrecived}</Text>
                    </View>
                    <View style={styles.rightcontainer}>

                      <Text style={styles.chargeText}>Total:  </Text>
                      <Text style={styles.chargevalue}>{item[1].total}</Text>
                    </View>
                  </View>
                )}
              />
            </View> */}


            <View style={[{ backgroundColor: color1 }]}>
              {upich && (
                <View style={[styles.chargeItemrow,]}>
                  <Text style={styles.chargeTitle}>Upi Charge in (%)</Text>
                  <Text style={styles.chargeValue}>% {upich["Charge %"]}</Text>
                </View>
              )}
              {chargeData.length > 0 && (
                <FlashList
                  data={chargeData}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (

                    <View style={[styles.chargeItemrow,]}>
                      <Text style={styles.chargeTitle}>{item.title}</Text>
                      <Text style={styles.chargeValue}>{item.value}</Text>
                    </View>
                  )}
                  estimatedItemSize={50}
                />
              )}
            </View>

          </View>
          }
        </ScrollView>
      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.white
  },
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: wScale(10),
    paddingTop: hScale(10),
    flex: 1
  },
  balanceCard: {
    alignItems: 'center',
    marginTop: hScale(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceTitle: {
    fontSize: wScale(16),
    marginBottom: hScale(5),
    color: colors.black75,
  },
  balanceValue: {
    fontSize: wScale(20),
    fontWeight: 'bold',
    color: colors.black,
  },
  total: {
    fontSize: wScale(22),
    fontWeight: 'bold',
    color: colors.black,
    flex: 1,
    textAlign: 'right'
  },
  chargesContainer: {
    borderRadius: 5,
  },
  chargesTitle: {
    fontSize: FontSize.large,
    fontWeight: 'bold',
    color: colors.black_primary_blur,
    paddingTop: hScale(10),
    paddingBottom: wScale(10),

  },
  chargeItem: {
    marginBottom: hScale(15),
    paddingHorizontal: wScale(10),
    borderRadius: 5,
    paddingVertical: hScale(5),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  chargeText: {
    fontSize: FontSize.xSmall,
    color: colors.black75,
  },
  chargevalue: {
    fontSize: FontSize.xSmall,
    color: colors.black,
    fontWeight: 'bold',
    paddingBottom: hScale(8),
    textTransform: 'uppercase'
  },
  errortext: {
    color: colors.red_deactivated,
    fontSize: FontSize.regular,
    marginTop: hScale(-10),
    marginBottom: hScale(15),
    fontFamily: FontFamily.italic
  },
  headerview: {
    paddingTop: hScale(20),
    marginBottom: hScale(15),
    paddingHorizontal: wScale(15),
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    paddingBottom: hScale(20)
  },
  headertop: {
    flexDirection: 'row',
  },
  imgview: {
    borderWidth: wScale(1),
    borderRadius: 30,
    marginRight: wScale(15),
    borderColor: colors.black75,
    height: wScale(45),
    width: wScale(45),
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropbtn: {
    marginLeft: wScale(5),
    paddingHorizontal: (10),
  },
  rightcontainer: {
    flexDirection: 'row',
  }

  ,
  chargeItemrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hScale(5),
    borderBottomWidth: 1,
    borderBottomColor: colors.black75,
    paddingHorizontal: wScale(10),
    borderStyle: 'dotted',
    marginHorizontal: wScale(8)
  },

  chargeTitle: {
    fontSize: FontSize.regular,
    color: colors.black,
  },
  chargeValue: {
    fontSize: FontSize.regular,
    color: colors.black,
    fontWeight: 'bold',
  },
});

export default WalletScreen;


