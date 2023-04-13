import React, { FC, memo } from 'react';
import { StyleChatAvatar, StyleChatMessage, StyleChatMessageContainer } from 'components/StyledComponents';
import { Link as MuiLink, Stack, Typography } from '@mui/material';
import { IChatMessage } from 'types/share';
import { styled } from '@mui/material/styles';

interface IChatMessageProps {
  message: IChatMessage;
}

export const ChatMessage: FC<IChatMessageProps> = memo(({ message: { id, remote, body, name } }) => {
  const position = remote ? 'left' : 'right';
  const timeArr = new Date(Number(id)).toLocaleTimeString().split(':');
  const time = `${timeArr[0]}:${timeArr[1]}`;

  const urlRegEx = /\s?((?:https?:\/\/)?(?:[.\w-]{1,32}\.(?:\w{1,3}))[^\s@]*)\s?/gm; //Ищет url

  const messageParser = (message: string) => {
    if (!urlRegEx.test(message)) return message;
    const msgArr = message.split(urlRegEx);
    let result: (string | JSX.Element)[] = [];
    msgArr.forEach((el) => {
      if (!urlRegEx.test(el)) return (result = [...result, ` ${el} `]);
      result = [
        ...result,
        <MuiLink target="_blank" key={el} href={el}>
          {el}
        </MuiLink>,
      ];
    });
    return result;
  };

  return (
    <StyleChatMessageContainer styleposition={position}>
      <Stack direction="column" sx={{ margin: '0' }}>
        <StyleChatMessage variantstyle={!remote ? 'primary' : 'secondary'}>
          {remote && <StyleMessageSenderName>{name}</StyleMessageSenderName>}
          <StyleMessageBody>{messageParser(body)}</StyleMessageBody>
          <Typography position="absolute" bottom="1px" right="5px" fontSize="10px" sx={{ opacity: 0.7 }}>
            {time}
          </Typography>
        </StyleChatMessage>
      </Stack>
      {position === 'left' && <StyleChatAvatar styleposition={position}>{name && name[0]}</StyleChatAvatar>}
    </StyleChatMessageContainer>
  );
});

const StyleMessageBody = styled(Typography)(() => ({
  '&:after': {
    content: "''",
    display: 'block',
    height: '6px',
    width: '30px',
    float: 'right',
  },
}));

const StyleMessageSenderName = styled(Typography)(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 400,
  marginBottom: '3px',
  color: theme.palette.primary.light,
}));

ChatMessage.displayName = 'ChatMessage';
