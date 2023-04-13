/* eslint-disable */
// react
import { MutableRefObject } from 'react';

// hooks
import { useAppDispatch } from 'hooks/redux';

import { DifferentStatesSlice } from 'store/reducers/DifferentStatesSlice';
import { useWebRTCOnDataHandler } from './useWebRTCOnDataHandler';
import { IFeedInformationJanusSubscription } from 'types/share';

export const useSubscribeTo = () => {
  const dispatch = useAppDispatch();
  const [webRTCDataHandler] = useWebRTCOnDataHandler();
  const { reducerRemoteWebRTCStatus } = DifferentStatesSlice.actions;

  const subscribeTo = (
    creatingSubscription: any,
    janus: any,
    opaqueId: any,
    remoteFeed: any,
    myroom: any,
    subscriptions: any,
    addNewClient: any,
    addNewAudioClient: any,
    setFeedAllInfo: any,
    webRTCStatus: boolean,
    setTotalFeedsInfo: any,
    totalFeed: MutableRefObject<number>,
  ) => {

    const subscribeToRemoteTracks = (subscriptions: any[]) => {
      const subscriptionRemoteTracks = [];

      for (let index = 0; index < subscriptions.length; index++) {
        const remoteFeed = subscriptions[index];
        const remoteFeedID = subscriptions[index]['id'];
        setTotalFeedsInfo((prev: any) => {
          return prev.some((el: IFeedInformationJanusSubscription) => el.id === remoteFeed.id)
              ? prev
              : [...prev, remoteFeed];
        });

        totalFeed.current++;

        for (let s in remoteFeed['streams']) {
          // TODO: после правок поставить значение в totalFeed.current >= 12
          // не подписываемся если колл участников больше чем нам нужно и тип video
          if (totalFeed.current >= 12 && remoteFeed['streams'][s]['type'] === 'video') continue;

          subscriptionRemoteTracks.push({
            feed: remoteFeedID,
            mid: remoteFeed['streams'][s]['mid'],
          });
        }
      }

      return subscriptionRemoteTracks;
    }


    console.debug('###### Начался процесс подписки на стримы тех кто в комнате ######');
    // дескриптор создается не сразу нужно проверить что он создан иначе попробовать снова думаю что проверять нужно каждые 1,5 сек
    if (creatingSubscription) {
      setTimeout(() => {
        subscribeTo(
          creatingSubscription,
          janus,
          opaqueId,
          remoteFeed,
          myroom,
          subscriptions,
          addNewClient,
          addNewAudioClient,
          setFeedAllInfo,
          webRTCStatus,
          setTotalFeedsInfo,
          totalFeed,
        );
      }, 1500);
      return;
    }

    if (remoteFeed.current) {
     const subscriptionRemoteTracksArr =  subscribeToRemoteTracks(subscriptions)

      remoteFeed.current.send({
        message: {
          request: 'subscribe',
          streams: subscriptionRemoteTracksArr,
        },
          
      });

      return;
    }

    creatingSubscription = true;
    if (!subscriptions.length && !webRTCStatus) return;
    janus.current.attach({
      plugin: 'janus.plugin.videoroom',
      opaqueId: opaqueId,
      success: (pluginHandle: any) => {
        remoteFeed.current = pluginHandle;

        const subscriptionRemoteTracksArr =  subscribeToRemoteTracks(subscriptions)

        const subscribe = {
          request: 'join',
          room: myroom,
          ptype: 'subscriber',
          streams: subscriptionRemoteTracksArr, // тут оправляем массив на кого нужно подписаться
          private_id: 1042493830, // НАШ ID, но как его использовать пока не знаю
        };

        remoteFeed.current.send({ message: subscribe });
      },

      error: (error: typeof Error) => {
        console.log('🚀 =====> error', error);
      },

      iceState: (state: any) => {
        console.info('iceState ===> ', state)},

      webrtcState: (on: any) => {
        console.log('webrtcState', on);
        dispatch(reducerRemoteWebRTCStatus(on));
      },

      slowLink: (uplink: any, lost: any, mid: any) => {
        console.log('slowLink Проблемы с медиа сервером ==>> ', 'uplink >>> :', uplink, 'lost >>> :', lost, 'mid >>> :', mid)
      },

      onmessage: (msg: any, jsep: any) => {
        const event = msg['videoroom'];

        if (event) {
          if (event === 'attached') {
            creatingSubscription = false;
            setFeedAllInfo(msg['streams']);
          }

          if (event === 'updated') {
            if(!msg['streams']) return
            setFeedAllInfo(msg['streams']);
          }

          if (jsep) {
            remoteFeed.current.createAnswer({
              jsep: jsep,
              media: { audioSend: false, videoSend: false, data: true }, // We want recvonly audio/video
              success: (jsep: any) => {
                const body = { request: 'start', room: myroom };
                remoteFeed.current.send({ message: body, jsep: jsep });
              },
              error: (error: typeof Error) => {
                console.error(error);
              },
            });
          }
        }
      },

      onremotetrack: (track: any, mid: any, added: any) => {
        console.log("🚀 =====> track:", track)
        if (!added) return;
        if (track.kind === 'audio') {
          const audioStream = new MediaStream([track]);

          addNewAudioClient({ id: mid, audioStream, type: track.kind, track });
        }

        if (track.kind === 'video') {
          console.log('🚀 =====> track start', track?.readyState);
          const stream = new MediaStream([track]);

          addNewClient({ id: mid, stream, type: track.kind, track });
        }
      },
      oncleanup: () => {},
      ondataopen: () => {
        //TODO: здесь получаем статус подключения
      },
      ondata: (data: string) => webRTCDataHandler(data),
    });
     
  };

  return [subscribeTo];
};
