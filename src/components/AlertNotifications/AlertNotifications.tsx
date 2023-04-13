import  { FC, useCallback, useEffect, useState } from 'react';
import { Alert, Stack, styled } from '@mui/material';
import { IAlertMessage } from 'types/share';

interface IAlertNotificationsProps {
  messages: IAlertMessage[] | undefined;
}

export const AlertNotifications: FC<IAlertNotificationsProps> = ({ messages }) => {
  const [queueMessages, setQueueMessages] = useState<IAlertMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<IAlertMessage | null>(null);

  const nextMessage = useCallback(() => {
    setQueueMessages(prevState => prevState.slice(1));
    setCurrentMessage(null);
  }, []);

  useEffect(() => {
    if (messages && messages.length > 0) {
      setQueueMessages(prevState => [...prevState, ...messages]);
    }
  }, [messages]);

  useEffect(() => {
    if (queueMessages.length && currentMessage === null) {
      setCurrentMessage(queueMessages[0]);
      const delay = queueMessages[0].severity === 'error' ? 10000 : 3000;
      const timerId = setTimeout(nextMessage, delay);
      return () => clearTimeout(timerId);
    }
  }, [queueMessages, currentMessage, nextMessage]);

  return (
      <StyledDivContainer direction="column" spacing={2}>
        {currentMessage && (
            <Alert variant="filled" severity={currentMessage.severity}>
              {currentMessage.body}
            </Alert>
        )}
      </StyledDivContainer>
  );
};


const StyledDivContainer = styled(Stack)(() => ({
  marginTop: 10,
  marginRight: 20,
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 900,
}));
