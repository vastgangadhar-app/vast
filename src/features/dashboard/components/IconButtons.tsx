import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { FlashList } from '@shopify/flash-list';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import BackArrow from '../../../utils/svgUtils/BackArrow';
import { sectionData } from '../utils';
import { useNavigation } from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors } from '../../../utils/styles/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnelineDropdownSvg from '../../drawer/svgimgcomponents/simpledropdown';
import { APP_URLS } from '../../../utils/network/urls';
import useAxiosHook from '../../../utils/network/AxiosClient';

const loader = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }];
const MAX_ITEMS = 4; 

const IconButtons = ({
  getItem,
  isQuickAccess,
  iconButtonstyle,
  buttonData,
  showViewMoreButton = false,
  setViewMoreStatus = (p0: (prev: any) => boolean) => { },
  buttonTitle = "",
}) => {
  const [Radius1, setRadius1] = useState(Number);
  const [rotation, setRotation] = useState(false);

  const { post, get } = useAxiosHook();


  const navigation = useNavigation();



  useEffect(() => {
    async function fetchData() {
      try {

        const response = await post({ url: APP_URLS.signUpSvg });
        if (response && Array.isArray(response)) {

          setRadius1(response[0].Radius1);


          console.log(Radius1, 'radius*/*/*/*/*/*/');

        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }

    }
    fetchData()

  })

  const saveItemToStorage = async (item) => {
    try {
      const savedItems = await AsyncStorage.getItem('quickAccessItems');
      let itemsArray = savedItems ? JSON.parse(savedItems) : [];

      itemsArray.unshift(item);

      if (itemsArray.length > MAX_ITEMS) {
        itemsArray.pop();
      }

      await AsyncStorage.setItem('quickAccessItems', JSON.stringify(itemsArray));
      getItem();
    } catch (error) {
      console.error('Error saving item to AsyncStorage:', error);
    }
  };

  return (
    <>
      <FlashList
        style={[
          iconButtonstyle,
          { justifyContent: "space-between", alignSelf: "stretch" }, 
        ]}
        data={buttonData}
        ListEmptyComponent={() => (
          <View style={{ flexDirection: "row", }}>
            {loader.map((item) => (
              <View key={item.id} style={{ marginHorizontal: wScale(18) }}>
                <SkeletonPlaceholder
                  speed={1200}
                  backgroundColor={colors.gray}
                  borderRadius={4}
                >
                  <SkeletonPlaceholder.Item alignItems="center">
                    <SkeletonPlaceholder.Item
                      width={wScale(45)}
                      height={wScale(45)}
                      borderRadius={wScale(45)}
                    />
                    <SkeletonPlaceholder.Item
                      margin={wScale(10)}
                      width={wScale(40)}
                      height={wScale(10)}
                    />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              </View>
            ))}
          </View>
        )}
        numColumns={4}
        estimatedItemSize={20}
        renderItem={({ item, index }: { item: sectionData; index: number }) => (
          <>
            <TouchableOpacity
              onPress={() => {
                if (isQuickAccess) {
                  saveItemToStorage(item);
                } else {
                  navigation.navigate({ name: item.ScreenName });
                }
              }}
              style={styles.element} 
            >
              <View style={styles.InputImage}>
                <SvgUri height={wScale(50)} width={wScale(50)} uri={item.svg} onError={() => <BackArrow />} />
              </View>
              <View key={item.name}>
                <Text style={styles.screeitemname} numberOfLines={2}>
                  {item.name}
                </Text>
              </View>
            </TouchableOpacity>

            
            {showViewMoreButton && index === buttonData.length - 1 && (
              <Pressable
                onPress={() => {
                  setViewMoreStatus((prev) => !prev);
                  setRotation(!rotation);
                }}
                style={styles.morebtn} 
              >
                <View style={[
                  styles.imgview,
                  {
                    borderRadius: Radius1,
                    transform: [{ rotate: rotation ? '180deg' : '0deg' }]
                  }
                ]}>
                  <OnelineDropdownSvg size={25} />
                </View>
                <Text style={styles.screeitemname}>{buttonTitle}</Text>
              </Pressable>
            )}
          </>
        )}
      />


    </>
  );
};


export default memo(IconButtons);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  element: {
    paddingHorizontal: wScale(6),
    paddingVertical: wScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wScale(5),
    width: '100%'
  },
  InputImage: {
    height: wScale(50),
    width: wScale(50),
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  morebtn: {
    paddingVertical: wScale(8),
    padding: wScale(7),
    alignItems: 'center',
    width: '100%'
  },
  imgview: {
    backgroundColor: "#fff",
    height: wScale(50),
    width: wScale(50),
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }]
  },
  screeitemname: {
    color: "white",
    textAlign: "center",
  }

});
