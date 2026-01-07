import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
  Image,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';
import { colors } from '../../utils/styles/theme';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { FlashList } from '@shopify/flash-list';
import { APP_URLS } from '../../utils/network/urls';
import useAxiosHook from '../../utils/network/AxiosClient';
import { BottomSheet, Card } from '@rneui/base';
import { translate } from '../../utils/languageUtils/I18n';
import { useDeviceInfoHook } from '../../utils/hooks/useDeviceInfoHook';
import { useSelector } from 'react-redux';
import { useLocationHook } from '../../utils/hooks/useLocationHook';
import { RootState } from '../../reduxUtils/store';
import { encrypt } from '../../utils/encryptionUtils';
import FlotingInput from '../drawer/securityPages/FlotingInput';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import DynamicButton from '../drawer/button/DynamicButton';
import { ALERT_TYPE, Dialog } from 'react-native-alert-notification';
import { useNavigation } from '@react-navigation/native';
import ClosseModalSvg from '../drawer/svgimgcomponents/ClosseModal';
import DropdownSvg from '../../utils/svgUtils/DropdownSvg';
import OnelineDropdownSvg from '../drawer/svgimgcomponents/simpledropdown';
import OperatorBottomSheet from '../../components/OperatorBottomSheet';
import Rechargeconfirm from '../../components/Rechargeconfirm';
import RecentHistory from '../../components/RecentHistoryBottomSheet';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import RecentText from '../../components/RecentText';

