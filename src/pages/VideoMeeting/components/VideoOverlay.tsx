import  { FC, useMemo } from 'react';

import { VideoOverlayContainer } from 'components/StyledComponents';
import { IndicateActiveLocalMediaFeed } from 'components/IndicateActiveMediaFeed/IndicateActiveLocalMediaFeed';
import { IFeedInfo } from 'types/janusTypes';
import { IndicateActiveRemoteMediaFeed } from 'components/IndicateActiveMediaFeed/IndicateActiveRemoteMediaFeed';

interface IVideoOverlayProps {
  talkingIndicator: boolean;
  videoType: 'local' | 'remote';
  feedMidId?: IFeedInfo;
  videoFeed?: {
    track: MediaStreamTrack | null;
  } | null;
  name?: string;
  bigScreen: boolean;
}

export const VideoOverlay: FC<IVideoOverlayProps> = ({ talkingIndicator, videoType, feedMidId, name, bigScreen }) => {
  const indicators = useMemo(() => {
    if (videoType === 'remote') return <IndicateActiveRemoteMediaFeed feedMidId={feedMidId} name={name} />;

    return <IndicateActiveLocalMediaFeed />;
  }, [videoType, name]);

  return (
    <VideoOverlayContainer className={`${talkingIndicator && !bigScreen && 'speaker'}`}>
      {indicators}
    </VideoOverlayContainer>
  );
};
