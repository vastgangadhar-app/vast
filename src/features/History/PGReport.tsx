import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import { useSelector } from 'react-redux';
import { hScale, wScale } from '../../utils/styles/dimensions';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { RootState } from '../../reduxUtils/store';
import { FontSize } from '../../utils/styles/theme';
import OnelineDropdownSvg from '../drawer/svgimgcomponents/simpledropdown';
import ShareSvg from '../drawer/svgimgcomponents/sharesvg';
import ViewShot, { captureRef } from "react-native-view-shot";
import Share from "react-native-share";
import DateRangePicker from '../../components/DateRange';
import DynamicButton from '../drawer/button/DynamicButton';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';

const PaymentGReport = () => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`

    const [transactions, setTransactions] = useState([]);
    const [present, setPresent] = useState(10);
    const [loading, setLoading] = useState(false);
    const [heightview, setHeightview] = useState(false);
    const { post } = useAxiosHook();
    const { userId } = useSelector((state) => state.userInfo);
    const currentDate = new Date();
    const [selectedDate, setSelectedDate] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    const capRef = useRef();

    const recentTransactions = async (from, to, status) => {
        try {
            const formattedFrom = new Date(from).toISOString().split('T')[0];
            const formattedTo = new Date(to).toISOString().split('T')[0];
            setLoading(true);
            const url = `${APP_URLS.PaymentGateway}ddlstatus=${status}&pagesize=500&txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}`;
            const response = await post({ url });
            console.log(response.RESULT[0])
            console.log(url)
            if (response.Status === "Success") {
                const transactionsData = response.RESULT || [];
                setTransactions(transactionsData);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        recentTransactions(selectedDate.from, selectedDate.to, selectedStatus);
    }, [selectedDate, selectedStatus]);

    const handleLoadMore = () => {
        setPresent((prev) => prev + 10);
    };
    const handlebtn = (item) => {
        setHeightview(!heightview);

    }

    const TransactionDetails = ({ item }) => {
        const getStatusIcon = (status) => {
            switch (status) {
                case 'Success':
                    return 'check-circle';
                case 'Failed':
                    return 'error';
                case 'Pending':
                    return 'hourglass-empty';
                default:
                    return 'help-outline';
            }
        };
        const onShare = useCallback(async () => {
            try {
                const uri = await captureRef(capRef, {
                    format: "jpg",
                    quality: 0.7,
                });
                await Share.open({
                    message: "Hi, I am sharing the transaction details using Smart Pay Money App.",
                    url: uri,
                });
            } catch (e) {
                ToastAndroid.show("Transaction details not shared", ToastAndroid.SHORT);
            }
        }, []);

        return (
            <ViewShot
                ref={capRef}
                options={{
                    fileName: "TransactionReciept",
                    format: "jpg",
                    quality: 0.9,
                }}
            >
                <TouchableOpacity activeOpacity={0.9} style={[styles.card, {
                    backgroundColor: color1,
                    borderColor: item.status === 'Success' ? 'green' : item.status === 'Failed' ? 'red' : '#e6b42c'
                }

                ]}
                    onPress={() => handlebtn(item)} >
                    <View >
                        <View style={styles.tileTitle}>

                            <View style={styles.rowview}>
                                <Text style={styles.statusText}>{`Firm Name: ${item.Frm_Name}`}</Text>
                                <Text style={[styles.statusText,
                                { color: item.status === 'Success' ? 'green' : item.status === 'Failed' ? 'red' : '#e6b42c' }]}>
                                    {item.status}</Text>
                            </View>

                            <View style={[styles.rowview,]}>
                                <Text style={styles.timetex}>{`Txn Tyep : ${item.PG_TYPE}`}</Text>
                                <Text style={[styles.amounttex, { color: item.status === 'Success' ? 'green' : item.status === 'Failed' ? 'red' : '#e6b42c' }]}>₹ {`${item.amount}`}</Text>
                            </View>

                            <View style={[styles.border,]} />

                            <View style={[styles.rowview]}>
                                <View >
                                    <Text style={styles.statusText}>{`Bank RRN ${item.PG_TYPE}`}</Text>
                                    <Text style={styles.amounttex}>
                                        {item.bankrrnno ? item.bankrrnno : 'BankRRN'}
                                    </Text>
                                </View>
                                <View style={{ transform: [{ rotate: heightview ? '180deg' : '0deg' }] }}>
                                    <OnelineDropdownSvg />

                                </View>

                            </View>
                            <Text style={[styles.smstex,
                            {
                                backgroundColor: item.status === 'Success' ?
                                    'green' : item.status === 'Failed' ?
                                        'red' : '#e6b42c'
                            }]}>Your Transaction in Queue or {item.status}</Text>

                            <View style={styles.rowview}>
                                <View >
                                    <Text style={styles.timetex}>Request Time</Text>
                                    <Text style={styles.timetex}>{`${new Date(item.f_date).toLocaleString()}`}</Text>
                                </View>
                                <TouchableOpacity style={styles.shearbtn} onPress={onShare}>
                                    <ShareSvg size={wScale(20)} color='#000' />
                                    <Text style={[styles.sheartext, { backgroundColor: colorConfig.secondaryColor }]}>
                                        Shear
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {heightview ? <View>
                                <View style={[styles.border,]} />
                                <View style={[styles.rowview,]}>
                                    <Text style={styles.timetex}>Transaction ID</Text>
                                    <Text style={styles.timetex}>Payment Mode</Text>
                                </View>
                                <View style={[styles.rowview,]}>
                                    <Text style={[styles.amounttex,]}>{`${item.txnid}`}</Text>
                                    <Text style={[styles.amounttex,]}>{`${item.mode}`}</Text>
                                </View>

                                <View style={[styles.border,]} />
                                <View style={[styles.rowview,]}>
                                    <Text style={styles.timetex}>Pre Balance</Text>
                                    <Text style={styles.timetex}>Post Balance</Text>
                                </View>

                                <View style={[styles.rowview,]}>
                                    <Text style={[styles.amounttex,]}>₹ {`${item.remainpre}`}</Text>
                                    <Text style={[styles.amounttex,]}>₹ {`${item.remainpost}`}</Text>
                                </View>
                            </View> : null}

                        </View>

                    </View>
                </TouchableOpacity>
            </ViewShot>

        );
    };

    return (
        <View style={styles.main}>
            <AppBarSecond title="Payment Gateway History" />
            <DateRangePicker
                onDateSelected={(from, to) => {
                    setSelectedDate({ from, to });
                }}
                SearchPress={(from, to, status) => {
                    recentTransactions(from, to, status);
                }}
                status={selectedStatus}
                setStatus={setSelectedStatus}
            />
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#4CAF50" />
                ) : transactions.length === 0 ? (
                    <NoDatafound />
                ) : (
                    <FlatList
                        data={transactions.slice(0, present)}
                        renderItem={({ item }) => <TransactionDetails item={item} />}
                        keyExtractor={(item, index) => index.toString()}
                        ListFooterComponent={
                            transactions.length > present ? (

                                <DynamicButton title={'Loar More'} onPress={handleLoadMore} />
                            ) : null
                        }
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: { flex: 1 },
    container: {
        flex: 1, paddingHorizontal: wScale(15),
        paddingVertical: wScale(15)
    },
    card: {
        marginBottom: hScale(16),
        borderWidth: wScale(.7),
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        paddingHorizontal: wScale(10),
        paddingVertical: hScale(8)
    },
    rowview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    border: {
        borderBottomWidth: wScale(.7),
        borderColor: '#000',
        paddingVertical: hScale(4)
    },

    frmname: {
        fontSize: FontSize.small,
        color: '#333',
        fontWeight: 'bold'
    },
    amounttex: {
        fontSize: FontSize.regular,
        color: '#000',
        fontWeight: 'bold'
    },
    statusText: {
        fontSize: FontSize.small,
        color: '#000',

    },
    timetex: {
        fontSize: FontSize.regular,
        color: '#000',
    },
    shearbtn: {
        alignItems: 'center'
    },
    sheartext: {
        fontSize: FontSize.tiny,
        color: '#FFF',
        paddingHorizontal: wScale(4),
        borderRadius: 10,
        paddingVertical: hScale(2)
    },
    smstex: {
        fontSize: FontSize.teeny,
        color: '#FFF',
        letterSpacing: wScale(1),
        textAlign: 'center',
        flex: 1,
        marginVertical: hScale(4)
    },
    text: {
        fontSize: hScale(14),
        color: '#666',
        marginVertical: hScale(2),
    },

    tileTitle: {
        flex: 1,
    },
    tileStatus: {
        alignItems: 'flex-end',
    },

    loadMoreButton: {
        backgroundColor: '#4CAF50',
        padding: hScale(10),
        alignItems: 'center',
        marginVertical: hScale(16),
        borderRadius: 5,
    },
    loadMoreText: {
        color: '#fff',
        fontSize: hScale(16),
    },
    noDataText: {
        textAlign: 'center',
        marginVertical: hScale(20),
        fontSize: hScale(18),
        color: '#D32F2F',
    },
});

export default PaymentGReport;
