import  { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { VideoSettingsSlice } from 'store/reducers/VideoSettingsSlice';
import { DeviceSelector } from 'pages/VideoMeeting/components/MeetingOverlay/DeviceSelector';

import { Box, Button, Stack, Typography, useTheme } from '@mui/material';

import { ColorizerSVG } from 'components/StyledComponents';
import { isMobile } from 'react-device-detect';
import { PermissionSelector } from './MeetingOverlay/PermissionSelector';
import { IPermissionArr } from 'types/share';

import { ReactComponent as MicIcon } from '../../../images/mic-active.svg';

const permissionArr: IPermissionArr[] = [
  { id: 'Small', name: 'низкое', height: 420, width: 760 },
  { id: 'High', name: 'средние', height: 720, width: 1280 },
  { id: 'Full', name: 'высокое', height: 2160, width: 3840 },
];

export const VideoSettings = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { selectDevices, reducerSwitchVideoPermission } = VideoSettingsSlice.actions;
  const { allDevices, selectedDevices, shareStatus } = useAppSelector((state) => state.VideoSettingsReducer);
  const notFound = 'NotFound';

  //TODO: Пока локальные state для того, что бы если пользователь меняет один state, не приходилось из-за
  // этого перезапускать весь стрим (пускай на клацает что хочет и жмет кнопку применить)
  const [vidInSelected, setVidInSelected] = useState<string>('');
  const [audInSelected, setAudInSelected] = useState<string>('');
  const [audOutSelected, setAudOutSelected] = useState<string>('');
  const [disabledSubmit, setDisabledSubmit] = useState<boolean>(true);
  const [videoPermission, setVideoPermission] = useState<string>(permissionArr[0].id);

  useEffect(() => {
    const { initStatus, audioOutput, audioInput, videoInput } = selectedDevices;
    if (!initStatus) return;
    setAudInSelected(audioInput?.deviceId ?? notFound);
    setAudOutSelected(audioOutput?.deviceId ?? notFound);
    setVidInSelected(videoInput?.deviceId ?? notFound);
  }, [selectedDevices]);

  const audioInSelectHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAudInSelected(e.target.value);
    setDisabledSubmit(false);
  };

  const audioOutSelectHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAudOutSelected(e.target.value);
    setDisabledSubmit(false);
  };

  const vidInSelectHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVidInSelected(e.target.value);
    setDisabledSubmit(false);
  };

  const onChangeSelectPermission = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    event.preventDefault();
    const perm = permissionArr.find((item) => item.id === event.target.value);
    dispatch(reducerSwitchVideoPermission(perm));
    setVideoPermission(event.target.value);
  };

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    const audioInput = allDevices.audioInput.find((device) => device.deviceId === audInSelected);
    const audioOutput = allDevices.audioOutput.find((device) => device.deviceId === audOutSelected);
    const videoInput = allDevices.videoInput.find((device) => device.deviceId === vidInSelected);

    dispatch(
      selectDevices({
        audioInput: audioInput ?? null,
        audioOutput: audioOutput ?? null,
        videoInput: videoInput ?? null,
        initStatus: true,
      }),
    );

    setDisabledSubmit(true);
  };

  return (
    <Box component="form" onSubmit={submitHandler}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent={isMobile ? 'space-around' : 'space-between'}
        height={isMobile ? '75vh' : '100vh'}
        padding="0 14px"
      >
        <Box width="100%">
          <Typography color={theme.palette.text.primary} fontSize="18px" marginTop="39px" textAlign="center">
            Настройки устройств
          </Typography>
          <Stack spacing="34px" marginTop="34px" style={isMobile ? { display: 'flex', alignItems: 'center' } : {}}>
            <Stack direction="row" alignItems="center" spacing="13px">
              <DeviceSelector
                disabled={!allDevices.audioInput.length}
                deviceList={allDevices.audioInput}
                label="Микрофон"
                value={audInSelected}
                onChange={audioInSelectHandler}
              />
              <ColorizerSVG sx={{ height: '24px' }}>
                {!isMobile && <MicIcon width="17px" height="25px" viewBox="0 0 10 16" />}
              </ColorizerSVG>
            </Stack>

            <Box display={isMobile ? 'none' : 'block'}>
              <DeviceSelector
                disabled={!allDevices.audioOutput.length}
                deviceList={allDevices.audioOutput}
                label="Устройства воспроизведения"
                value={audOutSelected}
                onChange={audioOutSelectHandler}
              />
            </Box>

            <DeviceSelector
              disabled={!allDevices.videoInput.length || shareStatus}
              deviceList={allDevices.videoInput}
              label="Камера"
              value={vidInSelected}
              onChange={vidInSelectHandler}
            />

            <PermissionSelector
              disabled={shareStatus}
              setDisabledSubmit={setDisabledSubmit}
              permissionArr={permissionArr}
              videoPermission={videoPermission}
              onChangeSelectPermission={onChangeSelectPermission}
            />
          </Stack>
        </Box>
        <Button
          type="submit"
          variant="contained"
          disabled={disabledSubmit}
          fullWidth
          sx={{ marginBottom: '28px', fontSize: '14px', height: '44px' }}
        >
          Применить
        </Button>
      </Stack>
    </Box>
  );
};
