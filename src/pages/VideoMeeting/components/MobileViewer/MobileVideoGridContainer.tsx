import React, { FC, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from 'hooks/redux';

import { useLottie } from 'lottie-react';
import loading from '../../../../lotties/LoaderMaiin.json';

import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { IAudioState, IFeedInfo, IStreamLocal, IStreamRemote } from 'types/janusTypes';
import { VideoComponent } from 'pages/VideoMeeting/components/VideoComponent';
import { AudioComponent } from 'pages/VideoMeeting/components/AudioComponent';
import { MobileVideoGridWrapper } from 'components/MobileStyledComponents';

import { styled } from '@mui/system';

// @ts-ignore
import { ReactComponent as MicActiveIcon } from '../../../../images/mic-active.svg';
// @ts-ignore
import { ReactComponent as MicInActiveIcon } from '../../../../images/no-microphone.svg';
// @ts-ignore
import { ReactComponent as AddNewFeedIcon } from '../../../../images/add_new_feed.svg';

import { IUser, optionsEnum, ILocationState } from 'types/share';

interface IMobileVideoGridContainerProps {
  audioState: IAudioState[];
  streamsRemote: IStreamRemote[];
  localStream: IStreamLocal | null;
  feedAllInfo: IFeedInfo[];
  webRTCStatus: boolean;
  videoStatus: boolean;
  audioStatus: boolean;
  meetingHash: string;
}

export const MobileVideoGridContainer: FC<IMobileVideoGridContainerProps> = (props) => {
  const { audioState, streamsRemote, localStream, feedAllInfo, webRTCStatus, videoStatus, audioStatus, meetingHash } =
    props;

  const location = useLocation() as ILocationState;

  const { mediaStatusFeeds } = useAppSelector((state) => state.SignalRSlice);
  const { talkingFeeds, imJanusID, statusConnectWebRtcInfo } = useAppSelector((state) => state.DifferentStatesSlice);
  const { user } = useAppSelector((state) => state.SingInReducer) as { user: IUser };
  const {
    selectedDevices: { videoInput },
  } = useAppSelector((state) => state.VideoSettingsReducer);

  const optionsLoading = {
    animationData: loading,
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(optionsLoading, {
    position: 'absolute',
    backgroundColor: '#17202E',
    zIndex: '9998',
    height: '100%',
    width: '100%',
  });

  const preloader = useMemo(() => {
    if (!webRTCStatus) {
      return (
        <>
          <StyleTitle>{statusConnectWebRtcInfo}</StyleTitle>
          {View}
        </>
      );
    }
  }, [webRTCStatus, statusConnectWebRtcInfo]);

  const localSpeakHandler = useCallback(() => {
    if (!imJanusID) return;
    if ((talkingFeeds as readonly number[]).includes(imJanusID)) {
      return true;
    }
    if (!(talkingFeeds as readonly number[]).includes(imJanusID)) {
      return false;
    }
  }, [imJanusID, talkingFeeds]);

  const removeSpeakHandler = useCallback(
    (feedId: number | undefined) => {
      if (!feedId) return;
      if ((talkingFeeds as readonly number[]).includes(feedId)) {
        return true;
      }
      if (!(talkingFeeds as readonly number[]).includes(feedId)) {
        return false;
      }
    },
    [talkingFeeds],
  );

  const handlePressInvite = async () => {
    const hash = meetingHash || location.state.meetingHash || '';
    await navigator.clipboard.writeText(`${window.location.origin}/guest/${hash}`);

    const shareData = {
      title: 'Letsmeet',
      text: 'Ссылка для встречи',
      url: `${window.location.origin}/guest/${hash}`,
    };

    try {
      await navigator.share(shareData);
      console.log('e');
    } catch (err) {
      console.log('e', err);
    }
  };

  const videoGrid = () => {
    return (
      <>
        <MobileVideoGridWrapper>
          {videoStatus && videoInput !== null && <VideoComponent videoType="local" videoFeed={localStream} />}
          {streamsRemote.map((item: IStreamRemote) => {
            const feedMidId = feedAllInfo.find((i: IFeedInfo) => i.mid === item.id);
            const status = mediaStatusFeeds.find((feed) => feed.feed_id === feedMidId?.feed_id);

            if (status?.video_status) {
              return (
                <React.Fragment key={item.id}>
                  {feedMidId && <VideoComponent videoType="remote" videoFeed={item} feedMidId={feedMidId} />}
                </React.Fragment>
              );
            }
          })}
        </MobileVideoGridWrapper>
        {audioState.map((item: IAudioState) => {
          return <AudioComponent key={item.id} audioFeed={item} />;
        })}
      </>
    );
  };

  const role = useCallback(
    (role: string | null | undefined) => {
      if (role === undefined) return;

      if (role === null) {
        const myRole = mediaStatusFeeds.find((feed) => feed.feed_id === imJanusID)?.user_role;
        return myRole !== optionsEnum.ORGANIZATOR ? 'Участник' : 'Организатор';
      }

      return role === optionsEnum.ORGANIZATOR ? 'Организатор' : 'Участник';
    },
    [mediaStatusFeeds],
  );

  const userList = () => {
    return (
      <>
        <List sx={{ width: '100%', maxWidth: '100%' }}>
          {!videoStatus && (
            <React.Fragment>
              <ListItem
                sx={{ height: '40px' }}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete">
                    {audioStatus ? <MicActiveIcon /> : <MicInActiveIcon />}
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ width: '35px', height: '35px' }}>В</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`Вы(${user.userName})`}
                  secondary={
                    <>
                      <span>{role(null)}</span>
                      {localSpeakHandler() && <StyleIndicateTeg>Говорит</StyleIndicateTeg>}
                    </>
                  }
                  primaryTypographyProps={{
                    fontSize: 14,
                  }}
                />
              </ListItem>
              <Divider variant="inset" component="li" sx={{ marginBottom: '10px', marginLeft: '65px' }} />
            </React.Fragment>
          )}

          {streamsRemote.map((item: IStreamRemote) => {
            const feedMidId = feedAllInfo.find((i: IFeedInfo) => i.mid === item.id);
            const infoFeed = mediaStatusFeeds.find((feed) => feed.feed_id === feedMidId?.feed_id);
            if (!infoFeed?.video_status) {
              return (
                <React.Fragment key={item.id}>
                  <ListItem
                    sx={{ height: '40px' }}
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        {infoFeed?.audio_status ? <MicActiveIcon /> : <MicInActiveIcon />}
                      </IconButton>
                    }
                  >
                    <ListItemAvatar sx={{ minWidth: ' 50px' }}>
                      <Avatar sx={{ width: '35px', height: '35px' }}>{infoFeed?.display[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={infoFeed?.display}
                      secondary={
                        <>
                          <span>{infoFeed?.user_role.length && role(infoFeed.user_role)}</span>
                          {removeSpeakHandler(infoFeed?.feed_id) && <StyleIndicateTeg>Говорит</StyleIndicateTeg>}
                        </>
                      }
                      primaryTypographyProps={{
                        fontSize: 14,
                      }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" sx={{ marginBottom: '10px', marginLeft: '65px' }} />
                </React.Fragment>
              );
            }
          })}
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            sx={{ padding: '0px 0px 0px 21px' }}
            onClick={handlePressInvite}
          >
            <AddNewFeedIcon style={{ marginRight: '20px' }} />
            <Typography sx={{ fontSize: '16px' }}>Пригласить участников</Typography>
          </Grid>
        </List>
      </>
    );
  };

  return (
    <>
      {preloader}
      <Stack direction="column" height="100%" sx={{ overflowY: 'auto' }}>
        {videoGrid()}
        <StyleBoxWrapper>{userList()}</StyleBoxWrapper>
      </Stack>
    </>
  );
};

const StyleBoxWrapper = styled(Box)(() => ({
  backgroundColor: 'rgba(55, 65, 81, 0.5)',
  margin: '0px 13px 0px 13px',
  borderRadius: 8,
}));

const StyleIndicateTeg = styled('span')(() => ({
  color: '#1C65B0',
  marginLeft: '20px',
}));

const StyleTitle = styled('span')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  height: '200px',
  padding: '20px',
  color: 'white',
  zIndex: 9999,
  fontSize: '16px',
}));
