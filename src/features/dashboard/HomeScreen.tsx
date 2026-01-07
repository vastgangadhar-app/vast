import React, { memo, useCallback, useEffect, useState } from "react";
import { Alert, AsyncStorage, Pressable, RefreshControl, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { View, Text, StyleSheet, Image } from "react-native";
import IconButtons from "./components/IconButtons";
import CarouselView from "./components/CarouselView";
import { SvgXml } from "react-native-svg";
import { hScale, wScale } from "../../utils/styles/dimensions";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxUtils/store";
import useAxiosHook from "../../utils/network/AxiosClient";
import { APP_URLS } from "../../utils/network/urls";
import { sectionData } from "./utils";
import DashboardHeader from "./components/DashboardHeader";
import { useNavigation } from "../../utils/navigation/NavigationService";
import LottieView from "lottie-react-native";
import { decryptData } from "../../utils/encryptionUtils";
import { useDispatch } from "react-redux";
import { setDashboardData } from "../../reduxUtils/store/userInfoSlice";
import isEmpty from "lodash/isEmpty";
import HoldcreditSvg from "../drawer/svgimgcomponents/HoldcreditSvg";
import ToselfSvg from "../drawer/svgimgcomponents/ToselfSvg";
import RecentTrSvg from "../drawer/svgimgcomponents/RecentTrSvg";
import { FlashList } from "@shopify/flash-list";
import NewsSlider from "../../components/SliderText";
const HomeScreen = () => {
  const { colorConfig, needUpdate, dashboardData ,userId} = useSelector((state: RootState) => state.userInfo);
  const color1 = `${colorConfig.primaryColor}25`;
  const [rechargeSectionData, setRechargeSectionData] = useState<sectionData[]>(
    []
  );
  const [financeSectionData, setFinanceSectionData] = useState<sectionData[]>(
    []
  );
  const [rechargeViewMoreData, setRechargeViewMoreData] = useState<sectionData[]>(
    []
  );
  const [viewMoreStatus, setViewMoreStatus] = useState<boolean>(
    true
  );
  const [otherSectionData, setOtherSectionData] = useState<sectionData[]>([]);
  const [travelSectionData, setTravelSectionData] = useState<sectionData[]>([]);
  const [sliderImages, setSliderImages] = useState<any[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const { post, get } = useAxiosHook();
  const navigation = useNavigation();
  const [savedItems, setSavedItems] = useState([]);
  const [newsData, setNewsData] = useState([]);

  const dispatch = useDispatch();

  const Newssms = async () => {
    const res = await get({ url: APP_URLS.getProfile })


    if (res.data) {
      console.log(JSON.parse(decryptData(res.value1, res.value2, res.data)))
      const video = JSON.parse(decryptData(res.value1, res.value2, res.data))
      console.log(video.videokycstatus)
      // if(video.videokycstatus =='Y'){

      //   if(video.videokycstatus ==='Y'){


      //     Alert.alert(
      //       'Info',
      //       'Video kyc is pending',
      //       [
      //         {
      //           text: 'OK',  
      //           onPress: () => console.log('OK Pressed'),
      //         },
      //         {
      //           text: 'Procceed Video Kyc',  
      //           onPress: () => {
      //             navigation.navigate('VideoKYC');
      //           },
      //         },
      //       ],
      //       { cancelable: false }
      //     );
          
      //   }



      //   // navigation.replace('VideoKYC');
      // }
    }
    try {
      const respone = await get({ url: APP_URLS.NewsNotifaction })
      console.log(respone)

      if (respone.Status) {
        setNewsData(respone.data);
      }

    } catch (error) { }
  }
  const fetchData = async () => {
    Newssms()
    try {
      const storedItems = await AsyncStorage.getItem('quickAccessItems');
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        setSavedItems(parsedItems);
        console.log('Loaded Items from AsyncStorage:', parsedItems);
      }
    } catch (error) {
      console.error('Error loading saved items from AsyncStorage:', error);
    }

    if (!needUpdate && !isEmpty(dashboardData)) {
      setRechargeSectionData([...dashboardData.rechargeSectionData]?.splice(0, 7) || []);
      setRechargeViewMoreData(dashboardData.rechargeSectionData || []);
      setFinanceSectionData(dashboardData.financeSectionData);
      setOtherSectionData(dashboardData.otherSectionData);
      setTravelSectionData(dashboardData.travelSectionData);
      return;
    }

    const rechargeSectionResponse = await post({
      url: APP_URLS.getRechargeSectionImages,
    });


    setRechargeSectionData([...rechargeSectionResponse]?.splice(0, 7) || []);
    setRechargeViewMoreData(rechargeSectionResponse || []);

    const financeSectionResponse = await post({
      url: APP_URLS.getFinanceSectionImages,
    });

    setFinanceSectionData(financeSectionResponse || []);

    const otherSectionResponse = await post({
      url: APP_URLS.getOtherSectionImages,
    });
    setOtherSectionData(otherSectionResponse || []);

    const travelSectionResponse = await post({
      url: APP_URLS.getTravelSectionImages,
    });
    console.log(travelSectionResponse, '-*/*/*/*/*/*/*/*/')

    setTravelSectionData(travelSectionResponse || []);

    dispatch(setDashboardData({
      rechargeSectionData: rechargeSectionResponse,
      financeSectionData: financeSectionResponse,
      otherSectionData: otherSectionResponse,
      travelSectionData: travelSectionResponse
    }));
  };
  const [IsVer,setIsVer]= useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setViewMoreStatus(true)
    fetchData().then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
 
    const getData = async () => {
   
      const userInfo = await get({ url: APP_URLS.getUserInfo });
      const data = userInfo.data;
      const frmanems = decryptData(data.vvvv, data.kkkk, data.frmanems)
      setFirmDet(frmanems);
      setAdminFirmDet(decryptData(data.vvvv, data.kkkk, data.adminfarmname));

      const decryptedFrmanems = decryptData(data.vvvv, data.kkkk, data.frmanems);
      const photoss = decryptData(data.vvvv, data.kkkk, data.photoss);
      const adminfarmname = decryptData(data.vvvv, data.kkkk, data.adminfarmname);
      await AsyncStorage.setItem('adminFarmData', JSON.stringify({
        adminFarmName: adminfarmname,
        frmanems: decryptedFrmanems,
        photoss: photoss
      }));
    }
    Promise.all([getData(), fetchData()]).then(() => setRefreshing(false));
    adharpanStatus();
  }, []);

  const [adminFirmDet, setAdminFirmDet] = useState<any>();
  const [FirmDet, setFirmDet] = useState<any>();

  const getData = useCallback(async () => {

    const userInfo = await get({ url: APP_URLS.getUserInfo });
    const data = userInfo.data;
    const response = await get({ url: APP_URLS.balanceInfo });
    console.log(userInfo, 'blance*/*/*/*/*/*/*/')
    console.log(decryptData(data.vvvv, data.kkkk, data.adminfarmname));
    console.log(decryptData(data.vvvv, data.kkkk, data.frmanems));
    setFirmDet(decryptData(data.vvvv, data.kkkk, data.frmanems));
    setAdminFirmDet(decryptData(data.vvvv, data.kkkk, data.adminfarmname))
  }, [get]);

  const adharpanStatus = async () => {
    try {
      const APstatus = await get({
        url: `${APP_URLS.AddharPanStatus}=${userId}`,
      });
      console.log(APstatus, `${APP_URLS.AddharPanStatus}=${userId}`);
  
      if (!APstatus) {
        console.error('API response is empty or undefined');
        return;
      }
  
      let isVerify = true;  
  
      if (APstatus.verify_type === "all") {
        isVerify = APstatus.aadhar_status === true && APstatus.pan_status === true;
      } else if (APstatus.verify_type === "aadhar") {
        isVerify = APstatus.aadhar_status === true;
      } else if (APstatus.verify_type === "pan") {
        isVerify = APstatus.pan_status === true;
      }
  
      if (!isVerify) {
        console.log('Verification failed');
  
        if (APstatus.aadhar_status !== true) {
          console.log('Navigating to AadhrPanVerify for Aadhar');
          navigation.replace('AadhrPanVerify', {
            aadharcard: APstatus.aadhar,  
            pancard: APstatus.pan,        
            verify_type: APstatus.verify_type,  
          });
        } else if (APstatus.pan_status !== true) {
          console.log('Navigating to AadhrPanVerify for Pan');
          navigation.replace('AadhrPanVerify', {
            aadharcard: APstatus.aadhar,  
            pancard: APstatus.pan,        
            verify_type: APstatus.verify_type,  
          });
        }
      } else {
        console.log('Verification successful');
      }
    } catch (error) {
      console.error('Error in adharpanStatus function:', error);
    }
  };
  
  
  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={[
        colorConfig.primaryColor, colorConfig.secondaryColor
      ]}>
      <StatusBar backgroundColor={colorConfig.primaryColor} />
      <DashboardHeader refreshPress={onRefresh} />
      <View >
        {newsData && <NewsSlider data={newsData} />}
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.HederContainer}>
        <View style={styles.box}>
        <TouchableOpacity style={[styles.boxiner,{ backgroundColor: colorConfig.secondaryColor }]} onPress={() => navigation.navigate({ name: 'PostoMain' })}>
          <ToselfSvg size={20} color={'#fff'} />
          <Text style={[styles.boxtext, ]}>Move Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boxiner,{ backgroundColor: colorConfig.secondaryColor }]} onPress={() => navigation.navigate({ name: 'HoldAndCredit' })}>
          <HoldcreditSvg size={20} color={'#fff'} />
          <Text style={[styles.boxtext, { }]}>Hold & Credit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.boxiner,{ backgroundColor: colorConfig.secondaryColor }]}>
          <RecentTrSvg size={20} color={'#fff'} />
          <Text style={[styles.boxtext, ]}>Recent Tr</Text>
        </TouchableOpacity>
      </View>

          <View style={[styles.Headers3, {  }]}>
            <View style={[styles.ios, { backgroundColor: colorConfig.secondaryColor }]}>
              <View style={[styles.titlerow, { backgroundColor: color1 }]}>
                <View style={[styles.QuickAcces2,]}>
                  <Text style={[styles.QuickAccestext, { color: '#fff' }]}>Hi </Text>
                  <Text style={[styles.hedertitletexr2, { maxWidth: 170 }]} numberOfLines={1} ellipsizeMode="tail">
                    {FirmDet}</Text>
                  <Text style={[styles.QuickAccestext, { color: '#fff' }]}> Your Quick Access</Text>
                </View>
                <Pressable
                  onPress={() => {
                    navigation.navigate({ name: "QuickAccessScreen" });
                  }}
                  style={[styles.InputImage, {
                    backgroundColor: colorConfig.secondaryColor
                  }]} >
                  <LottieView
                    autoPlay={true}
                    loop={true}
                    style={styles.lotiimg2}
                    source={require('../../utils/lottieIcons/pencil.json')}
                  />
                </Pressable>
              </View>
              <View style={styles.headercontant}>
                {savedItems && savedItems.length > 0 ? (
                  <IconButtons buttonData={savedItems} />
                ) : (
                  <IconButtons buttonData={otherSectionData} />
                )}
              </View>
            </View>  
          </View>
          <View >
            <CarouselView />
          </View>
          <View >
            <View style={[styles.Headers2, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
              <View style={[styles.bblogorow]}>
                <Text style={[styles.hedertitletexr,]}>Recharge & Pay Bill</Text>
                <Image source={require('../../features/drawer/assets/bblogo.png')}
                  style={styles.bblogo} />
              </View>
              <View style={styles.headercontant}>
                <IconButtons buttonData={viewMoreStatus ? rechargeSectionData : rechargeViewMoreData} showViewMoreButton
                  setViewMoreStatus={setViewMoreStatus} buttonTitle={viewMoreStatus ? 'View More' : 'Hide More'}
                />
              </View>
            </View>
          </View>

          <View style={[styles.Headers2, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
            <View style={styles.bblogorow}>
              <Text style={[styles.hedertitletexr,
              ]}>Financial Services</Text>

              <LottieView
                autoPlay={true}
                loop={true}
                style={styles.lotiimg}
                source={require('../../utils/lottieIcons/Money-bag2')}
              />
            </View>

            <View style={styles.headercontant}>
              <IconButtons buttonData={financeSectionData} />
            </View>
          </View>

          <View style={[styles.Headers2, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
            <View style={styles.bblogorow}>
              <Text style={[styles.hedertitletexr,]}>Travel Hotel</Text>
              <LottieView
                autoPlay={true}
                loop={true}
                style={styles.lotiimg}
                source={require('../../utils/lottieIcons/Travel.json')}
              />
            </View>
            <View style={styles.headercontant}>
              <IconButtons buttonData={travelSectionData} />
            </View>
          </View>

          <View style={[styles.Headers2, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
            <View style={styles.bblogorow}>
              <Text style={[styles.hedertitletexr,]}>Other Section</Text>
             </View>
            <View style={styles.headercontant}>
              <IconButtons buttonData={otherSectionData} />
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  HederContainer: {
    justifyContent: "space-between",
    paddingBottom: hScale(5),
    borderColor: "rgba(255,255,255,.3)",
    paddingHorizontal: wScale(10),
  },
  Headers2: {
    borderWidth: wScale(.8),
    borderColor: "white",
    borderRadius: 5,
    position: "relative",
    marginVertical: hScale(8),
  },
  Headers3: {
    borderWidth: wScale(.8),
    borderColor: "white",
    borderRadius: 5,
    position: "relative",
    marginVertical: hScale(8),
  },
  ios: {
    borderRadius: 5,
  },
  QuickAcces2: {
    flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal: wScale(15),
    borderTopEndRadius: 4,
    borderTopLeftRadius: 4,
    paddingVertical: hScale(5)
  },
  QuickAccestext: {
    fontSize: wScale(15),
    color: '#fff'
  },
  bblogorow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: hScale(10),
    marginRight: wScale(15),
  },
  bblogo: {
    height: wScale(25),
    width: wScale(20),
  },
  hedertitletexr: {
    fontSize: wScale(18),
    color: '#fff',
    fontWeight: 'bold',
    paddingLeft: wScale(15)
  },
  hedertitletexr2: {
    fontSize: wScale(15),
    color: "#fff",
    textAlign: "center",
    fontWeight: 'bold'
  },
  headercontant: {
    justifyContent: "space-between",
    paddingHorizontal: wScale(10),
    paddingTop: hScale(12),
  },
  InputImage: {
    height: wScale(25),
    width: wScale(25),
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    borderRadius: 100
  },
  editbgImg: {
    alignItems: "center",
    position: "absolute",
    right: 0,
    top: 0,
    color: "white",
  },
  lotiimg2: {
    height: hScale(20),
    width: wScale(20),
  },
  lotiimg: {
    height: hScale(50),
    width: wScale(40),
    position: 'absolute',
    right: wScale(-5),
    top: hScale(2)
  },
  viwemore: {
    marginLeft: wScale(18),
    width: wScale(80),
    alignItems: 'center',
    marginTop: hScale(15)
  },
  titlerow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: wScale(2)
  },
  box: {
    paddingVertical: hScale(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boxtext: {
    fontSize: wScale(15),
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'capitalize',
    textAlign: 'center',
    paddingLeft: wScale(4)
  },
  boxiner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth:wScale(.8),
    padding:wScale(4),
    borderRadius:5,
    borderColor:'#fff'
  }
});

export default memo(HomeScreen);