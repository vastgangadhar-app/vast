import React, { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AppBar from './headerAppbar/AppBar';
import { useSelector } from 'react-redux';
import { RootState } from './reduxUtils/store';
import useAxiosHook from './utils/network/AxiosClient';
import { APP_URLS } from './utils/network/urls';
import { useDispatch } from 'react-redux';

import { useNavigation } from './utils/navigation/NavigationService';
import { AuthNavigator } from './utils/navigation/AuthNavigator';
import { AppNavigator } from './utils/navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { setColorConfig, setNeedUpdate, setVersionData } from './reduxUtils/store/userInfoSlice';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import isEqual from 'lodash/isEqual';

const rnBiometrics = new ReactNativeBiometrics({ allowDeviceCredentials: true });

export const AppContainer = () => {
  const { authToken, refreshToken, versionData } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const { get, post } = useAxiosHook();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isFingerPrintEnabled, setIsFingerPrintEnabled] = useState(false);
  const [isFingerPrintVerified, setIsFingerPrintVerified] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await get({ url: APP_URLS.getColors });
      if (res) {
        dispatch(
          setColorConfig({
            primaryColor: res.BACKGROUNDCOLOR1,
            secondaryColor: res.BACKGROUNDCOLOR2,
            primaryButtonColor: res.BUTTONCOLOR1,
            secondaryButtonColor: res.BUTTONCOLOR2,
            labelColor: res.LABLECOLOR,
          }),
        );
      }
      const versionResult = await post({ url: APP_URLS.versionCheck });
      if (versionData && versionResult) {
        const isChanged = isEqual(versionData?.data, versionResult?.data)

        if (!isChanged) {
          dispatch(setVersionData(versionResult));
          dispatch(setNeedUpdate(true));
        
        }


        dispatch(setNeedUpdate(false));
      }
    }
    fetchData();
  }, [authToken, dispatch, get, navigation]);

  const authenticateFingerprint = useCallback(async () => {
    rnBiometrics
      .simplePrompt({ promptMessage: 'Confirm fingerprint' })
      .then(resultObject => {
        const { success } = resultObject;

        if (success) {
          setIsFingerPrintVerified(true);
          console.log('successful biometrics provided');
        } else {
          setIsFingerPrintVerified(false);

        }
      })
      .catch(() => {

      });
  }, []);

  useEffect(() => {
    async function checkBiometrics() {
      // const {available, biometryType} = await rnBiometrics.isSensorAvailable();

      if (available && biometryType === BiometryTypes.Biometrics) {
        // setIsFingerPrintEnabled(true);
        //authenticateFingerprint();
      }
    }
    checkBiometrics();
  }, []);

  return <>{authToken ? <AppNavigator /> : <AuthNavigator />}</>;
};
