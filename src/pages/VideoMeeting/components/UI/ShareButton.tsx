import React, { useMemo } from 'react';

// mui
import { Tooltip } from '@mui/material';

import { ColorizerSVG, SquareButton } from '../../../../components/StyledComponents';

import { ReactComponent as ShareIcon } from '../../../../images/Share.svg';
import { useAppDispatch } from 'hooks/redux';
import { ISendAddShare } from 'types/share';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit/dist/createAction';

enum buttonsLegend {
  serverConnecting = 'Идет подключения к серверу',
  onShare = 'Начать демонстрацию своего экрана',
  offShare = 'Закончить демонстрацию экрана',
}

interface IShareButtonProps {
  imJanusID: number | null;
  queryMobileViewer: boolean;
  shareState: ISendAddShare;
  shareStatus: boolean;
  switchSare: ActionCreatorWithPayload<boolean, 'videoSettings/switchSare'>;
  webRTCStatus: boolean;
}

export const ShareButton = ({
  imJanusID,
  queryMobileViewer,
  shareState,
  shareStatus,
  switchSare,
  webRTCStatus,
}: IShareButtonProps) => {
  const dispatch = useAppDispatch();
  const canShare = () => {
    return shareState?.isShare && JSON.stringify(imJanusID) !== shareState?.feed_id;
  };

  const { disabled, legend } = useMemo(() => {
    if (canShare()) {
      return { disabled: true, legend: buttonsLegend.serverConnecting };
    }
    if (!webRTCStatus) {
      return { disabled: true, legend: buttonsLegend.serverConnecting };
    }
    if (shareStatus) {
      return { disabled: false, legend: buttonsLegend.offShare };
    }
    return { disabled: false, legend: buttonsLegend.onShare };
  }, [canShare, shareStatus, webRTCStatus]);

  const switchSareHandler = () => {
    dispatch(switchSare(!shareStatus));
  };

  if (!queryMobileViewer) {
    return null;
  }

  return (
    <Tooltip title={legend}>
      <span>
        {shareStatus ? (
          <SquareButton disabled={disabled} onClick={switchSareHandler} color="primary">
            <ColorizerSVG color="active">
              <ShareIcon width="21px" height="17.5px" />
            </ColorizerSVG>
          </SquareButton>
        ) : (
          <SquareButton disabled={disabled} onClick={switchSareHandler}>
            <ColorizerSVG>
              <ShareIcon width="21px" height="17.5px" />
            </ColorizerSVG>
          </SquareButton>
        )}
      </span>
    </Tooltip>
  );
};
