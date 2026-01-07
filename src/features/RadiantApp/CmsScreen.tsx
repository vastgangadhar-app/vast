import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import RadiantLoginScreen from './RadiantLogin';
import RadiantDashboard from './RadiantDashboard';
import RadiantTransactionScreen from './RadiantTransactionScreen';

const CmsScreen = () => {

    const navigation = useNavigation<any>();

  return (


    <ScrollView contentContainerStyle={styles.container}>
      <RadiantTransactionScreen/>
     {/* // <RadiantLoginScreen/>  */}
       
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4629c6',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default CmsScreen;