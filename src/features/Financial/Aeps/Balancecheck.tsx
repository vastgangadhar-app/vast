import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Image, ToastAndroid, Modal, Alert, Platform, PermissionsAndroid, Linking, AsyncStorage, ActivityIndicator } from 'react-native';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import AppBar from '../../drawer/headerAppbar/AppBar';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import { SCREEN_HEIGHT, hScale, wScale } from '../../../utils/styles/dimensions';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import DynamicButton from '../../drawer/button/DynamicButton';
import { FlashList } from '@shopify/flash-list';
import { BottomSheet } from '@rneui/base/dist/BottomSheet/BottomSheet';
import ClosseModalSvg from '../../drawer/svgimgcomponents/ClosseModal';
import { useDeviceInfoHook } from '../../../utils/hooks/useDeviceInfoHook';
import { RootState } from '../../../reduxUtils/store';
import { useSelector } from 'react-redux';
import { useLocationHook } from '../../../utils/hooks/useLocationHook';
import { AepsContext } from './context/AepsContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { ColorSpace } from 'react-native-reanimated';
import ShowLoader from '../../../components/ShowLoder';
import OnelineDropdownSvg from '../../drawer/svgimgcomponents/simpledropdown';
import BankBottomSite from '../../../components/BankBottomSite';
import SelectDevice from './DeviceSelect';
import { isDriverFound, openFingerPrintScanner } from 'react-native-rdservice-fingerprintscanner';
import LottieView from 'lottie-react-native';
import QrcodAddmoneysvg from '../../drawer/svgimgcomponents/QrcodAddmoneysvg';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useRdDeviceConnectionHook } from '../../../hooks/useRdDeviceConnectionHook';


