import {useAppSelector} from "hooks/redux";
import {RootState} from "store/store";

interface IUseVideoMeetingAppSelectorsProps {
    user: RootState['SingInReducer']['user'];
    dataTurnServer: RootState['TurnServerReducer']['data'];
    turnServerError: RootState['TurnServerReducer']['error'];
    isLoading: RootState['TurnServerReducer']['isLoading'];
    selectedDevices: RootState['VideoSettingsReducer']['selectedDevices'];
    videoStatus: RootState['VideoSettingsReducer']['videoStatus'];
    audioStatus: RootState['VideoSettingsReducer']['audioStatus'];
    shareStatus: RootState['VideoSettingsReducer']['shareStatus'];
    videoPermission: RootState['VideoSettingsReducer']['videoPermission'];
    deviceInitError: RootState['VideoSettingsReducer']['error'];
    currentMeeting: RootState['MeetingReducer']['currentMeeting'];
    error: RootState['MeetingReducer']['error'];
    webRTCStatus: RootState['DifferentStatesSlice']['webRTCStatus'];
    errorMessageCaptureCamera: RootState['DifferentStatesSlice']['errorMessageCaptureCamera'];
    statusConnectionSignalR: RootState['DifferentStatesSlice']['statusConnectionSignalR'];
    destroyedRoom: RootState['DifferentStatesSlice']['destroyedRoom'];
    imJanusID: RootState['DifferentStatesSlice']['imJanusID'];
    screenCaptureStatus: RootState['DifferentStatesSlice']['screenCaptureStatus'];
}

export const useVideoMeetingAppSelectors = (): IUseVideoMeetingAppSelectorsProps => {
    const { user } = useAppSelector((state) => state.SingInReducer);

    const {
        data: dataTurnServer,
        error: turnServerError,
        isLoading,
    } = useAppSelector((state) => state.TurnServerReducer);

    const {
        selectedDevices,
        videoStatus,
        audioStatus,
        shareStatus,
        videoPermission,
        error: deviceInitError,
    } = useAppSelector((state) => state.VideoSettingsReducer);

    const {
        currentMeeting,
        error,
    } = useAppSelector((state) => state.MeetingReducer);

    const {
        webRTCStatus,
        errorMessageCaptureCamera,
        statusConnectionSignalR,
        destroyedRoom,
        imJanusID,
        screenCaptureStatus,
    } = useAppSelector((state) => state.DifferentStatesSlice);

    return {
        user,
        dataTurnServer,
        turnServerError,
        isLoading,
        selectedDevices,
        videoStatus,
        audioStatus,
        shareStatus,
        videoPermission,
        deviceInitError,
        currentMeeting,
        error,
        webRTCStatus,
        errorMessageCaptureCamera,
        statusConnectionSignalR,
        destroyedRoom,
        imJanusID,
        screenCaptureStatus,
    };
};