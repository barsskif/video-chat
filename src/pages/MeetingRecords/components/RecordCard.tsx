//helper
import { convertData } from '../../../helpers/convertData';

//components
import { FileDownloadComponent } from '../components/FileDownloadComponent';

// mui
import { Grid } from '@mui/material';
import { Box } from '@mui/system';

// styles
import { DateAndTimeStyles, RecordTitleStyles } from '../MeetingRecordsStyles';
import { styled } from '@mui/material/styles';

// types
import { IUserMeetingsRecordMessage } from 'types/share';

interface IMeetingRecordProps {
  id: IUserMeetingsRecordMessage['id'];
  createdAt: IUserMeetingsRecordMessage['createdAt'];
  url: IUserMeetingsRecordMessage['url'];
  recordName: IUserMeetingsRecordMessage['recordName'];
  body: IUserMeetingsRecordMessage['body'];
  userId: number | undefined;
}

export const MeetingRecord = ({ id, createdAt, url, recordName, body, userId }: IMeetingRecordProps) => {
  const { convertedData, convertedDataStart } = convertData(createdAt);

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      flexWrap="nowrap"
      sx={{ marginBottom: '10px' }}
    >
      <Box>
        <ImgPrev alt="prev" src={'https://klike.net/uploads/posts/2019-12/1576487087_1.jpg'} />
      </Box>

      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ height: 'inherit', padding: '0 0 10px 30px' }}
      >
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <DateAndTimeStyles>
            {convertedData} {convertedDataStart}
          </DateAndTimeStyles>
          <FileDownloadComponent url={url} id={id} userId={userId} />
        </Grid>
        <RecordTitleStyles>{recordName}</RecordTitleStyles>
        <span>{body}</span>
      </Grid>
    </Grid>
  );
};

const ImgPrev = styled('img')(() => ({
  minHeight: '80px',
  minWidth: '115px',
  maxWidth: '20vw',
  maxHeight: '40vh',
}));
