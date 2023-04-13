import { ChangeEvent, FormEvent, useEffect, useRef, useState, KeyboardEvent, FC, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { ChatSlice } from 'store/reducers/ChatSlice';

import { Box, IconButton, ListItemText, Stack, useTheme } from '@mui/material';

import {
  ChatWrapper,
  ColorizerSVG,
  StyledChatSendButton,
  StyledChatTextArea,
  StyledCircularProgress,
  StyledNoMessageInfo,
} from 'components/StyledComponents';
import { ChatMessage } from 'components/TextChat/ChatMessage';

import { IChatMessage, IUser } from 'types/share';

import { ReactComponent as ClipIcon } from '../../images/Clip.svg';
import { ReactComponent as SendIcon } from '../../images/Send.svg';

interface ITextChatProps {
  chatVisible: boolean;
  sendChatMessage: (message: string) => void;
}

export const TextChat: FC<ITextChatProps> = ({ chatVisible, sendChatMessage }) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { addMessage, resetCountUnread } = ChatSlice.actions;
  const { allMessages, countUnread } = useAppSelector((state) => state.ChatReducer);
  const { webRTCStatus } = useAppSelector((state) => state.DifferentStatesSlice);
  const { user } = useAppSelector((state) => state.SingInReducer) as { user: IUser };

  const [myMessage, setMyMessage] = useState<string>('');

  const chatWrapperRef = useRef<HTMLUListElement>(null);
  const textFieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatVisible && countUnread) dispatch(resetCountUnread());
  }, [countUnread, chatVisible]);

  useEffect(() => {
    if (chatWrapperRef.current) {
      chatWrapperRef.current.scrollTop = chatWrapperRef.current.scrollHeight + 100;
    }
  }, [allMessages]);

  const sendMyMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!myMessage.trim()) return;

    sendChatMessage(myMessage.trim());
    const { firstname, email } = user;

    dispatch(addMessage({ id: String(Date.now()), name: firstname || email, body: myMessage.trim(), remote: false }));
    setMyMessage('');
  };

  const onKeyDownHandler = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMyMessage(event);
    }
  };

  const messages = useMemo(() => {
    if (allMessages.length)
      return allMessages.map((message: IChatMessage) => <ChatMessage key={message.id} message={message} />);
    return (
      <StyledNoMessageInfo>
        <ListItemText primary={'Сообщений нет'} />
      </StyledNoMessageInfo>
    );
  }, [allMessages]);

  const componentRender = () => {
    if (!webRTCStatus)
      return (
        <>
          <Box position="relative" width="100%" height="100%" margin="12px 0" overflow="hidden">
            <StyledCircularProgress color="primary" />
          </Box>
        </>
      );

    return (
      <>
        <Box position="relative" width="100%" height="100%" margin="7px 0" overflow="hidden">
          <Stack direction="column" height="100%">
            <ChatWrapper ref={chatWrapperRef}>{messages}</ChatWrapper>
            <Box
              component="form"
              onSubmit={sendMyMessage}
              paddingRight="8px"
              borderTop={`1px solid ${theme.palette.borders.main}`}
            >
              <Stack direction="row" marginLeft="2px" padding="2px 0px">
                <Stack direction="column" justifyContent="flex-end" width="100%">
                  <StyledChatTextArea
                    value={myMessage}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMyMessage(e.target.value)}
                    onKeyDown={onKeyDownHandler}
                    disabled={!webRTCStatus}
                    placeholder="Сообщение"
                    fullWidth
                    size="small"
                    multiline
                    autoFocus={chatVisible}
                    inputRef={textFieldRef}
                    sx={{ paddingRight: '80px', marginTop: '3px' }}
                  />
                </Stack>
                <Box position="absolute" right="8px">
                  <Stack
                    sx={{ marginTop: '3px' }}
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing="10px"
                  >
                    <IconButton>
                      <ColorizerSVG sx={{ width: '21px', height: '21px' }}>
                        <ClipIcon width="20px" height="20px" viewBox="0.5 0.5 13 13" />
                      </ColorizerSVG>
                    </IconButton>
                    <StyledChatSendButton
                      type="submit"
                      disabled={!webRTCStatus}
                      color="primary"
                      variant="contained"
                      onFocus={() => textFieldRef.current?.focus()}
                    >
                      <ColorizerSVG color="active">
                        <SendIcon width="20px" height="20px" />
                      </ColorizerSVG>
                    </StyledChatSendButton>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </>
    );
  };

  return componentRender();
};
