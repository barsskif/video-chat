import { useEffect, ChangeEvent, useState } from 'react';

// hooks
import { useAppDispatch, useAppSelector } from 'hooks/redux';

//redux
import { getMeetingRecord } from 'store/reducers/ActionCreate';

//hocs
import appLayout from '../../hocs/appLayout';

//components
import { StyledCircularProgress } from 'components/StyledComponents';

// mui
import { Grid, IconButton } from '@mui/material';

// styles
import { SortTitleStyles, StyledGridWrap, StyledPagination } from './MeetingRecordsStyles';

// images
import { ReactComponent as IconSortSvg } from '../../images/SortIcon.svg';

// types
import { IUserMeetingsRecordMessage } from 'types/share';
import { MeetingRecord } from './components/RecordCard';
import { LinearWithValueLabel } from './components/LinearProgressDownload';

export const MeetingRecords = appLayout(() => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useAppSelector((state) => state.UserMeetingsRecordsReducer);
  const { user } = useAppSelector((state) => state.SingInReducer);
  const { loadingPercentage } = useAppSelector((state) => state.RecordDownloadReducer);

  const [toggleSortOrder, setToggleSortOrder] = useState<boolean>(false);

  const pageChangeHandler = (_: ChangeEvent<unknown>, pageNumber: number) => {
    if (!user || !user.userId) return;
    dispatch(getMeetingRecord(user.userId, pageNumber));
  };

  const fetchMeetingRecords = () => {
    if (!user || !user.userId) return;
    dispatch(getMeetingRecord(user.userId, 1));
  };

  useEffect(() => {
    fetchMeetingRecords();
  }, []);

  if (isLoading) <StyledCircularProgress />;

  return (
    <StyledGridWrap padding={{ xs: '13vh 15px 0px 15px', sm: '10vh 75px 0px 75px' }}>
      {loadingPercentage !== null && <LinearWithValueLabel loadingPercentage={loadingPercentage} />}
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        {!data?.message?.length ? 'У Вас нет записей!' : 'Записи встреч'}
        <Grid container direction="row" justifyContent="flex-start" alignItems="center" sx={{ width: 'auto' }}>
          <IconButton onClick={() => setToggleSortOrder((prev) => !prev)}>
            <IconSortSvg style={{ transform: toggleSortOrder ? 'rotateX(180deg)' : 'rotateX(0deg)' }} />
          </IconButton>

          <SortTitleStyles>{toggleSortOrder ? 'По дате по убывания' : 'По дате по возрастания'}</SortTitleStyles>
        </Grid>
      </Grid>
      <Grid sx={{ maxHeight: '100%', overflow: 'auto' }}>
        {data?.message.map(({ id, createdAt, url, recordName, body }: IUserMeetingsRecordMessage) => (
          <MeetingRecord
            key={id}
            id={id}
            createdAt={createdAt}
            url={url}
            recordName={recordName}
            body={body}
            userId={user?.userId}
          />
        ))}
      </Grid>
      {data?.message && (
        <StyledPagination
          defaultPage={1}
          hideNextButton={true}
          hidePrevButton={true}
          count={Math.ceil(data?.totalCount / 3)}
          page={data?.pageNumber || 1}
          onChange={(_, pageNumber) => pageChangeHandler(_, pageNumber)}
        />
      )}
    </StyledGridWrap>
  );
});
