import React, { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyledVideoBlur, VideoContainer, WrapperVideoContainer } from 'components/StyledComponents';
import { useAppSelector } from 'hooks/redux';
import { VideoOverlay } from 'pages/VideoMeeting/components/VideoOverlay';
import { IFeedInfo } from 'types/janusTypes';
import { IVideoGridLayout } from 'types/share';

import { styled } from '@mui/system';
import { Avatar, useTheme } from '@mui/material';
import { isMobile } from 'react-device-detect';
import { stringAvatar } from '../../../helpers/stringAvatar';

interface IVideoComponent {
  videoFeed?: {
    id: string;
    track: MediaStreamTrack | null;
    stream: MediaStream;
  } | null;
  videoType: 'local' | 'remote';
  feedMidId?: IFeedInfo;
  layout?: IVideoGridLayout;
  sidebar?: boolean;
  className?: string;
}

const URL_AVATAR: string | undefined = import.meta.env.REACT_APP_SERVER_URL;

export const VideoComponent: FC<IVideoComponent> = (props) => {
  const { videoFeed, videoType, feedMidId, layout, sidebar, className } = props;

  const videoRef = useRef<HTMLVideoElement>(null);

  const [talking, setTalking] = useState<boolean>(false);
  const [bigScreen, setBigScreen] = useState<boolean>(false);

  const theme = useTheme();

  const { talkingFeeds, imJanusID, remoteWebRTCStatus, screenCaptureStatus } = useAppSelector(
    (state) => state.DifferentStatesSlice,
  );

  const {
    videoStatus,
    shareStatus,
    selectedDevices: { videoInput },
    audioStatus,
  } = useAppSelector((state) => state.VideoSettingsReducer);

  const { shareState, mediaStatusFeeds } = useAppSelector((state) => state.SignalRSlice);

  const { user } = useAppSelector((state) => state.SingInReducer);

  const urlAvatarImg = user?.avatarUrl !== null ? `${URL_AVATAR}/${user?.avatarUrl}` : '';

  const mediaStatusRemoveFeed = useMemo(() => {
    if (!feedMidId?.feed_id && videoType === 'local') return;
    return mediaStatusFeeds.filter((feed) => feed.feed_id === feedMidId?.feed_id);
  }, [mediaStatusFeeds, feedMidId]);

  //true если локальный поток скрыт
  const localFeedMuted = !videoFeed?.stream || !videoStatus || videoInput === null;
  //true если удаленный поток muted
  const removeFeedMuted =
    mediaStatusRemoveFeed !== undefined && !mediaStatusRemoveFeed[0]?.video_status && videoType === 'remote';

  // отображения что, я говорю подсвечивать мою плашку
  const localSpeakHandler = useCallback(() => {
    if (!imJanusID) return;
    if ((talkingFeeds as readonly number[]).includes(imJanusID)) {
      setTalking(true);
    }
    if (!(talkingFeeds as readonly number[]).includes(imJanusID) || !audioStatus) {
      setTalking(false);
    }
  }, [imJanusID, talkingFeeds, audioStatus]);

  // отображения говорящего удаленного пользователя подсвечивать мою плашку
  const remoteUserSpeakHandler = useCallback(() => {
    if (!feedMidId?.feed_id) return;
    if ((talkingFeeds as readonly number[]).includes(feedMidId['feed_id'])) {
      setTalking(true);
    }
    if (!(talkingFeeds as readonly number[]).includes(feedMidId['feed_id'])) {
      setTalking(false);
    }
  }, [feedMidId, talkingFeeds]);

  useEffect(() => {
    if (!talkingFeeds) return;
    if (videoType === 'local') {
      localSpeakHandler();
    }
    if (videoType === 'remote') {
      remoteUserSpeakHandler();
    }
  }, [localSpeakHandler, remoteUserSpeakHandler, talkingFeeds, videoType]);

  const injectStreamInVideoRef = (videoRef: RefObject<HTMLVideoElement>, stream: MediaStream) => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
    videoRef.current.playsInline;
    videoRef.current.autoplay;
  };

  useEffect(() => {
    //Если есть ref видео элемента и есть стрим для инъекции
    if (!videoRef.current || !videoFeed || !videoFeed.stream) return;
    //Выполняем если срц видео элемента пустое или стрим который там уже есть отличается от нового
    if (!videoRef.current.srcObject) return injectStreamInVideoRef(videoRef, videoFeed.stream);
    if ('id' in videoRef.current.srcObject && videoRef.current.srcObject?.id !== videoFeed.stream.id) {
      injectStreamInVideoRef(videoRef, videoFeed.stream);
    }
    //TODO: Добавить логику autoPlay
  }, [videoFeed]);

  const blurEffect = (videoEl: JSX.Element) => {
    if (isMobile)
      return (
        <StyledVideoBlur>
          <div className="leftBlur" />
          {videoEl}
          <div className="rightBlur" />
        </StyledVideoBlur>
      );
    return videoEl;
  };

  const videoElement = useMemo(() => {
    //render видео если есть стрим и оно remote или
    //есть стрим, он локальный и включен и есть камера
    if (
      (videoFeed?.stream && videoType === 'remote') ||
      (videoFeed?.stream && videoStatus && videoInput !== null) ||
      shareStatus
    ) {
      return blurEffect(
        <video
          width={
            mediaStatusRemoveFeed !== undefined && !mediaStatusRemoveFeed[0]?.video_status && videoType === 'remote'
              ? 0
              : '100%'
          }
          height={
            mediaStatusRemoveFeed !== undefined && !mediaStatusRemoveFeed[0]?.video_status && videoType === 'remote'
              ? 0
              : '100%' //TODO: нужно задавать unset если не шара (когда заработает сокет)
          }
          ref={videoRef}
          muted
          playsInline
          autoPlay
          style={
            videoType === 'local' && !shareStatus ? { transform: 'scaleX(-1)', borderRadius: 8 } : { borderRadius: 8 }
          }
        />,
      );
    }
  }, [videoType, videoFeed?.stream, videoInput, videoStatus, shareStatus, mediaStatusRemoveFeed]);

  useEffect(() => {
    //Если кто-то включил шару, делаем её на полный экран
    if (feedMidId === undefined) return;
    const sharingScreen = shareState[0]?.feed_id === JSON.stringify(feedMidId['feed_id']) && shareState[0]?.isShare;
    setBigScreen(sharingScreen);
  }, [shareStatus, feedMidId, shareState]);

  useEffect(() => {
    //Сброс bigScreen когда remote feed muted
    if (!mediaStatusRemoveFeed) return;
    if (videoType === 'remote' && mediaStatusRemoveFeed[0]?.video_status === false) {
      setBigScreen(false);
    }
  }, [mediaStatusRemoveFeed]);

  const position = !bigScreen && layout ? `translateX(${layout.x}px) translateY(${layout.y}px)` : '';

  const displayHide =
    (!layout && removeFeedMuted && videoType === 'remote') || (!layout && !videoStatus && videoType === 'local');

  const videoOnClickHandler = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    if ((!removeFeedMuted && videoType === 'remote') || (!localFeedMuted && videoType === 'local')) {
      setBigScreen(!bigScreen);
    }
  };

  return (
    <>
      <WrapperVideoContainer
        className={`${!bigScreen && 'animate'} ${className ?? ''}`}
        style={{
          width: layout ? `${layout.videoWidth}px` : 'min-content',
          height: layout ? `${layout.videoHeight}px` : 'min-content',
          transform: position,
          display: displayHide && videoType === 'local' ? 'none' : 'block',
          position: layout ? 'absolute' : 'unset',
        }}
      >
        <VideoContainer
          id={videoFeed?.id ?? '0'}
          className={`videoContainer ${bigScreen && 'bigScreen'} ${isMobile ? 'mobile' : 'desktop'}`}
          sidebar={sidebar ? 'true' : ''}
          onClick={videoOnClickHandler}
          onTouchEnd={videoOnClickHandler}
        >
          <VideoOverlay
            bigScreen={bigScreen}
            talkingIndicator={talking}
            videoType={videoType}
            feedMidId={feedMidId}
            videoFeed={videoFeed}
            name={mediaStatusRemoveFeed && mediaStatusRemoveFeed[0]?.display}
          />
          {!remoteWebRTCStatus && videoType === 'remote' && <StyleLoading>Loading ...</StyleLoading>}
          {!videoStatus && videoType === 'local' && !screenCaptureStatus && (
            <StyleAvatar
              {...stringAvatar(user?.firstname || 'ВЫ')}
              src={urlAvatarImg}
              sx={{ bgcolor: theme.palette.avatars.me }}
            />
          )}
          {removeFeedMuted && (
            <StyleAvatar
              {...stringAvatar(mediaStatusRemoveFeed[0]?.display)}
              src={mediaStatusRemoveFeed[0]?.avatarUrl ? `${URL_AVATAR}/${mediaStatusRemoveFeed[0].avatarUrl}` : ''}
              sx={{ bgcolor: theme.palette.avatars.remote }}
            />
          )}
          {videoElement}
        </VideoContainer>
      </WrapperVideoContainer>
    </>
  );
};

const StyleLoading = styled('h1')(() => ({
  position: 'fixed',
  color: 'white',
  fontFamily: 'Jost',
}));

const StyleAvatar = styled(Avatar)(() => ({
  bgcolor: '#598200',
  width: '42%',
  height: '70%',
  fontSize: '10vmin',
  fontFamily: 'Jost',
  position: 'fixed',
}));
