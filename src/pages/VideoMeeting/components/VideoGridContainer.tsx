/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';

// lottie-react
import { useLottie } from 'lottie-react';

// mui
import { Box, SvgIcon } from '@mui/material';
import { styled } from '@mui/material/styles';

// hooks
import { useAppSelector } from 'hooks/redux';

// utils
import { getGridLayout } from 'utils/videoGridLayout';

// components
import { AudioComponent } from 'pages/VideoMeeting/components/AudioComponent';
import { VideoComponent } from 'pages/VideoMeeting/components/VideoComponent';
import { VideoGridWrapper } from 'components/StyledComponents';

// types
import { IAudioState, IFeedInfo, IStreamLocal, IStreamRemote } from 'types/janusTypes';
import { IFeedInformationJanusSubscription, IVideoGridLayout } from 'types/share';

// animations
import loadingJson from '../../../lotties/LoaderMaiin.json';

// mui icons
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { updateSubscription } from 'utils/updateSubscription';

// types
type TimerId = ReturnType<typeof setTimeout>;

interface ITotalFeedsInfo {
    audio_codec: string;
    display: string;
    id: number;
    streams: {
        codec?: string;
        mid: string;
        mindex: number;
        type: 'audio' | 'video' | 'data';
    }[];
}

interface IVideoGridContainerProps {
    audioState: IAudioState[];
    streamsRemote: IStreamRemote[];
    localStream: IStreamLocal | null;
    feedAllInfo: IFeedInfo[];
    webRTCStatus: boolean;
    sidebar: boolean;
    totalFeedsInfo: ITotalFeedsInfo[];
    remoteFeed: React.MutableRefObject<any>;
}

// global const
const optionsLoading = {
    animationData: loadingJson,
    loop: true,
    autoplay: true,
};

export const VideoGridContainer = ({
                                       audioState,
                                       streamsRemote,
                                       localStream,
                                       feedAllInfo,
                                       webRTCStatus,
                                       sidebar,
                                       totalFeedsInfo,
                                       remoteFeed,
                                   }: IVideoGridContainerProps) => {
    // state
    const [videoGridLayout, setVideoGridLayout] = useState<IVideoGridLayout[]>([
        { videoHeight: 0, videoWidth: 0, x: 0, y: 0 },
    ]);
    const [isTogglePack, setTogglePack] = useState(false);
    const [subarrayFeed, setSubarrayFeed] = useState<IFeedInformationJanusSubscription[][] | []>([]);
    const [itemSubArrSubscription, setItemSubArrSubscription] = useState<number>(0);

    //ref
    const videoGridRef = useRef<HTMLDivElement | null>(null);

    // redux
    const { meetingVideoGridCountPreset, statusConnectWebRtcInfo } = useAppSelector(
        (state) => state.DifferentStatesSlice,
    );

    const { View: Loading } = useLottie(optionsLoading, {
        position: 'absolute',
        backgroundColor: '#17202E',
        zIndex: '9998',
        height: '100%',
        width: '100%',
    });

    const resize: () => void = useCallback(() => {
        if (!videoGridRef.current) return;

        const container = {
            width: videoGridRef.current?.clientWidth,
            height: videoGridRef.current?.clientHeight,
        };
        const count = streamsRemote.length + 1;
        const gridCount = count > meetingVideoGridCountPreset ? count : meetingVideoGridCountPreset;
        const layout = getGridLayout(container, count, gridCount, 16 / 9);

        setVideoGridLayout(layout);
    }, [streamsRemote.length, meetingVideoGridCountPreset]);

    useEffect(() => {
        if (!videoGridRef.current) return;

        const elementObservable = videoGridRef.current;
        let timeOut: null | TimerId = null;

        const resizeObserver = new ResizeObserver(() => {
            if (typeof timeOut !== 'object') return;
            timeOut = setTimeout(() => {
                timeOut = null;
                resize();
            }, 500);
        });

        resizeObserver.observe(elementObservable);
        return () => {
            resizeObserver.unobserve(elementObservable);
        };
    }, [resize]);

    useEffect(() => {
        const size = 12;
        const subarray = [];

        for (let i = 0; i < Math.ceil(totalFeedsInfo.length / size); i++) {
            subarray.push(totalFeedsInfo.slice(i * size, (i + 1) * size));
        }

        setSubarrayFeed(subarray);
    }, [totalFeedsInfo]);

    const preloader = useMemo(() => {
        if (!webRTCStatus) {
            return (
                <>
                    <TitleStyle id="test">{statusConnectWebRtcInfo}</TitleStyle>
                    {Loading}
                </>
            );
        }
    }, [webRTCStatus, statusConnectWebRtcInfo]);

    return (
        <>
            {(localStorage as Storage).getItem('bot') !== 'true' && preloader}

            <VideoGridWrapper
                ref={videoGridRef}
                onMouseEnter={() => setTogglePack(true)}
                onMouseLeave={() => setTogglePack(false)}
            >
                {localStorage.getItem('bot') !== 'true' && (
                    <VideoComponent videoType="local" layout={videoGridLayout[0]} videoFeed={localStream} sidebar={sidebar}/>
                )}

                {streamsRemote.map((item: IStreamRemote, index) => {
                    const feedMidId = feedAllInfo.find((i: IFeedInfo) => i.mid === item.id);
                    // если не делать проверку, то новый пользователь появляется в левом углу и анимация погана
                    if (!videoGridLayout[index + 1]) return;

                    return (
                        <React.Fragment key={item.id}>
                            {feedMidId && (
                                <VideoComponent
                                    key={feedMidId.feed_mid}
                                    videoType="remote"
                                    videoFeed={item}
                                    feedMidId={feedMidId}
                                    layout={videoGridLayout[index + 1]}
                                    sidebar={sidebar}
                                />
                            )}
                        </React.Fragment>
                    );
                })}

                {totalFeedsInfo.length >= 12 && (
                    <PaginateWrapper>
                        <SvgIconStyled
                            side="right"
                            onClick={() =>
                                updateSubscription(
                                    'forward',
                                    subarrayFeed,
                                    itemSubArrSubscription,
                                    setItemSubArrSubscription,
                                    remoteFeed,
                                )
                            }
                            onMouseEnter={() => setTogglePack(true)}
                        >
                          {isTogglePack && <ArrowForwardIosIcon sx={{ color: '#32435e' }}/>}
                        </SvgIconStyled>
                        <SvgIconStyled
                            side="left"
                            onClick={() =>
                                updateSubscription('back', subarrayFeed, itemSubArrSubscription, setItemSubArrSubscription, remoteFeed)
                            }
                            onMouseEnter={() => setTogglePack(true)}
                        >
                          {isTogglePack && <ArrowBackIosNewIcon sx={{ color: '#32435e' }}/>}
                        </SvgIconStyled>
                    </PaginateWrapper>
                )}
            </VideoGridWrapper>
            {audioState.map((item: IAudioState) => {
                return <AudioComponent key={item.id} audioFeed={item}/>;
            })}
        </>
    );
};

const TitleStyle = styled('span')(() => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: '5%',
    color: 'white',
    zIndex: 9999,
    fontSize: '24px',
    fontFamily: 'Jost',
}));

const PaginateWrapper = styled(Box)(() => ({
    display: 'flex',
    textAlign: 'center',
    justifyContent: 'center',
    marginBottom: 10,
}));

const SvgIconStyled = styled(SvgIcon)<{ side: string }>(({ side }) => ({
    width: '44px',
    height: '100%',
    position: 'absolute',
    [side]: '-44px',
    cursor: 'pointer',
}));
