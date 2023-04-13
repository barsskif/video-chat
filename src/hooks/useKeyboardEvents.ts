import { Dispatch, useCallback, useEffect } from 'react';
import { VideoSettingsSlice } from "store/reducers/VideoSettingsSlice";

interface IKeyboardEventsProps {
  audioStatus: boolean;
  // eslint-disable-next-line
  dispatch: Dispatch<any>;
}

export const useKeyboardEvents = ({ audioStatus, dispatch }: IKeyboardEventsProps) => {
  const {  switchAudio } = VideoSettingsSlice.actions;

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    handleKeyEvent(event, true);
  }, []);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    handleKeyEvent(event, false);
  }, []);

  const handleKeyEvent = useCallback((event: KeyboardEvent, isKeyDown: boolean) => {
    const localName = event?.target as HTMLElement;
    if (event.code === 'Space' && localName.localName === 'body') {
      dispatch(switchAudio(isKeyDown ? event.repeat : !audioStatus));
    }
  }, [audioStatus, dispatch]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);
};