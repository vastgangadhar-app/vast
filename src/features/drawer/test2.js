import React from 'react';
import { View, StyleSheet } from 'react-native';

const Appss = () => {
  return (
    <View style={styles.container}>
      <View style={styles.doubleBorder}>
        <View style={[styles.innerView, styles.upperRadius]}></View>
        <View style={[styles.innerView, styles.lowerRadius]}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doubleBorder: {
    borderWidth: 4,
    borderColor: 'black', // Outer border color
    width: 200,
    height: 100,
    overflow: 'hidden', // To clip the inner views
    padding:4
  },
  innerView: {
    flex: 1,
    borderWidth: 4,
    borderColor: 'red', // Inner border color
  },
  upperRadius: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  lowerRadius: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});

export default Appss;
