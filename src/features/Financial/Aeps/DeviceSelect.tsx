import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ToastAndroid, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import LinearGradient from 'react-native-linear-gradient';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { isDriverFound } from 'react-native-rdservice-fingerprintscanner';
import CheckSvg from '../../drawer/svgimgcomponents/CheckSvg';
import CloseSvg from '../../drawer/svgimgcomponents/CloseSvg';
import FlotingInput from '../../drawer/securityPages/FlotingInput';
import OnelineDropdownSvg from '../../drawer/svgimgcomponents/simpledropdown';

const SelectDevice = ({ setDeviceName, device, opPress, pkg }) => {
  const [selectedDevice, setSelectedDevice] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const [rdpkg, setRdPkg] = useState(pkg);

  const devices = [
    'mantra L0',
    'mantra L1',
    'startek L0',
    'startek L1',
    'morpho L0',
    'morpho L1'
  ];

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setDeviceName(device)
    opPress;
    handleSelection(device);
    handleCloseModal();
  };
  const handleSelection = (selectedOption) => {
    if (selectedDevice === 'Device') {
      ToastAndroid.showWithGravity('Please Select Your Device', ToastAndroid.SHORT, ToastAndroid.BOTTOM);

      return;
    }
    console.log(selectedOption)
    const captureMapping = {
      'mantra L0': 'com.mantra.rdservice',
      'mantra L1': 'com.mantra.mfs110.rdservice',
      'startek L0': 'com.acpl.registersdk',
      'startek L1': 'com.acpl.registersdk_l1',
      'morpho L0': 'com.scl.rdservice',
      'morpho L1': 'com.idemia.l1rdservice',
    };

    console.log(captureMapping[selectedOption])
    if (captureMapping[selectedOption]) {
      isDriverFound(captureMapping[selectedOption])
        .then((res) => {
          console.log(res);
          setRdPkg(captureMapping[selectedOption]);

        })
        .catch((error) => {
          console.error('Error finding driver:', error);
          alert('Error: Could not find the selected driver.');
        });
    } else {
      alert('Invalid option selected');
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleOpenModal} style={[styles.selectButton,]}>
        <FlotingInput
          label={selectedDevice ? 'your Device' : 'Select your Device'}
          value={selectedDevice}
          editable={false}
        />
        <View style={[styles.righticon2]}>
          {selectedDevice ? <View style={[styles.languageEmojiContainer, { backgroundColor: colorConfig.secondaryColor }]}>
            <CheckSvg />
          </View> : <OnelineDropdownSvg />}
        </View>
      </TouchableOpacity>
      <Modal visible={isModalVisible}
        onRequestClose={handleCloseModal}
        animationType="slide"
        transparent={true}>
        <View style={styles.centerModal}>
          <LinearGradient
            colors={[colorConfig.primaryColor, colorConfig.secondaryColor,]}

            style={[
              styles.modalView,
              { borderColor: colorConfig.secondaryColor },
            ]}>
            <View style={styles.cutborder}>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                activeOpacity={0.7}
                style={[
                  styles.closebuttoX,
                  { backgroundColor: colorConfig.secondaryColor },
                ]}>
                <CloseSvg />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.texttitalView,
                { backgroundColor: colorConfig.secondaryColor },
              ]}>
              <View
                style={[
                  styles.cutout,
                  { borderTopColor: colorConfig.secondaryColor },
                ]}
              />
              <Text style={styles.texttital}>Select a Device</Text>
            </View>
            <ScrollView>

              <FlashList
                data={devices}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectDevice(item)}
                    style={styles.deviceItem}
                  >
                    <View
                      style={[styles.languageEmojiContainer, selectedDevice === item && { backgroundColor: colorConfig.secondaryColor }]}>
                      {selectedDevice === item && (
                        <CheckSvg />
                      )}

                    </View>
                    <Text style={styles.deviceItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                estimatedItemSize={50}
              />
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  selectButton: {
    borderRadius: 8,
    marginTop: hScale(20)
  },
  deviceItem: {
    paddingVertical: hScale(12),
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceItemText: {
    color: 'white',
    fontSize: wScale(20),
    textAlign: 'center',
    textTransform: 'capitalize',
    paddingLeft: wScale(15)
  },
  centerModal: {
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  modalView: {
    backgroundColor: '#fff',
    paddingTop: hScale(50),
    borderRadius: wScale(10),
    elevation: 5,
    marginHorizontal: wScale(16),
    marginTop: hScale(70),
    borderWidth: wScale(3),
    paddingHorizontal: wScale(10),
    marginBottom: hScale(5),
  },
  texttitalView: {
    width: wScale(120),
    height: hScale(40),
    borderTopLeftRadius: wScale(5),
    position: 'absolute',
    top: hScale(-1),
    left: wScale(-1),
    justifyContent: 'center',
    paddingBottom: hScale(3),
    borderBottomRightRadius: 0,
  },
  cutout: {
    borderTopWidth: hScale(40), // Height of the triangle
    borderRightWidth: wScale(33), // Width of the triangle
    borderBottomWidth: wScale(0), // Set to 0 to hide the bottom edge
    borderLeftWidth: wScale(3), // Width of the triangle
    width: wScale(70),
    height: hScale(40),
    borderRightColor: 'transparent', // Hide the right edge
    borderBottomColor: 'transparent', // Hide the bottom edge
    borderLeftColor: 'transparent', // Hide the left edge
    position: 'absolute',
    right: wScale(-50),
    zIndex: wScale(0),
    top: wScale(0),
  },
  texttital: {
    fontSize: wScale(18),
    fontWeight: 'bold',
    color: '#fff',
    width: 240,
    paddingLeft: wScale(10)
  },
  closebuttoX: {
    borderRadius: wScale(24),
    paddingVertical: hScale(5),
    alignItems: 'center',
    height: wScale(48),
    width: wScale(48),
    justifyContent: 'center',
    elevation: 5,
  },
  cutborder: {
    paddingLeft: wScale(2),
    position: 'absolute',
    right: wScale(-12),
    top: hScale(-12),
    borderRadius: wScale(24),
    paddingRight: wScale(3.2),
  },
  languageEmojiContainer: {
    borderWidth: wScale(.5),
    borderRadius: 25,
    height: wScale(35),
    width: wScale(35),
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default SelectDevice;
