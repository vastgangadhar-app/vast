import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';

const ReqToAdmin = ({route}) => {
  const [paymentMode1, setPaymentMode1] = useState('');
  const [paymentType1, setPaymentType1] = useState('');
  const [dealerwallet1, setDealerWallet1] = useState('');
  const [bank1, setBank1] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { post,get } = useAxiosHook();

  const paymentModedialog = () => {
    setModalVisible(true);
  };

  const bankDialog = () => {
    setBankModalVisible(true);
  };

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const url = `${APP_URLS.admindealerbankList}`;
      console.log(url);

      const response = await get({url});
      console.log(response.bindALLWallet.channel.Adminbanklist);
     setBanks(response.bindALLWallet.channel.Adminbanklist);
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
    console.log(route.params)
  }, []);

  const PaymentTypeDialog = ({ visible, onClose }) => {
    const paymentTypes = ['NEFT', 'IMPS', 'RTGS', 'UPI', 'Same Bank'];

    const handlePaymentTypeSelect = (paymentType) => {
      setPaymentType1(paymentType);
      onClose();
    };

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Type</Text>
            <FlatList
              data={paymentTypes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.paymentTypeItem}
                  onPress={() => handlePaymentTypeSelect(item)}
                >
                  <Text style={styles.paymentTypeText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const BankDialog = ({ visible, onClose }) => {
    const handleBankSelect = (bank) => {
      setBank1(bank);
      onClose();
    };

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Bank</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <FlatList
                data={banks}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.paymentTypeItem}
                    onPress={() => handleBankSelect(item.banknm)}
                  >
                    <Text style={styles.paymentTypeText}>{item.banknm}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Request to Admin</Text>

          <TouchableOpacity style={styles.selectionButton} onPress={paymentModedialog}>
            <Text style={styles.selectionButtonText}>{paymentMode1 || 'Select Payment Mode'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.selectionButton} onPress={paymentModedialog}>
            <Text style={styles.selectionButtonText}>{paymentType1 || 'Select Payment Type'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.selectionButton} onPress={bankDialog}>
            <Text style={styles.selectionButtonText}>{bank1 || 'Select Bank'}</Text>
          </TouchableOpacity>

          <PaymentTypeDialog
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
          />

          <BankDialog
            visible={bankModalVisible}
            onClose={() => setBankModalVisible(false)}
          />

          <TextInput
            style={styles.input}
            placeholder="Dealer Wallet"
            onChangeText={setDealerWallet1}
            value={dealerwallet1}
          />

          <TouchableOpacity style={styles.submitButton} onPress={() => {}}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollView: {
    flexGrow: 1,
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    height: 50,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  selectionButton: {
    height: 50,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectionButtonText: {
    color: '#333',
    fontSize: 16,
  },
  submitButton: {
    height: 50,
    width: '90%',
    backgroundColor: '#28a745',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentTypeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  paymentTypeText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ReqToAdmin;
