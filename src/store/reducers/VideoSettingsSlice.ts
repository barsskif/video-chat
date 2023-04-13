import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAllDevices, ISelectedDevices, IVideoPermission, IVidSettingsState } from 'types/share';

import { isMobile } from 'react-device-detect';

const initialState: IVidSettingsState = {
  allDevices: {
    initStatus: false,
    audioInput: [],
    audioOutput: [],
    videoInput: [],
  },
  selectedDevices: {
    initStatus: false,
    audioInput: null,
    audioOutput: null,
    videoInput: null,
  },
  videoPermission: {
    height: isMobile ? 2420 : 420,
    width: isMobile ? 2740 : 740,

    // height: 2420,
    // width: 2160,
  },
  audioStatus: true,
  videoStatus: false,
  shareStatus: false,
  error: null,
};

export const VideoSettingsSlice = createSlice({
  name: 'videoSettings',
  initialState,
  reducers: {
    addDevices: (state, action: PayloadAction<IAllDevices>) => {
      state.allDevices.audioInput = action.payload.audioInput;
      state.allDevices.audioOutput = action.payload.audioOutput;
      state.allDevices.videoInput = action.payload.videoInput;
      state.allDevices.initStatus = action.payload.initStatus;
      // state.error = null;
    },
    selectDevices: (state, action: PayloadAction<ISelectedDevices>) => {
      if ('audioInput' in action.payload) state.selectedDevices.audioInput = action.payload.audioInput;
      if ('audioOutput' in action.payload) state.selectedDevices.audioOutput = action.payload.audioOutput;
      if ('videoInput' in action.payload) state.selectedDevices.videoInput = action.payload.videoInput;
      if ('initStatus' in action.payload) state.selectedDevices.initStatus = action.payload.initStatus;
      // state.error = null;
    },
    errorInitDevices: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.allDevices.initStatus = true;
    },
    switchAudio: (state, action: PayloadAction<boolean>) => {
      state.audioStatus = action.payload;
    },
    switchVideo: (state, action: PayloadAction<boolean>) => {
      state.videoStatus = action.payload;
    },
    switchSare: (state, action: PayloadAction<boolean>) => {
      state.shareStatus = action.payload;
    },
    reducerSwitchVideoPermission: (state, action: PayloadAction<IVideoPermission | undefined>) => {
      state.videoPermission.height = action.payload?.height;
      state.videoPermission.width = action.payload?.width;
    },
    reset: () => initialState,
  },
});

export default VideoSettingsSlice.reducer;
