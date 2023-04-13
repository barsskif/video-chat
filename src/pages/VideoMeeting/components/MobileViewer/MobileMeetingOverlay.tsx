import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'hooks/redux';

import { VideoSettingsSlice } from 'store/reducers/VideoSettingsSlice';

import {
  MobileMeetingOverlayButton,
  MobileMeetingOverlayWrapper,
  MobileSidebarSettings,
  TouchZone,
} from 'components/MobileStyledComponents';
import { ColorizerSVG } from 'components/StyledComponents';
import { MobileNetworkWifiIcon } from 'components/MobileStyledComponents';

import { Close } from '@mui/icons-material';
import { ArrowBackRounded } from '@mui/icons-material';
import SignalCellularAlt2BarIcon from '@mui/icons-material/SignalCellularAlt2Bar';

import { ReactComponent as MicActiveIcon } from '../../../../images/mic-active.svg';
import { ReactComponent as MicInactiveIcon } from '../../../../images/mic-inactive.svg';
import { ReactComponent as CamActiveIcon } from '../../../../images/CamActive.svg';
import { ReactComponent as CamInactiveIcon } from '../../../../images/no-video-cam.svg';

import { TypeSfu } from 'types/janusTypes';
import { IUser } from 'types/share';
import { IconButton, useTheme } from '@mui/material';
import { VideoSettings } from '../VideoSettings';
import { MeetingSlice } from 'store/reducers/MeetingSlice';

interface IMobileMeetingOverlayProps {
  user?: IUser | null;
  sfuRef: TypeSfu;
  meetingHash: string;
  mobileDeviceSettings: boolean;
  webRTCPacketLoss: number | null;
  setMobileDeviceSettings: Dispatch<SetStateAction<boolean>>;
}

export const MobileMeetingOverlay: FC<IMobileMeetingOverlayProps> = (props) => {
  const { sfuRef, mobileDeviceSettings, setMobileDeviceSettings, webRTCPacketLoss } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const appLocation = useLocation() as { state: { role?: string } };
  const { audioStatus, videoStatus } = useAppSelector((state) => state.VideoSettingsReducer);

  const [touchTimeStamp, setTouchTimeStamp] = useState<number>();

  const { switchAudio, switchVideo } = VideoSettingsSlice.actions;
  const { reset: meetingReset } = MeetingSlice.actions;

  const switchAudioHandler = (event: React.TouchEvent<HTMLButtonElement>) => {
    if (event.type === 'touchstart') {
      if (audioStatus) return dispatch(switchAudio(false));
      setTouchTimeStamp(event.timeStamp);
      return dispatch(switchAudio(true));
    }
    if (event.type === 'touchend' && touchTimeStamp && event.timeStamp - touchTimeStamp > 500) {
      dispatch(switchAudio(false));
    }
  };

  const switchVideoHandler = () => {
    dispatch(switchVideo(!videoStatus));
  };

  const endCallHandler = async () => {
    if (!sfuRef.current) return;
    await sfuRef.current.detach();
    dispatch(meetingReset());
    appLocation.state?.role === 'guest' ? navigate(-1) : navigate('/rooms');
  };

  return (
    <>
      <MobileSidebarSettings className={!mobileDeviceSettings ? 'hide' : ''}>
        <IconButton
          onClick={() => setMobileDeviceSettings(false)}
          style={{ position: 'absolute', left: '12px', top: '20px' }}
        >
          <ArrowBackRounded />
        </IconButton>
        <VideoSettings />
      </MobileSidebarSettings>

      <MobileMeetingOverlayWrapper direction="row" justifyContent="space-around" alignItems="center">
        <MobileMeetingOverlayButton onTouchStart={switchVideoHandler}>
          <ColorizerSVG>
            {videoStatus ? (
              <CamActiveIcon width="20px" height="15px" />
            ) : (
              <CamInactiveIcon width="30px" height="20px" />
            )}
          </ColorizerSVG>
        </MobileMeetingOverlayButton>
        <MobileMeetingOverlayButton sizewh="100px" className={audioStatus ? 'audioBtnActive' : 'audioBtnInactive'}>
          <MobileNetworkWifiIcon display={webRTCPacketLoss === null ? 'none' : 'block'}>
            <SignalCellularAlt2BarIcon />
          </MobileNetworkWifiIcon>
          <TouchZone
            width="130px"
            height="130px"
            border_radius="50px"
            onTouchStart={switchAudioHandler}
            onTouchEnd={switchAudioHandler}
          />
          <ColorizerSVG>
            {audioStatus ? (
              <MicActiveIcon width="30px" height="30px" />
            ) : (
              <MicInactiveIcon width="30px" height="30px" />
            )}
          </ColorizerSVG>
        </MobileMeetingOverlayButton>
        <MobileMeetingOverlayButton
          variant="contained"
          bgcolor={theme.palette.action.closeTransparent}
          onTouchStart={endCallHandler}
        >
          <Close />
        </MobileMeetingOverlayButton>
      </MobileMeetingOverlayWrapper>
    </>
  );
};
