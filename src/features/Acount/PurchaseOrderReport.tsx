import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';

const PurchaseOrderReport = () => {
    const [inforeport, setInforeport] = useState([]);
    const [loading, setLoading] = useState(true);
    const { get, post } = useAxiosHook();

    const demoData = [
        {
            Rechargeno: '123',
            Responsetime: '12:30 PM',
            Amount: 1000,
            opt: 'Operator A',
            Status: 'Success',
            Response: 'OK'
        },
        {
            Rechargeno: '456',
            Responsetime: '01:00 PM',
            Amount: 2000,
            opt: 'Operator B',
            Status: 'Failed',
            Response: 'Error'
        },
    ];

    const FundRecReport = async () => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const url = `${APP_URLS.retailerBalRecRep}fromdate=${formattedDate}&todate=${formattedDate}`;

        try {
            const response = await post({
                url: `${APP_URLS.PurchaseOrderReport}txt_frm_date=2020-02-01&txt_to_date=${formattedDate}`
            });

            console.log('API Response:', response);

            if (!response || !response.Message) {
                throw new Error('Network response was not ok or data is empty');
            }

            setInforeport(response.Message);
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
        <View style={styles.card}>
            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.label}>Recharge No.</Text>
                    <Text style={styles.value}>{item.Rechargeno || '...'}</Text>
                </View>
                <View style={styles.column}>
                    <Text style={styles.label}>Response Time</Text>
                    <Text style={styles.value}>{item.Responsetime || '0 0 0'}</Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
                <View style={styles.flexColumn}>
                    <Text style={styles.label}>Amount</Text>
                    <Text style={styles.value}>{`\u20B9 ${item.Amount}`}</Text>
                </View>
                <View style={[styles.flexColumn, styles.center]}>
                    <Text style={styles.label}>Operator</Text>
                    <Text style={styles.value}>{item.opt || '...'}</Text>
                </View>
                <View style={styles.flexColumn}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.value}>{item.Status || '...'}</Text>
                </View>
            </View>
            <View style={styles.row}>
                <Text style={styles.responseLabel}>Response</Text>
                <Text style={styles.responseValue}>{item.Response}</Text>
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
        <View >
            <AppBarSecond
                title="Purchase Orders Report"
                onActionPress={undefined}
                actionButton={undefined}
                onPressBack={undefined}
            />
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
        backgroundColor: '#f0f0f0',
    },
    card: {
        backgroundColor: 'white',
        marginBottom: 10,
        padding: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        marginHorizontal: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    column: {
        flex: 1,
    },
    flexColumn: {
        flex: 1,
        alignItems: 'center',
    },
    center: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#ddd',
    },
    label: {
        fontSize: 10,
        color: '#666666',
    },
    value: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 5,
    },
    responseLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    responseValue: {
        fontSize: 12,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'right',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PurchaseOrderReport;