const BalanceCheck = () => {


    const [servifee, setServifee] = useState('');
    const {setBankId,
        bankid, aadharNumber, setFingerprintData, setAadharNumber, mobileNumber, setMobileNumber, consumerName, setConsumerName, bankName, setBankName, scanFingerprint, fingerprintData, isValid, setIsValid, deviceName, setDeviceName } = useContext(AepsContext);
    const [imei, setImei] = useState('');
    const [responsefromaaadharscan, setResponsefromaaadharscan] = useState('');
    const [banklist, setBanklist] = useState([]);
    const [isbank, setisbank] = useState(false);
    const [Fdata, setFdata] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [status, setStatus] = useState('');
    const [amount, setamount] = useState('')
    const [date, setdate] = useState('')
    const [bnkrrn, setbnkrrn] = useState('')
    const [agentid, setagentid] = useState('');
    const [autofcs, setAutofcs] = useState(false);
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const [isLoading, setIsLoading] = useState(false)
    const dayOfWeek = days[now.getDay()];
    const dayOfMonth = now.getDate();
    const month = months[now.getMonth()];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month} ${hours}:${minutes}:${seconds}`;

    const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
        useDeviceInfoHook();
    const { userId } = useSelector((state: RootState) => state.userInfo);
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`
    const navigation = useNavigation();
    const color2 = `${colorConfig.primaryColor}40`
    const color3 = `${colorConfig.secondaryColor}15`
    const { latitude, longitude } = useLocationHook();
    const { get, post } = useAxiosHook();
    const [isScan, setIsScan] = useState(false);

    useEffect(() => {
    
        banks();
        if (fingerprintData === 720) {
            if (fingerprintData === 720) {
                return;
            } else if (fingerprintData["PidData"].Resp.errCode == 0) {
                OnPressEnq();
            }
        }
    }, [fingerprintData])


      
  

    const OnPressEnq = async (fingerprintData) => {
        const pidData = fingerprintData.PidData;
        const DevInfo = pidData.DeviceInfo;
        const Resp = pidData.Resp;


        const cardnumberORUID = {
            adhaarNumber: aadharNumber,
            indicatorforUID: "0",
            nationalBankIdentificationNumber: bankid
        };

        const captureResponse = {
            Devicesrno: DevInfo.additional_info.Param[0].value,
            PidDatatype: "X",
            Piddata: pidData.Data.content,
            ci: pidData.Skey.ci,
            dc: DevInfo.dc,
            dpID: DevInfo.dpId,
            errCode: Resp.errCode,
            errInfo: Resp.errInfo,
            fCount: Resp.fCount,
            fType: Resp.fType,
            hmac: pidData.Hmac,
            iCount: Resp.fCount,
            iType: "0",
            mc: DevInfo.mc,
            mi: DevInfo.mi,
            nmPoints: Resp.nmPoints,
            pCount: "0",
            pType: "0",
            qScore: Resp.qScore,
            rdsID: DevInfo.rdsId,
            rdsVer: DevInfo.rdsVer,
            sessionKey: pidData.Skey.content
        };
        BEnQ(captureResponse, cardnumberORUID);
        try {

          

        } catch (error) {
            console.error('Error during BEnQ:', error);
            Alert.alert('Error', 'An error occurred while processing your request. Please try again.');
        } finally {
            setIsLoading(true);
        }
    };
    // const BEnQ = async (captureResponse1, cardnumberORUID1) => {
    //     try {
    //         setIsLoading(true);
    //         const Model = await getMobileDeviceId();
    //         const address = 'vwi';
    //         const jdata = {
    //             captureResponse: captureResponse1,
    //             cardnumberORUID: cardnumberORUID1,
    //             languageCode: 'en',
    //             latitude: latitude,
    //             longitude: longitude,
    //             mobileNumber: mobileNumber,
    //             merchantTranId: userId,
    //             merchantTransactionId: userId,
    //             paymentType: 'B',
    //             otpnum: '',
    //             requestRemarks: 'TN3000CA06532',
    //             subMerchantId: 'A2zsuvidhaa',
    //             timestamp: formattedDate,
    //             transactionType: 'BE',
    //             name: consumerName,
    //             address: address,
    //             transactionAmount: ''
    //         };

    //         const headers = {
    //             'trnTimestamp': formattedDate,
    //             'deviceIMEI': Model,
    //             "Content-type": "application/json",
    //             "Accept": "application/json",
    //         };

    //         console.log('headers', headers);
    //         const data = JSON.stringify(jdata);
    //         console.log('Request Data:', data);

    //         const response = await post({
    //             url: 'AEPS/api/app/AEPS/balanceEnquiry',
    //             data,
    //             config: {
    //                 headers,
    //             },
    //         });
    //         const responseString = JSON.stringify(response, null, 2);


    //         console.log('Response:', responseString);  
    //             console.log('Response:', response);
    //         const { RESULT, ADDINFO } = response;
    //         setIsLoading(false);
    //         setFingerprintData(720);
    //     const deviceInfoString = JSON.stringify(responseString, null, 2);
    //     const path = RNFS.DownloadDirectoryPath + `/deviceInfo-captureFinger-balanceEnquiry.json`;

    //     // Write the error to a file
    //     RNFS.writeFile(path, deviceInfoString, 'utf8')
    //       .then(() => {
    //         console.log('Error JSON saved to Download directory');
    //       })
    //       .catch((error) => {
    //         console.error('Error writing file:', error);
    //         //Alert.alert('Error', 'Failed to save error file');
    //       });
    //         if (RESULT == 0) {
    //             const { TransactionStatus, BankRrn, BalanceAmount, RequestTransactionTime } = ADDINFO;
    //             Alert.alert(`Transaction Status`, `Transaction Status: ${TransactionStatus}\nBank RRN: ${BankRrn}\nBalance Amount: ${BalanceAmount}\nRequest Transaction Time: ${RequestTransactionTime}`);
    //         } else if (RESULT == 1) { 
    //             Alert.alert('Message', ADDINFO);

    //         }
    //     } catch (error) {
    //         console.error('Error during balance enquiry:', error);
    //     }
    // };

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

    const BEnQ = async (captureResponse1, cardnumberORUID1) => {
        const loc = await readLatLongFromStorage()
        try {
            setIsLoading(true);
            const Model = await getMobileDeviceId();
            const address = loc?.latitude;
            const jdata = {
                captureResponse: captureResponse1,
                cardnumberORUID: cardnumberORUID1,
                languageCode: 'en',
                latitude: loc?.latitude,
                longitude: loc?.longitude,
                mobileNumber: mobileNumber,
                merchantTranId: userId,
                merchantTransactionId: userId,
                paymentType: 'B',
                otpnum: '',
                requestRemarks: 'TN3000CA06532',
                subMerchantId: 'A2zsuvidhaa',
                timestamp: formattedDate,
                transactionType: 'BE',
                name: consumerName,
                Address: address,
                transactionAmount: ''
            };

            const headers = {
                'trnTimestamp': formattedDate,
                'deviceIMEI': Model,
                "Content-type": "application/json",
                "Accept": "application/json",
            };

            console.log('headers', headers);
            const data = JSON.stringify(jdata);
            console.log('Request Data:', data);

         

            const response = await post({
                url: 'AEPS/api/app/AEPS/balanceEnquiry',
                data: data,
                config: {
                    headers,
                },
            });
              
         

            const { RESULT, ADDINFO } = response;
            setIsLoading(false);
            setFingerprintData(720);

            if (RESULT && RESULT.toString() === '0') {
                const { TransactionStatus, BankRrn, BalanceAmount, RequestTransactionTime } = ADDINFO;

                navigation.navigate("AepsRespons", {

                    ministate: {
                        bankName,
                        Name: consumerName,
                        Aadhar: aadharNumber,
                        mobileNumber: mobileNumber,
                        RequestTransactionTime: RequestTransactionTime,
                        BalanceAmount: BalanceAmount,
                        TransactionStatus: TransactionStatus,
                        BankRrn: BankRrn,

                    },
                    mode: 'BAL CHECK'
                })



                // Alert.alert(


                //     'Transaction Status',
                //     `Transaction Status: ${TransactionStatus}\nBank RRN: ${BankRrn}\nBalance Amount: ${BalanceAmount}\nRequest Transaction Time: ${RequestTransactionTime}`
                // );
            } else if (RESULT.toString() === '1') {
                Alert.alert('Message', ADDINFO == null ? 'Transaction Failed ' : ADDINFO);
            }

        } catch (error) {
            console.error('Error during balance enquiry:', error);
        }
    };


    async function adhar_Validation(adharnumber) {
        try {
            const response = await get({ url: `${APP_URLS.aadharValidation}${adharnumber}` })
            console.log(response);
            if (response['status'] === true) {
                setIsValid(true);
            } else {
                setIsValid(false);
                ToastAndroid.showWithGravity(
                    `Please Enter Valid Aadhar number`,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                );

            }

        } catch (error) {

        }

    }
    const aepsresponsepress = () => {

    };
    // const saveJsonToFile = async (jsonData) => {
    //     try {
    //         const path = RNFS.DownloadDirectoryPath + '/data.json';

    //         await RNFS.writeFile(path, JSON.stringify(jsonData), 'utf8');

    //         console.log('File saved successfully:', path);
    //     } catch (error) {
    //         console.error('Error saving file:', error);
    //     }
    // };
    // const captureResponse = {
    //     "Devicesrno": fingerprintData.PidData.DeviceInfo.additional_info.Param.srno,
    //     "PidDatatype": "X",
    //     "Piddata": fingerprintData.PidData.Data.content,
    //     "ci": fingerprintData.PidData.Skey.ci,
    //     "dc": fingerprintData.PidData.DeviceInfo.dc,
    //     "dpID": fingerprintData.PidData.DeviceInfo.dpId,
    //     "errCode": fingerprintData.PidData.Resp.errCode,
    //     "errInfo": fingerprintData.PidData.Resp.errInfo,
    //     "fCount": fingerprintData.PidData.Resp.fCount,
    //     "fType": fingerprintData.PidData.Resp.fType,
    //     "hmac": fingerprintData.PidData.Hmac,
    //     "iCount": fingerprintData.PidData.Resp.fCount,
    //     "iType": "0",
    //     "mc": fingerprintData.PidData.DeviceInfo.mc,
    //     "mi": fingerprintData.PidData.DeviceInfo.mi,
    //     "nmPoints": fingerprintData.PidData.Resp.nmPoints,
    //     "pCount": "0",
    //     "pType": "0",
    //     "qScore": fingerprintData.PidData.Resp.qScore,
    //     "rdsID": fingerprintData.PidData.DeviceInfo.rdsId,
    //     "rdsVer": fingerprintData.PidData.DeviceInfo.rdsVer,
    //     "sessionKey": fingerprintData.PidData.Skey.content
    // };

    // const cardnumberORUID = {
    //     adhaarNumber: aadharNumber,
    //     indicatorforUID: "0",
    //     nationalBankIdentificationNumber: ""
    // };


    async function getUserNamefunction(MoNumber) {
        try {
            const response = await get({ url: `${APP_URLS.aepsNameinfo}${MoNumber}` })
            setAutofcs(true);
            setConsumerName(response.RESULT);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    // const checkAndRequestPermissions = async () => {
    //     if (Platform.OS === 'android') {
    //         try {
    //             const granted = await PermissionsAndroid.request(
    //                 PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //                 {
    //                     title: 'Storage Permission',
    //                     message: 'App needs access to storage to save fingerprint data.',
    //                     buttonNeutral: 'Ask Me Later',
    //                     buttonNegative: 'Cancel',
    //                     buttonPositive: 'OK',
    //                 }
    //             );
    //             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //                 //saveJsonToFile(fingerprintData);
    //             } else {
    //                 console.log('Storage permission denied');
    //                 Alert.alert(
    //                     'Permission Denied',
    //                     'Storage permission is required to save fingerprint data.',
    //                     [
    //                         { text: 'Open Settings', onPress: () => Linking.openSettings() },
    //                         { text: 'Cancel', style: 'cancel' }
    //                     ]
    //                 );
    //             }
    //         } catch (err) {
    //             console.warn(err);
    //         }
    //     }
    // };
    const checkAepsStatus = async () => {
        try {
            const respone = await get({ url: `${APP_URLS.checkaepsStatus}` });
            if (respone['Response'] === true) {
            } else {
                ToastAndroid.showWithGravity(
                    `${respone['Message']}`,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                );
            }


        } catch (error) {
            console.log(error);


        }
    };


    const banks = async () => {
        try {
            const response = await post({ url: `${APP_URLS.aepsBanklist}` })

            if (response.RESULT === '0') {
                setBanklist(response['ADDINFO']['data'])
            }
        } catch (error) {

        }
    };


    const handleClose = () => {
        setIsVisible(false);
    };



    const handleUploadVideo = () => {
        setIsVisible(false);
    };

    const capture = async (rdServicePackage) => {
        let pidOptions = '';
        const aepscode = await AsyncStorage.getItem('aepscode');

        switch (rdServicePackage) {
            case 'com.mantra.mfs110.rdservice':
                pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
                break; case 'com.mantra.rdservice':
                pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
                break;
            case 'com.acpl.registersdk_l1':
                pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh=""/> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
                break; case 'com.acpl.registersdk':
                pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh=""/> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
                break;
            case 'com.idemia.l1rdservice':
                //pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <Demo></Demo> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
                pidOptions = `<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="20000" wadh="" posh="UNKNOWN" /><Demo></Demo><CustOpts><Param name="" value="" /></CustOpts></PidOptions>`;
                break; case 'com.scl.rdservice':
                // pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pType="" pCount="0"  format="0" pidVer="2.0" timeout="20000"  posh="UNKNOWN" env="P" /> <Demo></Demo> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
                pidOptions = `<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="20000" wadh="" posh="UNKNOWN" /><Demo></Demo><CustOpts><Param name="" value="" /></CustOpts></PidOptions>`;
                break;
            default:
                console.error('Unsupported rdServicePackage');
                return;
        }

        openFingerPrintScanner(rdServicePackage, pidOptions)

            .then(async (res) => {
                const deviceInfoString = JSON.stringify(res, null, 2);
                // await post({ url: 'AEPS/api/Aeps/ErrorMessage', data: { Message: JSON.stringify(res) } });

                // const path = RNFS.DownloadDirectoryPath + `/deviceInfo-capture-today--Finger.json`;

                // Write the response to a file
                // RNFS.writeFile(path, deviceInfoString, 'utf8')
                //   .then(() => {
                //     console.log('JSON saved to Download directory');
                //   })
                //   .catch((error) => {
                //     console.error('Error writing file:', error);
                //     // Alert.alert('Error', 'Failed to save file');
                //   });

                // Handle different response cases
                if (res.errorCode === 720) {
                    setFingerprintData(720);
                    console.log('setFingerprintData', res.errInfo, res.message);
                } else if (res.status === -1) {
                    setFingerprintData(-1);
                } else if (res.errorCode === 0) {

                    OnPressEnq(res.pidDataJson);
                    console.log('setFingerprintData', res);

                    const responseString = JSON.stringify(res.pidDataJson, null, 2);
                    //    Alert.alert('Tab Fingerprint Data', responseString);

                }
            })
            .catch(async (error) => {
                // await post({ url: 'AEPS/api/Aeps/ErrorMessage', data: { Message: JSON.stringify({
                //   message: error?.message,
                //   line: error?.line,
                //   column: error?.column
                // }) } });
                setFingerprintData(720);
                Alert.alert('Please check if the device is connected.');
            });
    };


    const handleSelection = (selectedOption) => {

        if (deviceName === 'Device') {
            ToastAndroid.showWithGravity('Please Select Your Device', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            return;
        }
        const captureMapping = {
            'mantra L0': 'com.mantra.rdservice',
            'mantra L1': 'com.mantra.mfs110.rdservice',
            'startek L0': 'com.acpl.registersdk',
            'startek L1': 'com.acpl.registersdk_l1',
            'morpho L0': 'com.scl.rdservice',
            'morpho L1': 'com.idemia.l1rdservice',
        };

        console.log(captureMapping[selectedOption])
        if (captureMapping[selectedOption]) {
            isDriverFound(captureMapping[selectedOption])
                .then((res) => {             capture(captureMapping[selectedOption]);


                    //  alert(`Capture Mapping: ${captureMapping[selectedOption]}\nResponse: ${JSON.stringify(res)}`);

                })
                .catch((error) => {
                    console.error('Error finding driver:', error);
                    alert('Error: Could not find the selected driver.');
                });
        } else {
            alert('Invalid option selected');
        }
    };
    const onSuccess = (e) => {
        console.log(e);
        setisScan2(false);
        const data = e.data;
        
        const obj = {};
        const regex = /([a-zA-Z0-9]+)="([^"]+)"/g;
        let match;
        
        while ((match = regex.exec(data)) !== null) {
          obj[match[1]] = match[2];
        }
     setAadharNumber(obj.uid)
     setConsumerName(obj.name)
        console.log(obj)
        // Linking.openURL(e.data).catch((err) => console.error('An error occurred', err));
    };
    const [isScan2, setisScan2] = useState(false)
    if (isScan2) {
        return   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ alignItems: 'center', position: 'absolute', top: 30, right: 20 }}>
          <TouchableOpacity
            onPress={() => setisScan2(false)}
            style={{
              backgroundColor: '#ff4d4d',
              padding: 10,
              borderRadius: 10,
              width:hScale(40),
              height:hScale(40),
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 20 }}>X</Text>
          </TouchableOpacity>
        </View>

        {/* QR Code Scanner */}
        <QRCodeScanner onRead={onSuccess} />
      </View>
    }

    return (
        <View style={styles.main}>

            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.body}>


                        <View style={{}}>

                            <FlotingInput
                                label="Enter Aadhar Number"
                                value={aadharNumber}
                                maxLength={12}
                                onChangeText={setAadharNumber}
                                keyboardType="numeric"
                                onChangeTextCallback={(text) => {
                                    setAadharNumber(text);
                                    if (text.length === 12) {
                                        adhar_Validation(text)
                                    } else {
                                        setIsValid(false)

                                    }

                                }}
                            />

                            <View style={[styles.righticon2]}>

                                <TouchableOpacity
                                    onPress={() => {

                                        setisScan2(true)
                                    }}
                                >
                                    <QrcodAddmoneysvg />

                                </TouchableOpacity>
                            </View>
                        </View>


                        <FlotingInput
                            label="Enter Mobile Number"
                            value={mobileNumber}
                            maxLength={10}

                            onChangeText={setMobileNumber}
                            keyboardType="numeric"
                            onChangeTextCallback={(text) => {
                                setMobileNumber(text);
                                if (text.length === 10) {
                                    getUserNamefunction(text);
                                }

                            }}
                        />
                        {isLoading ? (
                            <ShowLoader />
                        ) : null}
                        <FlotingInput
                            label="Enter Consumer Name"
                            value={consumerName}
                            onChangeText={setConsumerName}
                            autoFocus={autofcs}
                            onChangeTextCallback={(text) => {
                                setConsumerName(text);

                            }}

                        />
                        <TouchableOpacity
                            style={{}}
                            onPress={() => { setisbank(true) }}
                        >
                            <>
                                <FlotingInput
                                    editable={false}
                                    label={bankName.toString()}
                                    onChangeText={setServifee}
                                    placeholder={bankName ? "" : "Select Your Bank"}
                                    keyboardType="numeric"
                                    onChangeTextCallback={(text) => {
                                        setServifee(text);
                                    }}
                                    inputstyle={styles.inputstyle}
                                />
                            </>
                            <View style={styles.righticon}>
                                <OnelineDropdownSvg />
                            </View>
                        </TouchableOpacity>
                        <SelectDevice setDeviceName={setDeviceName} device={'Device'} opPress={() => { setDeviceName(deviceName); }} />
                        <View style={{ marginBottom: hScale(18) }} />
                        {/* <TouchableOpacity onPress={aepsresponsepress}>
                <Text style={{ color: 'red' }}>
                    Aeps Respons
                </Text>
            </TouchableOpacity> */}
                        <DynamicButton
                            onPress={() => {
                                if (bankName === 'Select Bank' || mobileNumber.length < 10 || consumerName === null || aadharNumber.length < 12 || isValid === false) {

                                } else {

                                    console.log(deviceName);
                                    handleSelection(deviceName)

                                    // if (fingerprintData == 720) {
                                    //     setIsScan(true);
                                    //     scanFingerprint();
                                    // } else {
                                    //     OnPressEnq();
                                    // }
                                }
                            }}
                            //onPress={CaptureFinger}
                            title={<Text>{'Scan & Proceed'}</Text>}
                        />
                    </View>
                </View>
            </ScrollView>
            <BankBottomSite
                setBankId={setBankId}

                bankdata={banklist}
                isbank={isbank}
                setBankName={setBankName}
                setisbank={setisbank}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
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
    closebuttoX: {
        elevation: 5,
    },
    container: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wScale(20),
        flex: 1,
        paddingBottom: hScale(20)
    },

    dialog: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: hScale(10),
        color: '#007bff',
    },
    detailText: {
        marginBottom: 5,
        fontSize: 16,
    },

    operatornametext: {
        textTransform: 'capitalize',
        fontSize: wScale(16),
        color: '#000',
        flex: 1,
        borderBottomColor: '#000',
        borderBottomWidth: wScale(.5),
        alignSelf: 'center',
        paddingVertical: hScale(30),
    },
    bottomsheetview: {
        backgroundColor: '#fff',
        height: SCREEN_HEIGHT / 1.3,
        marginHorizontal: wScale(0),
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },

    StateTitle: {
        paddingVertical: hScale(10),
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: wScale(10),
        marginBottom: hScale(10)
    },
    stateTitletext: {
        fontSize: wScale(22),
        color: '#000',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    stateTitletext2: {
        fontSize: wScale(17),
        color: '#000',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    titleview: {
        flex: 1,
        alignItems: 'center'
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: hScale(10),
    },
    body: {
        paddingTop: hScale(10),
    },
    inputstyle: {

        marginBottom: hScale(0),
    },
    operatorview: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: wScale(10),
    },
    righticon: {
        position: "absolute",
        left: "auto",
        right: wScale(0),
        top: hScale(0),
        height: "100%",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingRight: wScale(12),
    },


});

export default BalanceCheck;

