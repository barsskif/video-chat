/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';

// react-router-dom
import { useNavigate, useParams, useLocation } from 'react-router-dom';

// react-device-detect
import { isMobile } from 'react-device-detect';

// mui
import { Stack } from '@mui/material';

// redux
import { useAppDispatch } from 'hooks/redux';
import { VideoSettingsSlice } from 'store/reducers/VideoSettingsSlice';
import { DifferentStatesSlice } from 'store/reducers/DifferentStatesSlice';
import { meetingFetch, turnServerFetchingData } from 'store/reducers/ActionCreate';
import { SingInSlice } from 'store/reducers/SingInSlice';

// hooks
import { useResetGlobalState } from 'hooks/useResetGlobalState';
import { useInitDevices } from 'hooks/useInitDevices';
import { useKeyboardEvents } from "hooks/useKeyboardEvents";
import { useSignalREvents } from "hooks/useSignalREventHandlers";
import { useWakeLock } from "hooks/useWakeLock";
import { useVideoMeetingAppSelectors } from "hooks/useAppSelectorsVideoMeeting";

// janus cdn
import Janus from '../../Janus/Janus';

//components
import { AlertNotifications } from 'components/AlertNotifications/AlertNotifications';

// pages
import { VideoGridContainer } from 'pages/VideoMeeting/components/VideoGridContainer';
import { MeetingOverlay } from 'pages/VideoMeeting/components/MeetingOverlay';
import { MeetingSidebar } from 'pages/VideoMeeting/components/MeetingSidebar';
import { MobileMeetingOverlay } from 'pages/VideoMeeting/components/MobileViewer/MobileMeetingOverlay';
import { MobileVideoGridContainer } from 'pages/VideoMeeting/components/MobileViewer/MobileVideoGridContainer';
import { MobileMeetingHeader } from 'pages/VideoMeeting/components/MobileViewer/MobileMeetingHeader';
import { MobileMeetingSidebar } from 'pages/VideoMeeting/components/MobileViewer/MobileMeetingSidebar';

// helpers
import { publishOwnFeed } from '../../helpers/publishOwnFeed';
import { useJanusAttach } from '../../helpers/useJanusAttach';
import { useWebRTCSendData } from '../../helpers/useWebRTCSendData';
import { useSfuStats } from '../../helpers/useSfuStats';
import { muteAudioTracks } from '../../helpers/muteAudioTracks';
import { subscribeLeaderInWebinar } from "../../helpers/subscribeLeaderInWebinar";

// utils
import { connection, sendMessageSignalR } from 'utils/SignalRSocket';

// types
import { enumLocalStorage, IAlertMessage, IFeedInformationJanusSubscription } from 'types/share';
import { IStreamLocal } from 'types/janusTypes';


const server = import.meta.env.REACT_APP_SERVER_JANUS_WSS;

