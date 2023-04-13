import { Box, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { isMobile } from 'react-device-detect';

export const StyledCreateJoinBlock = styled(Grid)(({ theme }) => ({
  background: theme.palette.background.buttonSwitch,
  width: '253px',
  height: '173px',
  borderRadius: '28px 8px 8px 28px',
  cursor: 'pointer',
  '&:hover': {
    background: theme.palette.background.buttonSwitch,
  },
  ['@media (max-width:390px)']: {
    borderRadius: '28px 28px 28px 28px',
  },
  ['@media (max-width:414px)']: {
    borderRadius: '28px 28px 28px 28px',
  },
}));

export const StyledCreateRoomTile = styled('span')(() => ({
  color: '#FFFFFF',
  fontFamily: 'Jost',
  fontWeight: 600,
  fontSize: '22px',
  marginBottom: '7px',
}));

export const StyledLimitTitle = styled('span')(() => ({
  color: 'rgba(255, 255, 255, 0.6)',
  fontFamily: 'Jost',
  fontWeight: 600,
  fontSize: '14px',
  marginBottom: '20px',
}));

export const StyledBtn = styled('div')<{ mb: string; br: string }>(({ mb, br, theme }) => ({
  width: '156px',
  height: '82px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.buttonPurple,
  borderRadius: br,
  marginBottom: mb,
  marginLeft: '9px',
  cursor: 'pointer',
  '&:hover': {
    boxShadow: '10px 10px 71px 0px rgba(189,70,189,1)',
  },

  ['@media (max-width:390px)']: {
    width: '253px',
    height: '51px',
    marginTop: '14px',
    flexDirection: 'row',
    borderRadius: '28px 28px 28px 28px',
  },

  ['@media (max-width:400px)']: {
    width: '253px',
    height: '51px',
    marginTop: '14px',
    flexDirection: 'row',
  },

  ['@media (max-width:414px)']: {
    width: '253px',
    height: '51px',
    marginTop: '14px',
    flexDirection: 'row',
    borderRadius: '28px 28px 28px 28px',
  },
}));

export const StyledBtnTitle = styled('span')(({ theme }) => ({
  fontFamily: 'Jost',
  fontWeight: 600,
  fontSize: '14px',
  color: theme.palette.background.buttonSwitch,

  ['@media (max-width:390px)']: {
    marginLeft: '16px',
  },
}));

export const StyledTitleMobile = styled('span')(({ theme }) => ({
  fontFamily: 'Jost',
  fontWeight: 400,
  fontSize: '22px',
  color: theme.palette.background.buttonSwitch,
}));

export const StyledDowloadAppTitle = styled('span')(() => ({
  fontFamily: 'Jost',
  fontWeight: 400,
  fontSize: '10px',
  maxWidth: '198px',
  textAlign: 'center',
  marginTop: '72px',
  lineHeight: '12px',
  color: '#212121',
}));

export const StyledLinkDownloadApp = styled('span')(() => ({
  fontFamily: 'Jost',
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '12px',
  marginTop: '4px',
  color: 'rgba(0, 125, 254, 1)',
}));

export const StyledBoxRoom = styled(Box)(() => ({
  background: '#F4EFF5',
  width: '100%',
  margin: '0 auto',
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'center',
  height: '370px',
  alignItems: 'center',
  ['@media (max-width: 650px)']: {
    height: `${isMobile ? 370 : 346}px`,
  },
}));
