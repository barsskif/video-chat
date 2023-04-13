import { useCallback } from 'react';
import { useAppSelector } from 'hooks/redux';
import { isMobile } from 'react-device-detect';
import { funSliced } from 'utils/sliced';
import { Grid } from '@mui/material';

import {
  StyleBoxWrapperMobile,
  StyleNameFeed,
  StyleNameSignatureBlock,
  StylePositionAudioIndicator,
} from './StyleIndicate';

import { ReactComponent as MicActive } from '../../images/mic-active.svg';
import { ReactComponent as MicInActive } from '../../images/mic-inactive.svg';
import { ReactComponent as NoMicrophone } from '../../images/no-microphone.svg';
import { ReactComponent as VideoCamInActive } from '../../images/video-cam-inactive.svg';
import { ReactComponent as VideoCamActive } from '../../images/video-cam-active.svg';
import { ReactComponent as NoCamera } from '../../images/no-video-cam.svg';

import { RootState } from 'store/store';

export const IndicateActiveLocalMediaFeed = () => {
  const { audioStatus, videoStatus, audioInput, videoInput, user } = useAppSelector((state: RootState) => ({
    audioStatus: state.VideoSettingsReducer.audioStatus,
    videoStatus: state.VideoSettingsReducer.videoStatus,
    audioInput: state.VideoSettingsReducer.selectedDevices.audioInput,
    videoInput: state.VideoSettingsReducer.selectedDevices.videoInput,
    user: state.SingInReducer.user,
  }));

  const activeMic = useCallback(() => {
    if (audioInput === null) return <MicInActive />;

    if (audioStatus) return <MicActive />;

    if (!audioStatus) return <NoMicrophone />;
  }, [audioInput, audioStatus]);

  const activeCamera = useCallback(() => {
    if (videoInput === null) return <VideoCamInActive />;

    if (videoStatus) return <VideoCamActive />;

    if (!videoStatus) return <NoCamera />;
  }, [videoStatus, videoInput]);

  if (isMobile) {
    return (
      <StyleBoxWrapperMobile>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100%', color: 'aliceblue', fontFamily: 'Jost', textTransform: 'lowercase' }}
        >
          Вы
        </Grid>
      </StyleBoxWrapperMobile>
    );
  }

  return (
    <>
      <StylePositionAudioIndicator>
        <Grid container direction="row" justifyContent="space-around" alignItems="center" sx={{ height: '100%' }}>
          {activeCamera()}
          {activeMic()}
        </Grid>
      </StylePositionAudioIndicator>
      <StyleNameSignatureBlock>
        <Grid container direction="row" justifyContent="space-around" alignItems="center" sx={{ height: '100%' }}>
          Вы
        </Grid>
      </StyleNameSignatureBlock>
    </>
  );
};
