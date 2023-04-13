import { createSlice } from '@reduxjs/toolkit';

interface IState {
  isLoading: boolean;
  status: boolean | null;
  errorMessage: boolean | null;
}

const initialState: IState = {
  isLoading: false,
  status: null,
  errorMessage: null,
};

export const RegistrationSlice = createSlice({
  name: 'RegistrationSlice',
  initialState,
  reducers: {
    registrationFetching: (state) => {
      state.isLoading = true;
      state.status = null;
      state.errorMessage = null;
    },
    registrationSuccess: (state, action) => {
      state.isLoading = false;
      state.status = action.payload;
      state.errorMessage = null;
    },
    registrationError: (state, action) => {
      state.isLoading = false;
      state.status = null;
      state.errorMessage = action.payload;
    },
  },
});

export default RegistrationSlice.reducer;
