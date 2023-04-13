import React, { useEffect, useMemo, useRef, useState } from 'react';

// react-router-dom
import { useLocation, useNavigate } from 'react-router-dom';

// redux
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { useSelectsMeetingOverlay } from 'hooks/useSelectsMeetingOverlay';
import { VideoSettingsSlice } from 'store/reducers/VideoSettingsSlice';
import { meetingDelete } from 'store/reducers/ActionCreate';
import { isCloseBrowserBot, isOpenBrowserBot } from 'store/actions/ActionRecordBot';
import { MeetingSlice } from 'store/reducers/MeetingSlice';

// mui
import { Badge, Box, Divider, Popover, Stack, Theme, Tooltip, Typography, useMediaQuery } from '@mui/material';


// react-device-detect
import { isMobile } from 'react-device-detect';

// utils
import { sendMessageSignalR } from 'utils/SignalRSocket';

// components
import { TransitionsModalExitMeet } from 'components/TransitionsModalExitMeet/TransitionsModalExitMeet';
import {
    ColorizerSVG,
    MeetingOverlayWrapper,
    SquareButton,
    StyledAlertRecordStatus,
    StyledEndCallButton,
    StyledInvitation,
} from 'components/StyledComponents';

//types
import { TypeSfu } from 'types/janusTypes';
import { ILocationState, ISendAddShare, IUser, optionsEnum } from 'types/share';

// ReactComponent as svg
import { ReactComponent as MicActiveIcon } from '../../../images/mic-active.svg';
import { ReactComponent as MicInactiveIcon } from '../../../images/mic-inactive.svg';
import { ReactComponent as CamActiveIcon } from '../../../images/CamActive.svg';
import { ReactComponent as CamInactiveIcon } from '../../../images/no-video-cam.svg';
import { ReactComponent as RecordIcon } from '../../../images/Record.svg';
import { ReactComponent as SettingsIcon } from '../../../images/Settings.svg';
import { ReactComponent as SidebarIcon } from '../../../images/sidebarBtnIcon.svg';
import { ReactComponent as ChatIcon } from '../../../images/chat.svg';
import { ReactComponent as LinkIcon } from '../../../images/linkIcon.svg';
import { ReactComponent as HandUpSvg } from '../../../images/handUpSvg.svg';
import { ShareButton } from './UI/ShareButton';
import { IsRecordMsg } from "pages/VideoMeeting/components/UI/IsRecordMsg";

// types
interface overlayProps {
    user?: IUser | null;
    sfuRef: TypeSfu;
    meetingHash: string;
    sidebarVisible: boolean;
    toggleSidebar: () => void;
    devicesSettings: boolean;
    toggleSettingSidebar: () => void;
}

enum buttonsLegend {
    serverConnecting = 'Идет подключения к серверу',
    onCam = 'Включить камеру',
    offCam = 'Выключить камеру',
    onMic = 'Включить микрофон',
    offMic = 'Выключить микрофон',
    camBlockedShare = 'Во время демонстрации нельзя включить камеру',
    camBlockedNotFound = 'На вашем устройстве не обнаружена камера',
    micBlockedNotFound = 'На вашем устройстве не обнаружен микрофон',
    settingsBlockedShare = 'Во время демонстрации нельзя изменять устройства',
    settings = 'Выбор устройств',
    chat = 'Чат',
    sidebar = 'Список участников и чат',
}

