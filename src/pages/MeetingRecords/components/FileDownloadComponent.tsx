// hooks
import React from 'react';

import { useAppDispatch } from 'hooks/redux';

import { getRecordDownload } from 'store/actions/ActionDownloadRecord';
import { deleteRecordByServer } from 'store/actions/ActionDelete';

// mui
import { Box, IconButton } from '@mui/material';

// icons
import { ReactComponent as DownloadRecordSvg } from '../../../images/DownloadRecordSvg.svg';
import { ReactComponent as DeleteRecordSvg } from '../../../images/DeleteRecordSvg.svg';

// types
import { IUserMeetingsRecordMessage } from 'types/share';

interface IFileDownloadComponentProps {
  url: IUserMeetingsRecordMessage['url'];
  id: IUserMeetingsRecordMessage['id'];
  userId: number | undefined;
}

export const FileDownloadComponent = ({ url, id, userId }: IFileDownloadComponentProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const handleRecordFileDownload = async () => {
    console.log('download', url);
    if (!url) return;
    const name = url.split('/').at(-1);
    dispatch(getRecordDownload(JSON.stringify(id), name as string));
  };

  const handleDeleteRecord = () => {
    dispatch(deleteRecordByServer(JSON.stringify(id), userId));
  };

  return (
    <Box>
      <IconButton onClick={handleRecordFileDownload}>
        <DownloadRecordSvg />
      </IconButton>
      <IconButton onClick={handleDeleteRecord}>
        <DeleteRecordSvg />
      </IconButton>
    </Box>
  );
};
