import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// hooks
import { useAppDispatch, useAppSelector } from 'hooks/redux';

//redux
import { meetingConnectWaiting, meetingFetch } from 'store/reducers/ActionCreate';
import { MeetingSlice } from 'store/reducers/MeetingSlice';

//utils
import { connection } from 'utils/SignalRSocket';

//mui
import { Box, Grid, useMediaQuery } from '@mui/material';

// styles
import { MeetingWaitingImgComponent, TimeStyle, TypographyStyle } from './MeetingWaitingStyles';

interface ILocaleProps {
  state: {
    role: string;
    meetingHash: string;
    connectionId: string;
  };
}

export const MeetingWaiting = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryMobileViewer = useMediaQuery('(min-width:1584px)');
  const {
    state: { meetingHash, connectionId },
  } = useLocation() as ILocaleProps;

  const [enterAdmin, setEnterAdmin] = useState(false);

  const { error } = useAppSelector((state) => state.MeetingReducer);

  const { meetingError } = MeetingSlice.actions;

  const dataStart = error?.data.dateStartPlanning.split(' ')[0].split('/');
  const startTime = error?.data.timeStartPlanning;

  useEffect(() => {
    dispatch(meetingConnectWaiting(meetingHash, connectionId));
  }, []);

  useEffect(() => {
    const enterMeeting = async () => {
      setEnterAdmin(true);
      await dispatch(meetingFetch(meetingHash));
      console.log('🚀 =====> meetingHash', meetingHash);
      navigate(`/room/${meetingHash}`);
    };

    connection.on('SendStartPlanning', () => {
      console.log('enter');
      enterMeeting();
    });

    return () => {
      if (!enterAdmin) {
        dispatch(meetingError(null));
        sessionStorage.removeItem('accessEnter');
        // sessionStorage.clear();
      }
    };
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        marginTop: '50px',
      }}
    >
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ height: '100%' }}>
        <MeetingWaitingImgComponent width={!queryMobileViewer ? '390px' : '514px'} height="468px" />
        <TypographyStyle>Встреча еще не началась</TypographyStyle>
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <TypographyStyle>Подключайтесь</TypographyStyle>
          <TimeStyle>
            {dataStart && `${dataStart[1]}.${dataStart[0]}`}, {startTime}
          </TimeStyle>
        </Grid>
      </Grid>
    </Box>
  );
};
