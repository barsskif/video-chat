import {AppDispatch} from '../store';

import axios from 'axios';
import api from '../../configs/axios.interceptor';

import {recordBotIsConnectFetch, recordBotIsConnectSuccess, recordBotStopRecord} from '../reducers/RecordBotSlice';

const RECORD_BOT_URL: string | undefined = import.meta.env.REACT_APP_RECORD_BOT_URL;
const SERVER_URL: string | undefined = import.meta.env.REACT_APP_SERVER_URL;

export const isOpenBrowserBot = (hash: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(recordBotIsConnectFetch())
        const {data} = await axios.post(`${RECORD_BOT_URL}/api/bot/connection`, {hash: hash})

        if (data.data['is_open_browser'] === true) {

            const {data} = await api.post(`${SERVER_URL}/api/meeting/record`, {
                hash: hash,
                isRecord: true
            });

            dispatch(recordBotIsConnectSuccess(data))
        }

    } catch (error) {
        return error
    }
};

export const isCloseBrowserBot = (hash: string) => async (dispatch: AppDispatch) => {
    try {
        const {data} = await api.post(`${SERVER_URL}/api/meeting/record`, {
            hash: hash,
            isRecord: false
        });

        if (data['statusCode'] === 200) {
            const {data} = await axios.post(`${RECORD_BOT_URL}/api/bot/disconnect`, {hash: hash})
            dispatch(recordBotStopRecord(data['is_open_browser']))
        }
    } catch (error) {
        return error
    }
};
