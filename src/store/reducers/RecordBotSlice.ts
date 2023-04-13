import { createSlice } from '@reduxjs/toolkit';
import { IinitialStateRecordBot } from 'types/share';



const initialState: IinitialStateRecordBot = {
  recordBot: {
    isOpenBrowser: false,
    isRecord: false,
  },
  isLoading: false,
  error: null,
};

export const RecordBotSlice = createSlice({
  name: 'recordBotSlice',
  initialState,
  reducers: {
    recordBotIsConnectFetch: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    recordBotIsConnectSuccess: (state, action) => {
      state.isLoading = false;
      state.recordBot.isOpenBrowser = action.payload.is_open_browser;
      state.recordBot.isRecord = true;
      state.error = null;
    },
    recordBotIsConnectError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    recordBotStopRecord: (state, action) => {
      state.isLoading = false;
      state.recordBot.isRecord = action.payload;
      state.error = null;
    },
  },
});

export const {recordBotIsConnectFetch, recordBotIsConnectSuccess, recordBotStopRecord, recordBotIsConnectError} = RecordBotSlice.actions
export default RecordBotSlice.reducer;
