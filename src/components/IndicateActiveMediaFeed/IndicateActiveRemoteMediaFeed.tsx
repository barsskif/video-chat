import  { useCallback, useMemo } from 'react';
import { useAppSelector } from 'hooks/redux';

import { isMobile } from 'react-device-detect';
import { funSliced } from 'utils/sliced';

import { IFeedInfo } from 'types/janusTypes';

import { Grid } from '@mui/material';

import { ReactComponent as MicActive } from '../../images/mic-active.svg';
import { ReactComponent as MicInActive } from '../../images/no-microphone.svg';
import { ReactComponent as VideoCamActive } from '../../images/video-cam-active.svg';
import { ReactComponent as VideoCamInActive } from '../../images/no-video-cam.svg';

import {
  StyleGridNameIndicate,
  StyleBoxWrapperMobile,
  StyleMobileIndicate,
  StylePositionAudioIndicator,
  StyleNameSignatureBlock,
  StyleNameFeed,
} from './StyleIndicate';

interface IIndicateActiveRemoteMediaFeed {
  feedMidId?: IFeedInfo;
  name?: string;
}

export const IndicateActiveRemoteMediaFeed = ({ feedMidId, name }: IIndicateActiveRemoteMediaFeed): JSX.Element => {
  const { mediaStatusFeeds } = useAppSelector((state) => state.SignalRSlice);

  const mediaStatusFeedRemove = useMemo(() => {
    return mediaStatusFeeds.find((media) => media.feed_id === feedMidId?.feed_id);
  }, [mediaStatusFeeds, feedMidId]);

  // ### Выбор отображения иконки в зависимости от состояния аудио устройства ### //
  const activeMic = useCallback(() => {
    if (mediaStatusFeedRemove?.audio_status) return <MicActive />;

    if (!mediaStatusFeedRemove?.audio_status) return <MicInActive />;
  }, [mediaStatusFeedRemove?.audio_status]);
  // ### end ### //

  // ### Выбор отображения иконки в зависимости от состояния Видео устройства ### //
  const activeCamera = useCallback(() => {
    if (mediaStatusFeedRemove?.video_status) return <VideoCamActive />;

    if (!mediaStatusFeedRemove?.video_status) return <VideoCamInActive />;
  }, [mediaStatusFeedRemove?.video_status]);
  // ### end ### //

  if (isMobile)
    return (
      <StyleBoxWrapperMobile>
        <StyleGridNameIndicate container direction="row" justifyContent="center" alignItems="center">
          {mediaStatusFeedRemove && funSliced(name, 10)}
          <StyleMobileIndicate>{activeMic()}</StyleMobileIndicate>
        </StyleGridNameIndicate>
      </StyleBoxWrapperMobile>
    );

  return (
    <>
      {/* TODO: Вопрос как будет лучше через канал передавать или нет */}
      <StylePositionAudioIndicator>
        <Grid container direction="row" justifyContent="space-around" alignItems="center" style={{ height: '100%' }}>
          {activeCamera()}
          {activeMic()}
        </Grid>
      </StylePositionAudioIndicator>
      <StyleNameSignatureBlock>
        <Grid container direction="row" justifyContent="space-around" alignItems="center" style={{ height: '100%' }}>
          <StyleNameFeed>{mediaStatusFeedRemove && mediaStatusFeedRemove.display}</StyleNameFeed>
        </Grid>
      </StyleNameSignatureBlock>
    </>
  );
};
