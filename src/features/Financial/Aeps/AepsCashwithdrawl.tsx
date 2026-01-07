import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Image, ToastAndroid, Modal, Alert, AsyncStorage } from 'react-native';
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
import { AepsContext } from './context/AepsContext';
import OnelineDropdownSvg from '../../drawer/svgimgcomponents/simpledropdown';
import BankBottomSite from '../../../components/BankBottomSite';
import { useLocationHook } from '../../../utils/hooks/useLocationHook';
import ShowLoader from '../../../components/ShowLoder';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import SelectDevice from './DeviceSelect';
import { isDriverFound, openFingerPrintScanner } from 'react-native-rdservice-fingerprintscanner';
import { useNavigation } from '../../../utils/navigation/NavigationService';
import QrcodAddmoneysvg from '../../drawer/svgimgcomponents/QrcodAddmoneysvg';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useRdDeviceConnectionHook } from '../../../hooks/useRdDeviceConnectionHook';

const AepsCW = () => {

    const [lodervisi, setLodervisi] = useState(false);
    const {setBankId,
        bankid, aadharNumber, setFingerprintData, setAadharNumber, mobileNumber, setMobileNumber, consumerName, setConsumerName, bankName, setBankName, scanFingerprint, fingerprintData, isValid, setIsValid, deviceName, setDeviceName } = useContext(AepsContext);
    const [amountcont, setAmountcont] = useState('');
    const [servifee, setServifee] = useState('');
    const [otpcontroller, setOtpcontroller] = useState('');
    const [bankname, setBankname] = useState('Select Your Bank');
    const [paybtn, setPaybtn] = useState(true);
    const [otpservisi, setOtpservisi] = useState(false);
    const [showdetatis, setShowdetatis] = useState(false);
    const [aeps2Visible, setAeps2Visible] = useState(false);
    const [aepsType, setAepsType] = useState('AEPSService1');
    const [viewVisible, setViewVisible] = useState(true);
    const [viewVisible1, setViewVisible1] = useState(false);
    const [uniqueid, setUniqueid] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [responsefromaaadharscan, setResponsefromaaadharscan] = useState('');
    const [adharIsValid, setadharIsValid] = useState(false);
    const [banklist, setBanklist] = useState([]);
    const [isbank, setisbank] = useState(false);
    const navigation = useNavigation<any>();

    const [isVisible, setIsVisible] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [status, setStatus] = useState('');
    const [amount, setamount] = useState('')
    const [date, setdate] = useState('')
    const [bnkrrn, setbnkrrn] = useState('')
    const [agentid, setagentid] = useState('');
    const [autofcs, setAutofcs] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const dayOfWeek = days[now.getDay()];
    const dayOfMonth = now.getDate();
    const month = months[now.getMonth()];
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const formattedDate = `${dayOfWeek} ${dayOfMonth} ${month} ${hours}:${minutes}:${seconds}`;
 
    const { getNetworkCarrier, getMobileDeviceId, getMobileIp, getMobilePhoneNumber } =
        useDeviceInfoHook();
    const { userId } = useSelector((state: RootState) => state.userInfo);
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`
    const color2 = `${colorConfig.primaryColor}40`
    const color3 = `${colorConfig.secondaryColor}15`
    const { latitude, longitude } = useLocationHook();
    const [isScan, setIsScan] = useState(false);

    const { get, post } = useAxiosHook();
    useEffect(() => {
     
     //   checkAepsStatus();
        const banks = async () => {
            try {
                const response = await post({ url: `${APP_URLS.aepsBanklist}` })
    
                if (response.RESULT === '0') {
                    setBanklist(response['ADDINFO']['data'])
                }
            } catch (error) {
    
            }
        };
        if (fingerprintData == 720) {
            if (fingerprintData === 720) {
                return;
            } else if (fingerprintData["PidData"].Resp.errCode === 0 && isScan) {
                OnPressEnq();
            }
        }
        banks();
    }, [fingerprintData])



    async function getUserNamefunction(MoNumber) {
        try {
            const response = await get({ url: `${APP_URLS.aepsNameinfo}${MoNumber}` })
            setAutofcs(true);
            setConsumerName(response.RESULT);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const checkvideo = async (transamount, agentid, AddharpayResponse) => {
        try {
            const response = await post({ url: `${APP_URLS.checkadharpayvideo}?transamount=${transamount}&agentid=${agentid}` });

            const { ADDINFO, RESULT } = await response.json();

            setIsLoading(false)


            if (RESULT === '0') {
                Alert.alert(
                    "Required",
                    "For this transaction Video Verification is Required.",
                    [
                        {
                            text: "OK",
                            onPress: () => {
                               
                            },
                            style: "default"
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                const addinfo = AddharpayResponse.ADDINFO
              
              aepsresponsepress(addinfo);

            };
        } catch (error) {
            console.error(error);
        }
    }
    const checkAepsStatus = async () => {
        try {
            const respone = await get({ url: `${APP_URLS.checkaepsStatus}` });
            if (respone['Response'] === true) {
                videostatus();
            } else {
                ToastAndroid.showWithGravity(
                    `${respone['Message']}`,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                );
            }
            console.log(respone['Response']);
            console.log(respone['Message']);

        } catch (error) {
            console.log(error);


        }
    };
    const uploadvideo = async (video, Agentid) => {
        try {
            const respone = post({ url: `${APP_URLS.checkadharpayvideo}Videolink=${video}&agentid=${Agentid}` });

            console.log(respone);
        } catch (error) {

        }
    };
    const handleSelection = (selectedOption) => {
        if (deviceName === 'Device') {
            ToastAndroid.showWithGravity('Please Select Your Device', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
            return;
        }
        console.log(selectedOption)
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
  

    const videostatus = async () => {
        try {
            const response = await get({ url: `${APP_URLS.adharpayvideostatus}` })
            if (response.Status === true) {

                setShowDialog(false);
            } else {
                setShowDialog(true);
                setAadharNumber(response.Aadhar);
                setagentid(response.txnid);
                setbnkrrn(response.bankrrn);
                setagentid(response.txnid);
                setamount(response.amount);
                setdate(response.txndate);

            }


        } catch (error) {

        }
    };
    const sendOtp = async () => {
        try {

            const response = await post({
                url: `${APP_URLS.adharpaysendotp}amount=${amountcont}&usermobile=${mobileNumber}`
            });
            if (response.status === "1") {
                ToastAndroid.showWithGravity(
                    `sending otp failed,${response.ADDINFO}`,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                );
            } else {
                setOtpservisi(true);
            }
            console.log(response.status, response.ADDINFO);
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    };

    const OnPressEnq = async (fingerprintData) => {
        setIsLoading(true); 

        
        if (!fingerprintData || !fingerprintData["PidData"]) {
            Alert.alert('Error', 'Invalid fingerprint data. Please try again.', [{ text: 'OK', onPress: () => { } }]);
            setIsLoading(false);  
            return;
        }

        if (!aadharNumber || !bankid) {
            Alert.alert('Error', 'Aadhar number and Bank ID are required.', [{ text: 'OK', onPress: () => { } }]);
            setIsLoading(false);  
            return;
        }

        const cardnumberORUID = {
            adhaarNumber: aadharNumber,
            indicatorforUID: "0", 
            nationalBankIdentificationNumber: bankid,
        };

        const captureResponse = {
            Devicesrno: fingerprintData["PidData"]['DeviceInfo'].additional_info.Param[0]['value'],
            PidDatatype: "X",
            Piddata: fingerprintData["PidData"]['Data'].content,
            ci: fingerprintData["PidData"].Skey.ci,
            dc: fingerprintData["PidData"].DeviceInfo.dc,
            dpID: fingerprintData["PidData"].DeviceInfo.dpId,
            errCode: fingerprintData["PidData"].Resp.errCode,
            errInfo: fingerprintData["PidData"].Resp.errInfo,
            fCount: fingerprintData["PidData"].Resp.fCount,
            fType: fingerprintData["PidData"].Resp.fType,
            hmac: fingerprintData["PidData"].Hmac,
            iCount: fingerprintData["PidData"].Resp.fCount,
            iType: "0",
            mc: fingerprintData["PidData"].DeviceInfo.mc,
            mi: fingerprintData["PidData"].DeviceInfo.mi,
            nmPoints: fingerprintData["PidData"].Resp.nmPoints,
            pCount: "0",
            pType: "0",
            qScore: fingerprintData["PidData"].Resp.qScore,
            rdsID: fingerprintData["PidData"].DeviceInfo.rdsId,
            rdsVer: fingerprintData["PidData"].DeviceInfo.rdsVer,
            sessionKey: fingerprintData["PidData"].Skey.content,
        };

        try {
            await BEnQ(captureResponse, cardnumberORUID);
            setIsLoading(false);
            /// Alert.alert('Success', 'Fingerprint data submitted successfully.', [{ text: 'OK', onPress: () => {} }]);
        } catch (error) {
            console.error('Error during fingerprint data submission:', error);

            // Stop loading if error occurs
            setIsLoading(false);

            // Show error message to the user
            Alert.alert('Error', 'There was an issue submitting the fingerprint data. Please try again later.', [{ text: 'OK', onPress: () => { } }]);
        }
    };

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


        const lac = await readLatLongFromStorage();

        try {
            const Model = await getMobileDeviceId();
            const address = lac?.latitude + lac?.longitude;

            const jdata = {
                captureResponse: captureResponse1,
                cardnumberORUID: cardnumberORUID1,
                languageCode: 'en',
                latitude: lac?.latitude,
                longitude: lac?.longitude,
                mobileNumber: mobileNumber,
                merchantTranId: userId,
                merchantTransactionId: userId,
                paymentType: 'B',
                otpnum: otpcontroller,
                requestRemarks: 'TN3000CA06532',
                subMerchantId: 'A2zsuvidhaa',
                timestamp: formattedDate,
                transactionType: 'CW',
                name: consumerName,
                Address: address,
                transactionAmount: amountcont
            };

            const headers = {
                trnTimestamp: formattedDate,
                deviceIMEI: Model,
                "Content-type": "application/json",
                "Accept": "application/json",
            };

            const data = JSON.stringify(jdata);

            const response = await post({
                url: 'AEPS/api/app/Aeps/cashWithdrawal',
                data: data,
                config: {
                    headers,
                },
            });


            // const path = RNFS.DownloadDirectoryPath + `/MiniStatement_${Date.now()}.json`; 
            // await RNFS.writeFile(path, JSON.stringify(response, null, 2), 'utf8')
            //     .then(() => {
            //         Alert.alert('Success', 'Response saved to Downloads folder');
            //     })
            //     .catch(err => {
            //         console.error('Error saving file:', err);
            //         Alert.alert('Error', 'Failed to save the file');
            //     });
            const { RESULT, ADDINFO, agentid } = response;
            setFingerprintData(720);
            setIsLoading(false)
            if (RESULT === '0') {
                 const addinfo = ADDINFO;
                aepsresponsepress(addinfo);

                checkvideo(amount, agentid, response)
            } else {
                Alert.alert(`Note:`, ADDINFO);
            }
        } catch (error) {
            console.error('Error during balance enquiry:', error);
        }
    };
    const handleClose = () => {
        setIsVisible(false);
    };
    const handleUploadVideo = () => {
        setIsVisible(false);
    };
    const AepsVideoResponseDialog = ({ status, amount, date, bnkrrn, aadharNumber, agentid }) => {
        const [isVisible, setIsVisible] = useState(true);


        return (
            <Modal
                visible={isVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsVisible(false)}
            >
                <View style={styles.container}>
                    <View style={styles.dialog}>
                        <Text style={styles.title}>Transaction Details</Text>
                        <Text style={styles.detailText}>Transaction Status: {status}</Text>
                        <Text style={styles.detailText}>Bank RRN: {bnkrrn}</Text>
                        <Text style={styles.detailText}>Date & Time: {date}</Text>
                        <Text style={styles.detailText}>Amount: ₹{amount}</Text>
                        <Text style={styles.detailText}>Aadhar Number: {aadharNumber}</Text>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleUploadVideo}
                        >
                            <Text style={styles.buttonText}>Upload Video Now</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: '#dc3545' }]}
                            onPress={handleClose}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    };
    const AadharResponseDialog = ({
        isVisible,
        onClose,
        trnstatus,
        trnbnkrrn,
        datee,
        trnsamount,
        remamount,
        bankname,
    }) => {
        return (
            <Modal
                visible={isVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={onClose}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Aadhar Pay Receipt</Text>
                        </View>
                        <View style={styles.modalContent}>
                            <Text style={styles.contentText}>Transaction Status: {trnstatus}</Text>
                            <Text style={styles.contentText}>Bank RRN: {trnbnkrrn}</Text>
                            <Text style={styles.contentText}>Date & Time: {datee}</Text>
                            <Text style={styles.contentText}>Amount: ₹{trnsamount}</Text>
                            <Text style={styles.contentText}>Remain Amount: ₹{remamount}</Text>
                            <Text style={styles.contentText}>Bank Name: {bankname}</Text>
                        </View>
                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.footerButton}
                                onPress={() => {
                                }}
                            >
                                <Text style={styles.footerButtonText}>Share Receipt</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.footerButton}
                                onPress={onClose}
                            >
                                <Text style={styles.footerButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
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
               
                if (res.errorCode === 720) {
                    setFingerprintData(720);
                } else if (res.status === -1) {
                    setFingerprintData(-1);
                } else if (res.errorCode === 0) {

                    OnPressEnq(res.pidDataJson);

                    //    Alert.alert('Tab Fingerprint Data', responseString);

                }
            })
            .catch(async (error) => {
             
                setFingerprintData(720);
                Alert.alert('Please check if the device is connected.');
            });
    };
    // const aepsresponsepress = () => {
    //     navigation.navigate("AepsRespons", {
    //         ministate: {
    //             TransactionStatus: 'Sucess',
    //             BankRrn: 'BankRrn',
    //             TransactionAmount: '3000',
    //             BalanceAmount: '50000'

    //         },
    //         mode: 'AEPS'
    //     })
    // };

     const aepsresponsepress = (addinfo) => {
        // "Transaction Details",
        //             `Status: ${ADDINFO.TransactionStatus}\n` +
        //             `Bank RRN: ${ADDINFO.BankRrn}\n` +
        //             `Transaction Amount: ${ADDINFO.TransactionAmount}\n` +
        //             `Balance Amount: ${ADDINFO.BalanceAmount}`,
        const ministate={
            bankName,
            TransactionStatus:addinfo.TransactionStatus,
            Name:consumerName,
            Aadhar:aadharNumber,
            mobileNumber:mobileNumber,
            BankRrn:addinfo.BankRrn,
            TransactionAmount:addinfo.TransactionAmount,
            RequestTransactionTime:formattedDate,
            BalanceAmount:addinfo.BalanceAmount
        }

        navigation.navigate("AepsRespons", {
            
            ministate: 
                ministate,
            mode: 'AEPS'
        })
    };

    const onSuccess = (e) => {
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
                            onChangeText={setMobileNumber}
                            keyboardType="numeric"
                            onChangeTextCallback={(text) => {
                                setMobileNumber(text);
                                if (text.length === 10) {
                                    getUserNamefunction(text);
                                }

                            }}
                        />
                        <FlotingInput
                            label="Enter Consumer Name"
                            value={consumerName}
                            onChangeText={setConsumerName}
                            autoFocus={autofcs}
                            onChangeTextCallback={(text) => {
                                setConsumerName(text);

                            }}
                        />
                        <FlotingInput
                            label="Enter Amount"
                            value={amountcont}
                            onChangeText={setAmountcont}
                            keyboardType="numeric"
                            onChangeTextCallback={(text) => {


                                setAmountcont(text);

                            }}
                        />
                        {isLoading ? (
                            <ShowLoader />
                        ) : null}
                        <FlotingInput
                            label="Enter Service Fee"
                            value={servifee}
                            onChangeText={setServifee}
                            keyboardType="numeric"
                            onChangeTextCallback={(text) => {
                                setServifee(text);

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


                        <SelectDevice setDeviceName={setDeviceName} device={'Device'} opPress={() => { setDeviceName(deviceName); handleSelection(deviceName) }} />
                        <View style={{ marginBottom: hScale(10) }} />

                        <DynamicButton
                            onPress={() => {
                                if (bankName === 'Select Bank' || mobileNumber.length < 10 || consumerName === null || aadharNumber.length < 12 || isValid === false || amountcont === '') {

                                } else {
                                    handleSelection(deviceName);


                                    // if (fingerprintData == 720) {
                                    //     setIsScan(true);
                                    //     scanFingerprint();
                                    // } else {
                                    //     OnPressEnq();
                                    // }
                                }
                            }}
                            title={'Scan & Proceed'}
                        />

                        {showDialog && (
                            <AepsVideoResponseDialog
                                status={status}
                                amount={amount}
                                date={date}
                                bnkrrn={bnkrrn}
                                aadharnum={aadharNumber}
                                agentid={agentid}
                            />
                        )}
                    </View>
                    {/* <TouchableOpacity onPress={aepsresponsepress}>
                        <Text style={{ color: 'red' }}>
                            Aeps Respons
                        </Text>
                    </TouchableOpacity> */}
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
    main: {
        flex: 1,
    },
    container: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: wScale(20),
        flex: 1,
        paddingBottom: hScale(20)
    },
    container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialog: {
        backgroundColor: '#fff',
        padding: wScale(20),
        borderRadius: hScale(10),
        width: '80%',
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: hScale(18),
        marginBottom: hScale(10),
        color: '#007bff',
    },
    detailText: {
        marginBottom: hScale(5),
        fontSize: hScale(16),
    },
    button: {
        backgroundColor: '#28a745',
        padding: hScale(10),
        borderRadius: hScale(5),
        marginTop: hScale(10),
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    body: {
        paddingTop: hScale(10),
    },
    inputstyle: {
        marginBottom: hScale(0),
    },


    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%'
    },
    modalContainer: {
        backgroundColor: '#fff',
        width: wScale(400),
        height: hScale(400),
        borderRadius: hScale(2),
        overflow: 'hidden',
    },
    modalHeader: {
        backgroundColor: '#007bff',
        paddingVertical: hScale(1),
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: hScale(18),
        color: '#fff',
    },
    modalContent: {
        padding: hScale(5),
    },
    contentText: {
        fontSize: hScale(16),
        marginBottom: hScale(0.5),
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: hScale(0.1),
        borderTopColor: '#ccc',
    },
    footerButton: {
        paddingVertical: hScale(21),
    },
    footerButtonText: {
        fontSize: hScale(12),
        color: 'green',
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

export default AepsCW;