export const MeetingOverlay = ({
                                   sfuRef,
                                   meetingHash,
                                   sidebarVisible,
                                   toggleSettingSidebar,
                                   toggleSidebar,
                                   devicesSettings,
                               }: overlayProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const location = useLocation() as ILocationState;
    const queryMobileViewer = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));

    const btnRefCamEl = useRef(null);

    // get multi selector
    const {
        audioStatus,
        videoStatus,
        shareStatus,
        selectedDevices: { videoInput, audioInput },
        webRTCStatus,
        imJanusID,
        statusConnectionSignalR,
        screenCaptureStatus,
        shareState,
        mediaStatusFeeds,
        kickFeedId,
        currentMeeting,
        countUnread,
        isLoading,
        recordBot,
        error: recordBotError,
    } = useAppSelector(useSelectsMeetingOverlay);

    // redux actions
    const { switchAudio, switchVideo, switchSare } = VideoSettingsSlice.actions;
    const { reset: meetingReset } = MeetingSlice.actions;

    const myFeed = mediaStatusFeeds.find((feed) => feed.feed_id === imJanusID);
    const isOrganizator = myFeed?.user_role === optionsEnum.ORGANIZATOR;
    const isModerator = myFeed?.user_role === optionsEnum.COORGANIZATOR;

    const [openModalExit, setOpenModalExit] = useState(false);
    const [popoverVisible, setPopoverVisible] = useState<boolean>(false);
    const [popoverPosition, setPopoverPosition] = useState<HTMLButtonElement | null>(null);
    const [isOpenBrowserByBot, setIsOpenBrowserByBot] = useState<boolean>(false);
    const [toogleActiveBtnHendUp, setToogleActiveBtnHendUp] = useState(false);

    const handleOpenModalExit = () => setOpenModalExit(true);
    const handleCloseModalExit = () => setOpenModalExit(false);

    if (isMobile) {
        document.documentElement.requestFullscreen();
    }


    useEffect(() => {
        if (
            !statusConnectionSignalR ||
            typeof statusConnectionSignalR === 'string' ||
            imJanusID === null ||
            currentMeeting === null
        )
            return;
        const msg: ISendAddShare = {
            meeting_id: JSON.stringify(currentMeeting.roomId),
            feed_id: JSON.stringify(imJanusID),
            isShare: screenCaptureStatus,
        };

        sendMessageSignalR(msg, 'IsShare').then();
    }, [screenCaptureStatus, statusConnectionSignalR, imJanusID, currentMeeting]);

    useEffect(() => {
        if (kickFeedId === imJanusID) {
            endCallHandler(false);
        }
    }, [kickFeedId]);

    const micBtn = useMemo(() => {
        //TODO: Добавить проверку разрешения включить микрофон
        let disabled = false,
            legend = '';
        if (audioStatus) legend = buttonsLegend.offMic;
        if (!audioStatus) legend = buttonsLegend.onMic;
        if (audioInput === null) {
            disabled = true;
            legend = buttonsLegend.micBlockedNotFound;
        }
        if (!webRTCStatus) {
            disabled = true;
            legend = buttonsLegend.serverConnecting;
        }

        const switchAudioHandler = () => {
            dispatch(switchAudio(!audioStatus));
        };

        const btn = (
            <SquareButton
                disabled={disabled}
                onClick={switchAudioHandler}
                style={audioStatus && !disabled ? { background: '#007DFE' } : {}}
            >
                {audioStatus ? (
                    <ColorizerSVG color="active">
                        <MicActiveIcon width="15px" height="22.5px" color="blue"/>
                    </ColorizerSVG>
                ) : (
                    <ColorizerSVG>
                        <MicInactiveIcon width="20px" height="22.5px"/>
                    </ColorizerSVG>
                )}
            </SquareButton>
        );
        return (
            <Tooltip title={legend}>
                <span>{btn}</span>
            </Tooltip>
        );
    }, [audioStatus, audioInput, webRTCStatus, dispatch, switchAudio]);

    const camBtn = useMemo(() => {
        //TODO: Добавить проверку разрешения включить камеру
        let disabled = false,
            legend = '';
        if (videoStatus) legend = buttonsLegend.offCam;
        if (!videoStatus) legend = buttonsLegend.onCam;
        if (!webRTCStatus) {
            disabled = true;
            legend = buttonsLegend.serverConnecting;
        }
        if (shareStatus) {
            disabled = true;
            legend = buttonsLegend.camBlockedShare;
        }
        if (videoInput === null) {
            disabled = true;
            legend = buttonsLegend.camBlockedNotFound;
        }

        const switchVideoHandler = () => {
            dispatch(switchVideo(!videoStatus));
            const camBtn = btnRefCamEl.current as unknown as HTMLElement;
            camBtn.blur();
        };

        const btn = (
            <SquareButton
                disabled={disabled}
                onClick={switchVideoHandler}
                ref={btnRefCamEl}
                style={videoStatus ? { background: '#007DFE' } : {}}
            >
                {videoStatus ? (
                    <ColorizerSVG color="active">
                        <CamActiveIcon width="20px" height="15px"/>
                    </ColorizerSVG>
                ) : (
                    <ColorizerSVG>
                        <CamInactiveIcon width="30px" height="20px"/>
                    </ColorizerSVG>
                )}
            </SquareButton>
        );
        return (
            <Tooltip title={legend}>
                <span>{btn}</span>
            </Tooltip>
        );
    }, [dispatch, shareStatus, switchVideo, videoInput, videoStatus, webRTCStatus]);

    const handleClickHandUp = async () => {
        if (!currentMeeting) return;

        try {
            const msg = {
                meeting_id: JSON.stringify(currentMeeting.roomId),
                feed_id: JSON.stringify(imJanusID),
                is_rise_hand: !toogleActiveBtnHendUp,
            };

            await sendMessageSignalR(msg, 'WebinarRaiseHandAsync');
            setToogleActiveBtnHendUp((prev) => !prev);
        } catch (error) {
            console.error('Не удалось отправить запрос на поднятие руки....', error);
            setToogleActiveBtnHendUp(false);
        }
    };

    const startRecord = async () => {
        // const secret = 'kjwbeflqwelfhbwefbwqfhbwqf';
        if (isOrganizator && meetingHash) {
            setIsOpenBrowserByBot(true);
            await dispatch(isOpenBrowserBot(meetingHash));
        }
    };

    const stopRecord = async () => {
        console.log('stop record');
        if (isOrganizator && meetingHash) {
            setIsOpenBrowserByBot(false);
            await dispatch(isCloseBrowserBot(meetingHash));
        }
    };

    const recordBtn = useMemo(() => {
        if (!isOrganizator) return;
        //TODO: Добавить проверку разрешения записи
        let disabled = false,
            legend = '';

        if (!webRTCStatus) {
            disabled = true;
        }

        legend = 'Запись';
        const btn = (
            <SquareButton
                disabled={disabled}
                onClick={isOpenBrowserByBot ? stopRecord : startRecord}
                sx={{ backgroundColor: isOpenBrowserByBot ? '#007DFE' : '' }}
            >
                <ColorizerSVG color={isOpenBrowserByBot ? 'active' : ''}>
                    <RecordIcon width="20px" height="20px"/>
                </ColorizerSVG>
            </SquareButton>
        );

        if (!queryMobileViewer) return;
        return (
            <Tooltip title={legend}>
                <span>{btn}</span>
            </Tooltip>
        );
    }, [queryMobileViewer, webRTCStatus, isOpenBrowserByBot, isOrganizator]);

    const openVideoSettingsBtn = useMemo(() => {
        let disabled = false,
            legend = buttonsLegend.settings;
        if (!webRTCStatus) {
            disabled = true;
            legend = buttonsLegend.serverConnecting;
        }
        if (shareStatus) {
            disabled = true;
            legend = buttonsLegend.settingsBlockedShare;
        }
        const btn = (
            <SquareButton
                disabled={disabled}
                onClick={toggleSettingSidebar}
                style={sidebarVisible && devicesSettings ? { background: '#007DFE' } : {}}
            >
                <ColorizerSVG>
                    <SettingsIcon width="19.2px" height="20px"/>
                </ColorizerSVG>
            </SquareButton>
        );
        return (
            <Tooltip className="videoSettingsButton" title={legend}>
                <span>{btn}</span>
            </Tooltip>
        );
    }, [shareStatus, webRTCStatus, sidebarVisible, devicesSettings]);

    const switchSidebarVisibleButton = useMemo(() => {
        let disabled = false,
            legend = buttonsLegend.sidebar;
        if (!webRTCStatus) {
            disabled = true;
            legend = buttonsLegend.serverConnecting;
        }

        const btn = (
            <SquareButton
                className="switchSidebarButton"
                disabled={disabled}
                onClick={toggleSidebar}
                style={sidebarVisible && !devicesSettings ? { background: '#007DFE' } : {}}
            >
                <ColorizerSVG type="stroke">
                    <SidebarIcon/>
                </ColorizerSVG>
            </SquareButton>
        );
        return (
            <Tooltip title={legend}>
                <Badge
                    badgeContent={
                        countUnread && (
                            <ColorizerSVG color="active" sx={{ width: '11.5px', marginLeft: '-2.5px', height: '12px' }}>
                                <ChatIcon width="13" height="11" viewBox="0 0 18 19"/>
                            </ColorizerSVG>
                        )
                    }
                    color={'primary'}
                >
                    <span>{btn}</span>
                </Badge>
            </Tooltip>
        );
    }, [webRTCStatus, countUnread, sidebarVisible, devicesSettings, mediaStatusFeeds]);

    const endCallHandler = async (isDelete: boolean) => {
        if (!sfuRef.current) return;
        if (isDelete) {
            await dispatch(meetingDelete(meetingHash));
            return
        }
        const role = localStorage.getItem('role') === 'guest';

        role ? await sfuRef.current.detach() : await sfuRef.current.hangup();

        dispatch(meetingReset());

        if (JSON.parse(sessionStorage.getItem('dataToken') || '')?.guest === 'True') {
            localStorage.removeItem('accessToken');
            document.cookie = 'name=user; max-age=-1';
            sessionStorage.clear();
        }
        const msg = {
            meeting_id: meetingHash,
            feed_id: String(imJanusID),
        };
        await sendMessageSignalR(msg, 'DisconnectionStream');

        return role ? navigate('/') : navigate('/rooms');
    };

    const copyHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
        const hash = meetingHash || location.state.meetingHash || '';
        setPopoverPosition(event.currentTarget);

        navigator.clipboard.writeText(`${window.location.origin}/guest/${hash}`).then(() => {
            setPopoverVisible(true);
            setTimeout(() => setPopoverVisible(false), 1000);
        });
    };

    return (
        <>
           <IsRecordMsg isLoading={isLoading} isRecord={recordBot.isRecord} recordBotError={recordBotError}/>
            <TransitionsModalExitMeet
                endCallHandler={endCallHandler}
                open={openModalExit}
                handleCloseModalExit={handleCloseModalExit}
            />
            <MeetingOverlayWrapper sidebar={sidebarVisible ? 'true' : 'false'}>
                <Stack direction="row" justifyContent="center" alignItems="center" spacing="33%" height="100%">
                    <Box>
                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                            <StyledInvitation
                                disabled={!webRTCStatus}
                                onClick={copyHandle}
                                variant="contained"
                                color="success"
                                startIcon={<LinkIcon/>}
                            >
                                Пригласить
                            </StyledInvitation>
                            <Divider orientation="vertical" sx={{ height: '32px' }}/>
                            {micBtn}
                            {camBtn}
                            <ShareButton
                                imJanusID={imJanusID}
                                queryMobileViewer={queryMobileViewer}
                                shareState={shareState}
                                shareStatus={shareStatus}
                                switchSare={switchSare}
                                webRTCStatus={webRTCStatus}
                            />
                            {(isOrganizator || isModerator) && recordBtn}
                            {switchSidebarVisibleButton}
                            {openVideoSettingsBtn}
                            <SquareButton style={toogleActiveBtnHendUp ? { background: '#007DFE' } : {}}
                                          onClick={handleClickHandUp}>
                                <ColorizerSVG>
                                    <HandUpSvg/>
                                </ColorizerSVG>
                            </SquareButton>
                            <Divider orientation="vertical" sx={{ height: '32px' }}/>
                            <StyledEndCallButton
                                disabled={!webRTCStatus}
                                onClick={isOrganizator ? handleOpenModalExit : () => endCallHandler(false)}
                                variant="contained"
                                color="error"
                            >
                                Покинуть встречу
                            </StyledEndCallButton>
                        </Stack>
                    </Box>
                </Stack>
            </MeetingOverlayWrapper>

            <Popover
                open={popoverVisible}
                anchorEl={popoverPosition}
                onClose={() => setPopoverVisible(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                PaperProps={{
                    style: {
                        transform: 'translateX(46%) translateY(-62%)',
                    },
                }}
            >
                <Typography sx={{ margin: '5px' }} variant="body1">
                    Ссылка скопирована
                </Typography>
            </Popover>
        </>
    )
        ;
};
