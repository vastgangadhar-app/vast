import React, { useState } from 'react';
import { View, Alert, StyleSheet, ScrollView, Button, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import useAxiosHook from '../../../utils/network/AxiosClient';
import { APP_URLS } from '../../../utils/network/urls';
import { hScale } from '../../../utils/styles/dimensions';
import DynamicButton from '../../drawer/button/DynamicButton';
import AppBarSecond from '../../drawer/headerAppbar/AppBarSecond';

const PancardManual = ({ navigation }) => {
  const { post } = useAxiosHook();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [mobile2, setMobile2] = useState('');
  const [father, setFather] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [adharno, setAdharno] = useState('');

  const getCurrentYear = () => new Date().getFullYear();

  const formatDate = (text) => {
    const cleaned = text.replace(/\D+/g, '');
    if (cleaned.length <= 8) {
      const day = cleaned.slice(0, 2);
      const month = cleaned.slice(2, 4);
      const year = cleaned.slice(4, 8);
      if (month && (parseInt(month, 10) < 1 || parseInt(month, 10) > 12)) {
        Alert.alert('Invalid Month', 'Please enter a valid month between 01 and 12.');
        return;
      }
      if (year && (parseInt(year, 10) > getCurrentYear())) {
        Alert.alert('Invalid Year', `Please enter a year not greater than ${getCurrentYear()}.`);
        return;
      }
      const formatted = [day, month, year].filter(Boolean).join('/');
      setDob(formatted);
    }
  };

  const handleManualPan = async () => {
    if (!name || !mobile || !father || !gender || !state || !dob || !email || !adharno) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }
  
    if (!/^\d{10}$/.test(mobile)) {
      Alert.alert('Invalid Mobile Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
  
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      Alert.alert('Invalid Date', 'Please enter a valid date in the format DD/MM/YYYY.');
      return;
    }
  
    const [day, month, year] = dob.split('/');
    const validDate = new Date(`${month}/${day}/${year}`);
    if (validDate.getDate() !== parseInt(day)) {
      Alert.alert('Invalid Date', 'Please enter a valid date.');
      return;
    }
  
    const params = {
      msts: '',
      state: state,
      gender: gender,
      cmobile: mobile2, 
      Email: email,
      father: father,
      mobile: mobile,
      dob: dob,
      name: name,
      adharno: adharno,
    };
  
    // Convert params to JSON
    const data = JSON.stringify(params);
    console.log(data);
  
    try {
      // Make API call
      const response = await post({ url: APP_URLS.PancardManual, data: data });
      if (response && response.Message) {
        // Show success or failure message using Toast
        ToastAndroid.showWithGravity(response.Message, ToastAndroid.LONG, ToastAndroid.CENTER);
      }
      console.log(response);
    } catch (error) {
      // Log error and show an alert
      console.error('Error making request:', error);
      Alert.alert('Error', 'An error occurred while processing your request. Please try again later.');
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      <AppBarSecond
        title="Pancard Manual Form"
        actionButton={<Button title="Back" onPress={() => navigation.goBack()} />}
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: hScale(20) }}>
        <View style={styles.container}>
          <FlotingInput
            label="Enter Name"
            value={name}
            onChangeTextCallback={setName}
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Mobile"
            value={mobile}
            onChangeTextCallback={setMobile}
            keyboardType="phone-pad"
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Aadhar Reg. Mobile"
            value={mobile2}
            onChangeTextCallback={setMobile2}
            keyboardType="phone-pad"
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Father's Name"
            value={father}
            onChangeTextCallback={setFather}
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Gender"
            value={gender}
            onChangeTextCallback={setGender}
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter State"
            value={state}
            onChangeTextCallback={setState}
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Email"
            value={email}
            onChangeTextCallback={setEmail}
            keyboardType="email-address"
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Aadhaar Number"
            value={adharno}
            onChangeTextCallback={setAdharno}
            keyboardType="numeric"
            maxLength={12}
            inputstyle={styles.input}
          />
          <FlotingInput
            label="Enter Date of Birth (DD/MM/YYYY)"
            value={dob}
            onChangeTextCallback={formatDate}
            keyboardType="numeric"
            maxLength={12}
            inputstyle={styles.input}
          />
          {/* <FlotingInput
            label="Enter Amount"
            value={reamount}
            onChangeTextCallback={setReamount}
            keyboardType="numeric"
            maxLength={8}
            inputstyle={{ borderColor: amount === reamount ? 'black' : 'red' }}
          /> */}
          <DynamicButton
            title={'Submit'}
            styleoveride={{ marginBottom: hScale(20), marginTop: hScale(10) }}
            onPress={handleManualPan}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    backgroundColor: '#fff',
  },
  input: {
    top: 2,
    marginBottom: 16,
  },
});

export default PancardManual;
