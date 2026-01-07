import React from 'react';
import { View, StyleSheet } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxUtils/store';
import { hScale, wScale } from '../utils/styles/dimensions';
import BackSvg from '../features/drawer/svgimgcomponents/BackSvg';
import NextcalenderSvg from '../features/drawer/svgimgcomponents/NextcalenderSvg';

const CustomCalendar = ({ onDateSelected }) => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);
  const handleDateChange = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    console.log(formattedDate);
    onDateSelected(formattedDate);
  };

  return (
    <View style={[styles.main, { backgroundColor: colorConfig.secondaryColor }]}>
      <View style={styles.container}>
        <CalendarPicker
          onDateChange={handleDateChange}
          nextTitle={<NextcalenderSvg size={25} color='#000' />}
          previousTitle={<BackSvg size={25} color='#000' />}
          selectedDayColor="red"
          monthTitleStyle	={styles.month}
          yearTitleStyle	={styles.month}
          selectMonthTitle	={styles.month}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
    flex: 1,
  },
  container: {
    borderTopEndRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    flex: 1,
    paddingBottom: hScale(20),
  },
  month:{
    fontSize:wScale(25),
    fontWeight:'bold',
    textTransform:'uppercase'
  }
});

export default CustomCalendar;
