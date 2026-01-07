import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DynamicButton from '../../drawer/button/DynamicButton';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import GetBenifiaryScreen from './GetBenifiaryScreen';
import DmtTabScreen from '../Dmt/DmtTabScreen';

const MoneyTransferScreen = () => {
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  const { get, post } = useAxiosHook();
const [isOk,setIsOk] = useState(false);
  useEffect(() => {
   //CheckDmtstatus();
  }, []);

  const buttonTextColor = colorScheme === 'dark' ? 'white' : 'black';

  const CheckDmtstatus = async () => {
    try {
      const url = `${APP_URLS.Dmtstatus}`;
      const response = await get({ url: url });
      console.log(url);
      console.log(response);
      const msg = response.Message;
      const Response = response.Response; 
           const Name = response.Name;

      // {"Message": "", "Name": "RADIANT", "Response": "Success"}
      if (Response === 'Success') {
       // setIsOk(Response === 'Success')
      navigation.navigate('GetBenificiaryScreen',{Name:Name});
      } else if (msg === 'BOTHNOTDONE' || msg === 'NOTOK' || msg === 'ALLNOTDONE' || msg === 'PURCHASE') {
        navigation.navigate('ServicepurchaseScreen', { typename: 'DMT' });
      } else if (msg === 'OTPREQUIRED') {


      }





    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DmtTabScreen/>
    // <View>
    //   <AppBarSecond title={'To Bank Account'} />
    //   <View style={styles.container}>


    //     <DynamicButton
    //       title={'To Account'}
    //       onPress={() => {
    //         navigation.navigate('DmtTabScreen');

    //        CheckDmtstatus();

    //       }}
    //       styleoveride={{ marginVertical: hScale(10), }}
    //     />

    //     <DynamicButton
    //       title={'To Upi'}
    //       onPress={() => {
    //         navigation.navigate('UpiGetBenificiaryScreen');

    //       }}
    //       styleoveride={{ marginVertical: hScale(10), }}
    //     /> 

    //   </View>
    // </View>


  );
};

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: wScale(15),
    paddingTop: hScale(20)
  },
  button: {
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
  },
});

export default MoneyTransferScreen;
