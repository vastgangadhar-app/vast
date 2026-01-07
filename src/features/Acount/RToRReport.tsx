import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import LinearGradient from 'react-native-linear-gradient';
import DateRangePicker from '../../components/DateRange';
import { FlashList } from '@shopify/flash-list';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { APP_URLS } from '../../utils/network/urls';
import useAxiosHook from '../../utils/network/AxiosClient';
import { RootState } from '../../reduxUtils/store';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';

const RToRReport = () => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`;

    const { userId } = useSelector((state: RootState) => state.userInfo);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const { post } = useAxiosHook();
    const [selectedDate, setSelectedDate] = useState({
        from: new Date().toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });
    const [selectedStatus, setSelectedStatus] = useState('ALL');


    const Rtor = async (from, to, status) => {
        setLoading(true);

        try {
            const formattedFrom = new Date(from).toISOString().split('T')[0];
            const formattedTo = new Date(to).toISOString().split('T')[0];
            const url = `${APP_URLS.RtorReport}txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&RetailerId1=${userId}`;

            const response = await post({ url: url });

            console.log(response, url, 'response');
            setTransactions(response.Report);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        Rtor(selectedDate.from, selectedDate.to, selectedStatus);
    }, []);

    const renderItem = ({ item }) => (
        <View style={[styles.cardContainer, { backgroundColor: color1 }]}>
            <View style={styles.balanceRow}>

                <View >
                    <Text style={styles.cardTitle}>Name</Text>
                    <Text style={styles.cardValue}>{item.transfertoretailername}</Text>
                </View>
                <View style={styles.balanceColumnRight}>
                    <Text style={styles.cardTitle}>Date</Text>
                    <Text style={styles.cardValue}>{item.tran_date}</Text>
                </View>
            </View>

            <View style={styles.balanceRow}>
                <View style={styles.balanceColumnLeft}>
                    <Text style={styles.cardTitle}>Pre Balance</Text>
                    <Text style={styles.cardValue}>₹ {item.rem_from_old_bal.toFixed(2)}</Text>
                </View>
                <View style={styles.balanceColumnCenter}>
                    <Text style={[styles.cardTitle,]}>Post Balance</Text>
                    <Text style={styles.cardValue}>₹ {item.rem_from_new.toFixed(2)}</Text>
                </View>
                <View style={styles.balanceColumnRight}>
                    <Text style={styles.cardTitle}>Amount</Text>
                    <Text style={styles.cardValue}>₹ {item.value.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.main}>
            <AppBarSecond title={'R To R History'} />
                <DateRangePicker
                    onDateSelected={(from, to) => setSelectedDate({ from, to })}
                    SearchPress={(from, to, status) => Rtor(from, to, status)}
                    status={selectedStatus}
                    setStatus={setSelectedStatus}
                    isStShow={false}
                />

            <View style={styles.container}>

                {loading ? <ActivityIndicator size="large" color={colorConfig.secondaryColor} /> : !Array.isArray(transactions) || transactions.length === 0 ? <NoDatafound /> :
                    <FlashList
                        data={transactions}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingVertical: hScale(15),
        paddingHorizontal: hScale(10)
    },

    cardContainer: {
        padding: wScale(10),
        marginBottom: hScale(12),
        borderRadius: 12,
    },

    cardTitle: {
        fontSize: wScale(14),
        color: '#333',
    },

    cardValue: {
        fontSize: wScale(14),
        fontWeight: 'bold',
        color: '#0d47a1',
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hScale(5),
    },
    balanceColumnLeft: {
        alignItems: 'flex-start',
        flex: 1,
    },
    balanceColumnCenter: {
        alignItems: 'center',
        flex: 1,
    },
    balanceColumnRight: {
        alignItems: 'flex-end',
        flex: 1,
    },

});

export default RToRReport;
