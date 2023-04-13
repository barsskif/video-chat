import { FC, ChangeEvent, useState } from 'react';

// types
import { IMeetingPlanned } from 'types/share';

// mui
import { TableBody, TableContainer, Typography } from '@mui/material';
import TableMui from '@mui/material/Table';

// components
import { StyledPagination } from '../MeetingsPalnnedStyles';

// images
import { TableItem } from './TableItem';
import { isMobile } from 'react-device-detect';

interface IMeetingsPlannedCardProps {
  meetings: IMeetingPlanned[];
  count: number;
}

export const Table: FC<IMeetingsPlannedCardProps> = ({ meetings, count }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(isMobile ? 3 : 6);

  const pageChangeHandler = (_: ChangeEvent<unknown>, pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = meetings.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(meetings.length / recordsPerPage);

  if (meetings.length === 0)
    return (
      <Typography textAlign="center" variant="h2">
        Записей пока нет
      </Typography>
    );
  return (
    <>
      <TableContainer>
        <TableMui sx={{ position: 'relative' }}>
          <TableBody>
            {currentRecords.slice(0, count).map((meeting) => (
              <TableItem meeting={meeting} key={meeting.hashRoom} />
            ))}
          </TableBody>
        </TableMui>
        {count > 3 ? (
          <StyledPagination
            defaultPage={1}
            hideNextButton={true}
            hidePrevButton={true}
            count={nPages}
            page={currentPage}
            onChange={(_, pageNumber) => pageChangeHandler(_, pageNumber)}
          />
        ) : (
          <></>
        )}
      </TableContainer>
    </>
  );
};
