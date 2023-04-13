import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IMeeting, IMeetingState} from 'types/share';

export type MeetingPayload<T> = PayloadAction<T>;

type SetMeetingStateAction = {
    type: string;
    payload: string | boolean;
};

const initialState: IMeetingState = {
    currentMeeting: null,
    meetingHash: null,
    isLoading: false,
    error: null,
    guest: false,
    subscription: null,
};

const setMeetingState = (state: IMeetingState, action: SetMeetingStateAction) => {
    state.isLoading = false;
    state.error = null;
    state.meetingHash = action.payload;
};


export const MeetingSlice = createSlice({
    name: 'meeting',
    initialState,
    reducers: {
        reset: () => initialState,
        guestSwitcher: (state, action: MeetingPayload<boolean>) => {
            return {
                ...state,
                guest: action.payload
            }
        },
        guestSubscription: (state, action: MeetingPayload<boolean>) => {
            return {
                ...state,
                subscription: action.payload
            }
        },
        meetingCreateSuccess: (state, action: MeetingPayload<string>) => {
            setMeetingState(state, action)
        },
        meetingExistsSuccess: (state, action: MeetingPayload<string | boolean>) => {
            setMeetingState(state, action)
        },
        meetingFetchSuccess: (state, action: MeetingPayload<IMeeting>) => {
            return {
                ...state,
                isLoading: false,
                error: null,
                currentMeeting: action.payload,
            }

        },
        meetingDeleteSuccess: (state) => {
            return {
                ...state,
                meetingHash: null,
                currentMeeting: null,
                isLoading: false,
                error: null,
            }
        },
        meetingFetching: (state) => {
            return {
                ...state,
                isLoading: true,
                error: null,
            }
        },
        meetingError: (state, action) => {
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        },
    },
});

export default MeetingSlice.reducer;
