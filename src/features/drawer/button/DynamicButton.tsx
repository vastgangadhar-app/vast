import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import { hScale, wScale } from '../../../utils/styles/dimensions';

type Props = {
  title: string;
  onPress: () => void;
  styleoveride?: any;
  disabled?: boolean; // ✅ NEW (optional)
};

const DynamicButton = ({
  title,
  onPress,
  styleoveride,
  disabled = false, // ✅ default
}: Props) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  const handlePress = () => {
    if (disabled) return; // 🔒 safety
    onPress();
  };

  return (
      <LinearGradient
        style={[styles.LinearGradient, styleoveride]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colors={
           [colorConfig.primaryButtonColor, colorConfig.secondaryButtonColor]
        }
      >
        <TouchableOpacity
          // activeOpacity={disabled ? 1 : 0.7}
          onPress={handlePress}
          disabled={disabled}
          style={styles.subnitbtn}
        >
          <Text
            style={[
              styles.submittext,
              { color: colorConfig.labelColor },
            ]}
          >
            {title}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
  );
};


const styles = StyleSheet.create({
  subnitbtn: {
    alignItems: 'center',
    height: hScale(55),
    justifyContent: 'center',
    borderRadius: wScale(5),

  },
  submittext: {
    fontSize: wScale(18),
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  LinearGradient: {
    width: '100%',
    borderRadius: wScale(5),
  },
});
export default DynamicButton;
