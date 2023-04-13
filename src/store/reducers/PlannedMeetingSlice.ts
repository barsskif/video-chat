import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPayloadActionPlannedListGroup, IPlannedListGroup, IPlannedMeeting, IPlannedState } from 'types/share';

const initialState: IPlannedState = {
  plannedList: [],
  currentPlannedMeeting: null,
  isLoading: false,
  isCreateSuccess: false,
  isEditSuccess: false,
  error: null,
  startDate: null,
  countDays: 0,
};

export const PlannedMeetingSlice = createSlice({
  name: 'plannedMeeting',
  initialState,
  reducers: {
    fetchSuccess: (state, action: PayloadAction<IPayloadActionPlannedListGroup>) => {
      state.plannedList = action.payload.data;
      state.countDays = action.payload.countDays;
      state.startDate = action.payload.startDate;
      state.error = null;
      state.isLoading = false;
    },
    deleteSuccess: (state, action: PayloadAction<[IPlannedListGroup]>) => {
      state.isLoading = false;
      state.error = null;
      state.plannedList = action.payload;
    },
    createSuccess: (state) => {
      state.isCreateSuccess = true;
      state.isLoading = false;
      state.error = null;
    },
    editSuccess: (state) => {
      state.isEditSuccess = true;
      state.isLoading = false;
      state.error = null;
    },
    fetchOneSuccess: (state, action: PayloadAction<IPlannedMeeting>) => {
      state.error = null;
      state.isLoading = false;
      state.currentPlannedMeeting = action.payload;
    },
    fetchAwait: (state) => {
      state.isLoading = true;
    },
    fetchError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    formStateReset: (state) => {
      state.isCreateSuccess = false;
      state.isEditSuccess = false;
      state.currentPlannedMeeting = null;
      state.error = null;
    },
  },
});

export default PlannedMeetingSlice.reducer;
