
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import ClosseModalSvg from '../features/drawer/svgimgcomponents/ClosseModal';

const VerifyMobileNumber = ({ visible, onClose, isCpin = false, handleSubmit }) => {
    const [mobileNumber, setMobileNumber] = useState('');

    // const handleSubmit = () => {
    //     console.log("Mobile Number Submitted:", mobileNumber);
    //     onClose();
    // };

    return (
        <View style={styles.container}>
            <Modal
                transparent={true}
                animationType="slide"
                visible={visible}
                onRequestClose={onClose} 
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.header}>
                            <Text style={styles.modalTitle}> {isCpin ? 'Verify CPIN' : 'Verify Mobile Number'}</Text>
                            <TouchableOpacity onPress={onClose}>
                                {/* <Text style={styles.cancelText}>Cancel</Text> */}
                                <ClosseModalSvg />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder={isCpin ? 'Enter your Cpin' : "Enter your mobile number"}
                            placeholderTextColor="#aaa"
                            value={mobileNumber}
                            onChangeText={setMobileNumber}
                            keyboardType="phone-pad"
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.button} onPress={() => handleSubmit(mobileNumber)}>
                                <Text style={styles.buttonText}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e201d',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    cancelText: {
        color: '#e45a55',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#e45a55',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default VerifyMobileNumber;
