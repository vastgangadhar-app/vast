import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, ToastAndroid, Alert, ActivityIndicator, PermissionsAndroid } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { hScale, SCREEN_HEIGHT, wScale } from '../../../utils/styles/dimensions';
import { FlashList } from '@shopify/flash-list';
import { FontSize } from '../../../utils/styles/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import DynamicButton from '../../drawer/button/DynamicButton';
import { BottomSheet } from '@rneui/base';
import VerifyMobileNumber from '../../../components/VerifyMobileNumber';
import OTPModal from '../../../components/OTPModal';
import toNumber from 'lodash/toNumber';
import CustomCalendar from '../../../components/Calender';
import moment from 'moment';
import useRadiantHook from '../../Financial/hook/useRadiantHook';
import { useLocationHook } from '../../../utils/hooks/useLocationHook';
import ScanScreen from '../ScanScreen';
import CameraScreen from '../ScanScreen';
import { openSettings } from 'react-native-permissions';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import QRCodeScanner from 'react-native-qrcode-scanner';
import QrcodAddmoneysvg from '../../drawer/svgimgcomponents/QrcodAddmoneysvg';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import RadintPickupSvg from '../../drawer/svgimgcomponents/RadintPickupSvg';
import LinearGradient from 'react-native-linear-gradient';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import Calendarsvg from '../../drawer/svgimgcomponents/Calendarsvg';
import OnelineDropdownSvg from '../../drawer/svgimgcomponents/simpledropdown';

