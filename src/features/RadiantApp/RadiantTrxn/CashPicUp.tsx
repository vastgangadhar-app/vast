import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, PermissionsAndroid, Linking, Button } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { FlashList } from '@shopify/flash-list';
import { colors, FontSize } from '../../../utils/styles/theme';
import { useNavigation } from '@react-navigation/native';
import RadintTransactSvg from '../../drawer/svgimgcomponents/RadintTransactSvg';
import useAxiosHook from '../../../utils/network/AxiosClient';
import useRadiantHook from '../../Financial/hook/useRadiantHook';
import { useLocationHook } from '../../../utils/hooks/useLocationHook';
import { check, openSettings, PERMISSIONS, RESULTS } from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import NoDatafound from '../../drawer/svgimgcomponents/Nodatafound';
import LinearGradient from 'react-native-linear-gradient';
import RadintPickupSvg from '../../drawer/svgimgcomponents/RadintPickupSvg';
import NextErrowSvg2 from '../../drawer/svgimgcomponents/NextErrowSvg2';

const CashPickup = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const navigation = useNavigation()
  // const { latitude, longitude, isLocationPermissionGranted, getLocation, checkLocationPermissionStatus, getLatLongValue } = useLocationHook();
  const [number, setNumber] = useState('');
  const [encryptedNumber, setEncryptedNumber] = useState('');

  const { cashPickUpTransactionList, fetchCashPickupTransactionList, isLoading } = useRadiantHook();
  const [cashPickupList, setCashPickupList] = useState([]);
  const { get, post } = useAxiosHook();
  const handleBack = () => {
    // requestCameraPermission()

    navigation.goBack();
  };


  async function requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need access to your location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      console.log('===========================')
      console.log(granted);
      console.log('===========================')
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      await fetchCashPickupTransactionList();
      //  await getLocation();
      setCashPickupList(cashPickUpTransactionList);

      console.log(cashPickUpTransactionList);

      // console.log(isLocationPermissionGranted,longitude,latitude)
    }
    fetchData();
    return;
  }, [])
  useEffect(() => {
    const fetchData2 = async () => {
      //  await getLocation();
      //  requestLocationPermission();
      //     check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      // .then((result) => {


      //   console.log(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      //   switch (result) {
      //     case RESULTS.GRANTED:
      //       console.log('Location access is granted');
      //       break;
      //     case RESULTS.DENIED:
      //       console.log('Location access denied');
      //       break;
      //     case RESULTS.BLOCKED:
      //       console.log('Location access is blocked');
      //       break;
      //     case RESULTS.UNAVAILABLE:
      //       console.log('Location services are unavailable');
      //       break;
      //   }
      // })
      // .catch((error) => {
      //   console.log('Error checking permission:', error);
      // });

      // console.log(isLocationPermissionGranted,longitude,latitude)
    }
    // fetchData2();
    return;
  }, [])

  const onSuccess = (e) => {
    console.log(e.data);
    //   setIsScan(false);

    // Linking.openURL(e.data).catch((err) => console.error('An error occurred', err));
  };
  const encryptNumber = (num) => { // Simple encryption: Reverse the number and add '0' at the start 
    let encrypted = '0' + num.split('').reverse().join(''); setEncryptedNumber(encrypted);
  };
  const decryptNumber = (num) => { // Simple decryption: Remove the first character and reverse the rest
    let decrypted = num.slice(1).split('').reverse().join(''); setEncryptedNumber(decrypted);
  };
  const renderItem = ({ item }) => (
    <LinearGradient colors={[colorConfig.primaryColor, colorConfig.secondaryColor,]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.LinearGradient}
    >
      <TouchableOpacity onPress={() => navigation.navigate('PicUpScreen', { item })}
        style={[styles.itembtn,]}>

        <View style={[styles.itemContainer,]}>
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{item.CustName}</Text>
          </View>

          <View style={styles.rightContainer}>
            <View style={styles.rightin}>
              <RadintPickupSvg size={20} color='#fff' />
              <Text style={styles.pickupText}>{item.Type}</Text>
            </View>

            {/* <Text style={styles.addressText}>{item?.PointName}</Text> */}
          </View>
        </View>
        {/* <View style={[styles.itemContainer,]}> */}

        <Text style={styles.addressText}>{item?.PointName}</Text>
        {/* </View> */}
        <View style={[styles.itemContainer, {
          borderBottomWidth: 0,
        }]}>
          <View style={styles.textContainer}>
            <Text style={styles.clientCodeText}>Number Of Transaction / Slip</Text>
            <Text style={styles.pickupCount}>{item.ClientCode?.length} +</Text>

          </View>

          <View style={styles.rightContainer}>
            <NextErrowSvg2 />
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient >
  );

  const requestCameraPermission = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take photos and videos.',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {

        setIsScan(true);
      } else {
        Dialog.show({
          type: ALERT_TYPE.WARNING,
          title: 'Permission Required',
          textBody: 'Please grant the camera permission from settings.',
          button: 'OK',
          onPressButton: () => {
            Dialog.hide();
            openSettings().catch(() => console.warn('Cannot open settings'));
          },
        });
      }
    } catch (err) {
      console.warn(err);
    }
  }, []);


  return (
    <View style={styles.main}>

      <AppBarSecond title={'Radiant Cash Pickup'} />

      {/* <QRCodeScanner
      onRead={onSuccess}
    /> */}
      {/* <Text style={styles.topappBar}>Radiant Sandesh</Text>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={handleBack}>
          <RadintTransactSvg size={35} />
        </TouchableOpacity>

        <Text style={styles.appBarText}>Transactions</Text>
      </View> */}
      <View style={styles.container}>
        {/* <View
          style={styles.buttonContainer}
        >
          <Button title="-" onPress={() => decryptNumber(number)} />

          <Text
            style={styles.resultText}
          >
            Result: {encryptedNumber}</Text>
          <Button title="+" onPress={() => encryptNumber(number)} />



        </View> */}


        {/* <View style={styles.contentContainer}>
          <Svg height="50" width="50">
            <Circle cx="25" cy="25" r="20" fill="#fff" />
          </Svg>
          <Text style={styles.cashPickupText}>{'Cash Pickup'.toUpperCase()}</Text>
        </View> */}
        {/* {isLoading ?
          <ActivityIndicator color={colorConfig.primaryColor} size="large" /> :



          <FlashList
            data={cashPickUpTransactionList}
            renderItem={renderItem}
            estimatedItemSize={70}
            keyExtractor={(item, index) => index.toString()}
          />
        } */}


        {isLoading ? (
          <ActivityIndicator color={colorConfig.primaryColor} size="large"/>
        ) : (
          <>
            {cashPickUpTransactionList ? (
               <FlashList
               data={cashPickUpTransactionList}
               renderItem={renderItem}
               estimatedItemSize={70}
               keyExtractor={(item, index) => index.toString()}
             />

            ) : (
                           <NoDatafound />
            )}
          </>
        )}



      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: hScale(10),
    paddingHorizontal: wScale(10)
  },
  topappBar: {
    paddingVertical: hScale(10),
    backgroundColor: '#1e201d',
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: wScale(20),
    fontWeight: 'bold',
  },
  appBar: {
    paddingVertical: hScale(10),
    backgroundColor: '#e45a55',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wScale(20),
  },
  appBarText: {
    color: '#fff',
    fontSize: wScale(20),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  LinearGradient: {
    color: '#fff',
    fontSize: wScale(20),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginBottom: hScale(10),
    borderRadius: 5,
    elevation: 5
  },
  contentContainer: {
    height: hScale(70),
    backgroundColor: '#e45a55',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,

  },
  cashPickupText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: hScale(4),
    marginBottom: hScale(4)
  },
  itembtn: {
    paddingHorizontal: wScale(8),
    paddingVertical: hScale(8)

  },
  textContainer: {
    flex: 1
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  rightin: {
    // flexDirection: 'row'
    alignItems: 'flex-end',
  },
  nameText: {
    color: '#fff',
    fontSize: FontSize.medium,
    fontWeight: 'bold',
  },
  clientCodeText: {
    color: 'yellow',
    fontSize: 14,
  },
  detailContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  addressText: {
    color: '#d3d3d3',
    fontSize: FontSize.small

  },
  pickupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start'
  },
  pickupText: {
    color: '#d3d3d3',
    fontSize: FontSize.tiny,

  },
  pickupCount: {
    color: 'yellow',
    fontSize: FontSize.medium,
    marginRight: 5,
    fontWeight: 'bold'
  },
  arrow: {
    color: '#fff',
    fontSize: 30,
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, },
  resultText: { fontSize: 18, color: 'red' },
});

export default CashPickup;

