import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDifferentStatesSlice, typeThemesList } from 'types/share';

const initialState: IDifferentStatesSlice = {
  talkingFeeds: [],
  theme: 'main',
  imJanusID: null,
  destroyedRoom: false,
  webRTCStatus: false,
  remoteWebRTCStatus: false,
  dataChannelStatus: false,
  statusConnectionSignalR: false,
  errorMessageCaptureCamera: null,
  meetingVideoGridCountPreset: 0,
  screenCaptureStatus: false,
  statusConnectWebRtcInfo: null,
};

export const DifferentStatesSlice = createSlice({
  name: 'differentStatesSlice',
  initialState,
  reducers: {
    reset: () => initialState,
    addTalkingFeed: (state, action) => {
      if ((state.talkingFeeds as readonly number[]).includes(action.payload)) return;
      state.talkingFeeds = [...state.talkingFeeds, action.payload];
    },
    deleteTalkingFeed: (state, action) => {
      if (!(state.talkingFeeds as readonly number[]).includes(action.payload)) return;
      state.talkingFeeds = state.talkingFeeds.filter((feed: number) => feed !== action.payload);
    },
    reducerDestroyedRoom: (state, action: PayloadAction<boolean>) => {
      state.destroyedRoom = action.payload;
    },
    reducerImJanusID: (state, action: PayloadAction<number>) => {
      state.imJanusID = action.payload;
    },
    reducerWebRTCStatus: (state, action: PayloadAction<boolean>) => {
      state.webRTCStatus = action.payload;
    },
    reducerRemoteWebRTCStatus: (state, action: PayloadAction<boolean>) => {
      state.remoteWebRTCStatus = action.payload;
    },
    reducerDataChannelStatus: (state, action: PayloadAction<boolean>) => {
      state.dataChannelStatus = action.payload;
    },
    reducerStatusConnectionSignalR: (state, action: PayloadAction<boolean | string>) => {
      state.statusConnectionSignalR = action.payload;
    },
    reducerErrorMessageCaptureCamera: (state, action: PayloadAction<string | null>) => {
      state.errorMessageCaptureCamera = action.payload;
    },
    reducerMeetingVideoGridCountPreset: (state, action: PayloadAction<number>) => {
      state.meetingVideoGridCountPreset = action.payload;
    },
    reducerSetTheme: (state, action: PayloadAction<typeThemesList>) => {
      state.theme = action.payload;
    },
    reducerScreenCaptureStatus: (state, action: PayloadAction<boolean>) => {
      state.screenCaptureStatus = action.payload;
    },
    reducerStatusConnectWebRtc: (state, action: PayloadAction<string | null>) => {
      state.statusConnectWebRtcInfo = action.payload;
    },
  },
});

export default DifferentStatesSlice.reducer;
