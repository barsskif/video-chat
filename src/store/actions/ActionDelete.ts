import { AppDispatch } from '../store';
import api from '../../configs/axios.interceptor';
import { getMeetingRecord } from 'store/reducers/ActionCreate';

const url: string | undefined = import.meta.env.REACT_APP_SERVER_URL;

export const deleteRecordByServer = (id: string, userId: number | undefined) => async (dispatch: AppDispatch) => {
  try {
    const { status } = await api.delete(`${url}/api/meeting/records/${id}/file`);
    if (status === 200) {
      if (userId === undefined) return;
      dispatch(getMeetingRecord(userId, 1));
    }
  } catch (error) {
    return error;
  }
};
