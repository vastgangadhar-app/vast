import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';

const HotelCom = () => {
  const { get } = useAxiosHook();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${APP_URLS.opComm}ddltype=HOTEL`;
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

  // Function to handle null values
  const handleNullValue = (value) => (value === null ? '0.00' : value.toFixed(2));

  return (
    <View style={styles.container}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.cell, styles.headerCell]}>Particulars</Text>
          <Text style={[styles.cell, styles.headerCell]}>Margin (%)</Text>
          <Text style={[styles.cell, styles.headerCell]}>GST (₹)</Text>
          <Text style={[styles.cell, styles.headerCell]}>TDS (₹)</Text>
        </View>
        {data.length > 0 && (
          data.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>
                {item.IsDomestic ? 'Domestic' : 'International'}
              </Text>
              <Text style={styles.cell}>
                {handleNullValue(item.marginPercentage)}
              </Text>
              <Text style={styles.cell}>
                {handleNullValue(item.gst)}
              </Text>
              <Text style={styles.cell}>
                {handleNullValue(item.tds)}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#f8f8f8',
  },
});

export default HotelCom;
