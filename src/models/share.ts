/* eslint-disable */
import { AlertColor } from '@mui/material';

export enum optionsEnum {
  DELETE = 'delete',
  CONFIRM = 'confirm',
  ADMIN = 'Admin',
  OFF_MIC = 'offMIc',
  OFF_CAM = 'offCAM',
  ORGANIZATOR = 'Organizator',
  COORGANIZATOR = 'Coorganizator',
  LEADER = 'Leader',
  MEMBER = 'Member',
  GUEST = 'Guest',
}

export enum ServerErrorDescriptionEnum {
  MEETING_NOT_ACTIVE = 'Meeting not active!',
}

export interface IFeedInformationJanusSubscription {
  id: number;
  display: string;
  audio_codec?: string;
  video_codec?: string;
  streams: { type: string; mindex: number; mid: string; codec?: string }[];
}

export interface ISendAddShare {
  meeting_id: string | null | undefined;
  feed_id: string | null | undefined;
  isShare: boolean | null | undefined;
}

export interface IUpdateMediaStatus {
  meeting_id: string;
  feed_id: string;
  audio_status: boolean;
  video_status: boolean;
}

export interface IStartRecord {
  meeting_id: string | null;
  feed_id: string;
  isRecord: boolean;
}

export type TypeMsg =
  | 'SubscribeLeaderInWebinarAsync'
  | 'ConnectionStream'
  | 'IsShare'
  | 'UpdateMediaStatus'
  | 'isRecord'
  | 'DisconnectionStream'
  | 'WebinarRaiseHandAsync'
  | 'GetAllLeadersInWebinarAsync';

export interface SingInState {
  user: IUser | null;
  isLoading: boolean;
  error: typeof Error | null;
}

export interface IStateSignalRSlice {
  shareState: ISendAddShare;
  mediaStatusFeeds: IMediaStatusFedds[] | [];
  kickFeedId: number | null;
}

export interface IinitialStateRecordBot {
  recordBot: {
    isOpenBrowser: boolean;
    isRecord: boolean;
  };
  isLoading: boolean;
  error: any;
}

export interface ITurnServerState {
  data: {
    turnServer: string;
    turnPort: number;
    turnType: string;
    turnUser: string;
    turnPwd: string;
  } | null;
  isLoading: boolean;
  error: typeof Error | null;
}

export interface IUser {
  avatarUrl?: string | null;
  email: string;
  userId?: number;
  firstname?: string;
  userName?: string | undefined | any;
}

export interface IMeeting {
  id?: number;
  sessionId?: number;
  transaction?: string;
  audioCodec: string;
  videoCodec: string;
  userEmail?: string;
  adminUserId?: number;
  hashId?: string;
  isActive?: boolean;
  isWebinar: boolean;
  pluginId?: number;
  isPrivate?: boolean;
  record?: boolean;
  description: string;
  meetingName: string;
  roomId: number;
}

export interface ISingIn {
  email: string;
  password: string;
}

export interface IMeetingState {
  meetingHash: string | null | boolean;
  currentMeeting: IMeeting | null;
  isLoading: boolean;
  error: {
    description: string;
    data: {
      dateStartPlanning: string;
      timeStartPlanning: string;
    };
  } | null;
  guest: boolean;
  subscription: null | boolean;
}

export type typeThemesList = 'main' | 'meeting';

export interface IDifferentStatesSlice {
  talkingFeeds: [] | number[];
  theme: typeThemesList;
  imJanusID: number | null;
  destroyedRoom: boolean;
  webRTCStatus: boolean;
  remoteWebRTCStatus: boolean;
  dataChannelStatus: boolean;
  statusConnectionSignalR: boolean | string;
  errorMessageCaptureCamera: null | string;
  meetingVideoGridCountPreset: number;
  screenCaptureStatus: boolean;
  statusConnectWebRtcInfo: null | string;
}

export interface ITalkingDBov {
  [x: string]: any;

  [index: number]: number;
}

export interface IDevice {
  deviceId: string | 'default';
  groupId: string;
  kind: 'audioinput' | 'audiooutput' | 'videoinput' | 'videooutput';
  label: string;
}

export interface IChangedDevicesList {
  audioInput: IChangedDevice[] | [];
  audioOutput: IChangedDevice[] | [];
  videoInput: IChangedDevice[] | [];
}

export interface IDeviceList {
  audioInput: IDevice[] | [];
  audioOutput: IDevice[] | [];
  videoInput: IDevice[] | [];
}

export interface IAllDevices extends IDeviceList {
  initStatus: boolean;
}

export interface IChangedDevice extends IDevice {
  status: 'add' | 'remove';
}

export interface ISelectedDevices {
  initStatus?: boolean;
  audioInput?: IDevice | null;
  audioOutput?: IDevice | null;
  videoInput?: IDevice | null;
}

export interface IVideoPermission {
  height: number | undefined;
  width: number | undefined;
}

