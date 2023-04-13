import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { VideoSettingsSlice } from 'store/reducers/VideoSettingsSlice';
import { enumDeviceType, IChangedDevice, IChangedDevicesList, IDevice, IDeviceList } from 'types/share';
import { captureMediaDevice } from 'utils/captureMediaDevice';

//Хук инициализации устройств, ничего не принимает и не возвращает, но помещает в globalStore список всех устройств и список устройств выбранных по умолчанию системой
export const useInitDevices = () => {
  const dispatch = useAppDispatch();
  const { addDevices, selectDevices, errorInitDevices, switchVideo } = VideoSettingsSlice.actions;
  const { allDevices, selectedDevices } = useAppSelector((state) => state.VideoSettingsReducer);

  const [newDevicesList, setNewDevicesList] = useState<IDeviceList | null>(null);
  const [changedDevicesList, setChangedDevicesList] = useState<IChangedDevicesList | null>(null);
  const [rawDeviceList, setRawDeviceList] = useState<IDevice[] | null>(null);

  const eventTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (newDevicesList === null || changedDevicesList !== null) return;

    if (allDevices.initStatus === false) {
      setNewDevicesList(null);
      dispatch(addDevices({ initStatus: true, ...newDevicesList }));
      return;
    }

    const compareHandler = (newDevices: IDevice[], prevDevices: IDevice[]) => {
      const changedDevices: IChangedDevice[] = [];

      newDevices.forEach((newDevice) => {
        const findDevice = prevDevices.find((prevDevice) => prevDevice.deviceId === newDevice.deviceId);
        if (!findDevice) changedDevices.push({ status: 'add', ...newDevice });
      });
      if (changedDevices.length) return changedDevices;
      return [];
    };

    const { audioInput: prevAudioInput, videoInput: prevVideoInput, audioOutput: prevAudioOutput } = allDevices;
    const { audioInput: newAudioInput, videoInput: newVideoInput, audioOutput: newAudioOutput } = newDevicesList;

    const changedDeviceList = {
      audioInput: compareHandler(newAudioInput, prevAudioInput),
      videoInput: compareHandler(newVideoInput, prevVideoInput),
      audioOutput: compareHandler(newAudioOutput, prevAudioOutput),
    };

    if (
      changedDeviceList.audioInput.length ||
      changedDeviceList.audioOutput.length ||
      changedDeviceList.videoInput.length
    ) {
      setChangedDevicesList(changedDeviceList);
    }

    if (newDevicesList) {
      setNewDevicesList(null);
      dispatch(addDevices({ initStatus: true, ...newDevicesList }));
    }
  }, [newDevicesList, allDevices, changedDevicesList, dispatch, addDevices]);

  const parseDevices = useCallback(async (devices: MediaDeviceInfo[]) => {
    const reduceCallback = (unique: MediaDeviceInfo[], device: MediaDeviceInfo) => {
      if (device.deviceId === 'default' || device.deviceId === 'communications') return unique;
      if (unique.find((item) => item.deviceId === device.deviceId)) return unique;
      return [...unique, device];
    };

    // избавляемся от дубликатов устройств
    const uniqueDevices = devices.reduce(reduceCallback, []);

    // разбиваем устройства на группы
    const audioInput = uniqueDevices.filter((device) => device.kind === enumDeviceType.AUDIO_INPUT);
    const videoInput = uniqueDevices.filter((device) => device.kind === enumDeviceType.VIDEO_INPUT);
    const audioOutput = uniqueDevices.filter((device) => device.kind === enumDeviceType.AUDIO_OUTPUT);

    const isDevicesRealSupported = () => {
      if (
        videoInput.length === 1 &&
        (videoInput[0].deviceId === '' || videoInput[0].label === 'screen-capture-recorder')
      ) {
        dispatch(switchVideo(false));
        return [];
      }
      return videoInput;
    };

    setNewDevicesList(JSON.parse(JSON.stringify({ audioInput, videoInput: isDevicesRealSupported(), audioOutput })));
    setRawDeviceList(JSON.parse(JSON.stringify(devices)));
  }, []);

  // только при монтировании компонента
  useEffect(() => {
    // пытается получить список устройств
    const getDevices = () => {
      if (eventTimeoutRef.current === null) {
        eventTimeoutRef.current = setTimeout(() => {
          // если метод enumerateDevices не доступен
          if (!navigator.mediaDevices?.enumerateDevices) {
            // передаем в список устройств только микрофон по дефолту (хотя бы 1 микрофон точно есть иначе мы бы сюда не дошли)
            const defaultAudio: IDevice = { deviceId: 'default', groupId: '', kind: 'audioinput', label: 'default' };
            dispatch(addDevices({ initStatus: true, audioInput: [defaultAudio], audioOutput: [], videoInput: [] }));
            dispatch(errorInitDevices('not enumerate devices'));
            throw new Error('enumerateDevices() not supported.');
          }

          // если метод enumerateDevices доступен, получаем список устройств и отдаем парсеру
          navigator.mediaDevices
            .enumerateDevices()
            .then(parseDevices)
            .catch((error) => {
              throw new Error(`user denied access to devices ${error}`);
            });

          eventTimeoutRef.current = null;
        }, 600);
      }
    };

    // точка входа хука, запрашиваем у браузера разрешения и пытаемся получить все или хотя бы микрофон, иначе ошибка
    const capture = () =>
      captureMediaDevice({
        video: true,
        audio: true,
        callBack: {
          success: getDevices,
          error: (error) => {
            dispatch(errorInitDevices(error));
            // если доступа к устройствам нет, записываем пустые массивы
            dispatch(addDevices({ initStatus: true, audioInput: [], audioOutput: [], videoInput: [] }));
          },
        },
      });

    capture();
    navigator.mediaDevices.addEventListener('devicechange', capture);

    return () => {
      eventTimeoutRef.current = null;
      navigator.mediaDevices.removeEventListener('devicechange', capture);
    };
  }, []);

  const findDefault = useCallback(
    (devices: IDevice[], kind: enumDeviceType) => {
      if (rawDeviceList === null) return;
      const defaultDevice = rawDeviceList.find((device) => device.kind === kind && device.deviceId === 'default');
      if (!defaultDevice) return;
      const finedDefaultDevice = devices.find((device) => device.groupId === defaultDevice.groupId);
      if (finedDefaultDevice) {
        return finedDefaultDevice;
      }
    },
    [rawDeviceList],
  );

  useEffect(() => {
    if (!allDevices.initStatus) return;

    const { videoInput, audioInput, audioOutput } = allDevices;
    const {
      videoInput: videoInputSelected,
      audioInput: audioInputSelected,
      audioOutput: audioOutputSelected,
      initStatus: selectedStatus,
    } = selectedDevices;

    const defaultAudioInput = () => {
      const availabilityCurrentDevice = audioInputSelected
        ? !!audioInput.find((device) => device.groupId === audioInputSelected.groupId)
        : false;
      //если устройств нет, или последнее было отключено сбрасываем в null
      if (audioInput.length === 0) {
        return { audioInput: null };
      }
      //если подключено новое устройство выбираем его
      if (changedDevicesList?.audioInput?.length) {
        return { audioInput: changedDevicesList.audioInput[0] };
      }
      //если выбранное устройство стало недоступно и в системе всего 1 устройство выбираем его
      if (!availabilityCurrentDevice && audioInput.length === 1) {
        return { audioInput: audioInput[0] };
      }
      //если в системе несколько устройств и еще ни одно не выбрано, пытаемся найти определенное системой по умолчанию
      if (audioInput.length && audioInputSelected === null) {
        return { audioInput: findDefault(audioInput, enumDeviceType.AUDIO_INPUT) ?? audioInput[0] };
      }
      //Если устройство уже выбрано, проверяем, доступно ли оно еще
      if (audioInputSelected && !availabilityCurrentDevice) {
        return { audioInput: findDefault(audioInput, enumDeviceType.AUDIO_INPUT) ?? audioInput[0] };
      }
    };

    const defaultVideoInput = () => {
      const availabilityCurrentDevice = videoInputSelected
        ? !!videoInput.find((device) => device.groupId === videoInputSelected.groupId)
        : false;
      if (videoInput.length === 0) return { videoInput: null };
      if (changedDevicesList?.videoInput.length) return { videoInput: changedDevicesList.videoInput[0] };
      if (videoInput.length === 1 && !availabilityCurrentDevice) return { videoInput: videoInput[0] };
      if (videoInput.length && videoInputSelected === null)
        return { videoInput: findDefault(videoInput, enumDeviceType.VIDEO_INPUT) ?? videoInput[0] };
      if (videoInputSelected && !availabilityCurrentDevice)
        return { videoInput: findDefault(videoInput, enumDeviceType.VIDEO_INPUT) ?? videoInput[0] };
    };

    const defaultAudioOutput = () => {
      const availabilityCurrentDevice = audioOutputSelected
        ? !!audioOutput.find((device) => device.groupId === audioOutputSelected.groupId)
        : false;
      if (audioOutput.length === 0) return { audioOutput: null };
      if (changedDevicesList?.audioOutput.length) return { audioOutput: changedDevicesList.audioOutput[0] };
      if (audioOutput.length === 1 && !availabilityCurrentDevice) return { audioOutput: audioOutput[0] };
      if (audioOutput.length && audioOutputSelected === null)
        return { audioOutput: findDefault(audioOutput, enumDeviceType.AUDIO_OUTPUT) ?? audioOutput[0] };
      if (audioOutputSelected && !availabilityCurrentDevice) {
        return { audioOutput: findDefault(audioOutput, enumDeviceType.AUDIO_OUTPUT) ?? audioOutput[0] };
      }
    };

    const initStatus = () => {
      if (!selectedStatus) return { initStatus: true };
    };

    if (changedDevicesList) setChangedDevicesList(null);

    const result = { ...defaultVideoInput(), ...defaultAudioInput(), ...defaultAudioOutput(), ...initStatus() };

    if (Object.keys(result).length) dispatch(selectDevices(result));
  }, [allDevices, selectedDevices, changedDevicesList, dispatch, selectDevices, findDefault]);

  return { changedDevicesList };
};
