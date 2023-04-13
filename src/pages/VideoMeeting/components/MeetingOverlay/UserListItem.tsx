import { FC, useCallback, useMemo } from 'react';
import { IMediaStatusFedds, optionsEnum } from 'types/share';
import { ListItem, ListItemAvatar, ListItemText, Stack, Tooltip, useTheme } from '@mui/material';
import { ColorizerSVG, StyleAvatar, StyledChip } from 'components/StyledComponents';

import { UserAvatar } from '../../../../helpers/userAvatar';
import { useAppSelector } from 'hooks/redux';
import Typography from '@mui/material/Typography';
import { funSliced } from 'utils/sliced';
// import { LongMenu } from 'components/LongMenu/LongMenu';
import { styled } from '@mui/system';

import { ReactComponent as MicActiveIcon } from '../../../../images/mic-active.svg';
import { ReactComponent as MicInActive } from '../../../../images/no-microphone.svg';
import { ReactComponent as CamActiveIcon } from '../../../../images/video-cam-active.svg';
import { ReactComponent as VideoCamInActive } from '../../../../images/no-video-cam.svg';

interface IUserListItemProps {
  feed: IMediaStatusFedds;
}

export const UserListItem: FC<IUserListItemProps> = ({ feed }) => {
  const theme = useTheme();

  const { imJanusID } = useAppSelector((state) => state.DifferentStatesSlice);
  // const { mediaStatusFeeds } = useAppSelector((state) => state.SignalRSlice);
  const { audioStatus, videoStatus } = useAppSelector((state) => state.VideoSettingsReducer);

  // const myRole = mediaStatusFeeds.find((role) => role.feed_id === imJanusID)?.user_role;

  const isUserUrlAvatar = feed.avatarUrl ? <UserAvatar imgPath={feed.avatarUrl} /> : feed.display[0];
  const isUserEmail = feed.email.length ? funSliced(feed.email, 10) : 'Гость';

  const micLocalIndicate = useCallback(() => {
    return (
      <>
        <ColorizerSVG sx={{ height: '15px' }}>
          {audioStatus ? <MicActiveIcon width="13px" height="15px" /> : <MicInActive />}
        </ColorizerSVG>

        <ColorizerSVG sx={{ width: '14px', height: '17px' }}>
          {videoStatus ? <CamActiveIcon viewBox="0 1 11 8" /> : <VideoCamInActive />}
        </ColorizerSVG>
      </>
    );
  }, [audioStatus, videoStatus]);

  const micRemoveIndicate = useCallback(
    (feed: IMediaStatusFedds) => {
      return (
        <>
          <ColorizerSVG sx={{ height: '15px' }}>
            {feed?.audio_status ? <MicActiveIcon width="13px" height="15px" /> : <MicInActive />}
          </ColorizerSVG>

          <ColorizerSVG sx={{ width: '14px', height: '17px' }}>
            {feed?.video_status ? <CamActiveIcon viewBox="0 1 11 8" /> : <VideoCamInActive />}
          </ColorizerSVG>
        </>
      );
    },
    [feed],
  );

  const renderIsLabel = (role: string) => {
    if (role === optionsEnum.ORGANIZATOR) {
      return 'Организатор';
    }
    if (role === optionsEnum.COORGANIZATOR) {
      return 'Модератор';
    }
  };

  const founderChip = useMemo(() => {
    if (feed?.user_role === optionsEnum.ORGANIZATOR || feed?.user_role === optionsEnum.COORGANIZATOR) {
      return <StyledChip label={renderIsLabel(feed?.user_role)} variant="outlined" size="medium" />;
    }
  }, [feed?.user_role]);

  // const optionsLongMenu = [
  //   { title: 'Удалить', action: optionsEnum.DELETE },
  //   { title: 'Соорганизатор', action: optionsEnum.COORGANIZATOR },
  // ];

  const listItem = (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="column">
        <Typography
          fontSize="14px"
          lineHeight={1}
          textOverflow="ellipsis"
          maxWidth="125px"
          whiteSpace="nowrap"
          // overflow="hidden"
        >
          <Tooltip title={feed.display}>
            <StyleTitleTooltip>
              {funSliced(
                feed.display,
                feed.user_role === optionsEnum.ORGANIZATOR || feed.user_role === optionsEnum.COORGANIZATOR ? 14 : 20,
              )}
            </StyleTitleTooltip>
          </Tooltip>
        </Typography>
        <Typography fontSize="12px">{isUserEmail}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" spacing="10px">
        {founderChip}
        {feed.feed_id === imJanusID ? micLocalIndicate() : micRemoveIndicate(feed)}
        {/* {feed.feed_id && feed.feed_id !== imJanusID && myRole && (
          <LongMenu userId={feed.feed_id} options={optionsLongMenu} feedRole={feed.user_role} myRole={myRole} />
        )} */}
      </Stack>
    </Stack>
  );

  return (
    <ListItem key={feed.feed_id} sx={{ padding: '5px 4px' }}>
      <ListItemAvatar sx={{ minWidth: 0, marginRight: '10px' }}>
        <StyleAvatar
          backgroundColor={feed.feed_id === imJanusID ? theme.palette.avatars.me : theme.palette.avatars.remote}
        >
          {isUserUrlAvatar}
        </StyleAvatar>
      </ListItemAvatar>
      <ListItemText primary={listItem} />
    </ListItem>
  );
};

const StyleTitleTooltip = styled('span')(() => ({
  cursor: 'help',
}));