export interface IPermissionArr {
  id: string;
  name: string;
  height: number;
  width: number;
}

export interface IVidSettingsState {
  allDevices: IAllDevices;
  selectedDevices: ISelectedDevices;
  videoPermission: IVideoPermission;
  audioStatus: boolean;
  videoStatus: boolean;
  shareStatus: boolean;
  error: string | null;
}

export const enum enumDeviceType {
  AUDIO_INPUT = 'audioinput',
  AUDIO_OUTPUT = 'audiooutput',
  VIDEO_INPUT = 'videoinput',
}

export interface IChatMessage {
  id: string;
  name: string;
  remote: boolean;
  body: string;
}

type TypeWebRTCData = 'chat' | 'log' | 'settings';

export interface IWebRTCData {
  type: TypeWebRTCData;
  data: IChatMessage | never;
}

export interface IChatState {
  allMessages: IChatMessage[];
  countUnread: number;
}

export interface IMeetingParticipant {
  id: number | null;
  name: string;
  me?: boolean;
}

export interface IVideoGridLayout {
  videoHeight: number;
  videoWidth: number;
  x: number;
  y: number;
}

export interface IAlertMessage {
  body: string;
  severity: AlertColor;
}

export interface IMeetingPlanned {
  startDate: string;
  endDate: string;
  isPrivate: boolean;
  roomName: string;
  hashRoom: string;
}

export interface IFetchPlanningMeeting {
  email?: string;
  countDay: number;
  startDate: string;
}

export interface IPlannedItem {
  roomName: string;
  startDate: string;
  endDate: string;
  isPrivate: boolean;
  hashRoom: string;
}

export interface IPlannedListGroup {
  planningRoomDtos: IPlannedItem[];
}

export interface IPlannedState {
  plannedList: IPlannedListGroup[];
  currentPlannedMeeting: IPlannedMeeting | null;
  isLoading: boolean;
  isEditSuccess: boolean;
  isCreateSuccess: boolean;
  error: string | null;
  startDate: string | null;
  countDays: number;
}

export interface IDeletePlanned {
  hash: string;
  userEmail: string;
}

export interface IPayloadActionPlannedListGroup {
  data: IPlannedListGroup[];
  startDate: string;
  countDays: number;
}

export interface ILocationState {
  state: {
    user: IUser | null;
    meetingHash?: string;
  };
  pathname: string;
}

export interface IAuthDataPayload {
  data: {
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    user: {
      email: string;
      userId: number;
      userName: string;
      name?: string;
    };
  };
}

export enum enumLocalStorage {
  ACCESS_TOKEN = 'accessToken',
  GUEST_NAME = 'guestName',
  USER_DATA = 'userData',
  MEETING_HASH = 'meetingHash',
}

export interface IMediaStatusFedds {
  audio_codec: string;
  audio_status: boolean;
  display: string;
  feed_id: number;
  user_id: number;
  video_codec: string;
  video_status: false;
  user_role: string;
  avatarUrl: string;
  email: string;
}

export interface IPlannedMeeting {
  meetingName?: string;
  publishers?: number;
  description?: string;
  isPrivate?: boolean;
  record?: boolean;
  startDateTime?: Date;
  endDateTime?: Date;
  userVideo?: boolean;
  userAudio?: boolean;
  isRoomWait?: boolean;
}

export interface IPlannedMeetingFormikInitialState extends Omit<IPlannedMeeting, 'startDateTime' | 'endDateTime'> {
  startDateTime: Date | null;
  endDateTime: Date | null;
}

export interface IEditPlannedMeeting extends IPlannedMeeting {
  hash: string;
}

export interface IJwtTokenData {
  amr?: string[];
  aud?: string[];
  auth_time?: number;
  client_id?: string;
  email?: string;
  exp?: number;
  guest?: string;
  iat?: number;
  idp?: string;
  iss?: string;
  jti?: string;
  nbf?: number;
  scope?: string[];
  sub?: string;
  guest_name?: string;
}

export enum enumError {
  USER_NOT_FOUND = 'user not found',
  INCORRECT_PASSWORD = 'incorrect password',
  INVALID_USERNAME_OR_PASSWORD = 'invalid_username_or_password',
}

export interface UserMeetingsRecordsState {
  data: IUserMeetingsRecordData | null;
  error: typeof Error | null;
  downloadFile: string | undefined;
  isLoading: boolean;
}

export interface IUserMeetingsRecordData {
  message: IUserMeetingsRecordMessage[];
  pageNumber: number;
  pageSize: number;
  pageNumberNext: number;
  pageNumberPrev: number;
  totalPages: number;
  totalCount: number;
}

export interface IUserMeetingsRecordMessage {
  id: number;
  url?: string;
  meetingHash: string;
  recordName: string;
  meetingId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  body?: string;
}

export interface IWebinarRoom {
  data: string;
  description: string;
  err: Error | null;
  statusCode: number;
}
