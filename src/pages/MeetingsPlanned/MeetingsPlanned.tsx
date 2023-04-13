import { useEffect, useState, useCallback } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';

// hooks
import { useAppDispatch, useAppSelector } from 'hooks/redux';

// reducers
import { fetchPlanningMeetings } from 'store/reducers/ActionCreate';

// mui
import { Box, Fab, Grid, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';

// components
import appLayout from '../../hocs/appLayout';
import { Table } from 'pages/MeetingsPlanned/components/Table';
import {
  CustomImg,
  NoPlannedMeetingContainer,
  StyledCircularProgress,
  StyledTypography,
} from 'components/StyledComponents';
import { SortTitleStyles } from '../MeetingRecords/MeetingRecordsStyles';

// images
import noPlannedImg from '../../images/noPlannedMeetingImage.jpg';
import { ReactComponent as IconSortSvg } from '../../images/SortIcon.svg';
import AddIcon from '@mui/icons-material/Add';

export const MeetingsPlanned = appLayout(() => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryMobileViewer = useMediaQuery('(min-width:1584px)');

  const { plannedList, isLoading } = useAppSelector((state) => state.PlannedMeetingReducer);
  const [isIncrease, setIncrease] = useState<boolean>(false);
  const addNewPlannedRoom = useCallback(() => {
    navigate('/createPlannedMeeting');
  }, []);

  useEffect(() => {
    dispatch(
      fetchPlanningMeetings({
        countDay: 6,
        startDate: moment.utc().toISOString(),
      }),
    );
  }, []);

  return (
    <>
      <Box
        maxWidth="1430px"
        height="min-content"
        margin="auto"
        padding={{ xs: '20vh  15px 0px 15px', sm: '15vh 75px 0px 75px' }}
        position="relative"
      >
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <StyledTypography sx={{ marginBottom: '10px' }} fontSize={{ xs: '20px', sm: '24px', md: '32px' }}>
            Запланированные встречи
          </StyledTypography>
          <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ width: 'auto' }}>
            <IconButton onClick={() => setIncrease((prev) => !prev)}>
              <IconSortSvg style={{ transform: isIncrease ? 'rotateX(180deg)' : 'rotateX(0deg)' }} />
            </IconButton>
            <SortTitleStyles>{isIncrease ? 'По дате по убывания' : 'По дате по возрастания'}</SortTitleStyles>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          flexWrap="wrap"
          alignContent="center"
          justifyContent={!queryMobileViewer ? 'center' : 'flex-start'}
          spacing={1}
          marginLeft={0}
        >
          {plannedList &&
            plannedList.map((meetingsGroup) => (
              <Grid
                sx={{ width: '90%' }}
                item
                key={meetingsGroup.planningRoomDtos[0].hashRoom}
                style={!queryMobileViewer ? { paddingLeft: 0 } : {}}
                height={'70vh'}
              >
                <Table meetings={meetingsGroup.planningRoomDtos} count={plannedList[0].planningRoomDtos.length} />
                <Fab
                  color="primary"
                  sx={{
                    backgroundColor: theme.palette.background.buttonSingIn,
                    position: 'absolute',
                    bottom: (theme) => theme.spacing(5),
                    right: (theme) => theme.spacing(10),
                    ['@media (max-width:790px)']: {
                      bottom: (theme) => theme.spacing(2),
                    },
                  }}
                  onClick={addNewPlannedRoom}
                >
                  <AddIcon sx={{ color: 'white' }} />
                </Fab>
              </Grid>
            ))}
          {isLoading && <StyledCircularProgress />}
          {!isLoading && !plannedList.length && (
            <NoPlannedMeetingContainer direction="column">
              <CustomImg src={noPlannedImg} width="50%" />
              <Typography fontSize={{ xs: '13px', sm: '20px', md: '24px' }}>
                У Вас еще нет запланированных встреч
              </Typography>
              <Link to="/createPlannedMeeting" style={{ textDecoration: 'none' }}>
                <Typography
                  color={theme.palette.background.buttonSwitch}
                  fontSize={{ xs: '13px', sm: '20px', md: '24px' }}
                  textTransform="uppercase"
                  fontWeight={500}
                  lineHeight={2.5}
                >
                  Запланировать
                </Typography>
              </Link>
            </NoPlannedMeetingContainer>
          )}
        </Grid>
      </Box>
    </>
  );
});
