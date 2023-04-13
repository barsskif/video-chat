import { AppDispatch } from '../store';
import { fetch, fetchSuccess, fetchFailure } from '../reducers/CreateWebinarRoomSlice';
import api from '../../configs/axios.interceptor';

const SERVER_URL = import.meta.env.REACT_APP_SERVER_URL;

interface IData {
  meetingName: string;
  publishers: number;
  description: string;
}

export const createWebinarRoom = ({ meetingName, publishers, description }: IData) => async (dispatch: AppDispatch) => {
  try {
    const body = {
      meetingName,
      publishers,
      description,
      bitrate: 2000000,
      userVideo: false,
      userAudio: false,
      isWebinar: true,
    };

    dispatch(fetch());

    const { data } = await api.post(`${ SERVER_URL }/api/meeting/webinar`, body);

    dispatch(fetchSuccess(data));
    return data
  } catch (error) {
    dispatch(fetchFailure(error as Error));
  }
};