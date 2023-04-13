import { forwardRef, LegacyRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { isMobile } from 'react-device-detect';

import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { fetchPlanningMeetings, meetingCreate, putExternalAvatar } from 'store/reducers/ActionCreate';

import { Box, Grid, Stack, Tooltip, Typography } from '@mui/material';

import appLayout from '../../hocs/appLayout';

import {
  StyledBoxRoom,
  StyledBtn,
  StyledBtnTitle,
  StyledCreateJoinBlock,
  StyledCreateRoomTile,
  StyledDowloadAppTitle,
  StyledLimitTitle,
  StyledLinkDownloadApp,
  StyledTitleMobile,
} from './StylesRooms';

import { ReactComponent as UserStartSvg } from '../../images/userStartSvg.svg';
import { ReactComponent as SliderIcon } from '../../images/headerSliderIcon.svg';
import { ReactComponent as UserTickSvg } from '../../images/user-tick.svg';

import { IUser } from 'types/share';
import { Table } from 'pages/MeetingsPlanned/components/Table';
import moment from 'moment';
import { StyledButtonPurple, StyledTypography } from 'components/StyledComponents';
import { createWebinarRoom } from 'store/actions/WebinarCreateRoom';
import { GridStyledRooms } from 'components/StyledComponents';

export const Rooms = appLayout(() => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { meetingHash, error, plannedList, user } = useAppSelector((state) => ({
    meetingHash: state.MeetingReducer.meetingHash,
    error: state.MeetingReducer.error,
    plannedList: state.PlannedMeetingReducer.plannedList,
    user: state.SingInReducer.user as IUser,
  }));

  useEffect(() => {
    dispatch(
      fetchPlanningMeetings({
        countDay: 6,
        startDate: moment.utc().toISOString(),
      }),
    );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    document.cookie = `user=${token}; max-age=3600; secure; samesite=strict`;
    document.cookie = `userName=${user.firstname}; path=/; max-age=315360000`;
  }, []);

  useEffect(() => {
    if (typeof meetingHash === 'string' && !error) {
      navigate(`/room/${meetingHash}`);
    }
  }, [meetingHash, error]);

  const startSession = async () => {
    const meetingName = `${user.userName}-conference`;
    await dispatch(meetingCreate({ meetingName, publishers: 150 }));
  };

  const relocateToCreateRoomPage = () => {
    navigate('/createPlannedMeeting');
  };

  const createWebinar = async () => {
    const data = {
      meetingName: 'webinar',
      publishers: 2,
      description: 'Вебинар',
    };

    const webinarRoomInfo = await dispatch(createWebinarRoom({ ...data }));

    if (webinarRoomInfo) {
      navigate(`/webinar-room/${webinarRoomInfo['data']}`, { state: { isWebinar: true } });
    }
  };

  const downloadApp = () => {
    alert('Приносим свои извинения! Приложение появится в магазинах apple и android в ближайшее время');
  };

  const Join = forwardRef(function Join(props, ref: LegacyRef<HTMLDivElement> | undefined) {
    return (
      <StyledBtn mb="0px" br="8px 8px 28px 8px" {...props} ref={ref} onClick={createWebinar}>
        <UserTickSvg />
        <StyledBtnTitle>Вебинар</StyledBtnTitle>
      </StyledBtn>
    );
  });

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        wrap="nowrap"
        padding="20vh 0px 0px 0px"
        gap="10%"
      >
        <StyledBoxRoom>
          <Stack alignItems="flex-start" direction="column" spacing="30%" sx={{ maxWidth: '512px' }}>
            <Grid container direction="row" justifyContent="center" alignItems="flex-end">
              {isMobile && (
                <>
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    style={{ marginBottom: '65px' }}
                  >
                    <StyledTitleMobile>Добро пожаловать </StyledTitleMobile>
                    <StyledTitleMobile>в Let’s meet!</StyledTitleMobile>
                  </Grid>
                </>
              )}
              <StyledCreateJoinBlock
                container
                direction="column"
                justifyContent="flex-end"
                alignItems="center"
                onClick={startSession}
              >
                <UserStartSvg style={{ marginBottom: '29px' }} />
                <StyledCreateRoomTile>Создать встречу</StyledCreateRoomTile>
                <StyledLimitTitle>до 100 участников</StyledLimitTitle>
              </StyledCreateJoinBlock>
              <GridStyledRooms container direction="column">
                <StyledBtn mb="9px" br="8px 28px 8px 8px" onClick={relocateToCreateRoomPage}>
                  <SliderIcon />
                  <StyledBtnTitle>Запланировать</StyledBtnTitle>
                </StyledBtn>

                {!isMobile ? (
                  <Tooltip title={<Typography fontSize={16}>Создать Вебинар!</Typography>}>
                    <Join />
                  </Tooltip>
                ) : (
                  <Grid container direction="column" justifyContent="center" alignItems="center">
                    <StyledDowloadAppTitle>
                      Скачайте приложение, чтобы повысить эффективность совместной работы.
                    </StyledDowloadAppTitle>
                    <StyledLinkDownloadApp onClick={downloadApp}>Скачать</StyledLinkDownloadApp>
                  </Grid>
                )}
              </GridStyledRooms>
            </Grid>
          </Stack>
        </StyledBoxRoom>
        {/*TODO Преобразовать для мобилок встречи ближайшие */}
        {!isMobile ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              width: '100%',
            }}
          >
            <StyledTypography fontSize={{ xs: '20px', sm: '24px', md: '32px' }}>Ближайшие встречи</StyledTypography>
            {plannedList &&
              plannedList.map((meetingsGroup) => (
                <Grid
                  width={{ xs: '100%', sm: '100%', md: '100%', lg: '60%' }}
                  item
                  key={meetingsGroup.planningRoomDtos[0].hashRoom}
                >
                  <Table meetings={meetingsGroup.planningRoomDtos} count={3} />
                </Grid>
              ))}
            <StyledButtonPurple sx={{ maxWidth: '350px', padding: '10px 90px' }} onClick={() => navigate('/planned')}>
              Все встречи
            </StyledButtonPurple>
          </Box>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
});
