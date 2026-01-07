
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import { useSelector } from 'react-redux';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond';
import { hScale, wScale } from '../../utils/styles/dimensions';
import DateRangePicker from '../../components/DateRange';
import { colors, FontSize } from '../../utils/styles/theme';
import NoDatafound from '../drawer/svgimgcomponents/Nodatafound';
import OnelineDropdownSvg from '../drawer/svgimgcomponents/simpledropdown';
import ShareSvg from '../drawer/svgimgcomponents/sharesvg';
import { RootState } from '../../reduxUtils/store';
import CheckBalSvg from '../drawer/svgimgcomponents/CheckBlreporSvg';
import AadharReporSvg from '../drawer/svgimgcomponents/AadharReporSvg';
import MStateMentReporSvg from '../drawer/svgimgcomponents/MStateMentReporSvg';
import AepsReportSvg from '../drawer/svgimgcomponents/AepsReportSvg';

const AEPSAdharPayR = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.secondaryColor}20`;
  const { get } = useAxiosHook();
  const { userId } = useSelector((state) => state.userInfo);
  const currentDate = new Date();
  const [ddlStatus, setDdlStatus] = useState('ALL');
  const [type, setType] = useState('ALL');
  const [serchMO, setMo] = useState('ALL');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchnumber, setSearchnumber] = useState('');
  const [heightview, setHeightview] = useState(false);

  useEffect(() => {
    recentTransactions(selectedDate.from, selectedDate.to, selectedStatus);
  }, []);
  const recentTransactions = async (from, to, status) => {
    setLoading(true);
    try {
      const formattedFrom = new Date(from).toISOString().split('T')[0];
      const formattedTo = new Date(to).toISOString().split('T')[0];
      const url = `${APP_URLS.aepsReport}pageindex=1&pagesize=500&userid=${userId}&txt_frm_date=${formattedFrom}&txt_to_date=${formattedTo}&ddl_status=${ddlStatus}&amount=&BankId=&aadhar=&Type=${type}&userserch_acc_mob=${serchMO}`;
      const response = await get({ url: url });
      console.log(url);
      console.log(response[0]);
      setTransactions(response || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handlePress = (item) => {
    setHeightview(!heightview);

  };

  const renderItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.4} style={[styles.card, {
      backgroundColor: color1,
      borderColor: item.Status === 'Success' || item.Status === 'Don' || item.Status === 'M_Success' ? 'green' : item.Status === 'FAILED' || item.Status === 'M_Failed' ? 'red' : '#e6b42c'
    }]}
      onPress={() => handlePress(item)}
    >
      <View >

        <View style={styles.rowview}>
          <View style={styles.drporow}>
            {item.TYPE === 'Balance' ?
              <CheckBalSvg />
              : item.TransactionType === 'Aadhar Pay' ?
                <AadharReporSvg />
                : item.TYPE === 'Mini StateMent' ?
                  <MStateMentReporSvg />
                  : <AepsReportSvg />}
            <View style={styles.bankInfoContainer}>
              <Text
                style={styles.timetex}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.BankName === "" ? 'No Name' : item.BankName}
              </Text>
              <Text style={styles.statusText}>
                {item.BankId === '' ? "....." : item.BankId}
              </Text>
            </View>
          </View>
          <View>

            <Text style={[styles.statusText, styles.textrit,
            {
              color: item.Status === 'Success' || item.Status === 'Done' || item.Status === 'M_Success' ? 'green' : item.Status === 'Failed' || item.Status === 'M_Failed' ? 'red' : '#e6b42c',
            }]} numberOfLines={1} ellipsizeMode='tail'>
              {item.Status == "Done" ? "Success" :
                item.Status == "Balance" ? "Balance Enquiry" :
                  item.Status == "M_Success" ? "Success" :
                    item.Status == "M_Failed" ? "Failed" :
                      item.Status == "Failed" ? "Failed" :
                        item.Status}


            </Text>
            <Text style={[styles.amounttex, styles.textrit]}>₹ {`${item.Amount}`}</Text>
          </View>

        </View>

        <View style={[styles.border,]} />

        <View style={[styles.rowview]}>
          <View >

            <Text style={styles.statusText}>Mobile No</Text>
            <Text style={styles.amounttex}>
              {item.Mobile ? item.Mobile : 'Mobile...'}
            </Text>
          </View>
          <View style={styles.drporow}>
            <View style={styles.dropview}>
              <Text style={[styles.statusText, styles.textrit]}>Consumer Aadhar</Text>
              <Text style={[styles.amounttex, styles.textrit]}>
                {item.AccountHolderAadhar}
              </Text>
            </View>
            <View style={[{ transform: [{ rotate: heightview ? '180deg' : '0deg' }] }]}>
              <OnelineDropdownSvg />
            </View>
          </View>
        </View>

        <View style={[styles.rowview,]}>
          <Text style={[styles.smstex, {
            backgroundColor: item.Status === 'Success' || item.Status === 'Done' || item.Status === 'M_Success' ?
              'green' :
              item.Status === 'Failed' ?
                'red'
                : item.Status === 'M_Failed' ?
                  'brown' : '#e6b42c',
          }]} numberOfLines={1} ellipsizeMode='tail'>
            {(() => {
              switch (item.Status) {
                case 'Done':
                  return 'T r a n s a c t i o n     A m o u n t    P a i d    S u c c e s s f u l l y';
                case 'M_Success':
                  return 'M i n i  -  S t a t e m e n t  C h e c k e d   S u c c e s s f u l l y';
                case 'M_Failed':
                  return 'M i n i  -  S t a t e m e n t  C h e c k e d  F a i l e d';
                case 'Pending':
                  return 'Y o u r   T r a n s a c t i o n   i n  Q u e u e   o r   P e n d i n g';
                case 'Failed':
                  return 'Y  o  u r    T r a n s a c t i o n    is    F  a  i  l  e  d';
                case 'Balance':
                  return 'B a l a n c e   E n q u i r y';
                default:
                  return 'Status Unknown';
              }
            })()}
          </Text>
        </View>

        <View style={styles.rowview}>
          <View >
            <Text style={styles.statusText}>Request Time</Text>
            <Text style={styles.timetex}>{item.Reqesttime}</Text>
          </View>
          <TouchableOpacity style={styles.shearbtn}
          //  onPress={onShare}
          >
            <ShareSvg size={wScale(20)} color='#000' />
            <Text style={[styles.sheartext, { backgroundColor: colorConfig.secondaryColor }]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>

        {
          heightview ? <View>
            <View style={[styles.border,]} />

            <View style={styles.rowview}>
              <Text style={[styles.statusText, styles.textrit]}>TXN ID</Text>
              <Text style={[styles.timetex,]}>
                {item.MerchantTxnId ? item.MerchantTxnId : '...'}
              </Text>

            </View>
            <View style={styles.rowview}>
              <Text style={[styles.statusText,]}>
                Transaction Mode
              </Text>
              <Text style={[styles.timetex, styles.textrit]}>{item.TYPE} By {item.TransactionType}</Text>
            </View>

            <View style={[styles.border,]} />
            <View style={[styles.rowview,]}>
              <View style={styles.blance}>
                <Text style={[styles.statusText, { flex: 1 }]}>Pos Pre</Text>
                <Text style={[styles.timetex,]}>₹ {`${item.REM_Remain_Pre}`}</Text>
              </View>
              <View style={styles.blance}>
                <Text style={[styles.statusText,]}>Net Amt</Text>
                <Text style={[styles.timetex,]}>₹ {`${item.Total}`}</Text>
              </View>
              <View style={styles.blance}>
                <Text style={[styles.statusText,]}>Earn</Text>
                <Text style={[styles.timetex,]}>₹ {`${item.Rem_Income}`}</Text>
              </View>
              <View style={styles.blance}>
                <Text style={[styles.statusText, styles.textrit,]}>Cr / Dr</Text>
                <Text style={[styles.timetex,]}>₹ {`${item.CR}`}</Text>
              </View>
              <View style={[styles.blance, { borderRightWidth: 0 }]}>
                <Text style={[styles.statusText, styles.textrit,]}>Pos Post</Text>
                <Text style={[styles.timetex, styles.textrit,]}>₹ {`${item.REM_Remain_Post}`}</Text>
              </View>
            </View>

          </View> : null
        }
      </View >
    </TouchableOpacity >
  );

  return (
    <View style={styles.main}>
      <AppBarSecond title={'Aeps History'} />
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
          <ActivityIndicator size="large" color={colorConfig.secondaryColor} />
        ) : transactions.length > 0 ? (
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <NoDatafound />
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
    marginVertical: hScale(4),
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
    fontSize: FontSize.teeny,
    color: '#FFF',
    letterSpacing: wScale(1),
    textAlign: 'center',
    flex: 1,
    marginVertical: hScale(2),
    paddingHorizontal: wScale(5)
  },
  blance: {
    flex: 1,
    borderRightWidth: wScale(.7),
    borderColor: colors.black75,
    alignItems: 'center',
  },
  bankInfoContainer: {
    paddingLeft: wScale(10),
    maxWidth: wScale(260),
  },
});

export default AEPSAdharPayR;


