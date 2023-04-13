import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, SingInState } from 'types/share';

const initialState: SingInState = {
  user: null,
  isLoading: false,
  error: null,
};

export const SingInSlice = createSlice({
  name: 'singIn',
  initialState,
  reducers: {
    logOut: () => initialState,
    guestSingInFetching: (state) => {
      state.error = null;
      state.isLoading = true;
    },
    guestSingInSuccess: (state, action: PayloadAction<{ user: IUser }>) => {
      state.error = null;
      state.isLoading = false;
      state.user = action.payload.user;
    },
    guestSingInError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.user = null;
    },
    singInFetching: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    singInSuccess: (state, action: PayloadAction<IUser>) => {
      state.isLoading = false;
      state.error = null;
      state.user = action.payload;
    },
    userFetchSuccess: (state, action: PayloadAction<IUser>) => {
      state.isLoading = false;
      state.error = null;
      state.user = action.payload;
    },
    singInError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    editUserData: (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.user = action.payload;
    },
    editFetching: (state) => {
      state.error = null;
      if (state.user) {
        state.user.avatarUrl = null;
        state.isLoading = true;
      }
    },
    editAvatar: (state, action) => {
      state.isLoading = false;
      state.error = null;
      if (state.user) {
        state.user.avatarUrl = action.payload.data;
        state.isLoading = false;
      }
    },
  },
});

export default SingInSlice.reducer;
