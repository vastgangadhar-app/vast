/* eslint-disable react/prop-types */
/* eslint-disable react-native/no-inline-styles */
import React, { memo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TouchableOpacity,
    Modal,

} from 'react-native';

import { hScale, wScale } from '../../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import ClosseModalSvg from '../../drawer/svgimgcomponents/ClosseModal';
import DynamicOtp from '../../drawer/Otp/DynamicOtp';
import DynamicButton from '../../drawer/button/DynamicButton';


const OTPModal = ({ showModal, setShowModal, onPressSubmitOtp }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    return (
        <>
            <Modal transparent={true} animationType="fade" visible={showModal}

            >
                <View style={styles.modalcenter}>

                    <View style={[styles.modalView, {
                        borderTopColor: colorConfig.primaryColor,
                        borderLeftColor: colorConfig.primaryColor, borderRightColor: colorConfig.secondaryColor, borderBottomColor: colorConfig.secondaryColor
                    }]}>
                        <View style={styles.cutborder}>
                            <TouchableOpacity
                                onPress={() => setShowModal(false)}
                                activeOpacity={0.7}
                                style={[
                                    styles.closebuttoX,
                                ]}>
                                <ClosseModalSvg />
                            </TouchableOpacity>
                        </View>
                        <DynamicOtp otp={otp} setOtp={setOtp} />
                        <View style={styles.dynamicbtnviw}>
                            <DynamicButton title='Submit OPT' onPress={() => {

                                const otpVal = otp.join('');

                                onPressSubmitOtp(otpVal)
                                setOtp(["", "", "", "", "", ""]);
                            }}
                                styleoveride={undefined}
                            />
                        </View>

                    </View>

                </View>

            </Modal>
        </>
    );
};

export default memo(OTPModal);

const styles = StyleSheet.create({
    mobileviwe: {
        alignItems: 'center',
        marginBottom: hScale(15)
    },
    modalView: {
        borderRadius: wScale(10),
        marginHorizontal: wScale(20),
        backgroundColor: '#fff',
        borderWidth: wScale(.8),
        paddingBottom: hScale(20)
    },
    cutborder: {
        position: 'absolute',
        right: wScale(-12),
        top: wScale(-12),
        borderRadius: wScale(24),
        paddingRight: wScale(3.2),
        zIndex: 30
    },
    closebuttoX: {
        borderRadius: wScale(60),
        paddingVertical: wScale(5),
        alignItems: 'center',
        height: wScale(52),
        width: wScale(52),
        justifyContent: 'center',
    },
    dynamicbtnviw: {
        paddingHorizontal: wScale(15)
    },
    modalcenter: {
        justifyContent: 'center', height: '100%',
        backgroundColor: 'rgba(0,0,0,.6)'
    }
})
