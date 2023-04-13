import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChatMessage, IChatState } from 'types/share';

const initialState: IChatState = {
  allMessages: [],
  countUnread: 0,
};

export const ChatSlice = createSlice({
  name: 'chatSlice',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IChatMessage>) => {
      state.allMessages = [...state.allMessages, action.payload];
      state.countUnread = state.countUnread++;
    },
    resetCountUnread: (state) => {
      state.countUnread = 0;
    },
  },
});

export default ChatSlice.reducer;
