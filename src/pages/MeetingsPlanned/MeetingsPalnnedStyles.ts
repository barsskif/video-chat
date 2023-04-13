import styled from '@emotion/styled';
import { Box, Menu, TableCell } from '@mui/material';

import Pagination from '@mui/material/Pagination';

export const StyledSpan = styled('span')(() => ({
  display: 'block',
  fontWeight: 700,
}));

export const StyledImgIcon = styled('img')(() => ({
  width: '20px',
  height: '20px',
  cursor: 'pointer',
}));

export const StyledMenu = styled(Menu)(() => ({
  '& .MuiPopover-paper': {
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(140, 99, 155, 0.3)',
  },
}));

export const StyledBoxBtns = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  minWidth: '10px',
}));

export const StyledTableCell = styled(TableCell)(() => ({
  fontSize: '16px',
  border: 'none',
  fontFamily: 'Jost',
}));

export const StyledPagination = styled(Pagination)(({ theme }) => ({
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
    backgroundColor: theme.palette.background.buttonSwitch,
    color: theme.palette.background.root,
  },
  position: 'absolute',
  bottom: '70px',
  left: '80px',
  ['@media (max-width:790px)']: {
    bottom: '10px',
  },
}));
