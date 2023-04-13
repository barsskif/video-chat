import { useEffect, useRef } from 'react';
import { useAppSelector } from 'hooks/redux';
import { isMobile, isIOS } from 'react-device-detect';

interface AudioComponentProps {
  audioFeed: {
    id: string;
    audioStream: MediaStream;
  };
}

interface extendedHTMLAudioElement extends HTMLAudioElement {
  setSinkId?: (deviceId: string) => void;
}

export const AudioComponent = ({ audioFeed: { id, audioStream } }: AudioComponentProps): JSX.Element => {
  const audioRef = useRef<extendedHTMLAudioElement>(null);

  const audioOutput = useAppSelector((state) => state.VideoSettingsReducer.selectedDevices.audioOutput);

  useEffect(() => {
    if (audioOutput?.deviceId && audioRef.current?.setSinkId && !isMobile) {
      audioRef.current.setSinkId(audioOutput.deviceId);
    }
  }, [audioOutput]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.srcObject = audioStream;
      isIOS || isMobile && audioRef.current.play()
    }
  }, [audioStream, audioRef.current]);

  useEffect(() => {
    if (audioRef.current) {
      if (audioStream && !audioStream.getAudioTracks()[0].muted) {
        // audioRef.current.srcObject = audioStream;
        console.log('Audio stream ready');
      } else {
        console.log('Audio stream is not ready or is muted');
      }
    }
  }, [audioStream, audioRef.current]);

  return <audio id={id} ref={audioRef} autoPlay/>;
};
