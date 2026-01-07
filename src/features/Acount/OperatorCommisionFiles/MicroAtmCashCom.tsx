import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';

const MicroAtmCashCom = () => {
  const { get } = useAxiosHook();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${APP_URLS.opComm}ddltype=MICROATMCASH`;
        const response = await get({ url });

        if (response && Array.isArray(response) && response.length > 0) {
          setData(response);
        } else {
          console.error("Invalid response format or empty data:", response);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [get]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PARTICULARS</Text>
        <Text style={styles.headerText}>MARGIN (%)</Text>
        <Text style={styles.headerText}>₹</Text>
        <Text style={styles.headerText}>MAX ₹</Text>
      </View>
      {data.length > 0 && (
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>0 to 1000</Text>
            <Text style={styles.value}>{data[0].cash_0_1000_per}%</Text>
            <Text style={styles.value}>₹ {data[0].cash_0_1000_rs.toFixed(2)}</Text>
            <Text style={styles.value}>₹ {data[0].cash_0_1000_maxrs.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>1001 to 2000</Text>
            <Text style={styles.value}>{data[0].cash_1001_2000_per}%</Text>
            <Text style={styles.value}>₹ {data[0].cash_1001_2000_rs.toFixed(2)}</Text>
            <Text style={styles.value}>₹ {data[0].cash_1001_2000_maxrs.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>500 to 999</Text>
            <Text style={styles.value}>{(data[0].per_500_999)}</Text>
            <Text style={styles.value}>₹ {data[0].rs_500_999.toFixed(2)}</Text>
            <Text style={styles.value}>₹ {data[0].maxrs_500_999.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>1000 to 1499</Text>
            <Text style={styles.value}>{(data[0].per_1000_1499)}%</Text>
            <Text style={styles.value}>₹ {data[0].rs_1000_1499.toFixed(2)}</Text>
            <Text style={styles.value}>₹ {data[0].maxrs_1000_1499.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>1500 to 1999</Text>
            <Text style={styles.value}>{(data[0].per_1500_1999)}%</Text>
            <Text style={styles.value}>₹ {data[0].rs_1500_1999.toFixed(2)}</Text>
            <Text style={styles.value}>₹ {data[0].maxrs_1500_1999.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>2000 to 2499</Text>
            <Text style={styles.value}>{(data[0].per_2000_2499)}%</Text>
            <Text style={styles.value}>₹ {data[0].rs_2000_2499.toFixed(2)}</Text>
            <Text style={styles.value}>₹ {data[0].maxrs_2000_2499.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>2500 to 2999</Text>
            <Text style={styles.value}>{(data[0].per_2500_2999)}%</Text>
            <Text style={styles.value}>₹ {data[0].rs_2500_2999.toFixed(2)}</Text>
            <Text style={styles.value}>₹ {data[0].maxrs_2500_2999.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>3000 to 3499</Text>
            <Text style={styles.value}>{(data[0].per_3000_3499)}%</Text>
            <Text style={styles.value}>₹ {data[0].rs_3000_3499.toFixed(2)}</Text>
            <Text style={styles.value}>₹ {data[0].maxrs_3000_3499.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>3500 to 5000</Text>
            <Text style={styles.value}>{(data[0].per_3500_5000)}%</Text>
            <Text style={styles.value}>₹ {data[0].rs_3500_5000.toFixed(2)}</Text>
            <Text style={styles.value}>₹ {data[0].maxrs_3500_5000.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>5001 to 10000</Text>
            <Text style={styles.value}>{(data[0].per_5001_10000)}%</Text>
            <Text style={styles.value}>₹ {data[0].rs_5001_10000.toFixed(2)}</Text>
            <Text style={styles.value}>₹ {data[0].maxrs_5001_10000.toFixed(2)}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  value: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    color: '#333',
  },
});

export default MicroAtmCashCom;
