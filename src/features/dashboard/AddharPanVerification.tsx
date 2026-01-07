import React, { useEffect, useState } from "react";
import { View, Text, ToastAndroid, Alert, StyleSheet, TouchableOpacity } from "react-native";
import AppBarSecond from "../drawer/headerAppbar/AppBarSecond";
import useAxiosHook from "../../utils/network/AxiosClient";
import { APP_URLS } from "../../utils/network/urls";
import DynamicButton from "../drawer/button/DynamicButton";
import OTPModal from "../../components/OTPModal";
import FlotingInput from "../drawer/securityPages/FlotingInput";
import { useNavigation } from "../../utils/navigation/NavigationService";
import ShowLoader from "../../components/ShowLoder";
import { hScale, wScale } from "../../utils/styles/dimensions";

const AadhrPanVerify = ({ route }) => {
    const { verify_type, pancard, aadharcard } = route.params;
    const navigation = useNavigation();
    const { get, post } = useAxiosHook();
    const [otpModalVisible, setOtpModalVisible] = useState(false);
    const [mobileOtp, setMobileOtp] = useState('');
    const [reqData, setReqData] = useState([]);
    const [adharN, setAdharN] = useState(aadharcard || '');
    const [pan, setPan] = useState(pancard || '');
    const [loading, setisLoading] = useState(false);

    useEffect(() => {
        console.log("Verification Type:", verify_type);
        console.log("Pan Card:", pancard);
        console.log("Aadhar Card:", aadharcard);
    }, [verify_type, pancard, aadharcard]);

    const showToast = (message) => {
        ToastAndroid.showWithGravity(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    };

    const handleAadharValidation = async (adharnumber) => {
        const response = await get({ url: `${APP_URLS.aadharValidation}${adharnumber}` });
        if (response['status'] !== true) {
            setisLoading(false);
            showToast("Please Enter Valid Aadhar number");
            return false;
        }
        return true;
    };

    const PanVerification = async () => {
        setisLoading(true);
        const response = await get({ url: `${APP_URLS.PanVerification}?pancard=${pan}` });
        console.log(response);
        if (response.Status) {
            Alert.alert('Pan Verification', 'Pan Verification Done', [
                { text: 'OK', onPress: () => navigation.navigate('HomeScreen') },
            ]);
        } else {
            showToast(response.Message);
        }
        setisLoading(false);
    };

    const getOtp = async () => {
        const isValid = await handleAadharValidation(adharN);
        if (!isValid) return;
        const response = await get({ url: `${APP_URLS.AadharVerificationOtpSent}aadhar=${aadharcard}` });
        if (response.Status) {
            setisLoading(false);
            setReqData(response);
            setOtpModalVisible(true);
        } else {
            setisLoading(false);
            showToast(response.Message);
        }
    };

    const submitOtp = async () => {
        if (mobileOtp.length !== 6) return;
        setisLoading(true);
        const res = await post({
            url: `${APP_URLS.AadharVerificationOtpVerify}`,
            data: {
                client_id: reqData.clientid,
                otp: mobileOtp,
                txnid: reqData.txnid,
                aadhar: adharN,
            },
        });

        if (res.Status) {
            setOtpModalVisible(false);
            Alert.alert('Aadhar Verification', 'Aadhar Verification Done', [
                { text: 'OK', onPress: () => navigation.navigate('HomeScreen') },
            ]);
        } else {
            showToast(res.Message);
        }
        setisLoading(false);
    };

    const handleButtonPress = () => {
        if (verify_type === 'pan') {
            PanVerification();
        } else if (verify_type === 'aadhar') {
            getOtp();
        }
    };

    return (
        <View style={styles.container}>
            <AppBarSecond title="Aadhar Pan Verify" onPressBack={undefined} />
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>Aadhaar e-Verification Due!</Text>
                <Text style={styles.subtitleText}>Dear Business Partner, your Aadhaar e-Verification is due. For business purposes, we need instant verification. Click to verify now if you want to stay with us.</Text>
            </View>

            <FlotingInput
                label="Aadhar No"
                value={adharN}
                onChangeText={setAdharN}
                keyboardType="numeric"
                maxLength={12}
                containerStyle={styles.inputContainer}
                onChangeTextCallback={(t)=>{
                    setAdharN(t)
                }}
            />

            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>PanCard Verification Due!</Text>
                <Text style={styles.subtitleText}>Dear User, your PanCard verification is not done. Please enter your PanCard number.</Text>
            </View>

            <FlotingInput
                label="Pan No"
                value={pan}
                onChangeText={setPan}
                maxLength={12}
                containerStyle={styles.inputContainer}
                onChangeTextCallback={(t)=>{
                    setPan(t)
                }}
            />

            <OTPModal
                setShowOtpModal={setOtpModalVisible}
                disabled={mobileOtp.length !== 6}
                showOtpModal={otpModalVisible}
                setMobileOtp={setMobileOtp}
                verifyOtp={submitOtp}
            />

            <DynamicButton
                title={verify_type === 'pan' ? 'Verify Pan' : 'Get OTP'}
                onPress={handleButtonPress}
                style={styles.button}
            />

            {loading && <ShowLoader />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: wScale(20),
        backgroundColor: '#F7F7F7',
    },
    headerContainer: {
        marginVertical: hScale(20),
    },
    titleText: {
        fontSize: hScale(18),
        fontWeight: 'bold',
        color: '#333',
    },
    subtitleText: {
        fontSize: hScale(14),
        color: '#666',
        marginTop: hScale(8),
    },
    inputContainer: {
        marginVertical: hScale(10),
    },
    button: {
        marginTop: hScale(20),
        width: '100%',
        alignSelf: 'center',
    },
});

export default AadhrPanVerify;
