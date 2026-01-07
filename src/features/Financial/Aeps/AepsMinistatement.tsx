import React, { useContext, useEffect, useState } from 'react';
 
import { Appearance,View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Image, ToastAndroid, Modal, Alert, FlatList } from 'react-native';
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
import BankBottomSite from '../../../components/BankBottomSite';
import OnelineDropdownSvg from '../../drawer/svgimgcomponents/simpledropdown';
import ShowLoader from '../../../components/ShowLoder';
import RNFS from 'react-native-fs';
import { isMoment } from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SelectDevice from './DeviceSelect';
import { isDriverFound, openFingerPrintScanner } from 'react-native-rdservice-fingerprintscanner';
import { useNavigation } from '../../../utils/navigation/NavigationService';
import QrcodAddmoneysvg from '../../drawer/svgimgcomponents/QrcodAddmoneysvg';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useRdDeviceConnectionHook } from '../../../hooks/useRdDeviceConnectionHook';

const AepsMinistatement = () => {

    const [lodervisi, setLodervisi] = useState(false);
    const {setBankId,
        bankid, aadharNumber, setFingerprintData, setAadharNumber, mobileNumber, setMobileNumber, consumerName, setConsumerName, bankName, setBankName, scanFingerprint, fingerprintData ,isValid,setIsValid ,deviceName,setDeviceName} = useContext(AepsContext);
    const [amountcont, setAmountcont] = useState('');
    const [servifee, setServifee] = useState('');
    const [otpcontroller, setOtpcontroller] = useState('');

    const [paybtn, setPaybtn] = useState(true);
    const [otpservisi, setOtpservisi] = useState(false);
    const [showdetatis, setShowdetatis] = useState(false);
    const [aepsType, setAepsType] = useState('AEPSService1');
    const [viewVisible, setViewVisible] = useState(true);
    const [viewVisible1, setViewVisible1] = useState(false);
    const [isScan, setIsScan] = useState(false);
    const [uniqueid, setUniqueid] = useState('');
    const [imei, setImei] = useState('');
    const [responsefromaaadharscan, setResponsefromaaadharscan] = useState('');
    const [adharIsValid, setadharIsValid] = useState(false);
    const [banklist, setBanklist] = useState([]);
    const [isbank, setisbank] = useState(false);

    const [isVisible, setIsVisible] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [status, setStatus] = useState('');
    const [amount, setamount] = useState('')
    const [date, setdate] = useState('')
    const [bnkrrn, setbnkrrn] = useState('')
    const [agentid, setagentid] = useState('');
    const [autofcs, setAutofcs] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
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

    const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
        useDeviceInfoHook();
    const { userId } = useSelector((state: RootState) => state.userInfo);
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`

    const color2 = `${colorConfig.primaryColor}40`
    const color3 = `${colorConfig.secondaryColor}15`
    const { latitude, longitude } = useLocationHook();
    const [ministate, setMinistate] = useState([]);
    const [ismodel, setIsmodel] = useState(false);
    const [Proceed, setProceed] = useState(true);
    const { get, post } = useAxiosHook();
    const navigation = useNavigation<any>();

   
 
    useEffect(() => {
        banks();
        checkAepsStatus();
        if (fingerprintData == 720) {
            if (fingerprintData === 720) {

                return;
            } else if (fingerprintData["PidData"].Resp.errCode === 0 && Proceed) {
                adhar_Validation(aadharNumber);
            }
        }
    }, [formattedDate]);

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
      
    };
    const readLatLongFromStorage = async () => {
        try {
          const locationData = await AsyncStorage.getItem('locationData');
          
          if (locationData !== null) {
            const { latitude, longitude } = JSON.parse(locationData);
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
        const loc= await readLatLongFromStorage()
        setIsLoading(true);
        try {
            const Model = await getMobileDeviceId();
    
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
                name: consumerName,
                Address: 'Address',
                transactionAmount: ''
            };
    
            const headers = {
                'trnTimestamp': formattedDate,
                'deviceIMEI': Model,
                "Content-type": "application/json",
                "Accept": "application/json",
            };
    
            const data = JSON.stringify(jdata);
    
            const response = await post({
                url: 'AEPS/api/app/AEPS/MiniStatement',
                data:data,
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
            if (response) {
                const { RESULT, ADDINFO, agentid } = response;
                setFingerprintData(720);
    
                if (RESULT && RESULT.toString() === '0') {
                    setIsLoading(false);
                    setIsmodel(true);
                    setMinistate(ADDINFO);
    
                    // Save response to Download directory
              
    
                } else {
                    setIsLoading(false);
                    Alert.alert('Note:', ADDINFO || 'Unknown error occurred');
                }
            } else {
                setIsLoading(false);
                Alert.alert('Error', 'No response from server');
            }
    
        } catch (error) {
            setIsLoading(false);
            console.error('Error during balance enquiry:', error);
            Alert.alert('Error', 'Failed to process the request. Please try again later.');
        }
    };
    
    const MiniStatementResponse = ({ visible, onClose, statements }) => {
        const [isDarkMode, setIsDarkMode] = useState(Appearance.getColorScheme() === 'dark');
    
        useEffect(() => {
            const colorSchemeListener = Appearance.addChangeListener(({ colorScheme }) => {
                setIsDarkMode(colorScheme === 'dark');
            });
    
            // Cleanup listener on component unmount
            return () => colorSchemeListener.remove();
        }, []);
    
        return (
            <Modal transparent={true} visible={visible} animationType="slide">
                <View style={[styles.overlay, isDarkMode && styles.overlayDark]}>
                    <View style={[styles.container3, isDarkMode && styles.container3Dark]}>
                        <View style={styles.header}>
                            <Text style={[styles.title2, isDarkMode && styles.titleDark]}>Mini Statement Receipt</Text>
                        </View>
                        <View style={styles.listHeader}>
                            <Text style={[styles.headerText, isDarkMode && styles.headerTextDark]}>Date</Text>
                            <Text style={[styles.headerText, isDarkMode && styles.headerTextDark]}>Open</Text>
                            <Text style={[styles.headerText, isDarkMode && styles.headerTextDark]}>Type</Text>
                            <Text style={[styles.headerText, isDarkMode && styles.headerTextDark]}>Amount</Text>
                            <Text style={[styles.headerText, isDarkMode && styles.headerTextDark]}>Close</Text>
                        </View>
                        {statements && statements.length > 0 ? (
                            <FlatList
                                data={statements}
                                keyExtractor={(item) => item.id?.toString() || Math.random().toString()} // Handle undefined `id`
                                renderItem={({ item }) => (
                                    <View style={[styles.listItem, isDarkMode && styles.listItemDark]}>
                                        <Text style={isDarkMode && styles.textDark}>{item.Date || 'N/A'}</Text>
                                        <Text style={isDarkMode && styles.textDark}>{item.openbal || 'N/A'}</Text>
                                        <Text style={isDarkMode && styles.textDark}>{item.Type || 'N/A'}</Text>
                                        <Text style={isDarkMode && styles.textDark}>{item.Amount || 'N/A'}</Text>
                                        <Text style={isDarkMode && styles.textDark}>{item.closebal || 'N/A'}</Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>No statements available</Text>
                            </View>
                        )}
                        <View style={styles.footer}>
                            <TouchableOpacity style={[styles.button, isDarkMode && styles.buttonDark]} onPress={onClose}>
                                <Text style={[styles.buttonText2, isDarkMode && styles.buttonTextDark]}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };
    
    async function adhar_Validation(adharnumber) {
        try {
            const response = await get({ url: `${APP_URLS.aadharValidation}${adharnumber}` })

            // if (response['status'] === true){
            //                     setadharIsValid(true);

            // }else
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

    async function getUserNamefunction(MoNumber) {
        try {
            const response = await get({ url: `${APP_URLS.aepsNameinfo}${MoNumber}` })
            setAutofcs(true);
            setConsumerName(response.RESULT);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const checkvideo = async (transamount, agentid) => {
        try {
            const respone = post({ url: `${APP_URLS.checkadharpayvideo}transamount=${transamount}&agentid=${agentid}` });

        } catch (error) {

        }
    };
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


    const payAadhar = () => {
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


    const capture = async (rdServicePackage) => {
        let pidOptions = '';
        const aepscode = await AsyncStorage.getItem('aepscode');
        
        switch (rdServicePackage) {
          case 'com.mantra.mfs110.rdservice':
            pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
            break;case 'com.mantra.rdservice':
            pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>';
            break;
          case 'com.acpl.registersdk_l1':
            pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh=""/> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
            break; case 'com.acpl.registersdk':
            pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" wadh=""/> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
            break;
          case 'com.idemia.l1rdservice':
            //pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" posh="UNKNOWN" env="P" /> <Demo></Demo> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
            pidOptions =`<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="20000" wadh="" posh="UNKNOWN" /><Demo></Demo><CustOpts><Param name="" value="" /></CustOpts></PidOptions>`;
            break; case 'com.scl.rdservice':
           // pidOptions = '<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pType="" pCount="0"  format="0" pidVer="2.0" timeout="20000"  posh="UNKNOWN" env="P" /> <Demo></Demo> <CustOpts><Param name="" value="" /></CustOpts> </PidOptions>';
            pidOptions =`<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="0" iType="" pCount="0" pType="" format="0" pidVer="2.0" timeout="20000" wadh="" posh="UNKNOWN" /><Demo></Demo><CustOpts><Param name="" value="" /></CustOpts></PidOptions>`;
            break;
          default:
            console.error('Unsupported rdServicePackage');
            return;
        }
    
        openFingerPrintScanner(rdServicePackage, pidOptions)

          .then(async(res) => {
            const deviceInfoString = JSON.stringify(res, null, 2);
           
            if (res.errorCode === 720) {
              setFingerprintData(720);
            } else if (res.status === -1) {
              setFingerprintData(-1);
            } else if (res.errorCode === 0) {
    
                OnPressEnq(res.pidDataJson);
    
              const responseString = JSON.stringify(res.pidDataJson, null, 2);
              //    Alert.alert('Tab Fingerprint Data', responseString);
            
            }
          })
          .catch(async(error) => {
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
        if (selectedOption === 'Device') {
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
        
        if (captureMapping[selectedOption]) {
          isDriverFound(captureMapping[selectedOption])
            .then((res) => {
                capture(captureMapping[selectedOption]);


//   if(isDeviceConnected){
//                   }else{
//                     ToastAndroid.showWithGravityAndOffset(
//                       res.message + '  But Device Not Connected',
//                       ToastAndroid.LONG,
//                       ToastAndroid.TOP,
//                       0,
//                       1000
//                     );
//                   }    
    
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
                                if (mobileNumber.length === 10) {
                                    setAutofcs(false);
                                } else {

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
                        <TouchableOpacity
                            style={{}}
                            onPress={() => { setisbank(true) }}
                        >
                            <>
                                <FlotingInput
                                    editable={false}
                                    label={bankName.toString()}
                                    onChangeText={setServifee}
                                    placeholder={bankName ? "" : "Select Bank"}
                                    keyboardType="numeric"
                                    onChangeTextCallback={(text) => {
                                        setServifee(text);
                                    }}
                                    inputstyle={styles
                                        .inputstyle
                                    }
                                />
                            </>
                            <View style={styles.righticon}>
                                <OnelineDropdownSvg />
                            </View>
                        </TouchableOpacity>
                        <SelectDevice setDeviceName={setDeviceName} device={'Device'} opPress={()=>{setDeviceName(deviceName);}}/>


                        <View style={{ marginBottom: hScale(10) }} />


                        {otpservisi && (
                            <FlotingInput
                                label="Enter OTP"
                                value={otpcontroller}
                                onChangeText={setOtpcontroller}
                                keyboardType="numeric"
                                onChangeTextCallback={(text) => {
                                    setOtpcontroller(text);

                                }}
                            />
                        )}





                        <TouchableOpacity
                            style={{}}
                        >
                            <DynamicButton
                                onPress={() => {
                                    if (bankName === 'Select Bank' || mobileNumber.length < 10 || consumerName === null || aadharNumber.length < 12) {
                                    } else {

                                        handleSelection(deviceName)
                                     
                                    }
                                }}

                                //onPress={CaptureFinger}
                                title={<Text>{'Scan & Proceed'}
                                </Text>}
                            />
                        </TouchableOpacity>



                        {isLoading ? (
                            <ShowLoader />
                        ) : null}

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
            <MiniStatementResponse
                visible={ismodel}
                onClose={() => setIsmodel(false)}
                statements={ministate}
            />
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
        paddingHorizontal: 20, // Adjust as needed
        flex: 1,
        paddingBottom: 20,
    },
    container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Light overlay for modals
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
        marginBottom: 10,
        color: '#007bff',
    },
    detailText: {
        marginBottom: 5,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    body: {
        paddingTop: 10,
    },
    inputstyle: {
        marginBottom: 0,
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Default dark overlay for modal
    },
    overlayDark: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Darker overlay for dark mode
    },
    container3: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginHorizontal: 20,
    },
    container3Dark: {
        backgroundColor: '#333', // Dark background for dark mode
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
    },
    title2: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    titleDark: {
        color: 'white', // Dark mode title color
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    headerText: {
        flex: 1,
        textAlign: 'center',
    },
    headerTextDark: {
        color: '#ddd', // Lighter text for dark mode
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    listItemDark: {
        backgroundColor: '#444', // Darker background for dark mode
    },
    footer: {
        marginTop: 10,
        alignItems: 'flex-end',
    },
    button2: {
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    buttonText2: {
        color: 'white',
    },
    buttonTextDark: {
        color: '#fff', // Button text color in dark mode
    },
    textDark: {
        color: '#ddd', // Light text for dark mode
    },
    righticon: {
        position: 'absolute',
        left: 'auto',
        right: 12, // Adjusted with wScale
        top: 0, // Adjusted with hScale
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 12, // Adjusted with wScale
    },
    // Additional styles for handling dark mode
    emptyState: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    emptyText: {
        color: '#888', // Default light gray for empty state text
    },
    emptyTextDark: {
        color: '#bbb', // Lighter text for empty state in dark mode
    },
    // Button styles
    buttonDark: {
        backgroundColor: '#1b5e20', // Darker green for dark mode
    },
    buttonText2Dark: {
        color: '#fff', // White text for button in dark mode
    },
    // Input field styles
    inputField: {
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    inputFieldDark: {
        backgroundColor: '#555', // Dark background for inputs in dark mode
        color: '#ddd', // Light text color in inputs for dark mode
    },
    label: {
        fontWeight: 'bold',
        color: '#333',
    },
    labelDark: {
        color: '#fff', // Light label for dark mode
    },
    // More specific text styling
    normalText: {
        color: '#333',
    },
    normalTextDark: {
        color: '#ddd', // Lighter text for dark mode
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#007bff',
    },
    modalTitleDark: {
        color: '#f0f0f0', // Light color for modal title in dark mode
    },
});

export default AepsMinistatement;

