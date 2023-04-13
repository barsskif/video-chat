import { useAppDispatch } from 'hooks/redux';
import { ChatSlice } from 'store/reducers/ChatSlice';
import { IChatMessage, IWebRTCData } from 'types/share';

export const useWebRTCOnDataHandler = () => {
  const dispatch = useAppDispatch();
  const { addMessage } = ChatSlice.actions;

  const webRTCDataHandler = (data: string) => {
    let webRTCdata;
    try {
      webRTCdata = JSON.parse(data) as IWebRTCData;
    } catch (e) {
      console.error(e);
    }
    if (!webRTCdata) return;
    switch (
      webRTCdata.type //тут сколько угодно типов данных получаемых по webRTCData
    ) {
      case 'chat':
        const message = webRTCdata.data as never;
        return dispatch(addMessage(message as IChatMessage));
      default:
        return console.error('unknown data type - ', webRTCdata.type);
    }
  };

  return [webRTCDataHandler];
};
