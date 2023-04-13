import { Box, Pagination } from '@mui/material';
import { styled } from '@mui/material/styles';
import { isMobile } from 'react-device-detect';

export const StyledGridWrap = styled(Box)(({ theme }) => ({
  padding: '85px 165px 0 165px',
  fontFamily: 'Jost',
  fontWeight: '700',
  fontSize: '32px',
  fontStyle: 'normal',
  color: theme.palette.text.title,
}));

export const DateAndTimeStyles = styled('span')(({ theme }) => ({
  fontFamily: 'Jost',
  fontSize: isMobile ? '14px' : '20px',
  fontWeight: 400,
  color: theme.palette.text.title,
}));

export const SortTitleStyles = styled('span')(({ theme }) => ({
  fontFamily: 'Jost',
  fontWeight: 400,
  fontSize: '16px',
  marginLeft: '10px',
  color: theme.palette.borders.light,
}));

export const RecordTitleStyles = styled('span')(({ theme }) => ({
  fontFamily: 'Jost',
  fontWeight: 700,
  fontSize: isMobile ? '14px' : '20px',
  color: theme.palette.text.title,
}));

export const StyledPagination = styled(Pagination)(({ theme }) => ({
  padding: '0px 0px 0px 0px',
  '& .MuiPaginationItem-root:hover': {
    backgroundColor: theme.palette.background.buttonSwitch,
    color: theme.palette.background.root,
  },
  '& .MuiPaginationItem-root': {
    color: theme.palette.background.buttonSwitch,
    backgroundColor: 'none',
    fontSize: '16px',
  },
  '& .MuiPaginationItem-root.Mui-selected': {
    backgroundColor: `${theme.palette.background.buttonSwitch} !important`,
    color: theme.palette.background.root,
  },
  ['@media (max-width:790px)']: {
    bottom: '10px',
  },
}));