const PicUpScreen = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}100`;
  const rout = useRoute();
  const { item } = rout.params
  const { latitude, longitude, isLocationPermissionGranted, getLocation, checkLocationPermissionStatus, getLatLongValue } = useLocationHook();

  const [amount, setAmount] = useState('');
  const [sealingTagNo, setSealingTagNo] = useState('');
  const [customerGeneratedNo, setCustomerGeneratedNo] = useState('');
  const [hciSlipNo, setHciSlipNo] = useState('');
  const [hsbcDepositSlipNo, setHsbcDepositSlipNo] = useState('');
  const [airtenGampangila, setAirtenGampangila] = useState('');
  const [transactionCount, setTransactionCount] = useState('');
  const [additionalRemarks, setAdditionalRemarks] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const [remark, setRemark] = useState('');
  const [received, setReceived] = useState('');
  const [remarkVisible, setRemarkVisible] = useState(false);
  const [childRemarksVisible, setChildRemarksVisible] = useState(false);
  const [clientCodeIndex, setClientCodeIndex] = useState(0);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [mobilemodel, setMobilemodel] = useState(false);
  const [clientCodeModalVisible, setClientCodeModal] = useState(false);
  const [slipDate, setSlipDate] = useState('');
  const [TransDate, setTransDate] = useState(item?.TransDate);
  const [clientCode, setClientCode] = useState(item?.ClientCode[0]);
  const [cashPickupData, setCashPickupData] = useState([]);
  const [clientOtp, setClientOtp] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [showCalender, setShowCalender] = useState(false);
  const [isScan, setIsScan] = useState(false);

  const { remarkList, childRemarkList,
    fetchMasterRemarkList, fetchChildRemarkList,
    setRadiantOtp, setRadiantDynamicOtp,
    otpResponse, dynamicOtpResponse, submitCashPickupResponse,
    submitCashPickupTransaction, isLoading } = useRadiantHook();
  const currencyData = [
    // { key: '2000', val: '0' }, { key: '1000', val: '0' },
    { key: '500', val: '0' }, { key: '200', val: '0' }, { key: '100', val: '0' },
    { key: '50', val: '0' }, { key: '20', val: '0' }, { key: '10', val: '0' },
    { key: '5', val: '0' }, { key: 'Coins', val: '0' }]
  const [denominationData, setDenominationData] = useState(currencyData)

  const renderAmountItem = useCallback(({ item }) => (
    <View >
      <FlotingInput
        label={`${item.key} Rupee`}
        keyboardType="numeric"
        value={
          item.val === '0' ? '' : item.val}
        onChangeTextCallback={(text) => {
          setDenominationData(denominationData.map((denom) => denom.key === item.key ?
            { ...denom, val: text } : denom))
        }} />
    </View>
  ), [denominationData])

  useEffect(() => {

    const fetchData = async () => {
      await fetchMasterRemarkList();
    }
    fetchData();
  }, [])
  useEffect(() => {
    const fetchData2 = async () => {
      await getLocation();
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

      console.log(isLocationPermissionGranted, longitude, latitude)
    }
    fetchData2();
    return;
  }, [isLocationPermissionGranted, longitude, latitude, getLocation()])
  useEffect(() => {
    if (otpResponse) {
      console.log('----------------------------setRadiantOtp--------------');
      console.log(otpResponse);
      setClientOtp(otpResponse?.Content?.ADDINFO?.otp_pin || '');
      console.log('----------------------------setRadiantOtp--------------');
      closeMobileModal();
    }
  }, [otpResponse]);
  useEffect(() => {
    if (dynamicOtpResponse) {
      console.log('----------------------------setRadiantOtp--------------');
      console.log(dynamicOtpResponse);
      setClientOtp(dynamicOtpResponse?.Content?.ADDINFO?.otp_pin || '');
      console.log('----------------------------setRadiantOtp--------------');
      closeMobileModal();
    }
  }, [dynamicOtpResponse]);
  const submitCashPickupRequest = useCallback(async () => {
    if (!latitude || !longitude) {
      return null;
    }
    const transaction = {
      "requestType": "cashPickupTransSubmit",
      "type": "Pickup",
      "ceId": "RCE002",
      "shopId": item.ShopId,
      "transId": item.TransId,
      "noRecs": toNumber(transactionCount),
      "transParam": cashPickupData,
      "depType": item.DepTypess,
      "qrTransId": "",
      "latitude": latitude,
      "longitude": longitude
    };
    console.log(transaction)
    await submitCashPickupTransaction(transaction);
    // if(submitCashPickupResponse?.Content?.ADDINFO?.status === 'success'){
    //   Alert.alert("Success", submitCashPickupResponse?.Content?.ADDINFO?.message);
    // }
    // else{
    //   Alert.alert("Error", submitCashPickupResponse?.Content?.ADDINFO?.message || 'Something went wrong.');
    // }
    setCashPickupData([]);
  }, [
    cashPickupData,
    item,
    transactionCount,
    submitCashPickupTransaction,
    submitCashPickupResponse,
    toNumber
  ]);
  const handleOkPress = () => {
    if (transactionCount < item.ClientCode.length) {
      ToastAndroid.showWithGravity(
        `Please enter the number of Transaction as ${item?.ClientCode.length} or above`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
      return;
    }

    setModalVisible(false);
  };

  const handlePickupData = useCallback(() => {
    if (!amount) {
      Alert.alert('Pickup Amount is required');
      return;
    }
    if (remark === 'Select') {
      Alert.alert('Please select Remark');
      return;
    }
    let total = 0;
    denominationData.forEach((item) => {
      if (isNaN(Number(item.key))) {
        total += Number(item.val)
      }
      else {
        total += Number(item.key) * Number(item.val)
      }

    })

    if (total !== Number(amount)) {
      Alert.alert('Please check your denomination total and submit again');
      return;
    }


    const data = {
      "pickup_amount": parseFloat(amount),
      "rec_no": hsbcDepositSlipNo,
      "pis_hcl_no": customerGeneratedNo,
      "hcl_no": hciSlipNo,
      "gen_slip": sealingTagNo,
      "client_code": clientCode,
      "master_remarks": remark,
      "child_remarks": received,
      "remarks": additionalRemarks,
      "slip_date": slipDate,
      "pay_slip_date": TransDate,
      "2000s": toNumber(denominationData[0].val),
      "1000s": toNumber(denominationData[1].val),
      "500s": toNumber(denominationData[2].val),
      "200s": toNumber(denominationData[3].val),
      "100s": toNumber(denominationData[4].val),
      "50s": toNumber(denominationData[5].val),
      "20s": toNumber(denominationData[6].val),
      "10s": toNumber(denominationData[7].val),
      "5s": toNumber(denominationData[8].val),
      "coins": toNumber(denominationData[9].val),
    };

    console.log(data)
    const transData = [...cashPickupData, data]
    setCashPickupData(transData);

    if (toNumber(transactionCount) > 1 && transData.length < toNumber(transactionCount)) {
      setAmount('');
      setSealingTagNo('');
      setCustomerGeneratedNo('');
      setHciSlipNo('');
      setHsbcDepositSlipNo('');
      setAirtenGampangila('');
      setAdditionalRemarks('');
      setRemark('Select');
      setReceived('Select');
      setSlipDate('');
      setDenominationData([...currencyData]);
      setClientCode(clientCodeIndex + 1 < item.ClientCode.length ? item.ClientCode[clientCodeIndex + 1] : item.ClientCode[0]);
      setClientCodeIndex(clientCodeIndex + 1);
      return;
    }

    setDetailsModalVisible(true);
  }, [
    amount,
    hsbcDepositSlipNo,
    customerGeneratedNo,
    hciSlipNo,
    sealingTagNo,
    clientCode,
    remark,
    received,
    additionalRemarks,
    slipDate,
    denominationData,
    transactionCount,
    cashPickupData,
    setCashPickupData,
    setAmount,
    setSealingTagNo,
    setCustomerGeneratedNo,
    setHciSlipNo,
    setHsbcDepositSlipNo,
    setAirtenGampangila,
    setAdditionalRemarks,
    setRemark,
    setReceived,
    setSlipDate,
    setDenominationData,
    setDetailsModalVisible,
  ]);


  const handleSubmit = async () => {

    const data = {
      "pickup_amount": parseFloat(amount),
      "rec_no": hsbcDepositSlipNo,
      "pis_hcl_no": customerGeneratedNo,
      "hcl_no": hciSlipNo,
      "gen_slip": sealingTagNo,
      "client_code": clientCode,
      "master_remarks": remark,
      "child_remarks": received,
      "remarks": additionalRemarks,
      "slip_date": slipDate,
      "pay_slip_date": TransDate,
      "2000s": toNumber(denominationData[0].val),
      "1000s": toNumber(denominationData[1].val),
      "500s": toNumber(denominationData[2].val),
      "200s": toNumber(denominationData[3].val),
      "100s": toNumber(denominationData[4].val),
      "50s": toNumber(denominationData[5].val),
      "20s": toNumber(denominationData[6].val),
      "10s": toNumber(denominationData[7].val),
      "5s": toNumber(denominationData[8].val),
      "coins": toNumber(denominationData[9].val),
    };
    const transaction = {
      "requestType": "cashPickupTransSubmit",
      "type": "Pickup",
      "ceId": "RCE002",
      "shopId": item.ShopId,
      "transId": item.TransId,
      "noRecs": toNumber(transactionCount),
      "transParam": cashPickupData,
      "depType": item.DepTypess,
      "qrTransId": "",
      "latitude": latitude,
      "longitude": longitude
    };
    console.log(transaction)

    if (["CurrentTransaction", "Daily", "Weekly-Sun"].includes(item.OtpDay)) {
      console.log(item.TransId, '', item.ShopId, amount, item.OtpDay, '')
      await setRadiantOtp(item.TransId, '', item.ShopId, amount, item.OtpDay, '');
      setDetailsModalVisible(false);

      if (otpResponse?.Content?.ADDINFO?.status === 'success') {
        setDetailsModalVisible(false);

        setClientOtp(otpResponse?.Content?.ADDINFO?.otp_pin || '');
        setOtpModalVisible(true);
        return;
      }
      else {
        setOtpModalVisible(false);

        ToastAndroid.showWithGravity(
          'Something went wrong',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }
      setDetailsModalVisible(false);
      setDetailsModalVisible(false);

      return;
    }
    setDetailsModalVisible(false);
    setMobilemodel(true)
    // if(item.OtpDay === ""){
    //   setMobilemodel(true)
    // }
    //Verify CPIN
  };
  const closeMobileModal = () => {
    setMobilemodel(false);
    setOtpModalVisible(true);
  };
  const handleCancelPress = () => {
    setDetailsModalVisible(false); // Close the details modal on cancel
  };

  const handleDateChange = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const today = moment().format('YYYY-MM-DD');

    if (formattedDate <= today) {
      setSlipDate(formattedDate);
    } else {
      Alert.alert("Invalid Date", "You cannot select a future date.");
    }
    setShowCalender(false);
  };


  const onSuccess = (e) => {
    console.log(e.data);
    setIsScan(false);
    const data = JSON.parse(e.data);

    console.log(data);
    console.log(data.amount, data.pisdate, data.custcode);
    setAmount(data.amount);
    setSlipDate(data.pisdate);
    setCustomerGeneratedNo(data.pisdepslipno);

    return;
    // Linking.openURL(e.data).catch((err) => console.error('An error occurred', err));
  };

  // {
  //   "compname": "Reliance Retail Limited",
  //   "subdivcode": "2421",
  //   "custcode": "000004052831",
  //   "pisdepslipno": "2001701754",
  //   "pisdate": "21/07/2022",
  //   "bankname": "BARCLAYS BANK PLC",
  //   "amount": "80040"
  //   }
  if (isScan) {
    return <QRCodeScanner

      onRead={onSuccess}

    />
  }
  // useEffect(() => {
  //   const requestCameraPermission = useCallback(async () => {
  //     try {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.CAMERA,
  //         {
  //           title: 'Camera Permission',
  //           message: 'This app needs access to your camera to take photos and videos.',
  //           buttonPositive: 'OK',
  //         }
  //       );

  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       } else {
  //         Dialog.show({
  //           type: ALERT_TYPE.WARNING,
  //           title: 'Permission Required',
  //           textBody: 'Please grant the camera permission from settings.',
  //           button: 'OK',
  //           onPressButton: () => {
  //             Dialog.hide();
  //             openSettings().catch(() => console.warn('Cannot open settings'));
  //           },
  //         });
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }, []);

  //   requestCameraPermission();
  // }, []);

  return (
    <View style={styles.main}>
      <AppBarSecond title={'Cash Pickup'} />
      {/* <View style={styles.appBar}>
        <View style={[styles.righticon2]}>

          <TouchableOpacity
            onPress={() => {
              setIsScan(true)
            }}
          >
            <QrcodAddmoneysvg />

          </TouchableOpacity>
        </View>
      </View> */}
      {/* <CameraScreen onQRCodeScan={(data) => console.log(data)} /> */}
      <LinearGradient colors={[colorConfig.primaryColor, colorConfig.secondaryColor,]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      >
        <View style={[styles.contentContainer,]}>
          <View style={styles.itemContainer}>
            <Text style={styles.cashPickupText}> {item.CustName}</Text>
            <RadintPickupSvg size={20} color='#fff' />
          </View>
          <View style={styles.itemContainer}>
            <View style={styles.numberview}>
              <Text style={styles.clientCodeText}>Number Of Receipts :</Text>
              <Text style={styles.pickupCount}>{transactionCount}</Text>
            </View>
            <Text style={styles.pickuptext}>{item.Type}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView keyboardShouldPersistTaps={'handled'}>

        <View style={styles.container}>
          {item?.Captions?.PickupAmount && <FlotingInput
            keyboardType='numeric'
            label={item?.Captions?.PickupAmount}
            value={amount}
            onChangeTextCallback={setAmount}
          />}
          {item?.Captions?.GenSlip && <FlotingInput

            label={item?.Captions?.GenSlip}
            value={sealingTagNo}
            onChangeTextCallback={setSealingTagNo}
          />}
          {item?.Captions?.PisHclNo &&
            <FlotingInput
              label={item?.Captions?.PisHclNo}
              value={customerGeneratedNo}
              onChangeTextCallback={setCustomerGeneratedNo}
            />}
          {item?.Captions?.HclNo && <FlotingInput
            keyboardType="default"
            label={item?.Captions?.HclNo}
            value={hciSlipNo}
            onChangeTextCallback={setHciSlipNo}
          />}
          {item?.Captions?.RecNo &&
            <FlotingInput
              label={item?.Captions?.RecNo}
              value={hsbcDepositSlipNo}
              onChangeTextCallback={setHsbcDepositSlipNo}
            />}

          {item?.Captions?.PisDate &&
            <TouchableOpacity onPress={() => setShowCalender(true)}>
              <FlotingInput
                editable={false}
                label={item?.Captions?.PisDate}
                value={slipDate}
                onChangeTextCallback={setSlipDate}
              />
              <View style={[styles.righticon2]}>
                <Calendarsvg />
              </View>
            </TouchableOpacity>
          }

          {/* <FlotingInput
            
             

             label='AIRTEN-GAMPANGILA'
            value={airtenGampangila}
            onChangeText={setAirtenGampangila}
          /> */}

          <FlotingInput
            editable={item.ClientCode?.length > 1}
            onPressIn={() => {
              if (item.ClientCode?.length > 1) {
                setClientCodeModal(true)
              }
            }}
            label={'ClientCode'}
            value={clientCode}
          />
          <Text style={styles.denomiamount}>Denomination Amount</Text>
          <FlashList
            data={denominationData}
            extraData={denominationData}
            renderItem={renderAmountItem}
            keyExtractor={(item) => item.key + item.val}
            estimatedItemSize={9}
          />
          <TouchableOpacity onPress={() => setRemarkVisible(true)}>

            <FlotingInput
              editable={false}
              label={'Select Remark'}
              value={remark}
              onChangeTextCallback={(text) => {
                setRemark(text)
              }}
            />

            <View style={[styles.righticon2]}>
              <OnelineDropdownSvg />
            </View>
          </TouchableOpacity>

          {remark !== '' && (
            <View>
              <TouchableOpacity onPress={() => setChildRemarksVisible(true)}>
                <FlotingInput
                  editable={false}
                  label='Select Child Remark'
                  value={received}
                  onChangeTextCallback={(text) => {
                    setRemark(text)
                  }}
                />

                <TouchableOpacity onPress={() => setChildRemarksVisible(true)}
                  style={[styles.righticon2]}
                >
                  <OnelineDropdownSvg />
                </TouchableOpacity>
              </TouchableOpacity>

              <FlotingInput
                label='Additional Remarks'
                multiline={true}
                value={additionalRemarks}
                onChangeTextCallback={(text) => {
                  setAdditionalRemarks(text)
                }}
              />
            </View>
          )}
          <BottomSheet
            isVisible={remarkVisible}
            onBackdropPress={() => setRemarkVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.receivedModalContent}>
                <ScrollView>

                  {remarkList?.map((reason, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.reasonTextContainer}
                      onPress={async () => {
                        await fetchChildRemarkList(reason);
                        setRemark(reason);
                        setRemarkVisible(false);
                      }}>
                      <Text style={styles.reasonText}>{reason}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

              </View>
            </View>
          </BottomSheet>
          <BottomSheet
            isVisible={clientCodeModalVisible}
            onBackdropPress={() => setClientCodeModal(false)}
          >
            <View style={styles.centeredView}>

              <View style={styles.receivedModalContent}>
                <ScrollView>

                  {item.ClientCode?.map((code, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.reasonTextContainer}
                      onPress={() => {
                        setClientCode(code)
                        setClientCodeModal(false);
                      }}>
                      <Text style={styles.reasonText}>{code}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

              </View>
            </View>
          </BottomSheet>
          <Modal
            transparent={true}
            animationType="slide"
            visible={childRemarksVisible}
            onRequestClose={() => setChildRemarksVisible(false)} >

            <View style={styles.centeredView}>
              <View style={styles.receivedModalContent}>
                <ScrollView>
                  {childRemarkList?.map((childRemark, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.reasonTextContainer}
                      onPress={async () => {
                        setReceived(childRemark);
                        setChildRemarksVisible(false);
                      }}>
                      <Text style={styles.reasonText}>{childRemark}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

              </View>
            </View>
          </Modal>

          <Modal
            transparent={true}
            animationType="slide"
            visible={detailsModalVisible}
          >
            <View style={styles.modalContainer}>
              <View style={styles.detailmodalContent}>
                <Text style={styles.modalTitle}>{`Radiant Sandesh`}</Text>
                <Text style={styles.modalLabel}>{'Are you sure you want to submit?'}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButton} onPress={handleCancelPress}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalButton} onPress={handleSubmit}>
                    <Text style={styles.modalButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <DynamicButton title={'Submit'} onPress={() => handlePickupData()} />
          <VerifyMobileNumber isCpin={item.OtpDay === ""} handleSubmit={async (text) => {



            if (item.OtpDay === "") {
              if (text === item.PinNo) {
                submitCashPickupRequest();
                setMobilemodel(false);
              }
              else {
                ToastAndroid.showWithGravity(
                  'Invalid Pin',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );

              }
              return;
            }
            if (item.OtpDay === 'AxisTransaction') {
              await setRadiantDynamicOtp(item.TransId, text, item.ShopId, amount, item.OtpDay, '');

              if (dynamicOtpResponse) {

                setClientOtp(dynamicOtpResponse?.Content?.ADDINFO?.otp_pin || '');
              }
              closeMobileModal();
              return;
            }


            // if(otpResponse){
            //  setClientOtp(otpResponse?.Content?.ADDINFO?.otp_pin || '');
            // }
            // closeMobileModal();
          }} visible={mobilemodel} onClose={() => setMobilemodel(false)}
          />
          <OTPModal
            setShowOtpModal={setOtpModalVisible}
            disabled={mobileOtp.length !== 4}
            showOtpModal={otpModalVisible}
            //setMobileOtp={setMailOtp}
            setMobileOtp={setMobileOtp}
            verifyOtp={() => {
              //Verify OTP

              if (clientOtp === mobileOtp) {
                submitCashPickupRequest();
                setOtpModalVisible(false);
                return;
              }
              ToastAndroid.showWithGravity(
                'Invalid OTP',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
              );
            }

            }
          />
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View>

                  <Text style={styles.modalTitle}>Radiant CMS</Text>
                  <Text style={styles.modalText}>Enter No of Transactions</Text>
                </View>

                <FlotingInput
                  label="total receipts"
                  placeholderTextColor="#000"
                  numberOfLines={1}
                  value={transactionCount}
                  onChangeTextCallback={(count) => {
                    setTransactionCount(count)
                  }}
                  keyboardType="numeric"
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.modalButton} onPress={handleOkPress}>
                    <Text style={styles.modalButtonText}>OK</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </Modal>


          <BottomSheet
            onBackdropPress={() => setShowCalender(false)}
            isVisible={showCalender}
          >
            <View style={styles.bottomSheetContent}>
              <CustomCalendar
                onDateSelected={handleDateChange}
                maxDate={moment().toDate()}
              />
            </View>
          </BottomSheet>
          {isLoading &&
            <ActivityIndicator color={colorConfig.primaryColor}
              size="large" style={{
                marginTop: wScale(50),
                position: 'absolute', top: 0, left: 0, bottom: 0, right: 0
              }} />}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    paddingHorizontal: wScale(15),
    paddingTop: hScale(20),
    flex: 1,
    paddingBottom: hScale(20)
  },
  contentContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: wScale(10),
    paddingTop: hScale(4)
  },
  pickuptext: { color: '#fff', fontSize: FontSize.tiny, marginTop: hScale(-4) },

  cashPickupText: {
    fontSize: FontSize.large,
    fontWeight: '600',
    color: '#fff',
  },
  bottomSheetContent: {
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  denomiamount: {
    color: '#000',
    fontSize: FontSize.large,
    fontWeight: 'bold',
    paddingBottom: hScale(10),
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    height: hScale(220),
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: wScale(20),
    justifyContent: 'space-between',
  },
  detailmodalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: wScale(20),
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: '#000',
    fontSize: FontSize.large,
    fontWeight: 'bold',
    marginBottom: hScale(10),
  },
  modalText: {
    color: '#000',
    marginBottom: hScale(10),
  },
  righticon2: {
    position: "absolute",
    left: "auto",
    right: wScale(0),
    top: hScale(0),
    height: "85%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: wScale(12),
    width: wScale(44),
    marginRight: wScale(-2),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  modalButton: {
    padding: wScale(10),
    borderRadius: 5,
    marginHorizontal: wScale(5),
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#000',
  },
  reasonTextContainer: {
    padding: wScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    paddingHorizontal: wScale(20)
  },
  reasonText: {
    fontSize: FontSize.regular,
    color: '#000',
  },
  centeredView: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  receivedModalContent: {
    paddingVertical: hScale(10),
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'center',
    maxHeight: SCREEN_HEIGHT / 1.2,
    minHeight: SCREEN_HEIGHT / 4,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,

  },
  modalLabel: {
    color: '#000',
    fontSize: FontSize.medium,
    marginVertical: hScale(5),
  },
  rightin: {
    alignItems: 'flex-end',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickupCount: {
    color: 'yellow',
    fontSize: FontSize.large,
    marginLeft: wScale(10),
    fontWeight: 'bold'
  },
  clientCodeText: {
    color: 'yellow',
    fontSize: wScale(14),
  },
  numberview: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: wScale(-3)
  },
});

export default PicUpScreen;
