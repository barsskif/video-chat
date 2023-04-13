import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { isMobile } from 'react-device-detect';
import { PlannedMeetingSlice } from 'store/reducers/PlannedMeetingSlice';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { createPlanningMeeting, editPlanningMeeting, fetchOnePlanningMeeting } from 'store/reducers/ActionCreate';
import { IPlannedMeetingFormikInitialState } from 'types/share';

import { useFormik } from 'formik';
import moment from 'moment';
import * as yup from 'yup';

import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { CalendarMonthOutlined, ClearOutlined } from '@mui/icons-material';
import {
  PinkSwitch,
  StyledTextField,
  StyledTypography,
  StyledButtonPrimaryPurple,
  StyledButtonPurple,
} from 'components/StyledComponents';

import appLayout from '../../hocs/appLayout';
import DatePicker from 'components/DatePicker/DatePicker';
import { TimePicker } from 'pages/Rooms/components/TimePicker';

const validationSchema = yup.object({
  meetingName: yup.string().required('Это поле обязательно для заполнения'),
  description: yup.string(),
  startDateTime: yup.date(),
  endDateTime: yup.date(),
  userVideo: yup.boolean(),
  userAudio: yup.boolean(),
  isPrivate: yup.boolean(),
  isRoomWait: yup.boolean(),
  record: yup.boolean(),
  publishers: yup.number(),
});

const createRoomInitialState: IPlannedMeetingFormikInitialState = {
  meetingName: '',
  description: '',
  startDateTime: null,
  endDateTime: null,
  userVideo: false,
  userAudio: true,
  isPrivate: true,
  isRoomWait: false,
  record: false,
  publishers: 150,
};

