import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWebinarRoom } from "types/share";

interface IWebinarRoomState {
  webinarRoom: IWebinarRoom | null;
  isLoading: boolean;
  error: Error | null;
}

const initialState: IWebinarRoomState = {
  webinarRoom: null,
  isLoading: false,
  error: null,
};

const webinarRoomSlice = createSlice({
  name: 'webinarRoom',
  initialState,
  reducers: {
    fetch: (state) => {
      return {
        ...state,
        webinarRoom: null,
        isLoading: true,
        error: null,
      };
    },
    fetchSuccess: (state, { payload }: PayloadAction<IWebinarRoom>) => {
      return {
        ...state,
        webinarRoom: payload,
        isLoading: false,
        error: null,
      };
    },
    fetchFailure: (state, { payload: error }: PayloadAction<Error>) => {
      return {
        ...state,
        webinarRoom: null,
        isLoading: false,
        error,
      };
    },
  },
});

const {
  fetch,
  fetchSuccess,
  fetchFailure
} = webinarRoomSlice.actions;

export { fetch, fetchSuccess, fetchFailure };
export default webinarRoomSlice.reducer;