import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  Animated,
  Easing,
} from 'react-native';
import useAxiosHook from '../../utils/network/AxiosClient';
import { APP_URLS } from '../../utils/network/urls';
import AppBarSecond from '../drawer/headerAppbar/AppBarSecond'; // Ensure this import is correct based on your project structure
import { hScale, wScale } from '../../utils/styles/dimensions';
import { color } from '@rneui/base';

const OtherLinks = () => {
  const [inforeport, setInforeport] = useState([]);
  const [loading, setLoading] = useState(true);
  const { get } = useAxiosHook();
  const colorScheme = useColorScheme();

  const demoData = [
    { Name: 'Demo Link 1', Link: 'https://example.com/1' },
    { Name: 'Demo Link 2', Link: 'https://example.com/2' },
  ];

  const fetchReports = async () => {
    try {
      const response = await get({ url: `${APP_URLS.OtherLinks}` });
      if (!response) {
        throw new Error('Network response was not ok');
      }
      setInforeport(response.uploadlink_list);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load data, showing demo data');
      setInforeport(demoData);
    } finally {
      setLoading(false);
    }
  };

  const colorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchReports();
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 2,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [colorAnim]);

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['red', 'yellow', 'green'],
  });

  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, colorScheme === 'dark' ? styles.cardDark : styles.cardLight]}>
      <View style={styles.cardContent}>
        <Text style={[styles.nameText, colorScheme === 'dark' ? styles.textDark : styles.textLight]}>
          {item.Name}
        </Text>
        <TouchableOpacity onPress={() => openURL(item.Link)} style={styles.btn}>
          <Text style={[styles.buttonText, colorScheme === 'dark' ? styles.textDark : styles.textLight]}>Open Link</Text>
          <Animated.Text style={[styles.animtext, { color: textColor }]}>Click Me</Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.main}>
      <AppBarSecond
        title="Other Links" 
        onActionPress={() => { }}
        actionButton={null}
        onPressBack={() => { }}
      />
      <View style={[styles.container, colorScheme === 'dark' ? styles.containerDark : styles.containerLight]}>
        {loading ? (
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
        ) : (
          <FlatList
            data={inforeport}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.Link}
          />
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    paddingHorizontal: wScale(15),
    flex: 1,
    paddingVertical: hScale(20),
  },
  containerLight: {
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    backgroundColor: '#121212',
  },

  cardContainer: {
    marginBottom: hScale(10),
  },
  card: {
    borderRadius: 15,
    borderWidth: wScale(1),
    paddingHorizontal: wScale(15),
    paddingVertical: wScale(8),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderColor: '#fff',
    marginBottom: hScale(18),
  },
  cardLight: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    shadowColor: '#ccc',
  },
  cardDark: {
    backgroundColor: '#333',
    borderColor: '#444',
    shadowColor: '#000',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: wScale(16),
    fontWeight: '600',
  },
  btn: {
    paddingVertical: hScale(8),
    paddingHorizontal: wScale(16),
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: wScale(14),
    fontWeight: '500',
  },
  textLight: {
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
  animtext: {
    fontSize: wScale(12)
  },
});

export default OtherLinks;
