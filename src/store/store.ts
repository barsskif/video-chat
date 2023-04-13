import { combineReducers, configureStore } from '@reduxjs/toolkit';
import SingInReducer from './reducers/SingInSlice';
import MeetingReducer from './reducers/MeetingSlice';
import VideoSettingsReducer from './reducers/VideoSettingsSlice';
import ChatReducer from './reducers/ChatSlice';
import DifferentStatesSlice from './reducers/DifferentStatesSlice';
import SignalRSlice from './reducers/SignalRSlice';
import PlannedMeetingReducer from './reducers/PlannedMeetingSlice';
import RegistrationReducer from './reducers/RegistrationSlice';
import TurnServerReducer from './reducers/TurnServerSlice';
import RecordBotReducer from './reducers/RecordBotSlice';
import UserMeetingsRecordsReducer from './reducers/UserMeetingRecordsSlice';
import RecordDownloadReducer from './reducers/DownloadRecordSlice'
import webinarRoomSlice from './reducers/CreateWebinarRoomSlice'

const rootReducer = combineReducers({
  SingInReducer,
  MeetingReducer,
  VideoSettingsReducer,
  ChatReducer,
  DifferentStatesSlice,
  SignalRSlice,
  PlannedMeetingReducer,
  RegistrationReducer,
  TurnServerReducer,
  RecordBotReducer,
  UserMeetingsRecordsReducer,
  RecordDownloadReducer,
  webinarRoomSlice
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false
    }),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
