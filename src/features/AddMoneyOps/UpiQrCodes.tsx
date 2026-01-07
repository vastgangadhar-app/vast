import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { APP_URLS } from '../../utils/network/urls';
import useAxiosHook from '../../utils/network/AxiosClient';
import DynamicButton from '../drawer/button/DynamicButton';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import FlotingInput from '../drawer/securityPages/FlotingInput';
import CountdownTimer from '../dashboard/components/ContdownTimer';
import Phonepesvg from '../drawer/svgimgcomponents/phonepesvg';
import PayTmSvg from '../drawer/svgimgcomponents/paytmsvg';
import BharatPeSvg from '../drawer/svgimgcomponents/bharatpesvg';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import DownloadSvg from '../drawer/svgimgcomponents/DownloadSvg';
import ShareSvg from '../drawer/svgimgcomponents/sharesvg';

const UpiQrCodes = ({ route }) => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const { qrcode1Data, amnt, response } = route.params;
    const [hideqr, setHideqr] = useState(true);
    const [mszz, setMszz] = useState('');
    const { post } = useAxiosHook();
    const [code, setCode] = useState('');
    const [Txnid, setTxnId] = useState('');
    const [UtrNumber, setUtrNumber] = useState('');
    const [intervalId, setIntervalId] = useState(null);
    const [iscall, setIscall] = useState(true);

    useEffect(() => {
        createqr(amnt, response.name);
    }, [amnt]);

    const createqr = useCallback(async (amnt, type) => {
        let url = '';
        switch (type) {
            case 'PAYTM':
                url = `${APP_URLS.PaytmQrGenerate}${amnt}`;
                break;
            case 'PHONE PE':
                url = `${APP_URLS.PhonePeQrGenerate}${amnt}`;
                break;
            case 'BHARAT PE':
                url = `${APP_URLS.BharatPeQrGenerate}${amnt}`;
                break;
            default:
                break;
        }
        console.log(type, url);
        try {
            const Response = await post({ url: url });
            const image = Response.image;
            const tx = await Response.txnid;
            setTxnId(tx);
            console.log(Response);
            if (image) {
                setCode(`data:image/png;base64,${image}`);
                if (type !== 'BHARAT PE') {
                    paymentresponse(tx, type);
                }
            } else {
                alert(Response.message);
            }
        } catch (error) {
            console.error('Error in createqr:', error);
        }
    }, [post]);

    const paymentresponse = useCallback(async (txnid, type) => {
        let url = '';

        switch (type) {
            case 'PAYTM':
                url = `${APP_URLS.getPaytmResponse}${txnid}`;
                break;
            case 'PHONE PE':
                url = `${APP_URLS.getPhonePeResponse}${txnid}`;
                break;
            case 'BHARAT PE':
                url = `${APP_URLS.getBharatPeResponse}txnid=${txnid}&Utr=${UtrNumber}`;
                break;
            default:
                break;
        }

        try {
            const Response = await post({ url: url });
            console.log(url);
            console.log(Response);

            if (Response.toUpperCase() === 'YES') {
                setHideqr(false);
                setCode('');
                Alert.alert(
                    'Payment Successful',
                    'Your payment was completed successfully. Thank you for your transaction!',
                    [
                        {
                            text: 'OK',
                            onPress: () => { },
                        },
                    ],
                    { cancelable: false }
                );
            }
            console.log(txnid);
        } catch (error) {
            console.error('Error fetching QR code status:', error);
        }
    }, [post, intervalId, UtrNumber]);

    const downloadQRCode = async () => {
        if (code) {
            const downloadDest = `${RNFS.DownloadDirectoryPath}/qrcode-Nobelpay App-${Txnid}-₹${amnt}.png`;
            try {
                await RNFS.writeFile(downloadDest, code.split('data:image/png;base64,')[1], 'base64');
                Alert.alert('Download Successful', 'QR code has been downloaded successfully.');
            } catch (error) {
                console.error('Error downloading QR code:', error);
                Alert.alert('Download Failed', 'Unable to download the QR code.');
            }
        }
    };
    const shareQRCode = async () => {
        if (code) {
            try {
                const shareOptions = {
                    title: 'Share QR Code',
                    url: code, // QR code URL or image path
                    type: 'image/png',
                    message: `${APP_URLS.AppName}\nAmount: ₹${amnt}\nTransaction ID: ${Txnid}\nHi, I am sharing the transaction details using '${APP_URLS.AppName}' App.`,
                };

                // Attempt to open the share dialog
                await Share.open(shareOptions);
            } catch (error) {
                console.error('Error sharing QR code:', error);
                Alert.alert('Share Failed', 'Unable to share the QR code.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <AppBarSecond title={'Scann'} />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.contentContainer}>

                    {response.name === 'PHONE PE' ? (
                        <Phonepesvg />
                    ) : response.name === 'BHARAT PE' ? (
                        <BharatPeSvg size={70} />
                    ) : response.name === 'PAYTM' ? (
                        <PayTmSvg size={70} />
                    ) : null}
                    <View style={styles.qrContainer}>

                        {hideqr ? (
                            <View style={styles.qrImageContainer}>
                                {code ? <Image
                                    source={{ uri: code }}
                                    style={styles.qrImage}
                                /> : <ActivityIndicator />}
                                <CountdownTimer
                                    onComplete={() => {
                                        setHideqr(false);
                                        setCode('');
                                        console.log('QR code has expired');
                                    }}
                                    initialTime={120}

                                />
                            </View>
                        ) : (
                            <Text style={styles.qrText}>QR code has expired.</Text>
                        )}
                    </View>
                </View>

                {response.name === 'BHARAT PE' ? (
                    <FlotingInput
                        label="Enter UTR Number"
                        value={UtrNumber}
                        onChangeText={setUtrNumber}
                        keyboardType="numeric"
                        onChangeTextCallback={(text) => {
                            setUtrNumber(text);
                        }}
                    />
                ) : null}

                {code ? (
                    <View>
                        {response.name === 'BHARAT PE' && UtrNumber.length >= 12 ? (
                            <DynamicButton
                                title="Start Payment Response"
                                onPress={() => paymentresponse(Txnid, 'BHARAT PE')}
                                styleoveride={styles.option}
                            />
                        ) : (
                            <DynamicButton
                                title={iscall ? "Check Payment Response" : "Check Again Payment Response"}
                                onPress={() => paymentresponse(Txnid, response.name)}
                                styleoveride={styles.option}
                            />
                        )}
                        <View
                            style={[
                                styles.btn2,
                                { backgroundColor: colorConfig.primaryButtonColor },
                            ]}
                        >
                            <TouchableOpacity onPress={downloadQRCode} style={styles.homebtn}>
                                <DownloadSvg />
                            </TouchableOpacity>
                            <View style={[styles.btnborder]} />
                            <TouchableOpacity onPress={shareQRCode} style={styles.homebtn}>
                                <ShareSvg />
                            </TouchableOpacity>
                        </View>

                        {/* <DynamicButton
                            title="Download QR Code"
                            onPress={downloadQRCode}
                            styleoveride={styles.option}
                        />
                        <DynamicButton
                            title="Share QR Code"
                            onPress={shareQRCode}
                            styleoveride={styles.option}
                        /> */}
                    </View>
                ) : null}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flexGrow: 1,
        marginHorizontal: wScale(5),
        marginTop: hScale(20),
    },
    contentContainer: {
        alignItems: 'center',
    },
    qrImageContainer: {
        alignItems: 'center',
    },
    titleContainer: {
        marginTop: hScale(20),
    },
    title: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'bold',
    },
    option: {
        height: hScale(40),
        backgroundColor: '#fff',
        borderRadius: wScale(0),
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: wScale(10),
        marginBottom: hScale(20),
    },
    qrContainer: {
    },
    qrImage: {
        width: wScale(300),
        height: hScale(300),
        resizeMode: 'contain',
    },
    qrText: {
        fontSize: 16,
        marginTop: hScale(10),
        color: '#666',
    },
    timerText: {
        marginTop: hScale(10),
        fontSize: 16,
        color: '#333',
    },
    btn2: {
        paddingVertical: hScale(8),
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '40%',
        paddingHorizontal: wScale(4),
      },
      btnborder: {
        borderRightWidth: wScale(0.5),
        height: "100%",
        borderColor: "rgba(255,255,255,0.5)",
      },
      btntext: {
        color: "#fff",
        fontSize: wScale(22),
        fontWeight: "bold",
        textAlign: "center",
      },
      homebtn: {
        flex: 1,
        alignItems: 'center'
      }
});

export default UpiQrCodes;
