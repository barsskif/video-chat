/* eslint-disable */

export type TypeJanus = any;
export type TypeSfu = any;
export type TypeJsep = any;

export interface IFeedInfo {
  active: boolean;
  codec?: string;
  feed_display?: string;
  feed_id?: number;
  feed_mid?: string;
  mid: string;
  mindex: number;
  ready: boolean;
  send: boolean;
  type: 'audio' | 'video' | string;
}

export interface IAudioState {
  audioStream: MediaStream;
  id: string;
  track: MediaStreamTrack;
  type: 'audio' | string;
}

export interface IStreamRemote {
  id: string;
  stream: MediaStream;
  track: MediaStreamTrack;
  type: 'video' | string;
}

export interface IStreamLocal {
  id: string;
  stream: MediaStream;
  track: MediaStreamTrack;
  type: 'video' | string;
}

export interface ILocalTracksInfo {
  id: string;
  label: string;
  mid: string;
  type: 'audio' | 'video';
}