const DthScreen = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`
  const [showLoader, setShowLoader] = useState(false);

  const [showLoader2, setShowLoader2] = useState(false);
  const { get, post } = useAxiosHook();
  const [textInput1, setTextInput1] = useState('');
  const [consumerNo, setconsumerNo] = useState(translate(''));
  const [insuranceOptList, setInsuranceOptList] = useState([]);
  const [isOperatorList, setIsOperatorList] = useState(false);
  const [selectedOpt, setselectedOpt] = useState(
    translate('Select Your Operator'),
  );
  const [optimg, setOptimg] = useState('');

  const [Amount, setAmount] = useState('');
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [maxlen, setMaxLen] = useState(10);
  const [isInfo, setIsinfo] = useState(false);
  const [GasCylenderBillOpt, setGasCylenderBillOpt] = useState(
    translate('Select Your Operator'),
  );
  const [district, setdistrict] = useState('');
  const [DistList, setDistList] = useState([]);
  const [accnumhint, setAccnumhint] = useState('');
  const [accmaxlength, setAccmaxlength] = useState(0);
  const [key2, setKey2] = useState('');
  const [keyType2, setKeyType2] = useState('');
  const [accntvisivility, setAccntvisivility] = useState(false);
  const [firsttexthint, setFirsttexthint] = useState('');
  const [key1, setKey1] = useState('');
  const [keyType1, setKeyType1] = useState('default');
  const [accnumhint2, setAccnumhint2] = useState('');
  const [accmaxlength2, setAccmaxlength2] = useState(0);
  const [key3, setKey3] = useState('');
  const [keyType3, setKeyType3] = useState('');
  const [accntvisivility2, setAccntvisivility2] = useState(false);
  const [datatype, setDataType] = useState('');
  const [maxlength, setMaxLength] = useState();
  const [minlength, setMinLength] = useState();
  const [optional, setOptional] = useState('');
  const [paramname, setParamName] = useState('Customer ID');
  const [values, setValues] = useState('');
  const [regx, setRegx] = useState('');
  const [visibility, setVisibility] = useState(false);
  const [optcode, setOptCode] = useState('');
  const [dueDate, setDueDate] = useState('N/A');
  const [CustomerName, setCustomerName] = useState('N/A');
  const [custBal, setCustBal] = useState();
  const [Status, setStatus] = useState(translate(''));
  const [LoanBillOperator, setLoanBillOperator] = useState('Select Operator');
  const [LoanBillOperators, setLoanBillOperators] = useState([]);
  const [path, setpath] = useState('');
  const [reqTime, setReqTime] = useState('');
  const [reqId, setReqId] = useState('')
  const [historylist, setHistorylist] = useState([]);
  const [isrecent, setIsrecent] = useState(false)

  const navigation = useNavigation<any>();

  useEffect(() => {
    CreditCardOpt('DTH');
  }, []);

  const selectOperator = selectedOperator => {
    console.log('Selected Operator:', selectedOperator);
    setselectedOpt(selectedOperator);
    ViewbillInfoStatus();
    setIsOperatorList(false);
    setOptimg('selectOperatorImage');

  };
  useEffect(() => {
    recenttransactions();

  }, []);
  const recenttransactions = async () => {
    try {
      const url = `${APP_URLS.recenttransaction}pageindex=1&pagesize=5&retailerid=${userId}&fromdate=${formattedDate}&todate=${formattedDate}&role=Retailer&rechargeNo=ALL&status=ALL&OperatorName=ALL&portno=ALL`
      console.log(url);
      const response = await get({ url: url })
      console.log('-*************************************', response);

      setHistorylist(response);
      setReqTime(response[0]['Reqesttime']);
      setReqId(response[0]['Request_ID'])

    } catch (error) {
      console.log(error);

    }
  }

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
  const day = ('0' + currentDate.getDate()).slice(-2);

  const formattedDate = `${year}-${month}-${day}`;


  const handleItemPress = item => {
    setselectedOpt(item['Operatorname']);
    setOptCode(item['OPtCode']);
    setpath(item['path'])

    setAccntvisivility(false);
    setAccntvisivility2(false);

    setDataType('');
    setMaxLen(0);
    setMinLength(0);
    setOptional('');
    //  setParamName('Customer ID');
    setValues('');
    setRegx('');
    console.log(item['OPtCode']);
    console.log(item['Operatorname']);
    setVisibility(false);

    if (!item.customerparams || item.customerparams.length === 0) {
      //clearState();
    } else {
      const custparam = item.customerparams;

      setDataType(custparam[0]['dataType']);
      setMaxLength(custparam[0]['maxLength']);
      setMinLength(custparam[0]['minLength']);
      setVisibility(custparam[0]['visibility']);
      setOptional(custparam[0]['optional']);
      setParamName(custparam[0]['paramName']);
      setRegx(custparam[0]['regex']);
      setValues(custparam[0]['values']);

      if (custparam.length === 2) {
        setAccnumhint(custparam[1]['paramName']);
        setAccmaxlength(custparam[1]['maxLength']);
        setKey2(custparam[1]['dataType']);
        setKeyType2(
          custparam[1]['dataType'] === 'ALPHANUMERIC' ? 'default' : 'numeric',
        );
        setAccntvisivility(true);
        setAccntvisivility2(true);
      } else if (custparam.length === 3) {
        setAccnumhint(custparam[1]['paramName']);
        setAccmaxlength(custparam[1]['maxLength']);
        setAccnumhint2(custparam[2]['paramName']);
        setAccmaxlength2(custparam[2]['maxLength']);
        setKey2(custparam[1]['dataType']);
        setKey3(custparam[2]['dataType']);
        setKeyType2(
          custparam[1]['dataType'] === 'ALPHANUMERIC' ? 'default' : 'numeric',
        );
        setKeyType3(
          custparam[2]['dataType'] === 'ALPHANUMERIC' ? 'default' : 'numeric',
        );
        setAccntvisivility(true);

        setAccntvisivility2(true);
      } else {
        setAccntvisivility(false);
        setAccntvisivility2(false);
      }
    }

    console.log(item);
  };

  const clearState = () => {
    setDataType('');
    setMaxLength(0);
    setMinLength(0);
    setOptional('');
    // setParamName(translate('Consumer Number'));
    setValues('');
    setRegx('');
    setVisibility(false);
    setOptCode('');
    setFirsttexthint('');
    setKey1('');
    setKeyType1('default');
    setAccnumhint('');
    setAccmaxlength(0);
    setKey2('');
    setKeyType2('default');
    setAccnumhint2('');
    setAccmaxlength2(0);
    setKey3('');
    setKeyType3('default');
  };

  async function CreditCardOpt(opttype) {
    try {
      const url = `${APP_URLS.getDthOperator}${opttype}`;
      const res = await get({
        url: url,
      });
      setpath(res['path'])

      console.log(res['myprop2Items']);
      setInsuranceOptList(res['myprop2Items']);
    } catch (error) {
      console.error(error);
    }
  }


  const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
    useDeviceInfoHook();
  const { userId } = useSelector((state: RootState) => state.userInfo);
  const { latitude, longitude } = useLocationHook();
  const readLatLongFromStorage = async () => {
    try {
      const locationData = await AsyncStorage.getItem('locationData');

      if (locationData !== null) {
        const { latitude, longitude } = JSON.parse(locationData);
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        return { latitude, longitude };
      } else {
        console.log('No location data found');
        return null;
      }
    } catch (error) {
      console.error('Failed to read location data from AsyncStorage:', error);
      return null;
    }
  };

  const onRechargePress = useCallback(async () => {

    const loc = await readLatLongFromStorage();
    setBottomSheetVisible(false);
    setShowLoader(true);
    let status, Message;
    // Message='';
    // status="";
    const mobileNetwork = await getNetworkCarrier();
    const ip = await getMobileIp();
    const encryption = await encrypt([
      userId,
      consumerNo,
      optcode,
      Amount,
      loc?.latitude,
      loc?.longitude,
      'city',
      'address',
      'postcode',
      mobileNetwork,
      ip,
      '57bea5094fd9082d',
    ]);
    console.log(encryption.encryptedData);

    const rd = encodeURIComponent(encryption.encryptedData[0]);
    const n1 = encodeURIComponent(encryption.encryptedData[1]);
    const ok1 = encodeURIComponent(encryption.encryptedData[2]);
    const amn = Amount;
    const ip1 = encodeURIComponent(encryption.encryptedData[10]);
    const em = '57bea5094fd9082d';
    const devtoken = encodeURIComponent(encryption.encryptedData[6]);

    const Latitude = encodeURIComponent(encryption.encryptedData[4]);
    const Longitude = encodeURIComponent(encryption.encryptedData[5]);
    const ModelNo = encodeURIComponent(encryption.encryptedData[11]);
    const City = devtoken;

    const PostalCode = encodeURIComponent(encryption.encryptedData[8]);
    const InternetTYPE = encodeURIComponent(encryption.encryptedData[9]);
    const Addresss = encodeURIComponent(encryption.encryptedData[7]);

    const value1 = encodeURIComponent(encryption.keyEncode);
    const value2 = encodeURIComponent(encryption.ivEncode);

    const url = `${APP_URLS.rechTask}rd=${rd}&n=${n1}&ok=${ok1}&amn=${amn}&pc=${accnumhint}&bu=${accnumhint2}&acno&lt&ip=${ip1}&mc&em=${em}&offerprice&commAmount&Devicetoken=${devtoken}&Latitude=${Latitude}&Longitude=${Longitude}&ModelNo=${ModelNo}&City=${City}&PostalCode=${PostalCode}&InternetTYPE=${InternetTYPE}&Addresss=${Addresss}&value1=${value1}&value2=${value2}`;

    try {
      const res = await post({
        url: url,
      });
      console.log(res);
      status = res.Response;
      Message = res.Message;
      await recenttransactions();
    } catch (error) {
      console.error("Recharge failed:", error);
      status = "Failed";
      Message = "Recharge failed, please try again";
    }

    navigation.navigate('Rechargedetails', {
      mobileNumber: consumerNo,
      Amount,
      operator: selectedOpt,
      status,
      reqId,
      reqTime,
      Message
    }
  
  );
    // if (!res.ok) {
    //   Alert.alert(res['Response'], res['Message'], [{ text: 'OK', onPress: () => { } }]);

    // }
    setconsumerNo('');
    setselectedOpt('Select Your Operator');
    setAmount('');
    setIsinfo(false)
    setShowLoader(false);
    Message()

  }, [
    Amount,
    getMobileIp,
    getNetworkCarrier,
    latitude,
    longitude,
    consumerNo,
    optcode,
    post,
    userId,
  ]);

  const [status, setstatus] = useState();
  async function billInfo() {

    setStatus("");
    console.log(selectedOpt, consumerNo)
    try {
      const url = `${APP_URLS.getdthCustomerInfo}optname=${selectedOpt}&mobileno=${consumerNo}`;
      const res = await post({
        url: url,
      });
      setStatus(res['status'])
      console.log('ress-*--*-*-*-*-*-*-*-*-***--*-*', res);

      console.log(url);
      setDueDate(res['rechargedueDate']);
      // setAmount(res['monthlyRecharge']);
      if (res['status'] === 'SUCCESS') {
        setCustomerName(res['customerName']);
        setCustBal(res['balance']);
        setstatus(res['customerStatus']);
        console.log(res['balance'])
        setBottomSheetVisible(true);
        setShowLoader2(false)
      }
      else {
        setStatus('Failed');
        // setBottomSheetVisible(true);
        setShowLoader2(false)
        ToastAndroid.showWithGravity(
          `No Data Found`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        )
      }
    } catch (error) { }
  }
  async function ViewbillInfoStatus() {
    console.log(optcode);
    try {
      const config = {};
      const data = {
        Operatorcode: optcode,
      };
      const url = `${APP_URLS.viewbillstatuscheck}${optcode}`;
      const res = await post({ url: url, });
      console.log(':', url);
      const billSts = res['RESULT'];
      if (billSts === 'Y') {
        setIsinfo(true);

      } else {
        // setIsinfo(false);
      }
      console.log(':', res);
    } catch (error) { }
  }

  const validateFields = () => {
    if (!paramname) {
      ToastAndroid.showWithGravity(
        `Please Enter ${paramname}'`,
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );

    } else if (selectedOpt === 'Select Your Operator') {
      ToastAndroid.showWithGravity(
        'Please Select an Operator',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } else if (!Amount || Amount === 'Enter Amount' || parseFloat(Amount) <= 0) {
      ToastAndroid.showWithGravity(
        'Please Enter the Recharge Amount',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } else {
      setBottomSheetVisible(true);
      // billInfo();

    }
  };
  return (
    <View style={styles.main}>
      <AppBarSecond
        title='Dth Recharge'
        onActionPress={undefined}
        actionButton={undefined}
        onPressBack={undefined}
      />

      <View style={styles.container}>
        {showLoader && (
          <ActivityIndicator
            size={wScale(60)}
            color={colors.black}
            style={styles.loaderStyle}
          />
        )}
        <TouchableOpacity onPress={() => setIsOperatorList(true)}>

          <FlotingInput label={selectedOpt}
            editable={false}
            onChangeTextCallback={text => setTextInput1(text)}
          // value={selectedOpt}
          />
          <View style={[styles.righticon2,]}>
            {selectedOpt === 'Select Your Operator' ? (
              <OnelineDropdownSvg />
            ) : (
              path === null ? (
                <OnelineDropdownSvg />

              ) : (

                <Image style={styles.rightimg} source={{ uri: optimg }} />

              )
            )}

          </View>
        </TouchableOpacity>
        <View>
          <FlotingInput label={paramname}
            // maxLength={10}
            onChangeTextCallback={text => {
              setconsumerNo(text)
              if (text.length >= 5) {
                setIsinfo(true)
              } else {
                setIsinfo(false)
              }
              setconsumerNo(text.replace(/\D/g, ""));
            }
            }
            value={consumerNo}
            keyboardType="numeric"
          />
          <View style={[styles.righticon2,]}>
            {isInfo && (
              <TouchableOpacity
                style={styles.infobtn}
                onPress={() => {
                  ViewbillInfoStatus();
                  setShowLoader2(true);
                  billInfo()
                }}>
                {
                  showLoader2 ? <ActivityIndicator size={'large'} /> : <Text style={[styles.infobtntex,]}>Info</Text>
                }
              </TouchableOpacity>
            )}
          </View>
        </View>

        <OperatorBottomSheet
          isModalVisible={isOperatorList}
          operatorData={insuranceOptList}
          // stateData={stateList}
          selectedOperator={() => { selectedOpt; setIsOperatorList(false) }}
          setModalVisible={setIsOperatorList}
          selectOperator={selectOperator}
          setOperatorcode={setOptCode}
          showState={false}
          selectOperatorImage={setOptimg}
          handleItemPress={(item) => { handleItemPress(item) }}
        />

        <FlotingInput label={'Enter Amount'}
          keyboardType="numeric"
          value={Amount}
          onChangeTextCallback={text => setAmount(text)}

        />
        <DynamicButton title={'Procced'} onPress={() => {

          validateFields()

        }} />

        <View >
          <RecentHistory
            isModalVisible={isrecent}
            setModalVisible={setIsrecent}
            historylistdata={historylist}
            onBackdropPress={() => setIsrecent(false)} />
          <TouchableOpacity onPress={() => {
            setIsrecent(true);
          }}
            style={styles.recentviewbtn}>
                         <RecentText/>

          </TouchableOpacity>
        </View>
        <Rechargeconfirm
          isModalVisible={bottomSheetVisible}
          onBackdropPress={() => setBottomSheetVisible(false)}
          status={Status}
          details={[
            { label: 'User Name', value2: CustomerName === '' ? 'N/A' : CustomerName },
            { label: 'Customer ID', value: consumerNo },
            { label: 'Due Date', value2: dueDate === '' ? 'N/A' : dueDate },

            { label: 'Operator Name', value2: selectedOpt },
            { label: 'Customer Status', value2: status === '' ? 'N/A' : status },
            { label: 'Balance', value2: custBal === 0 ? 'N/A' : custBal },
          ]}

          lastlabel={'Transaction Amount'}
          lastvalue={Amount}
          onRechargedetails={() => {
            if (Amount === '0' || Amount === '') {
              ToastAndroid.showWithGravity(
                `Please Enter Amount`,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
              );
            } else { onRechargePress() }
          }
          }
          Lottieimg={require('../../utils/lottieIcons/satellite.json')}

        // isLoading2={isLoading2}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff'
  },
  container: {
    paddingHorizontal: wScale(20),
    flex: 1,
    paddingTop: hScale(30)
  },

  righticon2: {
    position: 'absolute',
    left: 'auto',
    right: wScale(0),
    top: hScale(0),
    height: '75%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: wScale(12)
  },
  infobtn: {
    alignItems: 'center',
  },
  infobtntex: {
    fontSize: wScale(18),
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'green',
    paddingHorizontal: wScale(13),
    paddingVertical: hScale(5),
    borderRadius: 5
  },

  rightimg: {
    height: wScale(45),
    width: wScale(45)
  },
  recentviewbtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row'
  },
  loaderStyle: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 999 },
  recent: {
    color: '#000',
    textAlign: 'right',
    paddingVertical: hScale(10),
  },
});

export default DthScreen;
