import { Button, Grid } from '@mui/material';

import styled from '@emotion/styled';

export const StyledBtnSave = styled(Button)(() => ({
  borderRadius: '8px',
  width: '162ix',
  height: '52px',
}));

export const StyledBtnUploadAvatar = styled('div')(({ isVisible }: { isVisible?: boolean }) => ({
  display: isVisible ? 'block' : 'none',
  position: 'relative',
  width: 'inherit',
  height: 'inherit',
  top: '-110px',
  borderRadius: '50%',
  background: 'rgba(0, 0, 0, 0.4)',
}));

export const StyledGridWrap = styled(Grid)(() => ({
  paddingTop: '20vh',
}));

export const StyledEditTitle = styled('span')(() => ({
  display: 'flex',
  justifyContent: 'flex-end ',
  width: '100%',
  marginBottom: '15px',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '19px',
  color: '#007DFE',
  '&:hover': {
    cursor: 'pointer',
  },
}));

export const StyledWrapBtnSave = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'flex-end ',
  width: '100%',
}));

export const StyledAvatarWrap = styled('div')(() => ({
  width: 110,
  height: 110,
  cursor: 'pointer',
}));

export const StyledEditBtnAvatar = styled('span')(() => ({
  width: 'inherit',
  height: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));
