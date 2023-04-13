import {AppDispatch} from '../store';
import api from '../../configs/axios.interceptor';
import {RecordDownloadStatus, RecordDownloadError} from 'store/reducers/DownloadRecordSlice';

const SERVER_URL: string | undefined = import.meta.env.REACT_APP_SERVER_URL;

export const getRecordDownload = (id: string, nameFile: string) => async (dispatch: AppDispatch) => {
  try {

        const {data} = await api.get(`${ SERVER_URL }/api/meeting/records/${id}/file/download`, {
            responseType: 'blob',
            onDownloadProgress: (progressEvent) => {
                if (!progressEvent.total) return
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent?.total);
                if (percentCompleted !== 100) {
                    dispatch(RecordDownloadStatus(percentCompleted))
                }
                if (percentCompleted === 100) {
                    dispatch(RecordDownloadStatus(percentCompleted))

          setTimeout(() => {
            dispatch(RecordDownloadStatus(null))

          }, 1000)
        }

      }
    })

        const urlDownload = window.URL.createObjectURL(new Blob([data]));
        const a = document.createElement('a');
        a.href = urlDownload;
        a.download = nameFile;
        document.body.appendChild(a);
        a.click();
    } catch (error) {
        dispatch(RecordDownloadError(error))
    }
};


