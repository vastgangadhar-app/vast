import React, { useCallback, useEffect, useState, version } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  NativeModules,
  Alert,
  ToastAndroid,
  AsyncStorage,
  Modal,
  Linking,
  Button,
  Animated,
  Easing,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { decryptData, encrypt } from '../../utils/encryptionUtils';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../utils/languageUtils/I18n';
import LinearGradient from 'react-native-linear-gradient';
import { hScale, wScale } from '../../utils/styles/dimensions';
import {
  ALERT_TYPE,
  Dialog,

} from 'react-native-alert-notification';

import { APP_URLS } from '../../utils/network/urls';
import {
  setAuthToken,
  setColorConfig,
  setRefreshToken,
  setUserId,
  setUserRole,
} from '../../reduxUtils/store/userInfoSlice';
import useAxiosHook from '../../utils/network/AxiosClient';
import { useLocationHook } from '../../utils/hooks/useLocationHook';
import { colors } from '../../utils/styles/theme';
import { useDeviceInfoHook } from '../../utils/hooks/useDeviceInfoHook';
import DynamicButton from '../drawer/button/DynamicButton';
import { getBrand, getBuildId, getBuildNumber, getCarrier, getDevice, getDeviceId, getDeviceName, getIpAddress, getModel, getSerialNumber, getSystemName, getSystemVersion, getUniqueId, getVersion } from 'react-native-device-info';
import ShowEye from '../drawer/HideShowImgBtn/ShowEye';
import ForgotPasswordModal from '../../components/ForgotPassword';
import { SvgUri, } from 'react-native-svg';
import SplashScreen from './SplashScreen';
import OTPModal from '../../components/OTPModal';
import ShowLoader from '../../components/ShowLoder';
import CheckSvg from '../drawer/svgimgcomponents/CheckSvg';

