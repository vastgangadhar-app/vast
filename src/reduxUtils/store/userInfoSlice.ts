import * as toolkitRaw from '@reduxjs/toolkit';
const {createSlice} = ((toolkitRaw as any).default ?? toolkitRaw) as typeof toolkitRaw;

const initialState = {
  authToken: '',
  refreshToken: '',
  userId: '',
  colorConfig: {
    primaryColor: '#EEEEEEE',
    secondaryColor: '#EEEEE00',
    primaryButtonColor: '#EEEEE00',
    secondaryButtonColor: '#EEEEEEE',
    labelColor: '#0000000',
  },
  versionData: {},
  isFingerprintEnabled: false,
  dashboardData: {},
  sliderImageData: [],
  needUpdate: true,
  userRole: '', 
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setColorConfig: (state, action) => {
      state.colorConfig = action.payload;
    },
    setFingerprintStatus: (state, action) => {
      state.isFingerprintEnabled = action.payload;
    },
    setVersionData: (state, action) => {
      state.versionData = action.payload;
    },
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setSliderImageData: (state, action) => {
      state.sliderImageData = action.payload;
    },
    setNeedUpdate: (state, action) => {
      state.needUpdate = action.payload;
    },
    setUserRole: (state, action) => { 
      state.userRole = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setAuthToken,
  setRefreshToken,
  setUserId,
  setColorConfig,
  setFingerprintStatus,
  reset,
  setVersionData,
  setDashboardData,
  setSliderImageData,
  setNeedUpdate,
  setUserRole, 
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
