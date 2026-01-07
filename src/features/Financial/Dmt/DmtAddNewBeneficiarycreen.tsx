import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, ToastAndroid, Alert, Button, Modal } from 'react-native';
import { BottomSheet } from '@rneui/base';
import { FlashList } from '@shopify/flash-list';



import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../../reduxUtils/store';
import { translate } from '../../../utils/languageUtils/I18n';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import { useDeviceInfoHook } from '../../../utils/hooks/useDeviceInfoHook';
import { hScale, SCREEN_HEIGHT, wScale } from '../../../utils/styles/dimensions';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import OnelineDropdownSvg from '../../drawer/svgimgcomponents/simpledropdown';
import DynamicButton from '../../drawer/button/DynamicButton';
import ClosseModalSvg2 from '../../drawer/svgimgcomponents/ClosseModal2';
import { colors } from '../../../utils/styles/theme';
import { it } from 'date-fns/locale';

const DmtAddNewBenificiaryScreen = ({ route }) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  const color1 = `${colorConfig.secondaryColor}20`;
console.log('**EKYC', route.params)
  const { no, Name } = route.params;
  const { userId } = useSelector((state: RootState) => state.userInfo);

  const [name, setName] = useState('');
  const [senderNo, setsenderNo] = useState(no || '');

  const [accountNumber, setAccountNumber] = useState('');
  const [reEnterAccountNumber, setReEnterAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState(translate(''));
  const [isLoading, setIsLoading] = useState(false);
  const [validate, setValidate] = useState(false);
  const [bankList, setBanklist] = useState([]);
  const [isBank, setIsBank] = useState(false);
  const [bank, setBank] = useState(translate('Select Your Bank'));
  const [UnqID, setUnqiD] = useState('');
  const [isSkip, setSkip] = useState(false);
  const [GoodMark, setGoodMark] = useState(false);
  const [GoodMark2, setGoodMark2] = useState(false);
  const [isR, setIsR] = useState(false);
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [verificationDetails, setVerificationDetails] = useState(null);
  const [rid, setrid] = useState('');
    const [id, setid] = useState('');
  const filteredData = (bankList).filter(item =>

    item["bank_name"].toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setIsR(Name === 'A2Z');
    console.log(Name === 'RADIANT');

    console.log(route.params)
  }, [])


  const handleAddBeneficiary = async (bename) => {
    console.log(Name);
    const { remid } = route.params;
    if (accountNumber === reEnterAccountNumber) {
      setGoodMark2(true);
      setIsLoading(true);
      setValidate(false);

      const url = `MoneyDMT/api/Money/AddNewRecipient?Name=${bename}&AccountNo=${accountNumber}&IFSC=${ifscCode}&SenderNo=${senderNo}&remitterid=${id}`
      console.log(url);
      
      try {
        const res = await post({ url: url });
      console.log(res);
          if (res?.ADDINFO?.statuscode !== 'TXN') {
            setGoodMark2(false);
            Alert.alert('', res['ADDINFO'].status, [{
              text: 'OK', onPress: () => {
                navigation.goBack();
              }
            }]);
          } else if (res['RESULT'] === '0' && res?.ADDINFO?.statuscode === 'TXN') {

            setGoodMark2(true);
            console.log('ADDINFO', res['ADDINFO']['status'])
            Alert.alert('Success', res['ADDINFO']['status'], [{
              text: '', onPress: () => {
                setModalVisible(false); 
                navigation.goBack();
              }
            }]);

          } else {
            Alert.alert('Error', '', [{ text: 'OK', onPress: () => { } }]);

          }


        console.log(res['ADDINFO']['data']['beneficiary']);
      } catch (error) {
        console.error('Error saving account:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setValidate(true);
    }
  };


  const { get, post } = useAxiosHook();
  useEffect(() => {
    // setsenderNo(route.params['no'])
    getBanks();
    getGenUniqueId();
    console.log(route.params)
  }, [])
  const getBanks = async () => {  
    // try {
    //   const url = `${APP_URLS.MasterIfsc}`
    //   console.log(url);
    //   const res = await get({ url: url });
    //   console.log(res['statuscode']);
    //   console.log(res['status']);
    //   setBanklist(res['data']);
    // } catch (error) {
    //   console.error('Error fetching data:', error);

    // }
    try {
      const url = `MoneyDMT/api/Money/MasterIfsc`
      
      const res = await get({ url: url });

      setBanklist(res['data']);
    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };

  const getGenUniqueId = async () => {
    try {
      const url = `${APP_URLS.getGenIMPSUniqueId}`
      console.log(url);
      const res = await get({ url: url });
      setUnqiD(res.Message);
      console.log(res)


      if (res['Response'] == 'Failed') {
        ToastAndroid.showWithGravity(
          res['Message'],
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        )
      } else {
        ToastAndroid.showWithGravity(
          res['Response'],
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        )
      }


    } catch (error) {
      console.error('Error fetching data:', error);

    }
  };
  // const bankStatus = async (bankname) => {
  //   console.log(bankname);
  //   try {

  //     const url = `${APP_URLS.getBankDown}${bankname}`; console.log(url);
  //     const res = await get({ url: url });

  //   } catch (error) {

  //   }
  // }

  const { getNetworkCarrier, getMobileDeviceId, getMobileIp } =
    useDeviceInfoHook();
    const verifyAcc = async (mb, iff, cd, bno, mal, sk, pi, kk, bankName, kyc, uniqueid) => {
      console.log(mb, iff, cd, bno, mal, sk, pi, kk, bankName, kyc, uniqueid);
      console.log(sk, 'sk');
      
      try {
        const Model = await getMobileDeviceId();
        const url = `${APP_URLS.verifybankACC}mb=${mb}&iff=${iff}&cd=${Model}&bno=${bno}&mal=${mal}&sk=${sk}&pi=${Model}&kk=${kk}&bankName=${bankName}&kyc=''&uniqueid=${uniqueid}`;
        const verifybankACC = `Money2/api/Money/mmmn2?mb=${mb}&iff=${iff}&cd=${Model}&bno=${bno}&mal=${mal}&sk=${sk}&pi=${Model}&kk=${kk}&bankName=${bankName}&kyc=''&uniqueid=${uniqueid}`;
    
        const res = await post({ url: Name === 'A2Z' ? verifybankACC : url });
        console.log(verifybankACC, '1234567890');
        setIsLoading(false);
        console.log(res)
        const addinfo = res.ADDINFO;
        if (res.RESULT === '1') {
          const statusCode = addinfo.statuscode;
          const status = addinfo.status;
    
          if (statusCode === 'IAN') {
            Alert.alert(
              'Invalid Account Number',
              `The account number you submitted is invalid. Please confirm the details:\n\nAccount Number: ${bno}\nName: ${bename}`,
              [{ text: 'OK', onPress: () => {} }]
            );
          } else {
            Alert.alert('Message', res?.ADDINFO?.data?.bankrefno, [{ text: 'OK', onPress: () => {} }]);
          }
          
          setGoodMark(false);
          setIsLoading(false);
        } else if (res.RESULT === '0') {
          
          const data = addinfo.data;
          const bename = data.benename;
          const verify = data.verification_status;
          const charged_amt = data.charged_amt;
          const bankrefno = data.bankrefno;
          const local = addinfo.Local;
      
          const id = data.ipay_id;
          setrid(id);
          setName(bename);
          setVerificationDetails({
            name: bename,
            status: verify,
            bankRefNo: bankrefno,
          });
          setModalVisible(true);
    
          if (verify === 'VERIFIED') {
            setGoodMark(true);
          } else {
            setGoodMark(false);
          }
    
          if (local === 'Local') {
            Alert.alert(
              bename,
              res.ADDINFO,
              [{ text: 'OK', onPress: () => {} }]
            );
          }
        } else {
          setIsLoading(false);
          Alert.alert('Failed', res.ADDINFO, [{ text: 'OK', onPress: () => {} }]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    

  const ReverifyAcc = async (mb, iff, cd, bno, mal, sk, pi, kk, bankName, kyc, uniqueid) => {
    try {
      const res = await post({ url: `${APP_URLS.reVerifybankACC}mb=${mb}&iff=${iff}&cd=${cd}&bno=${bno}&mal=${mal}&sk=${sk}&pi=${pi}&kk=${kk}&bankName=${bankName}&kyc=${kyc}&uniqueid=${uniqueid}` })
      console.log(res);
      if (res['RESULT'] === '1') {
        setGoodMark(false);
        setIsLoading(false);
        Alert.alert('', res['ADDINFO'], [{ text: 'OK', onPress: () => { } }]);
      } else if (res['RESULT'] === '0') {

        var bename = res["ADDINFO"]["data"]["benename"];
        var verify = res["ADDINFO"]["data"]["verification_status"];
        var local = res["ADDINFO"]["Local"];

        if (verify == "VERIFIED") {
          setGoodMark(true);
        } else {
          setGoodMark(false);
          Alert.alert(
            '',
            res['ADDINFO'],
            [
              { text: 'OK', onPress: () => { } },
              {
                text: 'Re-verify', onPress: () => {
                  ReverifyAcc(senderNo, ifscCode, '', accountNumber, userId, UnqID, '57bea5094fd9082d', 'RJUPM12131', bank, 'kyc', userId)
                }
              }
            ]
          );
          // setState(() {
          //   verfybtnnn = false;
          // });
        }
        if (local == "Local") {
          Alert.alert(
            '',
            res['ADDINFO'],
            [
              { text: 'OK', onPress: () => { } },
              {
                text: 'Re-verify', onPress: () => {
                  ReverifyAcc(senderNo, ifscCode, '', accountNumber, userId, UnqID, '57bea5094fd9082d', 'RJUPM12131', bank, 'kyc', UnqID)
                }
              }
            ]
          );
        } else {
        }
      } else {
        setIsLoading(false);
        Alert.alert('Failed', res['ADDINFO'], [{ text: 'OK', onPress: () => { } }]);
      }
    } catch (error) {
    }
  }

  const Banks = () => {
    return <FlashList
      style={{ marginBottom: wScale(50), marginHorizontal: wScale(24) }}
      data={filteredData}
      renderItem={({ item }) => {
        return (
          <View
            style={{ marginVertical: wScale(8), marginHorizontal: wScale(24) }}>
            <TouchableOpacity
              style={[styles.operatorview]}

              onPress={async () => {
                setid(item['id']);
                        setid(item['id']);
console.log(item['id']);
                setIfscCode(item['branch_ifsc']);
                setBank(item['bank_name']);
               
                setIsBank(false);
                bankStatus(item['bank_name']);
                setSearchQuery('');
              }}>
              <Text style={[styles.operatornametext]}>

                {item['bank_name']}
              </Text>
            </TouchableOpacity>
          </View>
        );
      }}
      estimatedItemSize={30}
    />
  }
  return (
    <View style={styles.main}>
      <AppBarSecond title={'Add Beneficiary'} />
      <ScrollView>

        <View style={styles.container}>
          <FlotingInput label={'Mobile Number'} value={senderNo}
            maxLength={10}
            keyboardType='decimal-pad' onChangeTextCallback={text => setsenderNo(text)} editable={false} />
          <FlotingInput label={'Name'} valu={name}
            onChangeTextCallback={text => setName(text)} />

          <FlotingInput label={'Account Number'} keyboardType="numeric" valu={accountNumber} onChangeTextCallback={text => setAccountNumber(text)} />

          <FlotingInput label={translate("Re-Enter Account Number")} keyboardType="numeric"
            valu={reEnterAccountNumber} onChangeTextCallback={text => setReEnterAccountNumber(text)} />

          <TouchableOpacity
            onPress={() => {
              if (accountNumber === reEnterAccountNumber || accountNumber.length >= 4 || reEnterAccountNumber.length >= 4) {
                setIsBank(true);
              }
            }}>

            <FlotingInput label={bank} editable={false} />
            <View style={[styles.righticon2]}>

              <OnelineDropdownSvg />
            </View>

          </TouchableOpacity>
          <FlotingInput label={'IFSC Code'} editable={false} value={ifscCode} onChangeTextCallback={text => setIfscCode(text.toUpperCase())}
          />
          <>
            <DynamicButton
              title={translate('Save Account')}
              styleoveride={{ marginBottom: hScale(20), marginTop: hScale(10) }}
              onPress={() => {  
                handleAddBeneficiary(name)
                // if (Name == 'A2Z') {
                //   handleSaveAccount(name);
                // } else {
                //   handleSaveAccount(name);
                // }
                // handleSaveAccount();

              }}
              disabled={!accountNumber || !reEnterAccountNumber || !ifscCode || !senderNo || senderNo.length !== 10 || isLoading}

            />
            <DynamicButton disabled={!accountNumber || !reEnterAccountNumber || !ifscCode || !senderNo || senderNo.length !== 10 || isLoading}

              onPress={() => {

                if (accountNumber === reEnterAccountNumber) {

                  console.log('57bea5094fd9082d', accountNumber === reEnterAccountNumber)
                  verifyAcc(senderNo, ifscCode, '57bea5094fd9082d', accountNumber, userId, UnqID, '57bea5094fd9082d', 'RJUPM12131', bank, 'kyc', UnqID)
                  setIsLoading(true);
                  setValidate(false);
                  setGoodMark(true);
                } else {
                  setValidate(true);
                }

              }} title={isLoading ? (
                <ActivityIndicator color={colorConfig.labelColor} />
              ) : (

                <Text>
                  {GoodMark ? '✓' : translate('Verify Account')}</Text>
              )} />
       


          </>
          {validate && <Text style={{ color: 'red' }}>Account numbers do not match</Text>}

          <BottomSheet
            isVisible={isBank}
            onBackdropPress={() => {
              setIsBank(false);
            }}
          >
            <View style={styles.bottomsheetview}>
              <View style={[styles.StateTitle, { backgroundColor: color1 }]}>
                <View style={styles.titleview}>
                  <View>
                    <Text style={styles.stateTitletext}>
                      Select Your Bank
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setIsBank(false)}
                  activeOpacity={0.7}
                >
                  <ClosseModalSvg2 />
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder="Search..."
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
                style={styles.searchBar}
                placeholderTextColor={colors.black75}
                cursorColor={'colors.black'}
              />
              {Banks()}
            </View>

          </BottomSheet>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Verification Details</Text>
              {verificationDetails && (
                <>
                  <Text style={{color:colors.black}}>Name: {verificationDetails.name}</Text>
                  <Text style={{color:colors.black}}>Status: {verificationDetails.status}</Text>
                  <Text style={{color:colors.black}}>Bank Reference No: {verificationDetails.bankRefNo}</Text>

                </>
              )}
              <View style={styles.buttonContainer}>
                <Button title="Save" onPress={() => { handleAddBeneficiary(name); }} />
                <Text>             </Text>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: wScale(20),
    paddingVertical: wScale(15),
  },
  righticon2: {
    position: "absolute",
    left: "auto",
    right: wScale(0),
    top: hScale(0),
    height: "85%",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: wScale(12),
  },
  operatorview: {
    alignItems: "center",
    paddingHorizontal: wScale(10),
  },
  searchBar: {
    borderColor: 'gray',
    borderWidth: wScale(1),
    paddingHorizontal: wScale(15),
    marginHorizontal: wScale(10),
    marginBottom: hScale(10),
    borderRadius: 5,
    color: colors.black75,
    fontSize: wScale(16),
  },
  operatornametext: {
    textTransform: "capitalize",
    fontSize: wScale(20),
    color: "#000",
    // flex: 1,
    borderBottomColor: "#000",
    borderBottomWidth: wScale(0.5),
    alignSelf: "center",
    paddingVertical: hScale(30),
    width: '100%'
  },
  bottomsheetview: {
    backgroundColor: "#fff",
    height: SCREEN_HEIGHT / 1.4,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  StateTitle: {
    paddingVertical: hScale(10),
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: wScale(10),
    // marginBottom: hScale(10),
  },
  stateTitletext: {
    fontSize: wScale(22),
    color: "#000",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  titleview: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    alignContent: 'space-between',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
})
export default DmtAddNewBenificiaryScreen;