const LoginScreen = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [androidVersion, setCurrentAndroidVersion] = useState('');
  const [brand, setBrand] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [secureEntry, setSecureEntry] = useState(true);
  const [remember, setRemember] = useState(false);
  const [passwordimgreadius, setPasswordimgreadius] = useState(Number);
  const [Radius1, setRadius1] = useState(Number);
  const [Radius2, setRadius2] = useState(Number);
  const [svg, setSvg] = useState([])
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { latitude, longitude, isLocationPermissionGranted, getLocation, checkLocationPermissionStatus, getLatLongValue } = useLocationHook();
  const { authToken, refreshToken } = useSelector(

    (state: RootState) => state.userInfo,
  );
  const [ShowOtpModal, setShowOtpModal] = useState(false);
  const [isVer, setIsVer] = useState(true);

  const { post, get } = useAxiosHook();


  const getDeviceInfo = useCallback(async () => {
    const buildId = await getBuildId();
    await getLocation();
    const brand = getBrand();
    setBrand(brand);

    const ip = await getIpAddress();
    setIpAddress(ip);

    const model = getModel();
    setModelNumber(model);

    const serialNum = await getUniqueId();
    setUniqueId(serialNum);

    const systemVersion = getSystemVersion();

    setCurrentAndroidVersion(systemVersion)
    console.log('**DATA')
  }, [])

  useEffect(() => {
    const onFocusCall = navigation.addListener('focus', async () => {
      // console.log('**DATA_PERM11_CALLED', isPhonePermissionGranted);
      console.log('**DATA_PERM77_CALLED', isLocationPermissionGranted);
      const Model = await getMobileDeviceId();
    })
    return onFocusCall;
  }, [navigation]);

  const extsvg = (svgarray) => {
    const result = {};
    svgarray.forEach((item) => {
      result[item.name] = item.svg;
    });
    return result;
  };
  const [loading, setLoading] = useState(true);

  const saveCredentials = async (id: string, password: string) => {
    try {
      await AsyncStorage.setItem('userId', id);
      await AsyncStorage.setItem('userPassword', password);
      console.log('Credentials saved successfully');
    } catch (error) {
      console.log('Error saving credentials: ', error);
    }
  };

  const getCredentials = async () => {
    try {
      const id = await AsyncStorage.getItem('userId');
      const password = await AsyncStorage.getItem('userPassword');

      if (id !== null && password !== null) {
        setUserEmail(id);
        setUserPassword(password);
        console.log('Retrieved credentials: ', id, password);
        return { id, password };
      } else {
        console.log('No credentials found');
        return null;
      }
    } catch (error) {
      console.log('Error retrieving credentials: ', error);
      return null;
    }
  };

  const removeCredentials = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userPassword');
      console.log('Credentials removed successfully');
    } catch (error) {
      console.log('Error removing credentials: ', error);
    }
  };



  useEffect(() => {
    // A function to get credentials and additional information
    const fetchData = async () => {
      //  checkUpldate();
      try {
        // Call the function to get device information
        getDeviceInfo();

        // Get model and log it (you may want to remove this or make it conditional)
        const model = await getMobileDeviceId();
        console.log(model, "Modelaaaaaaaa");

        // Fetch color settings from API
        const res = await get({ url: APP_URLS.getColors });
        if (res) {
          dispatch(
            setColorConfig({
              primaryColor: res.BACKGROUNDCOLOR1,
              secondaryColor: res.BACKGROUNDCOLOR2,
              primaryButtonColor: res.BUTTONCOLOR1,
              secondaryButtonColor: res.BUTTONCOLOR2,
              labelColor: res.LABLECOLOR,
            }),
          );
        }
console.log({
  primaryColor: res.BACKGROUNDCOLOR1,
  secondaryColor: res.BACKGROUNDCOLOR2,
  primaryButtonColor: res.BUTTONCOLOR1,
  secondaryButtonColor: res.BUTTONCOLOR2,
  labelColor: res.LABLECOLOR,
})
        // Fetch SVGs and update state
        const response = await post({ url: APP_URLS.signUpSvg });
        if (response && Array.isArray(response)) {
          setRadius1(response[0].Radius2);
          setRadius2(response[0].Radius3);

          // Assuming `extsvg` is a utility function to extract svg list
          const svgList = extsvg(response);
          setSvg(svgList);
        }



        if (authToken) {
          navigation.navigate('Dashboard');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'There was an issue fetching the data. Please try again.');
      } finally {
        // Set loading state to false when the async operations are complete
        setLoading(false);
      }
    };

    // Fetch data when component mounts or authToken changes
    fetchData();

    // Clean-up function (optional) if any cleanup is needed after component unmounts
    return () => {
      // Example cleanup logic (if needed)
      // setLoading(false); // Example: reset loading state if needed
    };

  }, [authToken, dispatch, get, navigation]); // Dependencies to trigger the effect



  // useEffect(() => {
  //   if(isLocationPermissionGranted){

  //       getLocation();
  //   }
  //   if(isPhonePermissionGranted){
  //     getSimPhoneNumber();
  //   }
  // },[isLocationPermissionGranted, isPhonePermissionGranted, getSimPhoneNumber, getLocation])
  const saveData = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Data saved successfully');
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };
  const { getMobileDeviceId, getSimPhoneNumber, isPhonePermissionGranted, checkPhoneStatePermissionStatus } = useDeviceInfoHook();
  const formatErrorCode = (code) => {
    return code.replace(/_/g, ' ')
      .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };
  const onPressLogin = useCallback(async (otp) => {
    setShowOtpModal(false);

    setIsLoading(true);
    const errorCodes = ['NotAllow', 'SENDOTP', 'invalid_client', 'invalid_grant'];

    //   let num;
    // if(!mobileNumber){
    //   const isPhoneStatePermission = await checkPhoneStatePermissionStatus();
    //   setIsLoading(false);
    //   if(!isPhoneStatePermission){
    //      num =  await getSimPhoneNumber();
    //     return;
    //   }
    //   num =  await getSimPhoneNumber();
    // }

    //  console.log('**MOB1', num)
    // const phoneNumbers = await getSimPhoneNumber();
    // let number = '';
    // if(phoneNumbers && phoneNumbers.length > 0){
    //   setMobileNumber(phoneNumbers[0].phoneNumber);
    //   number = phoneNumbers[0].phoneNumber;
    // }

    const encryption = encrypt([userEmail, userPassword, otp, mobileNumber, uniqueId, '', latitude, longitude, modelNumber, brand, ipAddress, '', '', '']);

    const data = {
      UserName: encryption.encryptedData[0],
      Password: encryption.encryptedData[1],
      'X-OTP': encryption.encryptedData[2],
      Mobile: encryption.encryptedData[3],
      Imei: encryption.encryptedData[4],
      Devicetoken: encryption.encryptedData[5],
      Latitude: encryption.encryptedData[6],
      Longitude: encryption.encryptedData[7],
      ModelNo: encryption.encryptedData[8],
      brandname: encryption.encryptedData[9],
      IPAddress: encryption.encryptedData[10],
      Address: encryption.encryptedData[11],
      City: encryption.encryptedData[12],
      PostalCode: encryption.encryptedData[13],
      InternetTYPE: encryption.encryptedData[14],
      grant_type: 'password',
    };
    console.log(data)
    const response = await post({
      url: APP_URLS.getToken,
      data,
      config: {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: 'bearer',
          value1: encryption.keyEncode,
          value2: encryption.ivEncode,
        },
      },
    });
    console.log('1', encryption.keyEncode, '2', encryption.ivEncode,);
    console.log('id', encryption.encryptedData[0]);
    console.log('password', encryption.encryptedData[1]);

    console.log('response', response, '????????????????????????????')
    setIsLoading(false);
    
    if (response?.access_token) {
      dispatch(setAuthToken(response?.access_token));
      dispatch(setUserId(response?.userId));
      dispatch(setRefreshToken(response?.refresh_token));
      dispatch(setUserRole(response.role))
      saveData(response?.access_token).then();
    
      const userInfo = await get({ url: APP_URLS.getUserInfo });
      const data = userInfo.data;
      const frmanems = decryptData(data.vvvv, data.kkkk, data.frmanems)
      const decryptedFrmanems = decryptData(data.vvvv, data.kkkk, data.frmanems);
      const photoss = decryptData(data.vvvv, data.kkkk, data.photoss);
      const adminfarmname = decryptData(data.vvvv, data.kkkk, data.adminfarmname);
      await AsyncStorage.setItem('adminFarmData', JSON.stringify({
        adminFarmName: adminfarmname,
        frmanems: decryptedFrmanems,
        photoss: photoss
      }));
      await AsyncStorage.setItem('role', response.role);

    }
    if (response.status === 'SUCCESS') {
      navigation.navigate({ name: 'Dashboard' });

      if (response.VideoKYC === 'VideoKYCDONE') {
        navigation.navigate({ name: 'Dashboard' });
      

      } else {
        navigation.navigate({ name: 'VideoKYC' });
      }

    } else if (errorCodes.includes(response.error)) {
      const formattedError = formatErrorCode(response.error);
      ToastAndroid.show(response.error_description, ToastAndroid.LONG);

      // Alert.alert(
      //   formattedError,
      //   response.error_description,
   
      //      [{ text: 'Close', onPress: () => console.log('Close Pressed') }],
      // );
      if (response.error === 'SENDOTP') {
        setShowOtpModal(true);
      }
    }


  }, [dispatch, navigation, post, userEmail, userPassword, isLocationPermissionGranted, isPhonePermissionGranted]);

  const onPressSignUp = () => {

    navigation.navigate("SignUpScreen", {
      svg, Radius2

    });
  }


  const ToggleSecureEntry = () => {
    setSecureEntry(!secureEntry)
  }
  const verifyOtp = async (otp) => {
    try {
      const res = await post({ url: `Common/api/data/CHECKPASSCODEPASSWORD?Passscodes=${otp}` })
      const status = res.Status;
      const role = await AsyncStorage.getItem('role');

      if (status == 'BOXNOTOPEN') {
        if (role == 'Retailer') {
          navigation.navigate({ name: 'Dashboard' });

        } else {

        }
      }


    } catch (error) {

    }
  }
  const checkUpldate = async () => {
    try {
      const version = await get({ url: ` ${APP_URLS.current_version}1.0.0` });
      console.log('version', version);

      if (version.currentversion === '1.0.8') {
        const aepscode = version.aepscode;

        await AsyncStorage.setItem('aepscode', aepscode);

        setIsVer(true);
      } else {
        setIsVer(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching version or saving aepscode:', error);
    }
  };

  const [fadeAnim] = useState(new Animated.Value(0));
  const [isAutofilled, setIsAutofilled] = useState(false);
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  if (isVer === false) {
    fadeIn();

    return (
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f5d']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 20,
            elevation: 5, // Add shadow effect for elevation (Android)
            shadowColor: '#000', // Shadow for iOS
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
              marginBottom: 20,
            }}
          >
            Update Available
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 20,
              color: '#555',
            }}
          >
            Sorry for the inconvenience, an updated application is available with some improvements.
            You can update it by clicking the button below. If you face any inconvenience, please
            uninstall the application and reinstall it.
          </Text>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`https://${APP_URLS.baseWebUrl}/Home/DownloadAPK`).catch(err =>
                console.error('Failed to open URL: ', err)
              );
            }}
            style={{
              backgroundColor: '#008CBA',
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginBottom: 10,
              elevation: 5,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Update Now
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 14,
              textAlign: 'center',
              color: '#888',
            }}
          >
            If the app doesn't update, please uninstall and reinstall the app.
          </Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  if (loading) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: '#87ceeb',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image source={require('../../../assets/images/app_logo.png')}
          style={[styles.imgstyle, {
            width: wScale(180),
            height: wScale(180),
          }]} resizeMode='contain' />
      </View>
    );
  }
  return (

    <View style={styles.main}>
      <LinearGradient
        colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}
        style={styles.gradientContainer}>
        <ScrollView keyboardShouldPersistTaps={"handled"}>
          <View
            style={styles.container}>
            <View style={[styles.Logocontainer,]}>
              <Image source={require('../../../assets/images/app_logo.png')}
                style={styles.imgstyle} resizeMode='contain' />
              <Text style={{ color: colorConfig.secondaryButtonColor ? colorConfig.secondaryButtonColor : 'white', fontWeight: 'bold' }}>
                {APP_URLS.AppName}
              </Text>
            </View>


            <View style={[styles.inputContainer, { borderRadius: Radius1 }]}>
              <View style={styles.InputImage}>

                <SvgUri
                  height={hScale(48)}
                  width={hScale(48)}
                  uri={svg.personUser}
                />

              </View>
              <TextInput
                style={[styles.textInput,]}
                cursorColor={'white'}
                placeholder={translate('emailOrMobile')}
                autoCapitalize="none"
                placeholderTextColor={'white'}
                value={userEmail}
                onChangeText={text => setUserEmail(text)}
              />
            </View>


            <View style={[styles.inputContainer, { borderRadius: Radius1 }]}>
              <View style={styles.InputImage}>
                <SvgUri
                  height={hScale(48)}
                  width={hScale(48)}
                  uri={svg.Password}
                />
              </View>
              <TextInput
                style={[styles.textInput,]}
                cursorColor={'white'}
                placeholder={translate('password')}
                value={userPassword}
                onChangeText={text => setUserPassword(text)}
                placeholderTextColor={'#fff'}
                secureTextEntry={secureEntry}

              />
              {userPassword.length >= 5 ? (
                <View style={styles.righticon}>
                  <TouchableOpacity onPressOut={ToggleSecureEntry} onPressIn={ToggleSecureEntry}>
                    <ShowEye color1="#fff" color2="#fff" />
                  </TouchableOpacity>
                </View>
              ) : ''}

            </View>
            <View style={styles.forgetrow}>
              <TouchableOpacity style={[styles.rememberow,]}
                onPress={() => {
                  setRemember(!remember);
                  if (remember) {
                    saveCredentials(userEmail, userPassword);
                  }

                }} >
                <TouchableOpacity
                  onPress={() => {
                    setRemember(!remember);
                    if (remember) {
                      saveCredentials(userEmail, userPassword);
                    }

                  }}
                  style={styles.remember}>
                  {remember ?
                    <CheckSvg size={8} />
                    : null}
                </TouchableOpacity>
                <Text style={[styles.forgettext, { paddingLeft: wScale(4) }]}>
                  Remember
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setShowForgotPasswordModal(true) }}
                style={styles.forgetbtn}
              >
                <Text style={styles.forgettext}>
                  {translate('forgotPassword')}<Text style={{ fontWeight: 'bold', fontSize: 15 }}>?</Text>
                </Text>
              </TouchableOpacity>

            </View>
            <DynamicButton title={
              isLoading ? <ActivityIndicator color={colorConfig.labelColor} size="large" /> :
                "Login"}
              onPress={() => {
                if (userEmail && userPassword) {
                  onPressLogin('');
                } else {
                  ToastAndroid.show("Please enter valid User ID and Password, you cannot leave it blank", ToastAndroid.SHORT);
                }
              }} styleoveride={undefined}

            />

            <View style={styles.signup_continer}>
              <Text style={styles.donthave_text}>
                {translate('signupText')}
              </Text>

              <TouchableOpacity onPress={onPressSignUp}>
                <Text
                  style={[styles.donthave_text, { fontWeight: 'bold', }]}>
                  {translate('signUp')}
                </Text>
              </TouchableOpacity>
            </View>
            <ForgotPasswordModal
              showForgotPasswordModal={showForgotPasswordModal}
              setShowForgotPasswordModal={setShowForgotPasswordModal}
              handleForgotPassword={undefined}
            />
            <OTPModal
              setShowOtpModal={setShowOtpModal}
              disabled={otp.length !== 6}
              showOtpModal={ShowOtpModal}
              setMobileOtp={setOtp}
              verifyOtp={() => {
                onPressLogin(otp)
              }}
              inputCount={6}
            />

          </View>
        </ScrollView>
      </LinearGradient>
    </View >
  );
};

