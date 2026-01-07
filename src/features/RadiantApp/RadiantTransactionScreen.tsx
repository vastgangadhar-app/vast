import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { wScale, hScale, SCREEN_WIDTH } from '../../utils/styles/dimensions';
import RadintTransactSvg from '../drawer/svgimgcomponents/RadintTransactSvg';
import RadintEditSvg from '../drawer/svgimgcomponents/RadintEditSvg';
import RadintPickupSvg from '../drawer/svgimgcomponents/RadintPickupSvg';
import { colors } from '../../utils/styles/theme';
import RadintDepositSvg from '../drawer/svgimgcomponents/RadintDepositSvg';
import RadintChequeSvg from '../drawer/svgimgcomponents/RadintChequeSvg';
import RadintDeliverySvg from '../drawer/svgimgcomponents/RadintDeliverySvg';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import PicUpScreen from './RadiantTrxn/PicUpScreen';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import LinearGradient from 'react-native-linear-gradient';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import BalanceCheck from '../Financial/Aeps/Balancecheck';
import AepsCW from '../Financial/Aeps/AepsCashwithdrawl';
import AepsMinistatement from '../Financial/Aeps/AepsMinistatement';
import AppBar from '../drawer/headerAppbar/AppBar';
import PagerView from 'react-native-pager-view';
// import NextErrowSvg2 from './drawer/svgimgcomponents/NextErrowSvg2';
import NextErrowSvg2 from '../drawer/svgimgcomponents/NextErrowSvg2';

const RadiantTransactionScreen = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);

  const transactions = [
    {
      id: '1', title: 'Cash Pickup',
      description: 'Humari mobile application ek powerful aur user-friendly tool hai jo aapke dincharya ko behtar banane aur productivity badhane ke liye design ki gayi hai. Is app ke madhyam se users apni tasks aur schedules ko',
      nav: 'CashPickup',
      img: <RadintPickupSvg />
    },
    {
      id: '2', title: 'Cash Delivery',
      description: 'Humari mobile application ek powerful aur user-friendly tool hai jo aapke dincharya ko behtar banane aur productivity badhane ke liye design ki gayi hai. Is app ke madhyam se',

      nav: 'CashDelivery', img: <RadintDeliverySvg />
    },
    {
      id: '3', title: 'Cheque Pickup',
      description: 'Humari mobile application ek powerful aur user-friendly tool hai jo aapke dincharya ko behtar banane aur productivity badhane ke liye design ki gayi hai. Is app ke madhyam se',

      nav: 'ChequePickup', img: <RadintChequeSvg />
    },
    {
      id: '4', title: 'Deposit',
      description: 'Humari mobile application ek powerful aur user-friendly tool hai jo aapke dincharya ko behtar banane aur productivity badhane ke liye design ki gayi hai. Is app ke madhyam se',

      nav: 'Deposit', img: <RadintDepositSvg />
    },
  ];

  const handleTransactionPress = (item) => {

    console.log(item)
    navigation.navigate(item.nav);
  };

  const handleBack = () => {
    navigation.goBack();
  };


  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => handleTransactionPress(item)}>
      <View style={[styles.svgimg, { backgroundColor: color1 }]}>
        {item.img}
      </View>
      <View style={styles.inveiw}>
        <Text style={styles.cardText}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>

      </View>
      <NextErrowSvg2 color='#000' />

    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[colorConfig.primaryColor, colorConfig.secondaryColor]} style={styles.LinearGradient}>
      <AppBar title={'R A D I A N T   C M S'} />


      <View style={styles.main}>
        <View style={[styles.topcontainer,
        { backgroundColor: '#ffe066', borderColor: '#fccb0a' }
        ]}>
          <Image source={require('../../../assets/images/images__1___1_.jpg')}
            style={styles.imgstyle}
            resizeMode="contain" />
          <View style={styles.column}>
            <Text style={styles.title}>Radiant</Text>
            <Text style={styles.title2}>Cash Management Services LTD.</Text>
          </View>
        </View>
        <ScrollView>
          <View style={styles.container}>
            <FlatList
              data={transactions}
              renderItem={renderTransactionItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </ScrollView>
      </View>
    </LinearGradient >
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: wScale(10),
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  LinearGradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: wScale(8),
  },
  textstyle: {
    fontSize: wScale(18),
    color: colors.white,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    paddingVertical: hScale(5),
    paddingHorizontal: wScale(5),
    marginBottom: hScale(10),
    shadowColor: '#000',
    elevation: 5,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    borderColor: colors.black_primary_blur,
    borderRadius: 5,
    justifyContent: 'space-between'
  },
  cardText: {
    color: 'black',
    fontSize: wScale(20),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: wScale(3),
  },
  inveiw: {
    flex: 1,
    paddingLeft: wScale(10)
  },
  description: {
    color: 'black',
    fontSize: wScale(14),
    textAlign: 'justify',
  },
  imgstyle: {
    width: wScale(90),
    height: wScale(90),
  },
  svgimg: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(5)
  },
  topcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(8),
    borderRadius: 5,
    borderWidth: 4,
    marginBottom: hScale(10)
  },
  column: {
  },
  title:
  {
    fontSize: wScale(55),
    fontWeight: 'bold',
    color: '#322254',
    textTransform: 'uppercase',
    letterSpacing: wScale(3),
    lineHeight: 60
  },
  title2: {
    fontSize: 17,
    color: '#322254',
    marginTop: hScale(-6),
    fontWeight: 'bold'
  },

});

export default RadiantTransactionScreen;
