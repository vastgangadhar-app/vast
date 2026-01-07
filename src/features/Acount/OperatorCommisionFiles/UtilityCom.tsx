import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { RootState } from '../../../reduxUtils/store';
import { useSelector } from 'react-redux';
import { colors, FontSize } from '../../../utils/styles/theme';
import { hScale, wScale } from '../../../utils/styles/dimensions';

const UtilityCommission = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`
  const { get } = useAxiosHook();
  const [list, setList] = useState([])

  useEffect(() => {
    const fetchCommissionData = async (operator) => {
      try {
        const url = `${APP_URLS.opComm}ddltype=${operator}`;
        const response = await get({ url });
        console.log('Prepaid');
        console.log('Prepaid');

        setList(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCommissionData('Utility');
  }, [])
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.firstCell,]}>{item.OperatorName}</Text>
      <Text style={[styles.cell, styles.secondCell]}>{item.OperatorCode}</Text>
      <Text style={[styles.cell, styles.third,]}>{item.Commission}</Text>

    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colorConfig.secondaryColor, }]}>
        <Text style={[styles.headerCell, styles.firstCell,]}>Operator</Text>
        <Text style={[styles.headerCell, styles.secondCell]}>Operator</Text>
        <Text style={[styles.headerCell, styles.third,]}>{' Commision By Range'}</Text>

      </View>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => item.OperatorCode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  headerCell: {
    fontWeight: 'bold',
    textAlign: 'center',
    borderLeftWidth: wScale(1),
    fontSize: FontSize.xSmall,
    color: colors.white,
    textAlignVertical: 'center',
    paddingVertical: hScale(5)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cell: {
    textAlign: 'center',
    borderLeftWidth: wScale(1),
    borderBottomWidth: wScale(1),
    color: colors.black75,
    paddingVertical: hScale(5),
    
  },
  firstCell: {
    borderLeftWidth: 0,
    flex: 2
  },
  secondCell: {
    flex: 1
  },
  third: {
    borderRightWidth: 0,
    flex: 2
  },
});

export default UtilityCommission;
