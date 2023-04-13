import { TypeSfu } from 'types/janusTypes';
import { IWebRTCData } from 'types/share';
import { useState } from 'react';

export const useWebRTCSendData = (sfuRef: TypeSfu, webRTCStatus: boolean, userName: string | undefined) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<Error | string | null>(null);

  const sendChatMessage = (message: string) => {
    if (!message || !userName) return;
    webRTCDataSend({
      type: 'chat',
      data: {
        id: String(Date.now()),
        name: userName,
        remote: true,
        body: message,
      },
    });
  };

  const webRTCDataSend = (data: IWebRTCData) => {
    if (!webRTCStatus || data === null || !sfuRef.current || !userName) return;
    setIsSending(true);
    sfuRef.current.data({
      text: JSON.stringify(data),
      success: () => {
        setIsSending(false);
        setError(null);
      },
      error: (error: Error | string) => {
        setError(error);
        setIsSending(false);
      },
    });
  };

  return { sendChatMessage, isSending, error };
};
