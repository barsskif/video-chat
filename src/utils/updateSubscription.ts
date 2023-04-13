/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { IFeedInformationJanusSubscription } from 'types/share';

export const updateSubscription = (
  toggle: string,
  subarrayFeed: [] | IFeedInformationJanusSubscription[][],
  itemSubArrSubscription: number,
  setItemSubArrSubscription: Dispatch<SetStateAction<number>>,
  remoteFeed: MutableRefObject<any>,
): void => {
  switch (toggle) {
    case 'forward': {
      console.log('forward');
      if (!subarrayFeed[itemSubArrSubscription + 1]) return;

      setItemSubArrSubscription((prev: number) => prev + 1);

      const unsubscribeArr = subarrayFeed[itemSubArrSubscription].map((el: IFeedInformationJanusSubscription) => {
        return {
          feed: el.id,
          mid: '1',
        };
      });

      const subscribeArr = subarrayFeed[itemSubArrSubscription + 1].map((el: IFeedInformationJanusSubscription) => {
        return {
          feed: el.id,
          mid: '1',
        };
      });

      const update = {
        request: 'update',
        unsubscribe: unsubscribeArr,
        subscribe: subscribeArr,
      };
      if (remoteFeed.current != null) remoteFeed.current.send({ message: update });

      break;
    }

    case 'back': {
      console.log('back');
      if (itemSubArrSubscription === 0) return;
      setItemSubArrSubscription((prev: number) => prev - 1);
      
      if (Math.sign(itemSubArrSubscription) === -1) return setItemSubArrSubscription(0);

      const unsubscribeArr = subarrayFeed[itemSubArrSubscription].map((el: IFeedInformationJanusSubscription) => {
        return {
          feed: el.id,
          mid: '1',
        };
      });

      const subscribeArr = subarrayFeed[itemSubArrSubscription - 1].map((el: IFeedInformationJanusSubscription) => {
        return {
          feed: el.id,
          mid: '1',
        };
      });

      const update = {
        request: 'update',
        unsubscribe: unsubscribeArr,
        subscribe: subscribeArr,
      };

      if (remoteFeed.current != null) remoteFeed.current.send({ message: update });
      return;
    }
    default:
      return;
  }
};
