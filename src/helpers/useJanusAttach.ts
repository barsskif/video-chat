/* eslint-disable */

import { Dispatch, SetStateAction, useRef, MutableRefObject } from 'react';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { DifferentStatesSlice } from 'store/reducers/DifferentStatesSlice';
import { useSubscribeTo } from './useSubscribeTo';
import { IStreamLocal, TypeJsep } from 'types/janusTypes';

export const useJanusAttach = () => {
    const dispatch = useAppDispatch();
    const {currentMeeting} = useAppSelector(state => state.MeetingReducer)
    const [subscribeTo] = useSubscribeTo();
    const {
        addTalkingFeed,
        deleteTalkingFeed,
        reducerImJanusID,
        reducerWebRTCStatus,
        reducerDestroyedRoom,
        reducerScreenCaptureStatus,
        reducerStatusConnectWebRtc,
    } = DifferentStatesSlice.actions;

    const prevLocalStreamRef = useRef<MediaStreamTrack>();

    const janusAttach = (
        janus: any,
        opaqueId: string,
        setFeedAllInfo: any,
        myRoom: number,
        remoteFeed: any,
        addNewClient: any,
        addNewAudioClient: any,
        handlerSetLocalClient: (data: IStreamLocal | null) => void,
        setLeaving: Dispatch<SetStateAction<number | null>>,
        sfuRef: any,
        switchJoinStatus: (status: boolean) => void,
        webRTCStatus: boolean,
        myUserName: string | undefined,
        setTotalFeedsInfo: Dispatch<SetStateAction<never[]>>,
        totalFeed: MutableRefObject<number>,
    ) => {
        janus.current.attach({
            plugin: 'janus.plugin.videoroom',
            opaqueId: opaqueId,
            success: (pluginHandle: any) => {
                sfuRef.current = pluginHandle;
                const register = {
                    request: 'join',
                    room: myRoom,
                    ptype: 'publisher',
                    display: myUserName,
                };

                const registerSubscribe = {
                    request: 'join',
                    room: myRoom,
                    ptype: 'subscriber',
                    feed: 3454312044152474,
                }

                sfuRef.current.send({ message: register });
            },

            error: () => {
            },

            consentDialog: () => {
            },

            iceState: () => {
                dispatch(reducerStatusConnectWebRtc('Проверяем возможность подключения к комнате...'));
            },

            mediaState: (medium: any, on: boolean, mid: string) => {
                console.debug(
                    'Janus ' + (on ? 'стартовал' : 'остановлен') + ' получение нашего ' + medium + ' (mid=' + mid + ')',
                );
            },

            webrtcState: (on: boolean) => {
                console.debug('WebRTC PeerConnection ' + (on ? 'поднят' : 'упал') + ' сейчас');
                dispatch(reducerStatusConnectWebRtc('Подключения к комнате...'));
                // ================================= Настройка битрейта ============================== //

                sfuRef.current.send({ message: { request: 'configure', bitrate: 2000000 } }); // на данный момент самое актуальное значение

                // ===================================== end ========================================= //
                setTimeout(() => {
                    dispatch(reducerWebRTCStatus(on));
                    dispatch(reducerStatusConnectWebRtc(null));
                }, 1000);
            },

            slowLink: (uplink: boolean, lost: number, mid: string) => {
                // ============== Нужно для отладки в последующем можно просто отключить ============= //
                console.error(
                    'Janus сообщает о проблемах ' +
                    (uplink ? 'отправка' : 'получение') +
                    ' пакеты на mid ' +
                    mid +
                    ' (' +
                    lost +
                    ' потерянные пакеты)',
                );
                // ===================================== end ========================================= //
            },

            onmessage: (msg: any, jsep: TypeJsep) => {

                const event = msg['videoroom'];
                const leaving = msg['leaving'];
                const unpublished = msg['unpublished'];

                // проверка на null и undefined
                if (event == null) return;

                switch (event) {
                    case 'talking':
                        const idTalking: number = msg['id'];
                        dispatch(addTalkingFeed(idTalking));
                        break;

                    case 'stopped-talking':
                        dispatch(deleteTalkingFeed(msg['id']));
                        break;

                    case 'joined':
                        switchJoinStatus(true);
                        dispatch(reducerImJanusID(msg['id']));
                        break;

                    default:
                        break;
                }

                if (unpublished) {
                    setLeaving(msg['unpublished']);
                }

                if (leaving) {
                    setLeaving(msg['leaving']);
                }

                if (msg['publishers']) {
                    const subscriptions = [];

                    for (let key in msg['publishers']) {
                        const publisher = msg['publishers'][key];
                        subscriptions.push(publisher);
                    }

                    let creatingSubscription = false;
                    subscribeTo(
                        creatingSubscription,
                        janus,
                        opaqueId,
                        remoteFeed,
                        myRoom,
                        subscriptions,
                        addNewClient,
                        addNewAudioClient,
                        setFeedAllInfo,
                        webRTCStatus,
                        setTotalFeedsInfo,
                        totalFeed,
                    );
                }

                if (event === 'destroyed') {
                    console.info('Комната уничтожена!');
                    dispatch(reducerDestroyedRoom(true));
                }

                if (jsep) sfuRef.current.handleRemoteJsep({ jsep: jsep });
            },

            onlocaltrack: (track: MediaStreamTrack , on: boolean) => {
                if (prevLocalStreamRef.current) prevLocalStreamRef.current.stop();

                if (on) {
                    const stream: MediaStream = new MediaStream([track]);

                    if (track.kind === 'video') {

                        const captureScreen = ['screen', 'window', 'web-contents-media-stream'].some(str => track.label.includes(str));

                        dispatch(reducerScreenCaptureStatus(captureScreen));
                        prevLocalStreamRef.current = track;
                        handlerSetLocalClient({ id: 'me', stream, type: track.kind, track });
                    }
                } else {
                    handlerSetLocalClient(null);
                }

                if (
                    sfuRef.current.webrtcStuff.pc.iceConnectionState !== 'completed' &&
                    sfuRef.current.webrtcStuff.pc.iceConnectionState !== 'connected'
                ) {

                    dispatch(reducerStatusConnectWebRtc('Подключения к серверу ...'));
                    console.debug('###########    Подключения к серверу прошло удачно, сервер работает стабильно!   ###########');
                }
            },
        });
    };

    return [janusAttach];
};
