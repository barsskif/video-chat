import { Avatar, ListItemAvatar } from '@mui/material';

const URL_AVATAR = import.meta.env.REACT_APP_SERVER_URL;
const AVATAR_SIZE = '32px';

export const UserAvatar = ({ imgPath, name }: { imgPath?: string; name?: string }) => {
  return (
    <ListItemAvatar sx={{ minWidth: 0 }}>
      <Avatar src={`${URL_AVATAR}/${imgPath}`} sx={{ borderRadius: '8px', width: AVATAR_SIZE, height: AVATAR_SIZE }}>
        {name?.charAt(0)}
      </Avatar>
    </ListItemAvatar>
  );
};