const styles = StyleSheet.create({
  Logocontainer: {
    backgroundColor: 'rgba(255,255, 255, 0.5)',
    justifyContent: 'center',
    alignSelf: 'center',
    width: wScale(180),
    height: wScale(180),
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: hScale(40),
    padding: hScale(8)
  },
  imgstyle: {
    flex: 1
  },

  main: {
    flex: 1
  },
  gradientContainer: {
    width: '100%',
    height: '100%',
  },
  container: {
    paddingHorizontal: wScale(40),
    paddingTop: hScale(60),
  },
  inputContainer: {
    marginTop: hScale(24),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: 'white',
    borderWidth: 0.2,
    height: hScale(48),

  },
  InputImage: {
  },
  lotiimg: { flex: 1, height: wScale(35), width: wScale(35) },
  textInput: {
    flex: 1,
    fontSize: wScale(18),
    color: '#fff',
    // textAlign: 'center',                                                                                                                                                                                   
  },
  input: {
    color: 'black',
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    margin: wScale(5),
  },

  forgetrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: hScale(20),
    paddingTop: hScale(7),
  },
  rememberow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  remember: {
    borderWidth: wScale(.8),
    borderColor: '#fff',
    height: wScale(14),
    width: wScale(14),
    alignItems: 'center',
    marginRight: wScale(0),
    justifyContent: 'center',
    borderRadius: 4
  },
  forgetbtn: {
    backgroundColor: 'transparent',
  },
  forgettext: {
    fontSize: wScale(15),
    color: '#fff',

  },
  signup_continer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: hScale(20)
  },
  donthave_text: {
    fontSize: wScale(14.5),
    color: 'white', marginRight: wScale(4),
  },
  righticon: {
    justifyContent: 'center',
    marginRight: wScale(20),
    opacity: .3
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: wScale(10),
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },

  submitButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  resendText: {
    color: '#2196F3',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  resendButton: {
    marginTop: 10,
  },
});
export default LoginScreen;


