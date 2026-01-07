import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, ToastAndroid } from 'react-native';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { translate } from '../../../utils/languageUtils/I18n';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import AppBar from '../../drawer/headerAppbar/AppBar';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import DynamicButton from '../../drawer/button/DynamicButton';
import { SvgXml } from 'react-native-svg';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import OTPModal from '../../../components/OTPModal';
import ShowLoader from '../../../components/ShowLoder';

const NumberRegisterScreen = ({ route }) => 
  
  {
  const { Name, No, type, CName } = route.params;

  const { colorConfig } = useSelector((state: RootState) => state.userInfo)
  const adduser = `
<svg id="Layer_1" height="512" viewBox="0 0 512 512" width="512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" data-name="Layer 1"><linearGradient id="GradientFill_1" gradientUnits="userSpaceOnUse" x1="256" x2="256" y1="512"><stop offset="0" stop-color="#5cc4bb"/><stop offset=".097" stop-color="#50c1c0"/><stop offset=".501" stop-color="#25b4d2"/><stop offset=".815" stop-color="#0aacde"/><stop offset="1" stop-color="#00a9e2"/></linearGradient><path d="m256 0c-141.159 0-256 114.841-256 256s114.841 256 256 256 256-114.841 256-256-114.841-256-256-256zm26.968 225.417c39.361 2.133 70.193 31.932 70.193 67.841v50.194c0 9.8-8.282 17.772-18.462 17.772h-180.499c-10.179 0-18.462-7.975-18.462-17.774v-50.191c0-35.91 30.833-65.71 70.193-67.841a12 12 0 0 1 8.6 2.992 46.519 46.519 0 0 0 59.846 0 12.02 12.02 0 0 1 8.6-2.993zm46.193 111.807h-169.424v-43.966c0-21.863 18.591-40.263 43.077-43.467a70.868 70.868 0 0 0 83.27 0c24.486 3.2 43.077 21.6 43.077 43.468zm-84.712-106.046a59.4 59.4 0 1 1 59.4-59.4 59.464 59.464 0 0 1 -59.4 59.4zm0-94.8a35.4 35.4 0 1 1 -35.4 35.4 35.44 35.44 0 0 1 35.4-35.4zm165.288 62.764a12 12 0 0 1 -12 12h-29.221v29.222a12 12 0 0 1 -24 0v-29.218h-29.216a12 12 0 0 1 0-24h29.221v-29.222a12 12 0 0 1 24 0v29.221h29.221a12 12 0 0 1 11.995 12z" fill="url(#GradientFill_1)" fill-rule="evenodd"/></svg>    
  
    `;
  const [remitterOtp, setRemitterOtp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [sendNum, setSendNum] = useState(No);
  const [remName, setRemName] = useState(CName);
  const [aadharnum, setaadharnum] = useState('');
  const [Pan, setPan] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const { post, get } = useAxiosHook();
  const otpRefs = useRef([]);
const [adharData,setadharData]= useState({});
  const [remitterid, setRemitterid] = useState('');

  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [mobileOtp, setMobileOtp] = useState('');
  const [isOtp,setisOtp]= useState(false);
const [type2,settype2]= useState('')

  const [load , setisload]= useState(false);


  useEffect(()=>{
    console.log(type)
  })
  const sendOtp = async (num, name) => {
    setisload(true);
    try {
      const baseUrl = `${APP_URLS.addnewRemSendOtp}Mobile=${num}&Name=${name}&surname=tte&pincode=123456`;
      //  Name === 'RADIANT'
      //       ? await get({ url: `Money/api/Radiant/RegisterMobileForIMPS?sender_number=${num}&Name=${name}` })
      //       : 
      const res = await post({ url: baseUrl });

if(res.RESULT ==='1'){
  ToastAndroid.show(res.ADDINFO, ToastAndroid.LONG);
  setisload(false)
  return;
}

      // {"ADDINFO": "Some technical error occured.", "RESULT": "1"}




      console.log(res)
      const { status, statuscode, data } = res.ADDINFO;
      const { remitter } = data || {};

      if (statuscode === 'TXN') {
        setIsLoading(false);

        console.log('OTP sent successfully');
        setRemitterid(remitter?.id || '');
        console.log('Remitter ID:', remitter?.id);
        console.log('Is Verified:', remitter?.is_verified);
        ToastAndroid.show('OTP sent successfully. Please check your phone.', ToastAndroid.LONG);
        setRemitterOtp(false);
        // if (remitter?.is_verified === 0) {
        //   Alert.alert('Verification Pending', 'Your mobile number is not yet verified.', [{ text: 'OK' }]);
        // } else {
        // }
      } else {
        setIsLoading(false);

        Alert.alert('Error', res['ADDINFO'] || 'An unknown error occurred.', [{ text: 'OK' }]);
      }
      setisload(false);
    } catch (error) {
      console.error('Failed to send OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again later.', [{ text: 'OK' }]);
      setIsLoading(false);
    }
  };

    const checksendernumber = async (number) => {
      setRemitterOtp(true);

      try {
        const url = `${APP_URLS.getCheckSenderNo}${number}`;
        const res = await get({ url: url });
        console.log('res', JSON.stringify(res));
  
        const addinfo = res['ADDINFO'];
  
        console.log();
       
        if (res) {
          const status = addinfo?.statuscode;
          if (status === "TXN") {
   
            settype2("AADHAROTP")

  
  
            const remmname = addinfo?.data?.remitter?.name || '';
            const consumelimit = addinfo?.data?.remitter?.consumedlimit?.toString() || '0';
            const remainlimit = addinfo?.data?.remitter?.remaininglimit?.toString() || '0';
            const kycsts = addinfo?.data?.remitter?.kycdone?.toString() || '';
            const photo = addinfo?.data?.remitter?.Photo?.toString() || '';
            const beneficiary = addinfo?.data?.beneficiary || [];
            const remid = addinfo?.data?.remitter?.id || '';
            console.log(beneficiary);
            setRemitterOtp(true)
            if (beneficiary.length === 0) {
            } else {
            }
          } else if(addinfo.statuscode === "RNF" || addinfo.statuscode === "NUMBEROTP" || addinfo.statuscode === "AADHAROTP") {
  
            if (addinfo.statuscode === "RNF" || addinfo.statuscode === "NUMBEROTP" || addinfo.statuscode === "AADHAROTP") {
              settype2("AADHAROTP")
            }
  
          } else if (status === 'ERR') {
            ToastAndroid.showWithGravity(addinfo, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
          }
        } else if (res?.RESULT === '1') {
          ToastAndroid.showWithGravity(addinfo, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  
          const status = addinfo?.data?.statuscode;
          console.log(addinfo.statuscode)
          console.log(addinfo.data.status)
        
          
  
        }
  
      
      } catch (error) {
        console.error('Error:', error);
        // Handle error
      }
    };
  const sendAadharOtp = async (num) => {
    try {
      console.log('Sending Aadhar OTP request...');
      console.log('Aadhar Data:', adharData);
  
      const { agentid, clientid } = adharData;
      const url = `${APP_URLS.Register_aadhar_new}mobile=${num}&aadharno=${aadharnum}&pancardnumber=${Pan}`;
      const url2 = `${APP_URLS.Verify_aadhar_new}mobile=${num}&otp=${mobileOtp}&aadhar=${aadharnum}&clientid=${clientid}&agentid=${agentid}`;
  
      console.log('Constructed URL:', isOtp ? url2 : url);
  
      const res = await post({ url: isOtp ? url2 : url });
      console.log(res);
      if (res) {
        if (isOtp) {
          console.log('OTP Verification Response:', res);
          const otpMsg = res.ADDINFO?.msg || 'OTP Verification failed, please try again.';
          const otpStatus = res.ADDINFO?.stsmsg === true;
          if (otpStatus) {
            setisOtp(true);
            setOtpModalVisible(true);
            ToastAndroid.show(otpMsg, ToastAndroid.LONG);
          } else {
            ToastAndroid.show(otpMsg, ToastAndroid.LONG);
          }
        } else {
          setadharData(res.ADDINFO);
  
          const aadharMsg = res.ADDINFO?.msg || 'Aadhar registration failed, please try again.';
          const aadharStatus = res.ADDINFO?.stsmsg === true;
  
          if (aadharStatus) {
            setisOtp(true);
            setOtpModalVisible(true);
            ToastAndroid.show(aadharMsg, ToastAndroid.LONG);
          } else {
            ToastAndroid.show(aadharMsg, ToastAndroid.LONG);
          }
        }
      } else {
        console.error('No response received from API');
        ToastAndroid.show('Error: No response from server', ToastAndroid.LONG);
      }
      setisload(false);

    } catch (e) {
      console.error('Error occurred in sendAadharOtp:', e);
      ToastAndroid.show('An error occurred. Please try again.', ToastAndroid.LONG);
    }
  };
  
  

  const verifyOtp = async (otp) => {
    try {
      const url = `${APP_URLS.verifynewRemSendOtp}Mobile=${sendNum}&OTP=${otp}&RequestId&remitterid=${remitterid}&beneficiaryid&Action=add`;

      const res = await post({ url });

      console.log(res, '==========================');

      if (res['RESULT'] === '1') {  // Check if the result indicates an error
        setIsLoading(false);  // Stop the loading state
        Alert.alert('Error', res['ADDINFO'], [{ text: 'OK', onPress: () => { } }]); // Show error message
      } else {
        // Handle successful response
        const data = res['ADDINFO']['data'];

        // Check if status is available
        if (data && data.status) {
          Alert.alert('Success', data['status'], [{ text: 'OK', onPress: () => { checksendernumber(sendNum)} }]);  // Show success message
        } else {
          Alert.alert('Success', 'Transaction Successful', [{ text: 'OK', onPress: () => {  checksendernumber(sendNum)
          } }]);
        }
      }

    } catch (error) {
      // Handle errors from API call
      console.error('Failed to verify OTP:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again later.', [{ text: 'OK', onPress: () => { } }]);
      setIsLoading(false);  // Make sure to stop loading in case of error
    }
  };


  const handleRemitterNameNext = () => {

    if (type == 'AADHAROTP' ||type2 == 'AADHAROTP'  ) {
      setisload(true)
      sendAadharOtp(sendNum)
    } else {
      if (remName.trim() !== '') {
        setisload(true)
        sendOtp(sendNum, remName);
        console.log(sendNum, remName);
      } else {
        Alert.alert(translate('Info'), translate('Enter Remitter Name'), [{ text: 'OK', onPress: () => { } }]);
      }
    }

  };

  const handleVerifyOtp = () => {
    const otp = otpDigits.join('');



    if (otp.length === 4) {
      verifyOtp(otp);
    } else {
      Alert.alert('Error', 'Please enter valid OTP.', [{ text: 'OK', onPress: () => { } }]);
    }
  };
  const handleVerifyOtp2 = () => {
    const otp = otpDigits.join('');



    if (otp.length === 4) {
      verifyOtp(otp);
    } else {
      Alert.alert('Error', 'Please enter valid OTP.', [{ text: 'OK', onPress: () => { } }]);
    }
  };

  const handleChangeOtpDigit = (index, value) => {
    const updatedOtpDigits = [...otpDigits];
    updatedOtpDigits[index] = value;
    setOtpDigits(updatedOtpDigits);
    if (value.length === 1 && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <View style={styles.main}>

      <AppBarSecond title={'Remitter Number Register'} />
      <LinearGradient colors={[colorConfig.primaryColor, colorConfig.secondaryColor]} style={{
        paddingTop: hScale(20), marginBottom: hScale(20)

      }}>
        {/* <View style={[styles.topappbar, styles.container]}>
          <SvgXml xml={adduser} width={wScale(50)} height={wScale(50)} />

          <Text style={styles.title}>Register New User</Text>
        </View> */}
      </LinearGradient>
      <View style={styles.container}>
        {remitterOtp ? (
          <View>
            <FlotingInput
              label={translate('Enter Remitter Name')}
              value={remName}
              onChangeTextCallback={setRemName}
              editable={!isLoading}
              textInputStyle={{ textAlign: 'center' }}
            />
            <FlotingInput
              label={translate('Mobile Number')}
              value={sendNum}
              onChangeTextCallback={setSendNum}
              keyboardType='numeric'
              maxLength={10}
              editable={false}
              textInputStyle={{ textAlign: 'center' }}
            />
            {(type === 'AADHAROTP' || type2 === 'AADHAROTP') && <FlotingInput
              label={translate('Aadhar')}
              value={aadharnum}
              keyboardType='numeric'
              onChangeTextCallback={setaadharnum}
              editable={!isLoading}
              maxLength={12}

              textInputStyle={{ textAlign: 'center' }}
            />}
            {(type === 'AADHAROTP' || type2 === 'AADHAROTP') &&
              <FlotingInput
                label={'Pan Card(Optional)'}
                value={Pan}
                onChangeTextCallback={setPan}
                editable={!isLoading}
                textInputStyle={{ textAlign: 'center' }}
              />}

            <DynamicButton
              title={translate('Next')}
              onPress={handleRemitterNameNext}
              disabled={isLoading}
              isLoading={isLoading}
            />
          </View>
        ) : (
          <View>
            <Text style={styles.otptitle}>{translate('Enter OTP')}</Text>
            <View style={styles.otpContainer}>
              {otpDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => otpRefs.current[index] = ref}
                  value={digit}
                  onChangeText={(value) => handleChangeOtpDigit(index, value)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType='numeric'
                  maxLength={1}
                  style={styles.otpInput}
                />
              ))}
            </View>

            {(type === 'AADHAROTP' || type2 === 'AADHAROTP') ? (
  <DynamicButton
    title={'Verify Aadhar OTP'}
    onPress={handleVerifyOtp2}
    disabled={isLoading}
    isLoading={isLoading}
  />
) : (
  <DynamicButton
    title={'Verify OTP'}
    onPress={handleVerifyOtp}
    disabled={isLoading}
    isLoading={isLoading}
  />
)}

          </View>
        )}
        {isLoading && <ActivityIndicator size='large' color={colorConfig.labelColor} />}
      </View>

     {load  && <ShowLoader/>}
      <OTPModal
        setShowOtpModal={setOtpModalVisible}
        disabled={mobileOtp.length !== 6}
        showOtpModal={otpModalVisible}
        setMobileOtp={setMobileOtp}
        setEmailOtp={null}
        inputCount={6}
        verifyOtp={() => {      sendAadharOtp(sendNum);

   ;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: wScale(15),
    justifyContent: 'center',
  },
  topappbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: hScale(10),
  },
  title: {
    fontSize: wScale(18),
    color: '#FFFFFF',
    marginLeft: wScale(10),
  },
  otptitle: {
    fontSize: wScale(16),
    textAlign: 'center',
    marginBottom: hScale(10),
    color: '#000'
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hScale(20),
  },
  otpInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    textAlign: 'center',
    fontSize: wScale(18),
    width: wScale(40),
    color: '#000',
    fontWeight: 'bold'
  },
});

export default NumberRegisterScreen;
