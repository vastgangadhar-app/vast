import React, { useState, useRef } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import DynamicButton from '../button/DynamicButton';
import { Dialog, ALERT_TYPE } from 'react-native-alert-notification';
import { colors } from '../../../utils/styles/theme';



const DynamicOtp = () => {
    // const [showModal, setShowModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [otp, setOtp] = useState(Array.from({ length: 6 }, () => ''));
    const [mobileotp, setMobileOtp] = useState(Array.from({ length: 4 }, () => ''));
    const [error, setError] = useState(false);
    const inputRefs = useRef(otp.map(() => React.createRef()));
    const mobileinputRefs = useRef(mobileotp.map(() => React.createRef()));

    const handleOtpChange = (index, value) => {
        const updatedOtp = [...otp];
        console.log(updatedOtp)
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        const predefinedOtp = '123456';
        const enteredOtp = updatedOtp.join('  ');

        if (enteredOtp === predefinedOtp || enteredOtp.length === 6) {
            console.log('is ok');
        }

        erroetext(updatedOtp);
    };

    const registeredmobileotp = (index, value) => {
        const updatedMobileOtp = [...mobileotp];
        updatedMobileOtp[index] = value;


        setMobileOtp(updatedMobileOtp);
    };

    const numberOfInputs = 6;
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.primaryColor}15`;
    const color2 = `${colorConfig.secondaryColor}15`;


    const erroetext = (text) => {
        if (text === '123456') {
            console.warn('otp is true')
        } else {
            console.warn('otp is false')
        }
    }

    return (
        <View style={styles.container}>
            <View style={[styles.otpcontainer, {
            }]}>
                <View
                    style={[
                        styles.texttitalView,
                        { backgroundColor: colorConfig.primaryColor },
                    ]}>

                    <Text style={styles.texttital}>ENTER OTP</Text>
                </View>
                <Text style={styles.otptext}>
                    OTP will be sent to your registered Email-ID and Mobile number for status change
                </Text>

                <LinearGradient
                    style={styles.LinearGradient}
                    colors={[color1, color2]}
                    start={{ x: 0, y: .5 }}
                    end={{ x: 1, y: .5 }} >

                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', }}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={inputRefs.current[index]}
                                style={styles.input}
                                value={digit}
                                keyboardType="numeric"
                                maxLength={1}
                                onChangeText={value => {
                                    handleOtpChange(index, value);

                                    if (value !== '' && index < numberOfInputs - 1) {
                                        inputRefs.current[index + 1].current.focus();
                                    } else if (value === '' && index > 0) {
                                        inputRefs.current[index - 1].current.focus();
                                    }
                                }}
                            />
                        ))}
                    </View>








                    {error ? <Text style={styles.errortext}>{error}</Text> : null}

                </LinearGradient>

                <TouchableOpacity style={styles.resend}>
                    <Text style={styles.resendtext}>
                        Resend OTP
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        // flex:1
        width: '100%'
    },
    LinearGradient: {
        paddingVertical: hScale(10),
        paddingHorizontal: wScale(15),
        marginBottom: hScale(5)
    },
    otpcontainer: {
        borderRadius: wScale(5),
        backgroundColor: '#fff',
        paddingHorizontal: wScale(15),
        width: '100%',
        paddingTop:hScale(50),
        paddingBottom: hScale(20)
    },
    otptext: {
        color: '#000',
        fontSize: wScale(16),
        marginBottom: hScale(20),
        fontWeight: 'bold',
    },
    input: {
        width: wScale(43),
        height: hScale(40),
        borderWidth: wScale(0.4),
        borderRadius: wScale(2),
        textAlign: 'center',
        fontSize: wScale(16),
        marginHorizontal: wScale(5),
        backgroundColor: '#fff',
        borderColor: '#000',
        color:"#000"
    },
    errortext: {
        color: 'red',
        marginTop: hScale(10),
    },
    modlecancelButton: {
        paddingRight: wScale(10),
        width: '30%',
    },

    texttitalView: {
        borderRadius: wScale(5),
        position: 'absolute',
        top: -10,
        left: 5,
        alignItems: 'center',
        paddingBottom: wScale(3),
        paddingHorizontal: wScale(10)
    },

    texttital: {
        fontSize: wScale(28),
        // fontWeight: 'bold',
        color: '#fff',
    },
    resend: {
        alignSelf: 'flex-end',
        paddingHorizontal: 5,
        alignItems: 'center'
    },
    resendtext: {
        fontSize: wScale(18),
        fontWeight: 'bold',
        color:colors.black75
    }

})
export default DynamicOtp;
