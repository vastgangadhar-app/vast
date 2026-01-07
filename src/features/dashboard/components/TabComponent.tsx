import React from 'react';
import { View, StyleSheet } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../HomeScreen';
import WalletScreen from '../WalletScreen';
import HomeSvg from '../../drawer/svgimgcomponents/homesvg';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { colors } from '../../../utils/styles/theme';
import SettingSvg from '../../drawer/svgimgcomponents/Settingsvg';
import ReportSvg from '../../drawer/svgimgcomponents/Reportsvg';
import ReportScreen from '../ReportScreen';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import WalletSvg from '../../drawer/svgimgcomponents/Walletsvg';
import AccReportScreen from '../accont';
import Accounttabsvg from '../../drawer/svgimgcomponents/Accounttabsvg';

const Tab = createBottomTabNavigator();

export const TabComponent = () => {
  const { colorConfig } = useSelector((state: RootState) => state.userInfo);

  return (
    
    <Tab.Navigator
      screenOptions={{
         headerShown: false,   
      }}
    
      tabBar={({ navigation, state, descriptors, insets }) => (
        
        <BottomNavigation.Bar
        activeColor={colorConfig.secondaryColor}
        activeIndicatorStyle={{backgroundColor:'transtparent'}}
        
        style={{backgroundColor: colors.light_blue ,borderRadius:30,}}
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key, 
              canPreventDefault: true, 
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color:'red', size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
    
        name="Home"
        component={HomeScreen}
        options={{ 
          
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => {
            return <HomeSvg size={wScale(28)} color={focused ? colorConfig.secondaryColor : '#263142'} />;
          },
          // tabBarIcon: ({ color, size }) => {
          //   return <HomeSvg size={wScale(28)} color={colors.white} />;
          // },
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarLabel: 'Wallet',
        
          tabBarIcon: ({ focused }) => {
            return <WalletSvg size={wScale(28)} color={focused ? colorConfig.secondaryColor : '#263142'} />;
          },

        }}
      />
            <Tab.Screen
            
        name="Account"
        component={AccReportScreen}
        options={{
          
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused }) => {
            return <Accounttabsvg size={wScale(28)} color={focused ? colorConfig.secondaryColor : '#263142'} />;
          },
        }}
      />  
            <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarLabel: 'Report',
          tabBarIcon: ({ focused }) => {
            return <ReportSvg size={wScale(28)} color={focused ? colorConfig.secondaryColor : '#263142'} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});