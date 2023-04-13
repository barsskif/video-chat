import { createSelector } from '@reduxjs/toolkit';
import {
  IChatState,
  IDifferentStatesSlice,
  IinitialStateRecordBot,
  IMeetingState,
  IStateSignalRSlice,
  IVidSettingsState,
} from 'types/share';

interface RootState {
  VideoSettingsReducer: IVidSettingsState;
  DifferentStatesSlice: IDifferentStatesSlice;
  SignalRSlice: IStateSignalRSlice;
  MeetingReducer: IMeetingState;
  ChatReducer: IChatState;
  RecordBotReducer: IinitialStateRecordBot;
}

const selectVideoSettings = (state: RootState) => state.VideoSettingsReducer;
const selectDifferentStates = (state: RootState) => state.DifferentStatesSlice;
const selectSignalR = (state: RootState) => state.SignalRSlice;
const selectMeeting = (state: RootState) => state.MeetingReducer;
const selectChat = (state: RootState) => state.ChatReducer;
const selectRecordBot = (state: RootState) => state.RecordBotReducer;

export const useSelectsMeetingOverlay = createSelector(
  selectVideoSettings,
  selectDifferentStates,
  selectSignalR,
  selectMeeting,
  selectChat,
  selectRecordBot,
  (videoSettings, differentStates, signalR, meeting, chat, recordBot) => ({
    audioStatus: videoSettings.audioStatus,
    videoStatus: videoSettings.videoStatus,
    shareStatus: videoSettings.shareStatus,
    selectedDevices: videoSettings.selectedDevices,
    webRTCStatus: differentStates.webRTCStatus,
    imJanusID: differentStates.imJanusID,
    statusConnectionSignalR: differentStates.statusConnectionSignalR,
    screenCaptureStatus: differentStates.screenCaptureStatus,
    shareState: signalR.shareState,
    mediaStatusFeeds: signalR.mediaStatusFeeds,
    kickFeedId: signalR.kickFeedId,
    currentMeeting: meeting.currentMeeting,
    countUnread: chat.countUnread,
    isLoading: recordBot.isLoading,
    recordBot: recordBot.recordBot,
    error: recordBot.error,
  }),
);
