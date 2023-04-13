import { createSlice } from '@reduxjs/toolkit';
import { ITurnServerState } from 'types/share';

const initialState: ITurnServerState = {
  data: null,
  isLoading: false,
  error: null,
};

export const TurnServerSlice = createSlice({
  name: 'turnServer',
  initialState,
  reducers: {
    resetTurnServer: () => initialState,

    turnServerFetching: (state) => {
      state.data = null;
      state.isLoading = true;
      state.error = null;
    },

    turnServerSuccess: (state, action) => {
      state.data = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    turnServerError: (state, action) => {
      state.data = null;
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default TurnServerSlice.reducer;
