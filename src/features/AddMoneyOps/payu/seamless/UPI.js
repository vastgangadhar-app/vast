import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';

import { getHash } from '../utils';
import { commonPaymentParam ,getPaymentHash,getVPAHash,displayAlert} from '../utils';
import  PayUUPI  from 'payu-upi-react';
import useAxiosHook from '../../../../utils/network/AxiosClient';
import AppBarSecond from '../../../drawer/headerAppbar/AppBarSecond';
import { RootState } from '../../../reduxUtils/store';
import { useSelector } from 'react-redux';

const UPI = (routeData,props) => {
  const { colorConfig } = useSelector((status: RootState) => status.userInfo)
const {txnId}=routeData.route.params;
  const {get,post} = useAxiosHook();
  const { navigation } = props
  const [vpa, setVpa] = useState('');
var route=routeData;
  if(routeData.route != undefined && routeData.route.params !=undefined){
    route=routeData.route.params;
  }
  console.log("navigation====>"+JSON.stringify(route));
  const initiatePayment = (mode,packageName="null") => {
    var commonParams=commonPaymentParam(route);
    commonParams["hashes"]["payment"]=getPaymentHash(commonParams,route.salt);
    commonParams["payment_mode"]=mode;
    if(mode=="upi"){
      commonParams["vpa"]=vpa;
    }
    
    if(packageName != "null"){
      commonParams["package_name"]=packageName;
      commonParams["intent_app"]="gpay";
    }
    
    const requestData = {
      payu_payment_params: commonParams,
    }

  console.log(requestData);
   PayUUPI.makeUPIPayment(requestData,
      (error) => {
        console.log("-----------Error "+mode+"---------");
        console.log(error);
    // displayAlert('Error '+mode, error);
        console.log("------------------------------------------");

      },
      (results) => {
        console.log("------------------------------------------");
        const modifiedData = { ...results, txnid: txnId };

      
        sendResponse(modifiedData);
        console.log(results);
      }
    );
  }

  const validateVPA = () => {
    console.log('Button Tapped validate VPA');
   
    var commonParams = commonPaymentParam(route);
    commonParams["vpa"]=vpa;
    commonParams["hashes"]["payment"]=getPaymentHash(commonParams,route.salt);
    commonParams["hashes"]["validate_vpa"]=getVPAHash(commonParams,route.salt);
    const requestData = {
      payu_payment_params: commonParams,
    }
    PayUUPI.validateVPA(
      requestData,
      (error) => {
        console.log("-----------Error validateVPA---------");
        console.log(error);
        console.log("-------------------------------------");
        displayAlert('Error validateVPA', error);
      },
      (params) => {
        console.log("-----------Success validateVPA---------");
        console.log(params);
        console.log("---------------------------------------");

       const Response = JSON.parse(params);
        Alert.alert(
          
          "validateVPA", // Title of the alert
          `Status: ${Response.status || 'N/A'}\n` +
          `VPA: ${Response.vpa || 'N/A'}\n` +
          `Is VPA Valid: ${Response.isVPAValid ? 'Yes' : 'No'}\n` +
          `Payer Name: ${Response.payerAccountName || 'N/A'}\n` +
          // `Is Auto Pay VPA Valid: ${Response.isAutoPayVPAValid ? 'Yes' : 'No'}\n` +
          // `Is Auto Pay Bank Valid: ${Response.isAutoPayBankValid || 'N/A'}`,
          [{ text: 'OK' }]
        );

        console.log(params?.status ,params.payerAccountName);
       // alert(params)
        // displayAlert('Success validateVPA', params);
      }
    );
  }

  const intentApps = () => {
    console.log('Button Tapped IntentApps');
    PayUUPI.intentApps((intentApps) => {
        console.log("-----------Success intentApps---------");
        console.log(JSON.stringify(intentApps));
        console.log("---------------------------------------");
       // alert(intentApps)
        //displayAlert('Success intentApps', intentApps);
      }
    );
  }
useEffect(()=>{
console.log(txnId);
},[])


  const sendResponse = async (status,msg) => {
    const data ={
        mode:'PG',
        status:status,
        txnid:json.txnid,
        PG_TYPE:'PG',
        error_Message:status,
        amount:json.amount,
        bankcode:'1234',
        payuMoneyId:'1234',
        bank_ref_num:'1234',

    }
    try {
        const response = await post({url:'PaymentGateway/api/data/Gatewayresponse',data}); 
        
        console.log('Success:', response);
        
        
    } catch (error) {
        console.error('Error during async operation:', error);
        
        Alert.alert('Error', 'An error occurred while processing the request.');
        
    }
};
  const paymentResponse = (data) => {
    console.log(data);
  }

  return (
    <View >
  <AppBarSecond title={'Payment by VPA'} />
    <View style={styles.container}>
                


      {/* <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#3A81F1' }]}
        onPress={() => initiatePayment('INTENT', 'com.google.android.apps.nbu.paisa.user')}
      >
   
        <Text style={styles.walletText}>Google Pay</Text>
      </TouchableOpacity>
      */}
      {/* <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: '#6739b7' }]}
        onPress={() => initiatePayment('INTENT', 'com.phonepe.app')}
      >
        <Text style={styles.walletText}>PhonePe</Text>
      </TouchableOpacity> */}


      {/* <TouchableOpacity
        style={[styles.walletItem, { backgroundColor: 'black' }]}
        onPress={() => intentApps()}
      >
        <Text style={styles.walletText}>Get UPI Apps List</Text>
      </TouchableOpacity> */}

      
      <Text style={styles.title}>Please Enter VPA</Text>
      <TextInput
        style={styles.textinput}
        placeholder="VPA"
        value={vpa}
        onChangeText={setVpa}
      />


      <Button
        style={[styles.walletItem, { backgroundColor: 'green' }]}
        onPress={() => validateVPA()}
        title="Validate VPA"
      >
        
      </Button>
     
      <Text ></Text>
      <Button
  title="Pay via collect"
  onPress={() => {
    initiatePayment("upi");
    
  }}
  buttonStyle={{
    backgroundColor: colorConfig,
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 8, // Example border radius
  }}
/>
      {/* <Button
      title="Pay via Intent"
      onPress={() => {
        initiatePayment("INTENT",null)
      }}
    /> */}
    </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,

  },
  textinput: {
    borderRadius:10,
    height: 40,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  textinput2: {
    // Styling for the container that wraps the Button
    marginVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  title: {
    paddingBottom: 16,
    fontSize: 20,
    marginTop: 20
  },
  walletItem: {
    paddingHorizontal: 4,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'white',
    marginTop: 8
  },
  walletText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 12
  }
});

export default UPI;