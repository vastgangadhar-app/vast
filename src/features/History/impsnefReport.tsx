import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Animated, Easing } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { useSelector } from 'react-redux';
import RecentHistory from '../../components/RecentHistoryBottomSheet'; // Ensure this is used or remove it
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import DateRangePicker from '../../components/DateRange';
import { hScale, wScale } from '../../utils/styles/dimensions';
import { useNavigation } from '@react-navigation/native';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';
import { FontSize } from '../../utils/styles/theme';
import { RootState } from '../../reduxUtils/store';
import OnelineDropdownSvg from '../drawer/svgimgcomponents/simpledropdown';
import ShareSvg from '../drawer/svgimgcomponents/sharesvg';
import AepsReportSvg from '../drawer/svgimgcomponents/AepsReportSvg';
import MStateMentReporSvg from '../drawer/svgimgcomponents/MStateMentReporSvg';
import AadharReporSvg from '../drawer/svgimgcomponents/AadharReporSvg';
import CheckBalSvg from '../drawer/svgimgcomponents/CheckBlreporSvg';
import Upisvg from '../drawer/svgimgcomponents/Upisvg';

const ImpsNeftScreen = () => {
  const navigation = useNavigation(); // Ensure navigation is accessible
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const color2 = `${colorConfig.primaryButtonColor}60`;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchnumber, setSearchnumber] = useState('');
  const [heightview, setHeightview] = useState(false);
  const [borderColor] = useState(new Animated.Value(0));

  const { get } = useAxiosHook();
  const { userId } = useSelector((state) => state.userInfo);
  useEffect(() => {
    recentTransactions(selectedDate.from, selectedDate.to, selectedStatus);
    Animated.loop(
      Animated.sequence([

        Animated.timing(borderColor, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,

        }),

        Animated.timing(borderColor, {
          toValue: 0,
          duration: 1000, // Duration for red to black transition
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();

  }, [borderColor]);

  const animatedBorder = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [color1, color2]
  })
  const handlePress = (item) => {
    setHeightview(!heightview);

  };

  const recentTransactions = async (from, to, status) => {
    setLoading(true);
    try {
      const formattedFrom = new Date(from).toISOString().split('T')[0];
      const formattedTo = new Date(to).toISOString().split('T')[0];

      const url = `Money/api/Money/GetBeneIMPSReport?pageindex=1&pagesize=500&role=Retailer&Id=${userId}&txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&status=${status}&transtype=ALL&senderno=${searchnumber}`;
      console.log(url);
      const response = await get({ url });
      setTransactions(response);
      console.log(response);

    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.4} style={[styles.card, {
      backgroundColor: color1,
      borderColor: item.Status === 'SUCCESS' ? 'green' : item.Status === 'FAILED' ? 'red' : '#e6b42c'
    }]}
      onPress={() => handlePress(item)} >
      <View >

        <View style={styles.rowview}>

          <View style={styles.drporow}>
            {/* {item.TYPE === 'Balance' ?
              <Upisvg />
              : item.TransactionType === 'Aadhar Pay' ?
                <AadharReporSvg />
                : item.TYPE === 'Mini StateMent' ?
                  <MStateMentReporSvg />
                  : <AepsReportSvg />


            } */}

            <View style={{ paddingLeft: wScale(10), }}>
              <Text style={styles.timetex}>{item.BankName === "" ? ('No Name') : item.BankName}
              </Text>
              <Text style={styles.amounttex}>{item.AccountNo === '' ? "....." : item.AccountNo}</Text>

            </View>
          </View>


          <View>
            <Text style={[styles.statusText, styles.textrit,
            { color: item.Status === 'SUCCESS' ? 'green' : item.Status === 'FAILED' ? 'red' : '#e6b42c' }]}>
              {item.Status}</Text>
            <Text style={[styles.amounttex, styles.textrit,
            {
              color: item.Status === 'SUCCESS' ? 'green' :
                item.Status === 'FAILED' ? 'red' : '#e6b42c'
            }]}>₹ {`${item.Amount}`}</Text>

          </View>
        </View>

        <View style={[styles.rowview,]}>

          <Text style={[styles.smstex,
          {
            flex: 0,
            letterSpacing: 0,

            backgroundColor: item.TransactionType === 'IMPS_VERIFY' ?
              'green' :
              'red',

          }]}>{item.TransactionType === 'IMPS_VERIFY' ?
            'Verified A/C' :
            ' Non Verify A/C'}
          </Text>
          <Text style={[styles.smstex,
          {
            backgroundColor: item.Status === 'SUCCESS' ?
              'green' : item.Status === 'FAILED' ?
                'red' : '#e6b42c',
          }]} numberOfLines={1} ellipsizeMode='tail'>Your Transaction is {item.Status}
          </Text>
        </View>
        <View style={[styles.rowview]}>
          <View >
            <Text style={styles.statusText}>IFS CODE</Text>
            <Text style={styles.timetex}>
              {item.IFSC ? item.IFSC : 'ifs code..'}
            </Text>
          </View>
          <View style={styles.drporow}>
            <View style={styles.dropview}>
              <Text style={[styles.statusText, styles.textrit]}>Sender Info</Text>
              <Text style={[styles.amounttex, styles.textrit]}>
                {item.Sender}
              </Text>
            </View>
            <View style={[{ transform: [{ rotate: heightview ? '180deg' : '0deg' }] }]}>
              <OnelineDropdownSvg />
            </View>
          </View>

        </View>
        <View style={[styles.border, { marginTop: 0 }]} />

        <View style={styles.rowview}>
          <Text style={[styles.statusText, styles.textrit]}>Receiver Name</Text>
          <Text style={[styles.timetex,]}>
            {item.Receiver}
          </Text>

        </View>
        <View style={styles.rowview}>
          <Text style={[styles.statusText, styles.textrit]}>Bank RRn</Text>
          <Text style={[styles.timetex,]}>
            {item.BankRefId ? item.BankRefId : 'BankRRN'}
          </Text>

        </View>
        <View style={[styles.border,]} />

        <View style={styles.rowview}>
          <View >
            <Text style={styles.statusText}>Request Time</Text>
            <Text style={styles.timetex}>{item.M_Date}</Text>
          </View>
          {
            item.api_name === 'VASTWEB' && item.Dmttype === 'DMTN'
              // && item.Status === 'Pending'
              ?
              <TouchableOpacity >
                <Animated.View style={[styles.refbut, { backgroundColor: animatedBorder }]}>
                  <Text style={[styles.reftext, {}]}>Refund</Text>
                </Animated.View>
              </TouchableOpacity>
              : null
          }

          <TouchableOpacity style={styles.shearbtn}
          //  onPress={onShare}
          >
            <ShareSvg size={wScale(20)} color='#000' />
            <Text style={[styles.sheartext, { backgroundColor: colorConfig.secondaryColor }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>

        {heightview ? <View>
          <View style={[styles.border,]} />
          <View style={[styles.rowview,]}>
            <Text style={styles.statusText}>Transaction ID</Text>
            <Text style={styles.statusText}>Transaction Mode</Text>
          </View>
          <View style={[styles.rowview,]}>
            <Text style={[styles.timetex,]}>{`${item.TransactionId}`}</Text>
            <Text style={[styles.timetex,]}>{`${item.TransactionType}`}</Text>
          </View>

          <View style={[styles.border,]} />
          <View style={[styles.rowview,]}>
            <Text style={[styles.statusText, { flex: 1 }]}>Pre Balance</Text>
            <Text style={[styles.statusText, { flex: 1, textAlign: 'center' }]}>Debit</Text>
            <Text style={[styles.statusText, { flex: 1, textAlign: 'center' }]}>Pre Balance</Text>
            <Text style={[styles.statusText, styles.textrit, { flex: 1, }]}>My Earn</Text>
          </View>

          <View style={[styles.rowview,]}>
            <Text style={[styles.timetex, { flex: 1, }]}>₹ {`${item.REM_Remain_Pre}`}</Text>
            <Text style={[styles.timetex, { flex: 1, textAlign: 'center' }]}>₹ {`${item.Debit}`}</Text>
            <Text style={[styles.timetex, { flex: 1, textAlign: 'center' }]}>₹ {`${item.REM_Remain_Pre}`}</Text>
            <Text style={[styles.timetex, styles.textrit, { flex: 1 }]}>₹ {`${item.Dealer_Income}`}</Text>
          </View>
        </View> : null}

      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.main}>
      <AppBarSecond title={'IMPS History'} />
      <DateRangePicker
        onDateSelected={(from, to) => setSelectedDate({ from, to })}
        SearchPress={(from, to, status) => recentTransactions(from, to, status)}
        status={selectedStatus}
        setStatus={setSelectedStatus}
        searchnumber={searchnumber}
        setSearchnumber={setSearchnumber}
      />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={colorConfig.primary} />
        ) : (
          <>
            {transactions.length === 0 ? (
              <NoDatafound />
            ) : (
              <FlatList
                data={transactions}
                renderItem={renderItem}
                keyExtractor={(item) => item.Idno.toString()}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1 },
  container: { flex: 1, paddingHorizontal: wScale(10), paddingVertical: hScale(20), },
  card: {
    marginBottom: hScale(10),
    borderWidth: wScale(.7),
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingHorizontal: wScale(10),
    paddingVertical: hScale(8)
  },
  rowview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  border: {
    borderBottomWidth: wScale(.7),
    borderColor: '#000',
    paddingVertical: hScale(4)
  },
  amounttex: {
    fontSize: wScale(18),
    color: '#000',
    fontWeight: 'bold'
  },
  statusText: {
    fontSize: FontSize.small,
    color: '#000',
    fontWeight: 'bold'
  },
  timetex: {
    fontSize: FontSize.regular,
    color: '#000',
  },
  dropview: {
    paddingRight: wScale(10),
  },
  textrit: {
    textAlign: 'right',

  },
  drporow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shearbtn: {
    alignItems: 'center'
  },
  sheartext: {
    fontSize: FontSize.tiny,
    color: '#FFF',
    paddingHorizontal: wScale(4),
    borderRadius: 10,
    paddingVertical: hScale(2)
  },
  smstex: {
    fontSize: FontSize.tiny,
    color: '#FFF',
    letterSpacing: wScale(1),
    textAlign: 'center',
    flex: 1,
    marginVertical: hScale(4),
    borderRadius: 10,
    paddingHorizontal: wScale(5)
  },
  refbut: {
    width: wScale(90),
    borderWidth: wScale(1),
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: hScale(2)
  },
  reftext: {
    fontSize: wScale(14),
    color: '#000',
    fontWeight: 'bold'
  },

});

export default ImpsNeftScreen;
