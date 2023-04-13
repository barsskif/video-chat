import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  masage: null,
  isLoading: false,
  error: null,
};

export const StateTechnicalWorkSlice = createSlice({
  name: 'stateTechnicalWorkSlice',
  initialState,
  reducers: {
    stateTechnicalWorkFetch: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    stateTechnicalWorkSuccess: (state, action) => {
      state.error = null;
      state.isLoading = false;
      state.masage = action.payload;
    },
    stateTechnicalWorkError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.masage = null;
    },
  },
});

export default StateTechnicalWorkSlice.reducer;