export const VideoMeeting = () => {
    const location = useLocation();
    const [resetGlobalState] = useResetGlobalState();
    const janus = useRef<any>();

    const remoteFeed = useRef<any>();
    const canvasRefEl = useRef<HTMLCanvasElement | null>(null);
    const sfuRef = useRef<any>();
    const firstRenderRef = useRef<boolean>(true);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { meetingHash } = useParams() as { meetingHash: string };

    const {
        user,
        dataTurnServer,
        turnServerError,
        isLoading,
        selectedDevices,
        videoStatus,
        audioStatus,
        shareStatus,
        videoPermission,
        deviceInitError,
        currentMeeting,
        error,
        webRTCStatus,
        errorMessageCaptureCamera,
        statusConnectionSignalR,
        destroyedRoom,
        imJanusID,
        screenCaptureStatus,
    } = useVideoMeetingAppSelectors();

    const { switchSare } = VideoSettingsSlice.actions;

    const {
        reducerErrorMessageCaptureCamera,
        reducerDestroyedRoom,
        reducerStatusConnectWebRtc
    } = DifferentStatesSlice.actions;

    const { logOut } = SingInSlice.actions;

    const { reducerStatusConnectionSignalR } = DifferentStatesSlice.actions;

    const queryMobileViewer = !isMobile;

    const [offerStatus, setOfferStatus] = useState<boolean>(false);
    const [joinStatus, setJoinStatus] = useState<boolean>(false);
    const [streamsRemote, setStreamsRemote] = useState<any>([]);
    const [localStream, setLocalStream] = useState<IStreamLocal | null>(null);
    const [audioState, setAudio] = useState<any>([]);
    const [feedAllInfo, setFeedAllInfo] = useState([]);
    const [leaving, setLeaving] = useState<number | null>(null);
    const [notifications, setNotifications] = useState<IAlertMessage[]>();
    const [rightMenuVisible, setRightMenuVisible] = useState(false);
    const [devicesSettings, setDevicesSettings] = useState(false);
    const [mobileDeviceSettings, setMobileDeviceSettings] = useState(false);

    // колл участников для динамической подписки
    const [totalFeedsInfo, setTotalFeedsInfo] = useState([]);
    console.log('totalFeedsInfo', totalFeedsInfo)
    // счетчик колл подписанных участников
    const totalFeed = useRef<number>(0);

    const [janusAttach] = useJanusAttach();
    const { sendChatMessage } = useWebRTCSendData(sfuRef, webRTCStatus, user?.userName);
    const { changedDevicesList } = useInitDevices();
    const [webRTCPacketLoss] = useSfuStats({ sfuRef, webRTCStatus });

    const opaqueId = `video_room-${meetingHash}`;

    useWakeLock() // кастомный хук для предотвращения сброса канала WEBRTC

    // если это вебинар то отправляем информацию на бек о ведуших
    useEffect(() => {
        if (firstRenderRef.current) return
        subscribeLeaderInWebinar(
            statusConnectionSignalR,
            webRTCStatus,
            imJanusID,
            currentMeeting?.roomId,
            location?.state?.isWebinar
        );
    }, [
        statusConnectionSignalR,
        webRTCStatus,
        imJanusID,
        currentMeeting?.roomId,
        location?.state?.isWebinar,
        firstRenderRef.current
    ])


    useEffect(() => {
        const startSocketSignalR = async () => {
            try {
                await connection.start();
                dispatch(reducerStatusConnectionSignalR(true));
            } catch (err) {
                dispatch(reducerStatusConnectionSignalR('не удалось подключиться к сокетам'));
            }
        };

        if (user) {
            startSocketSignalR()
        }

    }, [connection, dispatch, reducerStatusConnectionSignalR, user]);

    // ### Нужно для того чтоб точно быть уверенным, что соединение сброшено после нажатия кнопки назад ### //
    useEffect(() => {
        const refreshStateGuest = () => {
            dispatch(logOut());
            window.location.reload();
        };

        addEventListener('popstate', () => refreshStateGuest(), false);
        return () => removeEventListener('popstate', refreshStateGuest);
    }, []);
    // ### ######################################################################################### ### //

    const toggleSettingSidebar = () => {
        setDevicesSettings((prevSettings) => {
            if (prevSettings) setRightMenuVisible((prevSidebar) => !prevSidebar);
            else setRightMenuVisible(true);
            return true;
        });
    };

    const toggleSidebar = () => {
        setDevicesSettings((prevSettings) => {
            if (prevSettings) setRightMenuVisible(true);
            else setRightMenuVisible((prev) => !prev);
            return false;
        });
    };

    const returnName = () => {
        if (user) {
            return user.firstname === '' ? user.email : user.firstname;
        }

        return localStorage.getItem('userData');
    };

    useEffect(() => {
        if (
            statusConnectionSignalR &&
            webRTCStatus &&
            imJanusID &&
            currentMeeting?.roomId &&
            firstRenderRef.current
        ) {
            const isBot = localStorage.getItem('bot') !== 'true';

            const sendMsgSocketConnectToJoin = () => {
                const msg = {
                    meeting_id: JSON.stringify(currentMeeting.roomId),
                    audio_codec: currentMeeting.audioCodec,
                    display: returnName(),
                    feed_id: JSON.stringify(imJanusID),
                    video_codec: currentMeeting.videoCodec,
                    audio_status: audioStatus,
                    video_status: videoStatus,
                };

                const msgRecordBot = {
                    meeting_id: JSON.stringify(currentMeeting.roomId),
                    audio_codec: currentMeeting.audioCodec,
                    display: 'recordBot',
                    feed_id: JSON.stringify(imJanusID),
                    video_codec: currentMeeting.videoCodec,
                    audio_status: audioStatus,
                    video_status: videoStatus,
                };

                sendMessageSignalR(isBot ? msg : msgRecordBot, 'ConnectionStream')
            };

            sendMsgSocketConnectToJoin();
            firstRenderRef.current = false; // нужно для того чтоб только один раз отправить информацию
        }
    }, [statusConnectionSignalR, webRTCStatus, imJanusID, localStorage.getItem(enumLocalStorage.ACCESS_TOKEN)]);

    useEffect(() => {
        if (statusConnectionSignalR && webRTCStatus && imJanusID && currentMeeting?.roomId) {
            const msg = {
                meeting_id: JSON.stringify(currentMeeting.roomId),
                feed_id: JSON.stringify(imJanusID),
                audio_status: audioStatus,
                video_status: videoStatus || screenCaptureStatus,
            };
            sendMessageSignalR(msg, 'UpdateMediaStatus')
        }
    }, [statusConnectionSignalR, webRTCStatus, imJanusID, audioStatus, videoStatus, screenCaptureStatus]);

    // ### Подписываемся на события сокетов signalR ### //
    useSignalREvents(statusConnectionSignalR, dispatch);
    // ### ################################################ ### //

    // ### Подписываемся на события уничтожения комнаты ### //
    useEffect(() => {
        if (destroyedRoom) {
            dispatch(reducerDestroyedRoom(false));
            resetGlobalState().then();
            localStorage.removeItem('destroyedRoom');
            navigate(-1);
        }
    }, [destroyedRoom]);
    // ### ################################################ ### //

    // ### Обработка режима рации и вкл/выкл микрофона по нажатию на пробел ### //
    useKeyboardEvents({ audioStatus, dispatch })
    // ### ################################################ ### //

    const switchOfferStatus = (status: boolean) => {
        setOfferStatus(status);
    };

    const switchJoinStatus = (status: boolean) => {
        setJoinStatus(status);
    };

    const switchShareStatus = useCallback(
        (status: boolean) => {
            dispatch(switchSare(status));
        },
        [dispatch, switchSare],
    );

    const handlerSetLocalClient = (data: IStreamLocal | null) => {
        setLocalStream(data);
    };

    const addNewClient = (client: any) => {
        setStreamsRemote((prev: any) => {
            if (prev?.find((i: any) => i.id === client.id)?.id === client.id) return [...prev];
            return [...prev, client];
        });
    };

    const addNewAudioClient = (client: any) => {
        setAudio((prev: any) => {
            if (prev?.find((i: any) => i.id === client.id)?.id === client.id) return [...prev];
            return [...prev, client];
        });
    };

    const errorCaptureCamera = useCallback((error: string | null) => {
        dispatch(reducerErrorMessageCaptureCamera(error));
    }, []);

    useEffect(() => {
        if (!leaving && typeof leaving !== 'number') return;
        // фильтруем массив участников по update те кто ушёл с флагом active = false
        const delFeedByMid: IFeedInformationJanusSubscription['streams'] = feedAllInfo.filter((i) => i['active'] === false);

        // удаляем участники из массива у чистим треки
        delFeedByMid.map((feedToDelete) => {
            setStreamsRemote((previousStreams: { id: string }[]) => {
                return previousStreams.filter(({ id }) => id !== feedToDelete.mid);
            });
            setAudio((previousAudio: { id: string }[]) => {
                return previousAudio.filter(({ id }) => id !== feedToDelete.mid);
            });
        });

        // удаляем участники из массива общего колл участников
        setTotalFeedsInfo((prev: any) => prev.filter((feedID: any) => feedID.id !== leaving));

        // обнуляем ID ушедшего участника
        setLeaving(null);
        totalFeed.current !== 0 && totalFeed.current--;
    }, [feedAllInfo, leaving]);

    useEffect(() => {
        dispatch(turnServerFetchingData());
    }, []);

    useEffect(() => {
        if (turnServerError) {
            dispatch(reducerStatusConnectWebRtc('Не удалось связаться с Turn сервером... Напишите нам в поддержку!'));
        }
    }, [turnServerError]);

    useEffect(() => {
        if (currentMeeting?.roomId && statusConnectionSignalR && location?.state?.role === "guest" && currentMeeting.isWebinar) {
            console.log('логика только подписки')
            const msg = {
                "meeting_id": currentMeeting.roomId.toString()
            }
            sendMessageSignalR(msg, 'GetAllLeadersInWebinarAsync')
        }

    }, [currentMeeting?.roomId, statusConnectionSignalR])

    const startJanusServerRoom = useCallback(() => {
        if (!currentMeeting
            || dataTurnServer === null
            || turnServerError
            || user?.userName === undefined
        ) return;

        Janus.init({
            debug: 'false',
            callback: () => {
                janus.current = new Janus({
                    server: server,
                    iceServers: [
                        {
                            url: `turn:${dataTurnServer.turnServer}:${dataTurnServer.turnPort}?transport=${dataTurnServer.turnType}`,
                            credential: dataTurnServer.turnUser,
                            username: dataTurnServer.turnPwd,
                        },
                    ],
                    success: () => {
                        janusAttach(
                            janus,
                            opaqueId,
                            setFeedAllInfo,
                            currentMeeting.roomId,
                            remoteFeed,
                            addNewClient,
                            addNewAudioClient,
                            handlerSetLocalClient,
                            setLeaving,
                            sfuRef,
                            switchJoinStatus,
                            webRTCStatus,
                            user?.firstname,
                            setTotalFeedsInfo,
                            totalFeed,
                        );
                    },
                    error: (error: typeof Error) => {
                        dispatch(reducerStatusConnectWebRtc('### START JANUS ERROR ### Напишите нам в поддержку!'));
                        console.log('### START JANUS ERROR ###', error);
                        setTimeout(() => {
                            navigate('/')
                        }, 5 * 1000)
                    },
                    destroy: () => {
                        console.log('destroy');
                    },
                });
            },
        });
    }, [currentMeeting, janusAttach, user?.userName, opaqueId, webRTCStatus, dataTurnServer, isLoading]);

    useEffect(() => {
        if (!deviceInitError) return;
        setNotifications([{ body: 'Кажется у Вас нет микрофона и камеры, вас не видят и не слышат', severity: 'error' }]);
    }, [deviceInitError]);

    useEffect(() => {
        if (isMobile || webRTCPacketLoss === null) return;
        setNotifications([
            { body: `Нестабильное соединение${videoStatus ? ', попробуйте выключить камеру' : ''}`, severity: 'warning' },
        ]);
    }, [webRTCPacketLoss]);

    useEffect(() => {
        if (errorMessageCaptureCamera === null) return;
        setNotifications([{ body: 'Кажется ваша камера используется в другом браузере', severity: 'error' }]);
        errorCaptureCamera(null);
    }, [errorCaptureCamera, errorMessageCaptureCamera]);

    useEffect(() => {
        let messages: IAlertMessage[] = [];

        if (changedDevicesList?.audioInput.length)
            changedDevicesList.audioInput.map(
                (device) =>
                    (messages = [
                        ...messages,
                        { body: `В системе обнаружен новый микрофон - ${device.label}`, severity: 'info' },
                    ]),
            );

        if (changedDevicesList?.videoInput.length)
            changedDevicesList.videoInput.map(
                (device) =>
                    (messages = [...messages, {
                        body: `В системе обнаружена новая камера - ${device.label}`,
                        severity: 'info'
                    }]),
            );

        if (messages.length) setNotifications(messages);
    }, [changedDevicesList]);

    useEffect(() => {
        if (meetingHash) {
            dispatch(meetingFetch(meetingHash)).then();
        }
    }, [dispatch, meetingHash]);

    useEffect(() => {
        //Проверка на то проинициализировались ли устройства и, подключился ли janus к комнате
        //и следующий вызов не сработает до тех пор, пока webRTC не установит соединение
        //TODO: Добавить обработку если webRTC не подключился (в том случе если требуется повторная полная отправка офера, а не его
        // переопределение)
        if (selectedDevices.initStatus && sfuRef.current && joinStatus && offerStatus === webRTCStatus) {
            publishOwnFeed({
                offerStatus,
                selectedDevices,
                sfuRef,
                switchOfferStatus,
                switchShareStatus,
                canvasRefEl,
                startSharingScreen: shareStatus,
                videoStatus,
                audioStatus,
                errorCaptureCamera,
                videoPermission,
            });
        }
    }, [
        selectedDevices,
        joinStatus,
        shareStatus,
        offerStatus,
        webRTCStatus,
        switchShareStatus,
        videoStatus,
        errorCaptureCamera,
        videoPermission,
    ]);

    useEffect(() => {
        if (currentMeeting && !error && !janus.current && user && !turnServerError) {
            console.debug('***** ИНИЦИАЛИЗАЦИЯ JANUS *****');
            dispatch(reducerStatusConnectWebRtc('Готовлю устройства для входа в комнату'));
            startJanusServerRoom();
        }
        if (error) navigate('/rooms');
    }, [currentMeeting, error, navigate, startJanusServerRoom, user]);

    useEffect(() => {
        if (!offerStatus) return;

        muteAudioTracks(audioStatus, sfuRef);
    }, [audioStatus, offerStatus]);

    const mobileRender = () => (
        <>
            <Stack width="100vw">
                <MobileMeetingHeader toggleSidebar={toggleSidebar} setMobileDeviceSettings={setMobileDeviceSettings}/>
                <MobileVideoGridContainer
                    webRTCStatus={webRTCStatus}
                    feedAllInfo={feedAllInfo}
                    streamsRemote={streamsRemote}
                    audioState={audioState}
                    localStream={localStream ?? null}
                    videoStatus={videoStatus}
                    audioStatus={audioStatus}
                    meetingHash={meetingHash}
                />
                <MobileMeetingOverlay
                    sfuRef={sfuRef}
                    meetingHash={meetingHash}
                    user={user}
                    mobileDeviceSettings={mobileDeviceSettings}
                    setMobileDeviceSettings={setMobileDeviceSettings}
                    webRTCPacketLoss={webRTCPacketLoss}
                />
            </Stack>
            <MobileMeetingSidebar
                visible={rightMenuVisible}
                sendChatMessage={sendChatMessage}
                toggleSidebar={toggleSidebar}
            />
        </>
    );

    const desktopRender = () => (
        <>
            <Stack width="100vw">
                <VideoGridContainer
                    audioState={audioState}
                    feedAllInfo={feedAllInfo}
                    localStream={localStream ?? null}
                    streamsRemote={streamsRemote}
                    webRTCStatus={webRTCStatus}
                    sidebar={rightMenuVisible}
                    totalFeedsInfo={totalFeedsInfo}
                    remoteFeed={remoteFeed}
                />
                <MeetingOverlay
                    sidebarVisible={rightMenuVisible}
                    user={user}
                    sfuRef={sfuRef}
                    devicesSettings={devicesSettings}
                    meetingHash={meetingHash}
                    toggleSidebar={toggleSidebar}
                    toggleSettingSidebar={toggleSettingSidebar}
                />
            </Stack>
            <MeetingSidebar
                visible={rightMenuVisible}
                devicesSettingsMenu={devicesSettings}
                meetingHash={meetingHash}
                sendChatMessage={sendChatMessage}
            />
        </>
    );

    return (
        <>
            <AlertNotifications messages={notifications}/>
            <Stack direction="row" height={isMobile ? `${document.documentElement.clientHeight}px` : '100vh'}>
                {(!videoStatus || selectedDevices.videoInput === null || shareStatus) && (
                    <canvas ref={canvasRefEl} style={{ width: 0, height: 0 }}/>
                )}
                {!queryMobileViewer ? mobileRender() : desktopRender()}
            </Stack>
        </>
    );
};