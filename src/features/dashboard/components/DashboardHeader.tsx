import React, { memo, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, AsyncStorage, TouchableOpacity, Alert } from 'react-native';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import MenuIcon from './MenuIcon';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import { BalanceType } from '../utils';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import { decryptData } from '../../../utils/encryptionUtils';
import RefreshSvg from '../../drawer/svgimgcomponents/RefreshSvg';
import { useNavigation } from '@react-navigation/native';
import HoldcreditSvg from '../../drawer/svgimgcomponents/HoldcreditSvg';

const DashboardHeader = ({ refreshPress }) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const { get } = useAxiosHook();
  const [balanceInfo, setBalanceInfo] = useState<BalanceType | undefined>();
  const [firmname, setfirmName] = useState<any>();
  const navigation = useNavigation<any>();

  const getData = useCallback(async () => {
    try {
      const userInfo = await get({ url: APP_URLS.getUserInfo });
      const data = userInfo.data;
      const response = await get({ url: APP_URLS.balanceInfo });
      setBalanceInfo(response.data[0]);
      const adminFarmName = decryptData(data.vvvv, data.kkkk, data.adminfarmname);
      setfirmName(adminFarmName);

      await AsyncStorage.setItem('adminFarmData', JSON.stringify({
        adminFarmName: adminFarmName,
        frmanems: decryptData(data.vvvv, data.kkkk, data.frmanems),
        photoss: data.photoss ? decryptData(data.vvvv, data.kkkk, data.photoss) : 'Default Value',
      }));

    } catch (error) {
      if (error.message === 'Network Error') {
        // Alert.alert(
        //   'Network Error',
        //   'Check your network connection and try again.',
        //   [
           
        //     { text: 'Cancel', style: 'cancel' },
        //   ]
        // );
      } else {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    
    }
  }, [get]);

  useEffect(() => {

    const interval = setInterval(() => {
      getData(); 
    }, 10000);

    return () => clearInterval(interval);
  }, [getData]);

  return (
    <View style={styles.main}>

      <View style={[styles.Headers, { backgroundColor: 'rgba(0, 0, 0, 0.0)' }]}>
        <View style={styles.MenuLogo}>
          <MenuIcon />
          <Text style={styles.appname} ellipsizeMode="tail" numberOfLines={2}>
            {firmname ? firmname : ''}
          </Text>
        </View>
        {/* <View style={styles.headarrow}>

          <TouchableOpacity style={styles.qrcode} onPress={refreshPress}>
            <RefreshSvg size={wScale(35)} />
          </TouchableOpacity>
          
        </View> */}
        <View style={styles.PossOrWall}>

          <View style={styles.poscontainer}>
            <Text style={styles.balenstext}>Pos Bal ₹</Text>
            <Text style={styles.balensnumber}>{balanceInfo?.posremain.toString()}</Text>
          </View>
          <View style={styles.devider} />
          <View style={[styles.poscontainer, {}]}>
            <Text style={styles.balenstext}>Main Wallet ₹</Text>
            <Text style={styles.balensnumber}>{balanceInfo?.remainbal.toString()}</Text>
          </View>
        </View>

      </View>
     

    </View>
  );
};

export default memo(DashboardHeader);

const styles = StyleSheet.create({
  main: {
    width: '100%'
  },
  PossOrWall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poscontainer: {
    height: hScale(35),
    justifyContent: 'space-between',
    paddingHorizontal: wScale(5),

  },

  Headers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hScale(2),
    paddingBottom: hScale(5),
    paddingHorizontal: wScale(5),
  },
  headarrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: wScale(5)

  },
  MenuLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  appname: {
    fontSize: wScale(16),
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'left',
    height: 'auto',
    width: wScale(120),
    paddingLeft: wScale(5),
    lineHeight: 15,
  },
  balenstext: {
    fontSize: wScale(11),
    color: '#fff',
    textTransform: 'uppercase',
    textAlign: 'center',
    height: 'auto',
    paddingTop: hScale(1),
  },

  balensnumber: {
    fontSize: wScale(13, 1),
    color: '#fff',
    alignSelf: 'center',
    fontWeight: 'bold',

  },
  qrcode: {
    paddingHorizontal: wScale(7),
    marginLeft: wScale(15)
  },
  devider: {
    width: wScale(.1),
    height: hScale(28),
    backgroundColor: '#fff',
    padding: wScale(.2),
    marginHorizontal:4
  },
});
