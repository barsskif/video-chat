import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IUserMeetingsRecord, UserMeetingsRecordsState} from 'types/share';

const initialState: UserMeetingsRecordsState = {
  data: null,
  downloadFile: undefined,
  error: null,
  isLoading: false,
};

export const UserMeetingsRecordsReducer = createSlice({
  name: 'userMeetingsRecords',
  initialState,
  reducers: {
    MeetingsFetch: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    MeetingsFetchSuccess: (state, action: PayloadAction<IUserMeetingsRecord[]>) => {
      state.data = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    DownloadRecordFetchSuccess: (state, action: PayloadAction<string | undefined>) => {
      state.downloadFile = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    MeetingsFetchError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

  },
});

export default UserMeetingsRecordsReducer.reducer;
