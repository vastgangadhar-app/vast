import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import DynamicButton from '../drawer/button/DynamicButton';
import FlotingInput from '../drawer/securityPages/FlotingInput';
import { hScale } from '../../utils/styles/dimensions';
import useAxiosHook from '../../utils/network/AxiosClient';
import { useLocationHook } from '../../utils/hooks/useLocationHook';
import { RootState } from '../../reduxUtils/store';
import { useDeviceInfoHook } from '../../utils/hooks/useDeviceInfoHook';
import { encrypt } from '../../utils/encryptionUtils';
import ShowLoader from '../../components/ShowLoder';

const RtorScreen = () => {
    const { colorConfig } = useSelector((state) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`;

    const [id, setId] = useState('');
    const [amount, setAmount] = useState('');
    const [reAmount, setReAmount] = useState('');
    const [comments, setComments] = useState('');
    const { get, post } = useAxiosHook();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [retailer, setRetailer] = useState([])
const [isLoading,setisLoading]= useState(false);
    const data = {
        "sts": "Success",
        "data": {
            "Frm_Name": "Ramandeep Kaur",
            "Email": "ramandeepddugky1997@gmail.com",
            "Mobile": "7986672305",
            "RetailerName": "Ramandeep Kaur",
            "Address": "D / O Ranjit Singh, Near Dharamshala, Bangi Nihal Singh, Bathinda, Punjab-151301"
        }
    };
    const { latitude, longitude } = useLocationHook();
    const { userId } = useSelector((state: RootState) => state.userInfo);
    const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
        useDeviceInfoHook();



    // const RetailerData = async (mobile) => {
    //     try {

    //         const url = `Retailer/api/data/rem_rem_Information?rememail=${mobile}`
    //         const res = await get({ url: `Retailer/api/data/rem_rem_Information?rememail=${mobile}` });
    //         console.log(res)
    //         console.log(url)

    //         if (res.sts) {
    //             setRetailer(res.data);
    //             setDialogVisible(true)
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };


    const RetailerData = async (mobile) => {
        setisLoading(true);
        try {
            if (mobile.length !== 10) {
                console.error("Invalid mobile number. Must be 10 digits.");
                setisLoading(false)
                return;
            }

            const url = `Retailer/api/data/rem_rem_Information?rememail=${mobile}`;
            const res = await get({ url });

            console.log("API Response:", res);
            console.log("API URL:", url);
            setisLoading(false);
            if (res && res.sts === "Success") {
                setRetailer(res.data);
                setDialogVisible(true);
            } else {
                console.error("Retailer Not Found:", res.Message);
                alert("Retailer Not Found. Please check the details and try again.");
            }
        } catch (error) {
            console.error("Error fetching retailer data:", error);
        }
    };


    const FundTransfer = async () => {
        setisLoading(true);
        console.log(id);
        try {
            const mobileNetwork = await getNetworkCarrier();
            const ip = await getMobileIp();
            const Model = await getMobileDeviceId();
            console.log("Model", Model);
            
            const encryption = await encrypt([
                id,
                amount,
                comments,
                ip,
                'token',
                'null',
                Model,
                mobileNetwork,
            ]);
    
            const RetailerId = encodeURIComponent(encryption.encryptedData[0]);
            const Amount = encodeURIComponent(encryption.encryptedData[1]);
            const Commnets = encodeURIComponent(encryption.encryptedData[2]);
            const IP = encodeURIComponent(encryption.encryptedData[3]);
            const Token = encodeURIComponent(encryption.encryptedData[4]);
            const loc = encodeURIComponent(encryption.encryptedData[5]);
            const Model1 = encodeURIComponent(encryption.encryptedData[6]);
            const net = encodeURIComponent(encryption.encryptedData[7]);
    
            console.log([
                id,
                amount,
                comments,
                ip,
                'token',
                'null',
                Model,
                mobileNetwork,
            ]);
    
            const value1 = encodeURIComponent(encryption.keyEncode);
            console.log('value1:', value1);
    
            const value2 = encodeURIComponent(encryption.ivEncode);
    
            const res = await post({
                url: `Retailer/api/data/rem_rem_fund_transfer?RetailerId=${RetailerId}&txtbal=${Amount}&comment=${Commnets}&IP=${IP}&Devicetoken=${Token}&Latitude=${loc}&Longitude=${loc}&ModelNo=${Model1}&City=${loc}&PostalCode=${loc}&InternetTYPE=${net}&Addresss=${loc}&value1=${value1}&value2=${value2}`
            });
    
            const url = `Retailer/api/data/rem_rem_fund_transfer?RetailerId=${RetailerId}&txtbal=${Amount}&comment=${Commnets}&IP=${IP}&Devicetoken=${Token}&Latitude=${loc}&Longitude=${loc}&ModelNo=${Model1}&City=${loc}&PostalCode=${loc}&InternetTYPE=${net}&Addresss=${loc}&value1=${value1}&value2=${value2}`;
         
            
            console.log('Url', url,res);
            setisLoading(false);
            if (res?.Response === "Success") {
                Alert.alert(
                    "Success", 
                    `${res?.Message}\n Amount :${amount}`, 
                    
                    [{ text: "OK" }]
                );
            } else {
                setisLoading(false);
                Alert.alert(
                    "Error", 
                    `${res?.Message}`, 
                    
                    [{ text: "OK" }]
                );
            }
    
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Error", 
                "An error occurred while processing the fund transfer.", 
                [{ text: "OK" }]
            );
        }
    };
    
    const RetailerDetailsDialog = ({ visible, onClose, retailerDetails }) => (
        <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.dialogContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Retailer Info</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
                        <DetailRow label="Retailer Name" value={retailerDetails.RetailerName} />
                        <DetailRow label="Firm Name" value={retailerDetails.Frm_Name} />
                        <DetailRow label="Mobile No" value={retailerDetails.Mobile} />
                        <DetailRow label="Email Id" value={retailerDetails.Email} />
                    </View>
                </View>
            </View>
        </Modal>
    );

    const DetailRow = ({ label, value }) => (
        <View style={styles.row}>
            <Text style={styles.label}>{label}:</Text>
            <Text style={styles.value}>{value || ''}</Text>
        </View>
    );

    return (
        <View style={styles.main}>
            <AppBarSecond title={'R To R Fund Transfer'} />
            <View style={styles.container}>
                <FlotingInput
                    label="Enter Retailer ID"
                    value={id}
                    onChangeTextCallback={(text) => {
                        setId(text);
                        if (text.length === 10) {
                            RetailerData(text);
                            console.log(text)

                        } else {
                            //  RetailerData(text);
                        }
                    }}
                />
                {isLoading && <ShowLoader/>}
                <FlotingInput
                    label="Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeTextCallback={(text) => {
                        setAmount(text);
                    }} />
                <FlotingInput
                    label="Re Amount"
                    keyboardType="numeric"
                    value={reAmount}
                    onChangeTextCallback={(text) => {
                        setReAmount(text);
                    }}
                />
                <FlotingInput
                    label="Comments"
                    value={comments}
                    onChangeTextCallback={(text) => {
                        setComments(text);
                    }} />
                <DynamicButton title={'Fund Transfer'}
                    onPress={FundTransfer
                    }
                />
            </View>
            <RetailerDetailsDialog
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                retailerDetails={retailer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff'

    },
    container: {
        flex: 1,
        paddingVertical: hScale(20),
        paddingHorizontal: hScale(10),
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    dialogContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'red',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 10,
    },
    title: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        color: '#ffffff',
        fontSize: 20,
    },
    content: {
        marginTop: 15,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    label: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ee',
        flex: 1,
    },
});

export default RtorScreen;
