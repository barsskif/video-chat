import api from '../../configs/axios.interceptor';

interface IDataSubscribeLeader {
    meeting_id: string | undefined;
    janus_data: {
        audio_codec: string;
        video_codec: string
        display: string;
        id: string | undefined;
        streams: {
            codec: string,
            mid: string,
            mindex: number,
            type: string
        }[],
    },
}

const SERVER_URL: string | undefined = import.meta.env.REACT_APP_SERVER_URL;

export const postSubscribeLeader = async <T>(dataSubscribeLinear: IDataSubscribeLeader): Promise<T> => {
    try {
        const { data } = await api.post(`${SERVER_URL}/api/dev/record/webinar/subscribe-leader`, dataSubscribeLinear)
        return data
    } catch (error) {
        throw error
    }
};