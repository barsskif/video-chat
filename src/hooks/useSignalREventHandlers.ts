/* eslint-disable @typescript-eslint/no-explicit-any */
import { HubConnection } from '@microsoft/signalr';
import { Dispatch } from 'redux';
import { connection } from 'utils/SignalRSocket';
import { useEffect, useState } from "react";
import { SignalRSlice } from "store/reducers/SignalRSlice";

type EventHandlers<T> = { [eventName: string]: (msg: T) => any };

type EventHandlersMap = {
  IsShare: (e: unknown) => void;
  ConnectionStream: (msg: unknown) => void;
  UpdateMediaStatus: (msg: unknown) => void;
  DisconnectionStream: (msg: unknown) => void;
  ChangeRoleFeed: (msg: unknown) => void;
  Kick: (msg: unknown) => void;
};

const {
  reducerShareState,
  reducerMediaStatusFeeds,
  reducerUpdateStatusFeeds,
  reducerDisconnectFeed,
  reducerKickFeedId,
} = SignalRSlice.actions;

const useSignalREventHandlers = <T>(
    connection: HubConnection,
    eventHandlers: EventHandlers<T>,
    deps: any[] = [],
): void => {
  const [listeners, setListeners] = useState<{ eventName: string, listener: (msg: any) => void }[]>([]);

  useEffect(() => {
    if (!connection) return;

    const newListeners = Object.entries(eventHandlers).map(([eventName, handler]) => {
      const listener = (msg: any) => handler(msg);
      connection.on(eventName, listener);
      return { eventName, listener };
    });

    setListeners(newListeners);

    return () => {
      listeners.forEach(({ eventName, listener }) => connection.off(eventName, listener));
    };
  }, [connection, ...deps]);

  useEffect(() => {
    return () => {
      listeners.forEach(({ eventName, listener }) => connection.off(eventName, listener));
    };
  }, []);
};

export const useSignalREvents = (statusConnectionSignalR: boolean | string, dispatch: Dispatch) => {
  useSignalREventHandlers<EventHandlersMap>(connection, {
    'IsShare': (e) => dispatch(reducerShareState(e)),
    'ConnectionStream': (msg) => dispatch(reducerMediaStatusFeeds(msg)),
    'UpdateMediaStatus': (msg) => dispatch(reducerUpdateStatusFeeds(msg)),
    'DisconnectionStream': (msg) => dispatch(reducerDisconnectFeed(msg)),
    'ChangeRoleFeed': (msg) => dispatch(reducerMediaStatusFeeds(msg)),
    'Kick': (msg) => dispatch(reducerKickFeedId(msg[0][0]['feed_id'])),
  }, [statusConnectionSignalR, dispatch]);
};
