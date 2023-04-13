import { useAppSelector } from 'hooks/redux';

import { Stack } from '@mui/system';
import { ListItem, ListItemText, Typography } from '@mui/material';

import { UserAvatar } from '../../../../helpers/userAvatar';
interface IHendUpListFeedProps {
  userID: number;
}

const UserInfo = ({ name, email }: { name?: string; email?: string }) => (
  <Stack direction="column" marginLeft="10px">
    <Typography fontSize="14px" lineHeight={1} variant="body2">
      {name}
    </Typography>
    <Typography variant="body2" fontSize="12px">
      {name ? email : 'Гость'}
    </Typography>
  </Stack>
);

export const HendUpListFeed = ({ userID }: IHendUpListFeedProps) => {
  const { mediaStatusFeeds } = useAppSelector((state) => state.SignalRSlice);
  const userInfo = mediaStatusFeeds.find((item) => item.feed_id === userID);

  return (
    <ListItem key={userID} sx={{ padding: '0 0 16px' }}>
      <UserAvatar imgPath={userInfo?.avatarUrl} name={userInfo?.display} />
      <ListItemText primary={<UserInfo name={userInfo?.display} email={userInfo?.email} />} />
    </ListItem>
  );
};
