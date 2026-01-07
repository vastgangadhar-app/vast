import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import { hScale, wScale } from '../../../utils/styles/dimensions';

const MposCom = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`
  const { get } = useAxiosHook();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);  // For loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${APP_URLS.opComm}ddltype=MPOS`;
        const response = await get({ url });

        if (response && Array.isArray(response) && response.length > 0) {
          setData(response);
        } else {
          console.error("Invalid response format or empty data:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);  // Stop loading once the data is fetched
      }
    };

    fetchData();
  }, [get]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header,{backgroundColor:colorConfig.secondaryColor}]}>
        <Text style={styles.headerText}>PARTICULARS</Text>
        <Text style={styles.headerText}>COMMISSION (₹)</Text>
      </View>
      {data.length > 0 && (
      <View style={[styles.content,{backgroundColor:color1}]}>
          <View style={styles.row}>
            <Text style={styles.label}>Max Cash Commission</Text>
            <Text style={styles.value}>₹ {data[0].maxcashcomm.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cash Withdraw</Text>
            <Text style={styles.value}>₹ {data[0].CashWithdraw.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sales Debit up to 2000</Text>
            <Text style={styles.value}>₹ {data[0].Salesdebitupto2000.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sales Debit above 2000</Text>
            <Text style={styles.value}>₹ {data[0].Salesdebitabove2000.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sales Credit Normal</Text>
            <Text style={styles.value}>₹ {data[0].SalescreditNormal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sales Credit Grocery</Text>
            <Text style={styles.value}>₹ {data[0].Salescreditgrocery.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sales Credit Edu and Insu</Text>
            <Text style={styles.value}>₹ {data[0].SalescreditEduandInsu.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>GST</Text>
            <Text style={styles.value}>₹ {data[0].gst.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Credit Type</Text>
            <Text style={styles.value}>{data[0].credit_type}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wScale(20),
    backgroundColor: '#f9f9f9', // Light background
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: hScale(5),
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: wScale(16),
    color: '#333',  
  },
  content: {
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    color: '#2ecc71',  // Green color for values
    fontWeight: '500',
  },
});

export default MposCom;
