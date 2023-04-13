import { ChangeEvent, FC, useEffect, useState } from 'react';

// redux
import { useAppSelector } from 'hooks/redux';

// utils
import { connection } from 'utils/SignalRSocket';

// mui
import { Box, Divider, ListItemText, Stack } from '@mui/material';

import { HendUpListFeed } from './HendUpListFeed';

import {
  ColorizerSVG,
  StyledExpectationTitle,
  StyledNoMessageInfo,
  StyledScrollList,
  StyledScrollListExpectation,
  StyledTextField,
  BoxNumberPeopleStyled,
} from 'components/StyledComponents';

import { ReactComponent as SearchIcon } from '../../../../images/Search.svg';
import { UserListItem } from 'pages/VideoMeeting/components/MeetingOverlay/UserListItem';

interface IUserListDrawerProps {
  meetingHash: string;
}

export const UserListDrawer: FC<IUserListDrawerProps> = ({ meetingHash }) => {
  const { mediaStatusFeeds, imJanusID, statusConnectionSignalR } = useAppSelector((state) => ({
    mediaStatusFeeds: state.SignalRSlice.mediaStatusFeeds,
    imJanusID: state.DifferentStatesSlice.imJanusID,
    statusConnectionSignalR: state.DifferentStatesSlice.statusConnectionSignalR,
  }));

  const [searchUser, setSearchUser] = useState<string>('');
  const [raiseHandArr, setRaiseHandArr] = useState([]);

  const myFeed = mediaStatusFeeds.find((feed) => feed.feed_id === imJanusID);

  const userList = () => {
    if (!mediaStatusFeeds.length)
      return (
        <StyledNoMessageInfo>
          <ListItemText primary={'Ещё никого нет'} />
        </StyledNoMessageInfo>
      );

    const filteredFeed = mediaStatusFeeds.filter((item) => {
      return item.display.toLowerCase().includes(searchUser.toLowerCase());
    });

    return (
      <>
        {myFeed && <UserListItem key={myFeed.feed_id} feed={myFeed} />}
        {filteredFeed.map((feed) => feed.feed_id !== imJanusID && <UserListItem key={feed.feed_id} feed={feed} />)}
      </>
    );
  };

  // подписка на поднятых руку feed
  useEffect(() => {
    if (!statusConnectionSignalR) return;

    connection.on('WebinarRaiseHandAsync', (msg) => {
      const arr = msg[0]['feedIds'];
      setRaiseHandArr(arr);
    });
  }, [statusConnectionSignalR]);

  return (
    <Stack direction="column" height="inherit">
      <BoxNumberPeopleStyled>Количество участников: {mediaStatusFeeds.length}</BoxNumberPeopleStyled>
      <Box marginTop="16px" width="312px" padding="0 16px">
        <StyledTextField
          value={searchUser}
          variant="outlined"
          fullWidth
          size="small"
          height="30px"
          autoComplete="off"
          placeholder="Поиск участника"
          fontSize="8px"
          onChange={(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearchUser(event.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { paddingLeft: '10px' }, '& .MuiInputBase-input': {fontSize: '16px'} }}
          InputProps={{
            startAdornment: (
              <ColorizerSVG sx={{ height: '16px', width: '16px', margin: '0 11.7px 2px 0' }}>
                <SearchIcon />
              </ColorizerSVG>
            ),
          }}
        />
      </Box>
      {raiseHandArr.length > 0 && (
        <>
          <StyledExpectationTitle>Поднятые руки</StyledExpectationTitle>
          <StyledScrollListExpectation dense={raiseHandArr.length > 3} style={{ marginBottom: 10 }}>
            {raiseHandArr.map((user) => (
              <HendUpListFeed userID={user} key={user} />
            ))}
          </StyledScrollListExpectation>
          <Divider orientation="horizontal" sx={{ width: '100%' }} />
        </>
      )}

      <StyledScrollList>{userList()}</StyledScrollList>
    </Stack>
  );
};
