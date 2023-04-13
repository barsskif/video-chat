import { useEffect } from 'react';

export const useWakeLock = (): void => {
  useEffect(() => {
    let wakeLock: any = null;

    const requestWakeLock = async (): Promise<void> => {
      if ('wakeLock' in navigator) {
        try {
          // @ts-ignore
          wakeLock = await navigator.wakeLock.request('screen');
          console.info('on lock screen')
        } catch (err) {
          // @ts-ignore
          console.error(`${err.name}, ${err.message}`);
        }
      }
    };

    const releaseWakeLock = async (): Promise<void> => {
      if (wakeLock !== null) {
        try {
          await wakeLock.release();
          console.info('off lock screen')
        } catch (err) {
          // @ts-ignore
          console.error(`${err.name}, ${err.message}`);
        }
      }
    };

    const handleMount = async (): Promise<void> => {
      await requestWakeLock();
    };

    const handleUnmount = async (): Promise<void> => {
      await releaseWakeLock();
    };

    handleMount();

    return () => {
      handleUnmount();
    };
  }, []);
};