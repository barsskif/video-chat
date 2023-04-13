import { createSlice } from '@reduxjs/toolkit';

interface IRecordDownload {
  loadingPercentage: null | number
  error: Error | null
}

const initialState: IRecordDownload = {
  loadingPercentage: null,
  error: null
};

export const RecordDownloadSlice = createSlice({
  name: 'RecordDownloadSlice',
  initialState,
  reducers: {
    RecordDownloadStatus: (state, action) => {
      state.loadingPercentage = action.payload
    },
    RecordDownloadError: (state, action) => {
      state.error = action.payload
    },
  },
});

export const { RecordDownloadStatus, RecordDownloadError } = RecordDownloadSlice.actions
export default RecordDownloadSlice.reducer;
