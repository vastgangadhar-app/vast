import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { hScale, wScale } from '../../utils/styles/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Calendarsvg from '../drawer/svgimgcomponents/Calendarsvg';
import SearchIcon from '../drawer/svgimgcomponents/Searchicon';

const FundReceivedReport = () => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDate2, setSelectedDate2] = useState(new Date());
    const [inforeport, setInforeport] = useState([]);
    const [loading, setLoading] = useState(true);
    const { get, post } = useAxiosHook();
    const demoData = [
        {
            SenderId: 'Demo Sender',
            Date: '2024-06-20',
            OldBal: 5000,
            CurrentBal: 6000,
            Amount: 1000
        },
    ];

    const FundRecReport = async () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const url = `${APP_URLS.retailerBalRecRep}from=${formattedDate}&to=${formattedDate}&remid=ALL`;
        try {
            const response = await get({ url: `${APP_URLS.retailerBalRecRep}from=${formattedDate}&to=${formattedDate}&remid=` });
            console.log(response);
            if (!response) {
                throw new Error('Network response was not ok');
            }
            setInforeport(response);
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to load data, showing demo data');
            setInforeport(demoData);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        FundRecReport();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.container}>
            <View style={[styles.itemContainer, { backgroundColor: color1 }]}>
                <View style={styles.row}>
                    <View style={styles.leftColumn}>
                        <Text style={styles.label}>{'Name'}</Text>
                        <Text style={styles.value}>{item.SenderId === '' ? '....' : item.SenderId}</Text>
                    </View>
                    <View style={styles.rightColumn}>
                        <Text style={styles.label}>{'Date'}</Text>
                        <Text style={styles.value}>{item.Date}</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text style={styles.label}>{'Pre Balance'}</Text>
                        <Text style={styles.value}>₹ {item.OldBal}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>{'Post Balance'}</Text>
                        <Text style={styles.value}>₹ {item.CurrentBal}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.label}>{'Amount'}</Text>
                        <Text style={styles.value}>₹ {item.Amount}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (

        <View>

            <AppBarSecond
                title="Fund Recieved Report"
                onActionPress={undefined}
                actionButton={undefined}
                onPressBack={undefined}
            />

            <LinearGradient
                colors={[colorConfig.primaryColor, colorConfig.secondaryColor]}>

                <View style={[styles.header,]}>
                    <TouchableOpacity style={styles.datePickerButton}>

                        <Calendarsvg color='#fff' />
                        <View style={{ paddingLeft: wScale(5) }}>
                            <Text style={styles.buttonText}>From Date</Text>
                            <Text style={styles.dateText}>{selectedDate2.toISOString().split('T')[0]}</Text>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity style={styles.datePickerButton}>
                        <Calendarsvg color='#fff' />
                        <View style={{ paddingLeft: wScale(5) }}>


                            <Text style={styles.buttonText}>To Date</Text>
                            <Text style={styles.dateText}>{selectedDate.toISOString().split('T')[0]}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.searchButton, { backgroundColor: colorConfig.secondaryColor }]}>
                        <SearchIcon size={25} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <FlatList
                data={inforeport}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wScale(10),
        paddingVertical: hScale(5),
        marginVertical: hScale(5),
    },
    itemContainer: {
        paddingHorizontal: wScale(10),
        borderRadius: 5,
        paddingVertical: hScale(5)
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: wScale(10),
        borderRadius: 5,
    },
    datePickerButton: {
        paddingHorizontal: wScale(10),
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: wScale(1),
        borderColor: '#000'

    },
    searchButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wScale(15),
        backgroundColor: '#007bff',
        borderRadius: 5,
        borderWidth: wScale(1),
        borderColor: '#000'
    },
    buttonText: {
        color: '#fff',
        fontSize: wScale(14),
    },
    dateText: {
        color: '#fff',
        fontSize: wScale(14),
    },
    timetext: {
        color: '#000',
        fontSize: wScale(14),
    },
    timenumber: {
        color: '#000',
        fontSize: wScale(16),
        fontWeight: 'bold'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    leftColumn: {
    },
    rightColumn: {
        flex: 1,
        alignItems: 'flex-end',

    },
    column: {
        alignItems: 'center',
        borderWidth: wScale(.5),
        borderRadius: 100,
        paddingHorizontal: wScale(20),
        paddingVertical: hScale(2),
        width: '30%',
        marginTop: hScale(5)
    },
    label: {
        fontSize: wScale(12),
        color: '#666666',
    },
    value: {
        fontSize: wScale(14),
        fontWeight: 'bold',
        color: '#333333',
    },
});

export default FundReceivedReport;
