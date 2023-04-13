import { MutableRefObject } from 'react';

import { ISelectedDevices, IVideoPermission } from 'types/share';
import { TypeJsep, TypeSfu } from 'types/janusTypes';
import { muteAudioTracks } from './muteAudioTracks';
import { isMobile } from 'react-device-detect';
interface IPublishOwnFeedProps {
  offerStatus: boolean;
  switchOfferStatus: (status: boolean) => void;
  switchShareStatus: (status: boolean) => void;
  sfuRef: TypeSfu;
  selectedDevices: ISelectedDevices;
  canvasRefEl: MutableRefObject<HTMLCanvasElement | null>;
  startSharingScreen: boolean;
  videoStatus: boolean;
  audioStatus: boolean;
  errorCaptureCamera: (error: string) => void;
  videoPermission: IVideoPermission;
}

export const publishOwnFeed = (props: IPublishOwnFeedProps) => {
  const {
    offerStatus,
    switchOfferStatus,
    switchShareStatus,
    sfuRef,
    selectedDevices: { videoInput, audioInput },
    canvasRefEl,
    startSharingScreen,
    videoStatus,
    errorCaptureCamera,
    audioStatus,
    videoPermission,
  } = props;

  const mobileSettings = () => {
    const videoTrackCanvas = canvasRefEl?.current?.captureStream(0).getVideoTracks()[0];
    if (videoStatus) {
      return [
        {
          type: 'audio',
          capture: true,
          replace: offerStatus,
        },
        {
          type: 'video',
          capture: true,
          replace: offerStatus,
        },
        { type: 'data' },
      ];
    }

    return [
      {
        type: 'audio',
        capture: true,
        replace: offerStatus,
        recv: true,
      },
      {
        type: 'video',
        capture: videoTrackCanvas,
        replace: offerStatus,
        recv: true,
      },

      { type: 'data' },
    ];
  };

  const config = () => {
    if (localStorage.getItem('bot') === 'true') {
      return [
        {
          type: 'audio',
          capture: false,
          replace: offerStatus,
          recv: true,
        },
        {
          type: 'video',
          capture: false,
          replace: offerStatus,
          recv: true,
        },
        { type: 'data' },
      ];
    }
    if (videoInput && videoStatus && audioInput && !startSharingScreen) {
      return [
        {
          type: 'audio',
          capture: { deviceId: { exact: audioInput.deviceId } },
          replace: offerStatus,
          recv: true,
        },
        {
          type: 'video',
          capture: {
            deviceId: { exact: videoInput.deviceId },
            width: videoPermission.width,
            height: videoPermission.height,
          },
          replace: offerStatus,
          recv: true,
        },
        { type: 'data' },
      ];
    }

    if (
      (videoInput === null || !videoStatus) && audioInput && canvasRefEl.current !== null &&
      !startSharingScreen
    ) {
      const videoTrackCanvas = canvasRefEl.current.captureStream(0).getVideoTracks()[0];
      return [
        {
          type: 'audio',
          capture: { deviceId: { exact: audioInput.deviceId } },
          replace: offerStatus,
          recv: true,
        },
        { type: 'video', capture: videoTrackCanvas, recv: true, replace: offerStatus },
        { type: 'data' },
      ];
    }

    if (
      (videoInput === null || !videoStatus) && audioInput === null && canvasRefEl.current !== null &&
      !startSharingScreen
    ) {
      const videoTrackCanvas = canvasRefEl.current.captureStream(0).getVideoTracks()[0];
      const audioTrackContext = new AudioContext().createMediaStreamDestination().stream.getAudioTracks()[0];
      return [
        { type: 'audio', capture: audioTrackContext, recv: true, replace: offerStatus },
        { type: 'video', capture: videoTrackCanvas, recv: true, replace: offerStatus },
        { type: 'data' },
      ];
    }

    if (startSharingScreen) {
      return [
        {
          type: 'screen',
          capture: true,
          recv: true,
          replace: true,
        },
      ];
    }
  };

  sfuRef.current.createOffer({
    tracks: isMobile ? mobileSettings() : config(),
    simulcast: false,
    success: (jsep: TypeJsep) => {
      if (!offerStatus) {
        const publish = { request: 'configure', audio: true, video: true, };
        sfuRef.current.send({ message: publish, jsep: jsep });
      }
      muteAudioTracks(audioStatus, sfuRef);

      if (startSharingScreen) {
        sfuRef.current.send({ message: { request: 'configure', bitrate: 2000000 } });
      }
      if (!startSharingScreen && offerStatus) {
        sfuRef.current.send({ message: { request: 'configure', bitrate: 256000 } });
      }

      switchOfferStatus(true);
    },
    error: (error: Error) => {
      //Если запущена шара и попали в ошибку, значит пользователь нажал "отмена" в окне выбора источника шары, но нужно еще предусмотреть 2 сценарий -
      //TODO: если шара идет и пользователь нажал - закрыть доступ, нужно перехватить
      if (startSharingScreen) switchShareStatus(false);
      if (error.message === 'Could not start video source') errorCaptureCamera(error.message);
      console.error('При публикации нашего стрима произошла ошибка:', error);
    },
  });
};
