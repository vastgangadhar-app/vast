import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Alert } from 'react-native';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';
import {
  getDeviceInfo,
  captureFinger,
} from 'react-native-rdservice-fingerprintscanner';
import AepsTabScreen from './AepsTabScreen';

const AepsScreen = () => {
  const navigation = useNavigation<any>();
  const colorScheme = useColorScheme();
  const [fingerprintData, setFingerprintData] = useState<any>();
  const [currentRoute, setCurrentRoute] = useState('');
  const buttonTextColor = colorScheme === 'dark' ? 'white' : 'black';
  const { get, post } = useAxiosHook();
  const [isSuccess, setIsSucess] = useState(false);
  const CheckAeps = async () => {
    try {
      const url = `AEPS/api/data/AepsStatusCheck`;
      const response = await get({ url: url });
      console.log(response);
      const msg = response.Message;
      const status = response.Response;
      if (status === 'Success') {
        setIsSucess(status === 'Success')
        if (currentRoute) {
         start();
        }
      } else if (status === 'BOTHNOTDONE' || status === 'NOTOK' || status === 'ALLNOTDONE' || msg === 'PURCHASE') {
        navigation.navigate('ServicepurchaseScreen', { typename: 'AEPS' });
      } else if (msg === 'OTPREQUIRED') {
      }

    } catch (error) {
      console.log(error);
    } finally {
    }
  };


useEffect(()=>{
  const CheckEkyc = async () => {
    try {
      const url = `${APP_URLS.checkekyc}`;
      const response = await get({ url: url });
      console.log(url);
      console.log(response);
      const msg = response.Message;
      const Status = response.Status;
      if (Status === true) {
        CheckAeps();

      } else if (msg === '2FAREQUIRED') {
        navigation.navigate("TwoFAVerify");
      } else if (msg === 'REQUIREDOTP') {
        navigation.navigate("Aepsekyc");
      } else if (msg === 'REQUIREDSCAN') {
        start2()
      }
    } catch (error) {

      console.log(error);
    } finally {
    }
  };
  CheckEkyc();
},[])

 

  const start = () => {
    getDeviceInfo()
      .then((res) => {
        capture();
      })
      .catch((e) => {
        Alert.alert('Error While Scanning the finger. Please check if device is connected properly');
      });
  };  const start2 = () => {
    getDeviceInfo()
      .then((res) => {
        capture2();
      })
      .catch((e) => {
        Alert.alert('Error While Scanning the finger. Please check if device is connected properly');
      });
  };

  const capture = () => {

    captureFinger('<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>') //you can pass pidOptions to "captureFinger(pidOptions)"" method otherwise it takes DEFAULT_PID_OPTIONS
      .then((res) => {
        setFingerprintData(res.pidDataJson);
        if (currentRoute) {
          navigation.navigate(currentRoute, { fingerprintData: res.pidDataJson });
        }
      })
      .catch((e) => {
        setFingerprintData('')
        Alert.alert('Error While Scanning the finger. Please check if device is connected.');
      });
  };  
  const capture2 = () => {

    captureFinger('<PidOptions ver="1.0"> <Opts fCount="1" fType="2" iCount="0" pCount="0" pgCount="2" format="0" pidVer="2.0" timeout="10000" pTimeout="20000" wadh="E0jzJ/P8UopUHAieZn8CKqS4WPMi5ZSYXgfnlfkWjrc=" posh="UNKNOWN" env="P" /> <CustOpts><Param name="mantrakey" value="" /></CustOpts> </PidOptions>') //you can pass pidOptions to "captureFinger(pidOptions)"" method otherwise it takes DEFAULT_PID_OPTIONS
      .then((res) => {
        setFingerprintData(res.pidDataJson);
          navigation.navigate('Aepsekycscan', { fingerprintData: res.pidDataJson });
        
      })
      .catch((e) => {
        setFingerprintData('')
        Alert.alert('Error While Scanning the finger. Please check if device is connected.');
      });
  };

  
  return (
    <View style={styles.container}>
      <AepsTabScreen />
      {/* <TouchableOpacity
        onPress={() => {
          //setCurrentRoute("AepsTabScreen");
          navigation.navigate("AepsTabScreen",);
          
        }}
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>Tab</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          
     navigation.navigate("TwoFaComponent");
        }}
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>TwoFAVerify</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Aepsekyc");
        }}
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>Aepsekyc</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Aepsekycscan");
        }}
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>Aepsekycscan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setCurrentRoute("AdharPay");
          CheckEkyc();
        }}
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>AdharPay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setCurrentRoute("BalanceCheck");
          CheckEkyc();
          
        }}
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>BalanceCheck</Text>
      </TouchableOpacity>



      <TouchableOpacity
        onPress={() => {
          
          setCurrentRoute("AepsMinistatement");
          CheckEkyc();
        }}
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>AepsMinistatement</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setCurrentRoute("AepsCW");
          CheckEkyc();
          
        }}
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>AepsCW</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("VideoKYC");

        }}
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
      >
        <Text style={[styles.buttonText, { color: buttonTextColor }]}>Scan</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default AepsScreen;
