import { ILocalTracksInfo, TypeSfu } from 'types/janusTypes';

export const muteAudioTracks = (audio: boolean, sfuRef: TypeSfu) => {
  const localTracks: ILocalTracksInfo[] = sfuRef.current.getLocalTracks();
  const audioTrack = localTracks.find((track) => track.type === 'audio');
  const audioMid = audioTrack?.mid ?? '0';

  if (!audio) {
     sfuRef.current.muteAudio(audioMid);
  }

  if (sfuRef.current.isAudioMuted(audioMid) && audio) {
     sfuRef.current.unmuteAudio(audioMid);
  }
};
