import * as signalR from '@microsoft/signalr';
import { ISendAddShare, IStartRecord, IUpdateMediaStatus, TypeMsg } from 'types/share';

const url = import.meta.env.REACT_APP_SERVER_URL;

interface ISendAddNewFeed {
  meeting_id: string | undefined;
  audio_codec?: string;
  display: string;
  feed_id: string | null;
  video_codec?: string;
  audio_status?: boolean;
  video_status?: boolean;
}

interface IDisconnectionStream {
  meeting_id: string;
  feed_id: string;
}

interface IHandUp {
  meeting_id: string | null,
  feed_id: string,
  is_rise_hand: boolean,
}

interface IWebinarMsg{
  "meeting_id": "string",
  "janus_data": {
    "audio_codec": "string",
    "display": "string",
    "id": "string",
    "streams": [
      {
        "codec": "string",
        "mid": "string",
        "mindex": number,
        "type": "string"
      }
    ],
    "video_codec": "string"
  }
}

type ISendMessageSignalR = any | ISendAddNewFeed | ISendAddShare | IUpdateMediaStatus | IStartRecord | IDisconnectionStream | IHandUp

export const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${url}/streamHub`, {
    accessTokenFactory: () => localStorage.getItem('accessToken') as string | Promise<string>,
    // skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets,
  })
  // .configureLogging(signalR.LogLevel.Information)
  .configureLogging(signalR.LogLevel.None)
  .withAutomaticReconnect()
  .build();

export const sendMessageSignalR = async (message: ISendMessageSignalR, type: TypeMsg) => {
  await connection.invoke(type, message);
};
