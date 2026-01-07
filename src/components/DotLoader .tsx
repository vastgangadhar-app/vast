import React, { useEffect, useState } from 'react';
import { View, Animated, Easing, Text, StyleSheet } from 'react-native';
import { wScale } from '../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxUtils/store';

// Define colors
const SecondaryColor = '#FF6347';  // Example secondary color
const TextColor = '#FFFFFF';       // Example text color

const DotLoader = ({ color = SecondaryColor }) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  const [scale] = useState(new Animated.Value(1)); // Initial scale value for animation

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.5, // Scale up the box
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1, // Scale back to original size
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate();
  }, [scale]);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      {[...Array(4)].map((_, index) => (
        <Animated.View key={index} style={[styles.box, { transform: [{ scale }], backgroundColor: colorConfig.primaryColor }]}>
        </Animated.View>
      ))}
    </View>
  );
};

// White color version of the DotLoader
const DotLoaderWhiteColor = () => {
  return <DotLoader color={TextColor} />;
};

export { DotLoader, DotLoaderWhiteColor };

const styles = StyleSheet.create({
  box: {
    width: wScale(8),
    height: wScale(8),
    borderRadius: 8,
  },
});