export const MeetingPlannedForm = appLayout(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { meetingHash } = useParams() as { meetingHash?: string };

  const { isLoading, isCreateSuccess, isEditSuccess, currentPlannedMeeting } = useAppSelector(
    (state) => state.PlannedMeetingReducer,
  );
  const { formStateReset } = PlannedMeetingSlice.actions;

  const roundedDateTime = (date?: Date) => {
    const currentDate = date ?? new Date();
    if (moment(currentDate).minute() >= 30) return moment(currentDate).minute(30).second(0).millisecond(0).toDate();
    return moment(currentDate).minute(0).second(0).millisecond(0).toDate();
  };

  const formik = useFormik({
    initialValues: { ...createRoomInitialState, startDateTime: roundedDateTime(), endDateTime: roundedDateTime() },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (!currentPlannedMeeting || !meetingHash) return dispatch(createPlanningMeeting(values));
      dispatch(editPlanningMeeting({ ...values, hash: meetingHash }));
    },
  });

  // Если есть митинг хэш, пытаемся получить редактируемую комнату
  useEffect(() => {
    if (!meetingHash) return formik.resetForm();
    dispatch(fetchOnePlanningMeeting(meetingHash));
  }, [meetingHash]);

  // Если данные комнаты для редактирования получены, подставляем в форму
  useEffect(() => {
    if (!currentPlannedMeeting || !meetingHash) return;

    formik.setValues({
      ...currentPlannedMeeting,
      startDateTime: roundedDateTime(moment.utc(currentPlannedMeeting.startDateTime).toDate()),
      endDateTime: roundedDateTime(moment.utc(currentPlannedMeeting.endDateTime).toDate()),
    });
  }, [currentPlannedMeeting]);

  // Если запрос на редактирование или создание прошел успешно, перенаправляем
  useEffect(() => {
    if (!isEditSuccess && !isCreateSuccess) return;

    formik.resetForm();
    dispatch(formStateReset());
    navigate('/planned');
  }, [isCreateSuccess, isEditSuccess]);

  // Если выбранная дата отличается меньше чем на пол часа, добавляем
  useEffect(() => {
    const { startDateTime, endDateTime } = formik.values;
    if (startDateTime < endDateTime) return;
    const resultEndDateTime = moment(startDateTime).add(30, 'minutes').toDate();
    formik.setFieldValue('endDateTime', resultEndDateTime);
  }, [formik.values.startDateTime, formik.values.endDateTime]);

  // Если изменена дата, меняем и дату окончания с сохранением ранее выбранного времени
  const onDataChangeHandler = (date: Date | null) => {
    if (!date) return;
    const { endDateTime } = formik.values;

    const endTime = {
      h: moment(endDateTime).hour(),
      m: moment(endDateTime).minute(),
    };

    const newEndDataTime = moment(date).hour(endTime.h).minute(endTime.m).toDate();

    formik.setValues({
      ...formik.values,
      startDateTime: date,
      endDateTime: newEndDataTime,
    });
  };

  const clearInputBtn = formik.values.meetingName && (
    <IconButton onClick={() => formik.setFieldValue('meetingName', '')}>
      <ClearOutlined color={'disabled'} />
    </IconButton>
  );

  const submitFormBtn = (
    <StyledButtonPrimaryPurple
      variant="contained"
      type="submit"
      disabled={isLoading && !meetingHash && !currentPlannedMeeting}
      endIcon={
        isLoading &&
        !meetingHash &&
        !currentPlannedMeeting && <CircularProgress sx={{ maxWidth: '18px', maxHeight: '18px' }} />
      }
      sx={
        isMobile
          ? {
              position: 'absolute',
              left: '27%',
              transform: 'translate(-50%, 0)',
              fontSize: '16px',
              width: '180px',
            }
          : {}
      }
    >
      {meetingHash ? 'Изменить встречу' : 'Запланировать встречу'}
    </StyledButtonPrimaryPurple>
  );

  const cancelBtn = (
    <StyledButtonPurple
      onClick={() => navigate('/planned')}
      sx={
        isMobile
          ? {
              position: 'absolute',
              left: '76%',
              transform: 'translate(-50%, 0)',
              fontSize: '16px !important',
              marginTop: '0',
              width: '160px',
              height: '50px',
            }
          : { width: '160px', height: '50px', marginLeft: '30px', fontSize: '20px !important' }
      }
    >
      Отмена
    </StyledButtonPurple>
  );

  return (
    <>
      <Box
        component="form"
        padding={{ xs: '11vh 15px 0px 40px', sm: '11vh 75px 0px 75px' }}
        onSubmit={formik.handleSubmit}
        sx={{ margin: '0 10px', paddingBottom: `${isMobile ? 20 : 10}px` }}
      >
        <Grid
          container
          direction="row"
          alignContent="center"
          justifyContent="center"
          gap={{ xs: 1, sm: 1, md: 1, lg: 10, xl: 15 }}
          spacing={4}
        >
          <Stack
            direction="column"
            width="545px"
            minWidth="320px"
            paddingTop="30px"
            gap={{ xs: 0.3, sm: 0, md: 0.5, lg: 2 }}
          >
            <StyledTypography variant="h2" fontSize={{ xs: '20px', sm: '24px', md: '32px' }}>
              {meetingHash ? 'Изменить запланированную встречу' : 'Планирование встречи'}
            </StyledTypography>
            <br />
            <StyledTextField
              variant="outlined"
              color="textField"
              label="Название встречи"
              autoComplete="off"
              required
              fullWidth
              id="meetingName"
              name="meetingName"
              fontSize="20px"
              height="52px"
              value={formik.values.meetingName}
              onChange={formik.handleChange}
              error={formik.touched.meetingName && Boolean(formik.errors.meetingName)}
              helperText={formik.touched.meetingName && formik.errors.meetingName}
              InputProps={{
                endAdornment: clearInputBtn,
              }}
            />
            <Stack
              direction="row"
              width="100%"
              alignItems="center"
              justifyContent="space-between"
              gap={{ xs: 0.3, sm: 0.5, md: 2, lg: 2 }}
            >
              <TimePicker
                selected={formik.values.startDateTime}
                onChangeDate={(date) => formik.setFieldValue('startDateTime', date)}
                minTime={
                  Number(moment().format('D')) <= Number(moment(formik.values.startDateTime).format('D')) &&
                  roundedDateTime(new Date())
                }
                name="startDateTime"
                id="startDateTime"
                size="small"
                sx={{ width: `${isMobile ? 100 : 120}px` }}
              />
              <Divider orientation="horizontal" sx={{ width: '25px' }} hidden={isMobile} />
              <TimePicker
                selected={formik.values.endDateTime}
                onChangeDate={(date) => formik.setFieldValue('endDateTime', date)}
                minTime={
                  Number(moment(formik.values.startDateTime).format('D')) <=
                    Number(moment(formik.values.endDateTime).format('D')) && formik.values.startDateTime
                }
                id="endDateTime"
                name="endDateTime"
                size="small"
                sx={{
                  width: `${isMobile ? 100 : 120}px`,
                }}
              />
              <Box width="235px" sx={{ zIndex: 3 }}>
                <DatePicker
                  dateFormat="dd.MM.yyyy"
                  minDate={new Date()}
                  showDisabledMonthNavigation
                  selected={formik.values.startDateTime}
                  onChange={onDataChangeHandler}
                  name="startDateTime"
                  id="startDateTime"
                  customInput={
                    <StyledTextField
                      InputProps={{
                        startAdornment: <CalendarMonthOutlined color="disabled" sx={{ marginRight: '5px' }} />,
                        sx: { paddingLeft: `${isMobile ? '4' : '14'}px` },
                      }}
                      variant="outlined"
                      fontSize="20px"
                      height="52px"
                      color="textField"
                    />
                  }
                />
              </Box>
            </Stack>
            <StyledTextField
              value={formik.values.description || ''}
              onChange={formik.handleChange}
              name="description"
              id="description"
              label="Описание встречи"
              fontSize="20px"
              color="textField"
              fullWidth
              multiline
              rows={5}
            />
            <Box
              display={{
                xs: 'none',
                sm: 'none',
                md: 'none',
                lg: 'flex',
                xl: 'flex',
              }}
              alignItems={{ xs: 'none', sm: 'none', md: 'none', lg: 'flex-end', xl: 'flex-end' }}
            >
              {submitFormBtn}
              {cancelBtn}
            </Box>
          </Stack>
          <Stack
            width={{ xs: '100%', sm: 'auto' }}
            direction="column"
            justifyContent="flex-start"
            marginRight={{ xs: 'auto', sm: '0', md: '0', lg: '0' }}
            marginTop={{ xs: 'auto', sm: '0', md: '0', lg: '72px' }}
            marginBottom={{ xs: 'auto', sm: '20px', md: '0', lg: '72px' }}
          >
            <Typography fontSize="24px" fontFamily="Jost" fontWeight="700">
              Настройки
            </Typography>
            <FormGroup>
              <FormControlLabel
                label={
                  <Stack marginTop="6px">
                    <Typography fontSize="20px" fontFamily="Jost">
                      Зал ожидания
                    </Typography>
                    <Typography variant="subtitle1" fontSize="16px" width="220px" fontFamily="Jost">
                      Пользователи не смогут войти во встречу без вашего одобрения.
                    </Typography>
                  </Stack>
                }
                control={
                  <PinkSwitch
                    checked={formik.values.isRoomWait || false}
                    onChange={formik.handleChange}
                    name="isRoomWait"
                    id="isRoomWait"
                  />
                }
                sx={{ alignItems: 'flex-start' }}
              />
            </FormGroup>
            <br />
            <br />
            <Stack direction="row" gap={2}>
              <FormGroup>
                <FormLabel component="legend">
                  <Typography fontSize="20px" fontWeight="700" fontFamily="Jost">
                    Участники
                  </Typography>
                </FormLabel>
                <FormControlLabel
                  label={
                    <Typography fontSize="20px" fontFamily="Jost">
                      Видео
                    </Typography>
                  }
                  control={
                    <PinkSwitch
                      checked={formik.values.userVideo || false}
                      onChange={formik.handleChange}
                      name="userVideo"
                      id="userVideo"
                    />
                  }
                />
                <FormControlLabel
                  label={
                    <Typography fontSize="20px" fontFamily="Jost">
                      Микрофон
                    </Typography>
                  }
                  control={
                    <PinkSwitch
                      checked={formik.values.userAudio || false}
                      onChange={formik.handleChange}
                      name="userAudio"
                      id="userAudio"
                    />
                  }
                />
              </FormGroup>
            </Stack>

            <Box
              display={{ xs: 'flex', sm: 'flex', md: 'flex', lg: 'none', xl: 'none' }}
              alignItems={{ xs: isMobile ? 'flex-start' : 'flex-end', sm: 'flex-end', md: 'flex-end' }}
            >
              {submitFormBtn}
              {cancelBtn}
            </Box>
            <Stack direction="column" display="none">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.record || false}
                    onChange={formik.handleChange}
                    name="record"
                    id="record"
                  />
                }
                label={<Typography fontSize="14px">Автоматически записывать конференцию</Typography>}
              />
            </Stack>
          </Stack>
        </Grid>
      </Box>
    </>
  );
});
