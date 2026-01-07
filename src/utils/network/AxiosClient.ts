import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxUtils/store';
import { useCallback, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { APP_URLS } from './urls';
import { useDispatch } from 'react-redux';
import { reset, setAuthToken, setRefreshToken, setUserId } from '../../reduxUtils/store/userInfoSlice';
import { encrypt } from '../encryptionUtils';

const useAxiosHook = () => {
  const { authToken = '', refreshToken } = useSelector(
    (state: RootState) => state.userInfo,
  );
  const dispatch = useDispatch();
  let isRefreshing = false;

  useEffect(() => {
    console.log('**AUTH_TOKEN', authToken)
  }, [authToken])
  const axiosInstance = useMemo(
    () =>
      axios.create({
     //  baseURL: 'https://native.stdigipe.in/',
    //  baseURL: 'http://native.badshahwallet.in/',
    baseURL: 'https://native.smartpaymoney.in/',

 // baseURL: 'https://native.vastwebindia.com/',
      }),
    [],
  );

  const get = useCallback(
    async ({ url }: { url: string }) => {
      const response = await axiosInstance.get(url);
      return response.data;
    },
    [axiosInstance],
  );

  const post = useCallback(
    async ({
      url,
      data,
      config = {},
    }: {
      url: string;
      data?: any;
      config?: any;
    }) => {
      try {

        const response = await axiosInstance.post(url, data, config);
        return response.data;
      } catch (e) {

        return e;
      }
    },
    [axiosInstance],
  );

  const onRefreshToken = useCallback(async () => {

    const data = {
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    };

    const response = await post({
      url: APP_URLS.getToken,
      data,
      config: {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: 'bearer',
        },
      },
    });
    isRefreshing = false;

    if (response?.access_token) {
      dispatch(setAuthToken(response?.access_token));
      dispatch(setUserId(response?.userId));
      dispatch(setRefreshToken(response?.refresh_token));

      return response;
    }
    return null;
  }, [dispatch, post]);

  const onRefreshTokenTest = useCallback(async () => {
    const encryption = encrypt(['9090909090', '123456789']);

    const data = {
      UserName: encryption.encryptedData[0],
      Password: encryption.encryptedData[1],
      grant_type: 'password',
    };

    const response = await post({
      url: APP_URLS.getToken,
      data,
      config: {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: 'bearer',
          value1: encryption.keyEncode,
          value2: encryption.ivEncode,
        },
      },
    });
    isRefreshing = false;

    if (response?.access_token) {
      dispatch(setAuthToken(response?.access_token));
      dispatch(setUserId(response?.userId));
      dispatch(setRefreshToken(response?.refresh_token));

      return response;
    }
    return null;
  }, [dispatch, post]);

  const put = useCallback(
    async ({ url, data }: { url: string; data: any }) => {
      const response = await axiosInstance.put(url, data);
      return response.data;
    },
    [axiosInstance],
  );

  axiosInstance.interceptors.request.use(
    config => {
      if (authToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    async error => {

      if (error.response && error.response.status === 401 && isRefreshing === false) {
        isRefreshing = true;

        const response = await onRefreshTokenTest();

        if (response) {
          error.config.headers.Authorization = `Bearer ${response?.access_token}`;

          return axiosInstance(error.config);
        }
        else {
          dispatch(reset());
          return Promise.reject(error);
        }

      }
      if (error.response && error.response.data) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
    },
  );
  return { get, post, put };
};

export default useAxiosHook;
