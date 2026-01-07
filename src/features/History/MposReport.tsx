import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import { useSelector } from 'react-redux';
import { hScale, wScale } from '../../utils/styles/dimensions';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import Icon from 'react-native-vector-icons/Ionicons';
import DateRangePicker from '../../components/DateRange';
import { RootState } from '../../reduxUtils/store';

const MPosScreenR = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const [present, setPresent] = useState(10);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchnumber, setSearchnumber] = useState('');
  const [heightview, setHeightview] = useState(false);

  const { get } = useAxiosHook();
  const { userId } = useSelector((state) => state.userInfo);
  useEffect(() => {
    recentTransactions(selectedDate.from, selectedDate.to, selectedStatus);
  }, []);

  const handlePress = (item) => {
    setHeightview(!heightview);

  };

  const recentTransactions = async (from, to, status) => {
    setLoading(true);
    try {
      const formattedFrom = new Date(from).toISOString().split('T')[0];
      const formattedTo = new Date(to).toISOString().split('T')[0];
      const url = `${APP_URLS.mposRrport}txt_frm_date=2022-12-05&txt_to_date=${formattedFrom}&Type=`;
      const response = await get({ url: url });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPresent((prev) => prev + 10);
  };

  const TransactionDetails = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.tileHeader}>
          <View style={styles.tileTitle}>
            <Text style={styles.text}>{`Transaction ID: ${item.TxnId}`}</Text>
            <Text style={styles.textBold}>{`RRN: ${item.rrn}`}</Text>
            <Text style={styles.text}>{`Status: ${item.status}`}</Text>
            <Text style={styles.text}>{`Merchant ID: ${item.merchant_id}`}</Text>
          </View>
          <View style={styles.tileStatus}>
            <Icon
              name={
                item.status === "Success" || item.status === "SUCCESS"
                  ? "checkmark-circle"
                  : item.status === "M_Pending"
                    ? "time"
                    : item.status === "Failed" || item.status === "FAILED"
                      ? "close-circle"
                      : "cash"
              }
              size={14}
              color={
                item.status === "Success" || item.status === "SUCCESS"
                  ? "green"
                  : item.status === "M_Pending"
                    ? "yellow"
                    : item.status === "Failed" || item.status === "FAILED"
                      ? "red"
                      : "orange"
              }
            />
            <Text style={styles.text}>{item.status}</Text>
            <Text style={styles.textBold}>{`\u{20B9} ${item.amount}`}</Text>
          </View>
        </View>
      </View>
    );
  };

 

  return (
    <View style={styles.main}>
      <AppBarSecond title={'mPOs History'} />
      <DateRangePicker
        onDateSelected={(from, to) => setSelectedDate({ from, to })}
        SearchPress={(from, to, status) => recentTransactions(from, to, status)}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        // searchnumber={searchnumber}
        // setSearchnumber={setSearchnumber}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          transactions.length === 0 ? (
            <Text style={styles.noDataText}>No data found</Text>
          ) : (
            <FlatList
              data={transactions.slice(0, present)}
              renderItem={({ item }) => <TransactionDetails item={item} />}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={
                transactions.length > present ? (
                  <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
                    <Text style={styles.loadMoreText}>Load More</Text>
                  </TouchableOpacity>
                ) : null
              }
            />
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },
  container: { flex: 1, paddingHorizontal: wScale(10), paddingVertical: hScale(20), },

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hScale(17),
  },
  button: {
    flex: 1,
    marginHorizontal: hScale(5),
    paddingVertical: hScale(17),
    borderRadius: hScale(5),
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: hScale(17),
  },
  loadMoreButton: {
    backgroundColor: 'gray',
    padding: 10,
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 5,
  },
  loadMoreText: {
    color: 'white',
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    backgroundColor: 'lightgray',
  },
  tileTitle: {
    flex: 1,
  },
  tileStatus: {
    flex: 1,
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 12,
  },
  textBold: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: hScale(20),
    fontSize: hScale(16),
    color: 'red',
  },
});

export default MPosScreenR;
