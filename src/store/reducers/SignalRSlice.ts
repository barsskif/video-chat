import { createSlice } from '@reduxjs/toolkit';
import { IStateSignalRSlice } from 'types/share';



const initialState: IStateSignalRSlice = {
  shareState: {
    meeting_id: null,
    feed_id: null,
    isShare: null,
  },
  mediaStatusFeeds: [],
  kickFeedId: null,
};
export const SignalRSlice = createSlice({
  name: 'signalRSlice',
  initialState,
  reducers: {
    reducerShareState: (state, action) => {
      if (action.payload && action.payload[0]?.isShare) {
        state.shareState = action.payload;
      }
      if (!action.payload[0]?.isShare && action.payload[0]?.feed_id === state.shareState[0]?.feed_id) {
        state.shareState = {
          meeting_id: null,
          feed_id: null,
          isShare: null,
        };
      }
    },
    reducerMediaStatusFeeds: (state, action) => {
      state.mediaStatusFeeds = action.payload[0];
    },
    reducerUpdateStatusFeeds: (state, action) => {
      const found = state.mediaStatusFeeds.find((obj) => {
        return obj.feed_id === action.payload[0].feed_id;
      });

      if (!found) return;
      found.audio_status = action.payload[0].audio_status;
      found.video_status = action.payload[0].video_status;
    },
    reducerDisconnectFeed: (state, action) => {
      state.mediaStatusFeeds = action.payload[0];
    },
    reducerKickFeedId: (state, action) => {
      state.kickFeedId = action.payload;
    },
  },
});

export default SignalRSlice.reducer;
