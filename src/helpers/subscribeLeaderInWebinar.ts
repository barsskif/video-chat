import { IMeeting } from "types/share";
import { postSubscribeLeader } from "store/actions/ActionWebinar";

interface IProps {
    statusConnectionSignalR: string | boolean;
    webRTCStatus: boolean;
    imJanusID: number | null;
    currentMeetingID: IMeeting['roomId'] | undefined;
    isWebinar: boolean;
}


export const subscribeLeaderInWebinar = async (
    statusConnectionSignalR: IProps['statusConnectionSignalR'],
    webRTCStatus: IProps['webRTCStatus'],
    imJanusID: IProps['imJanusID'],
    currentMeetingID: IProps['currentMeetingID'],
    isWebinar: IProps['isWebinar'],
) => {
    const isReadyToSubscribe = statusConnectionSignalR &&
        webRTCStatus &&
        imJanusID &&
        currentMeetingID &&
        isWebinar;

    if (isReadyToSubscribe) {
        try {
            const message = {
                meeting_id: currentMeetingID?.toString(),
                janus_data: {
                    audio_codec: 'Opus',
                    video_codec: 'Vp8',
                    display: 'Test',
                    id: imJanusID?.toString(),
                    streams: [
                        {
                            codec: 'Opus',
                            mid: '0',
                            mindex: 0,
                            type: 'audio'
                        },
                        {
                            codec: 'Vp8',
                            mid: '1',
                            mindex: 1,
                            type: 'video'
                        }
                    ],
                }
            };
            return await postSubscribeLeader(message);
        } catch (e) {
            return e;
        }
    }
}
