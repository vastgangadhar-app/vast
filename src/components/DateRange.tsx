import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { hScale, wScale } from '../utils/styles/dimensions';
import Calendarsvg from '../features/drawer/svgimgcomponents/Calendarsvg';
import SearchIcon from '../features/drawer/svgimgcomponents/Searchicon';
import { useSelector } from 'react-redux';
import { RootState } from '../reduxUtils/store';
import CustomCalendar from './Calender';
import { BottomSheet } from '@rneui/base';
import OnelineDropdownSvg from '../features/drawer/svgimgcomponents/simpledropdown';
import { colors } from '../utils/styles/theme';
import FilterSvg from '../features/drawer/svgimgcomponents/FilterSvg';

interface DateRangePickerProps {
  onDateSelected: (from: Date, to: Date) => void;
  SearchPress: (from: Date, to: Date, status: string) => void;
  status: string;
  setStatus: (status: string) => void;
  isStShow?: boolean;

}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateSelected, SearchPress, status, setStatus, isStShow = true }) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isSelectingFromDate, setIsSelectingFromDate] = useState(true);
  const [rotation, setRotation] = useState(false);
  const [filter, setFilter] = useState(false);
  const [StShow, setStShow] = useState(isStShow);
  const [searchnumber, setSearchnumber] = useState('');
  const [searchstatus, setSearchStatus] = useState(status);

  const handleDateSelected = (data: string) => {
    const selectedDate = new Date(data);
    setIsCalendarVisible(false);

    if (isSelectingFromDate) {
      setFromDate(selectedDate);
      onDateSelected(selectedDate, toDate);
    } else {
      setToDate(selectedDate);
      onDateSelected(fromDate, selectedDate);
    }
  };

  const onFromDatePress = () => {
    setIsSelectingFromDate(true);
    setIsCalendarVisible(true);
  };

  const onToDatePress = () => {
    setIsSelectingFromDate(false);
    setIsCalendarVisible(true);
  };

  const dropdownPress = () => {
    setRotation(!rotation);
  };
  const filteress = () => {
    setFilter(!filter);
  };

  const searchHistory = () => {
    SearchPress(fromDate, toDate, searchstatus); // Pass selected status
  };

  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  return (
    <LinearGradient colors={[colorConfig.primaryColor, colorConfig.secondaryColor]} style={styles.gradient}>
      <View style={styles.header}>
        {rotation ? (
          <View>
            <TextInput
              placeholder={'Search By Consumer Number'}
              placeholderTextColor={'#fff'}
              value={searchnumber}
              onChangeText={setSearchnumber}
              style={styles.input}
            />
            <TouchableOpacity
              onPress={filteress}
            >
              <TextInput
                placeholder={'Select Status'}
                placeholderTextColor={'#fff'}
                value={searchstatus}
                editable={false}
                style={styles.input}
              />
              <View style={styles.righticon}>
                <OnelineDropdownSvg size={25} color='#fff' />
              </View>
            </TouchableOpacity>

            {filter ? <View style={[styles.statusheight,]}>
              {['All Transactions', 'Success', 'Pending', 'Failed'].map((statusOption) => (
                <TouchableOpacity key={statusOption} onPress={() => { setSearchStatus(statusOption); setStatus(statusOption); setFilter(false) }}>
                  <Text style={styles.statusText}>{statusOption}</Text>
                </TouchableOpacity>
              ))}
            </View> : null}
          </View>
        ) : null}
        <View style={styles.headerrow}>

          {StShow ? (
            <TouchableOpacity
              style={[styles.dropdown, { transform: [{ rotate: rotation ? '180deg' : '0deg' }] }]}
              onPress={dropdownPress}>
              <FilterSvg size={28} color='#fff' />
            </TouchableOpacity>) : null
          }
          <TouchableOpacity style={styles.datePickerButton} onPress={onFromDatePress}>
            <Calendarsvg color='#fff' />
            <View style={{ paddingLeft: wScale(5) }}>
              <Text style={styles.buttonText}>From Date</Text>
              <Text style={styles.dateText}>{fromDate.toISOString().split('T')[0]}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.datePickerButton} onPress={onToDatePress}>
            <Calendarsvg color='#fff' />
            <View style={{ paddingLeft: wScale(5) }}>
              <Text style={styles.buttonText}>To Date</Text>
              <Text style={styles.dateText}>{toDate.toISOString().split('T')[0]}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.searchButton} onPress={searchHistory}>
            <SearchIcon size={28} color='#fff' />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet
        isVisible={isCalendarVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={() => setIsCalendarVisible(false)}
      >
        <View>
          <CustomCalendar onDateSelected={handleDateSelected} />

        </View>
      </BottomSheet>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    elevation: 3,
  },
  header: {
    padding: wScale(10),
    backgroundColor: 'rgba(255,255,255,0.3)'
  },
  headerrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
    paddingHorizontal: wScale(8),
    paddingVertical: wScale(5),
    borderRadius: 5,

  },
  buttonText: {
    color: '#fff',
    fontSize: wScale(13),
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  dateText: {
    color: '#fff',
    fontSize: wScale(12),
  },
  searchButton: {
    padding: wScale(10),
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  dropdown: {
    padding: wScale(10),
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  righticon: {
    position: 'absolute',
    right: wScale(0),
    height: '75%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: wScale(12),
  },
  input: {
    height: hScale(40),
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: wScale(10),
    marginBottom: hScale(10),
    color: '#fff',
  },
  statusheight: {
    overflow: 'hidden',
    marginTop: hScale(-10),
    marginBottom: hScale(10),
    backgroundColor: 'rgba(0,0,0,0.2)'
  },
  statusText: {
    color: '#fff',
    paddingVertical: hScale(8),
    paddingHorizontal: wScale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',

  },
});

export default DateRangePicker;


