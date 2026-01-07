import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';

const PancardCom = () => {
  const { get } = useAxiosHook();
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        const url = `${APP_URLS.opComm}ddltype=Pancard`;
        const response = await get({ url });

        if (response && Array.isArray(response)) {
          setList(response);
        } else {
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        console.error("Error fetching commission data:", error);
      }
    };

    fetchCommissionData();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.itemContainer}>
        {Object.entries(item).map(([key, value], index) => (
          <Text key={index} style={styles.text}>
            <Text style={styles.keyText}>{key}: </Text>
            <Text style={styles.valueText}>{value !== null ? value.toString() : 'N/A'}</Text>
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={list}
        renderItem={renderItem}
        estimatedItemSize={50}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // Light background for the whole container
  },
  itemContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff', // White background for each item
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow effect
  },
  text: {
    fontSize: 14,
    color: '#333', // Text color
    marginBottom: 4, // Space between rows
  },
  keyText: {
    fontWeight: 'bold', // Make the key text bold
    color: '#555', // Slightly lighter color for keys
  },
  valueText: {
    color: '#333', // Darker color for values
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default PancardCom;
