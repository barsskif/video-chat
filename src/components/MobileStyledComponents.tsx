import { styled } from '@mui/material/styles';
import { Badge, Box, Button, Stack } from '@mui/material';

export const MobileMeetingOverlayWrapper = styled(Stack)(({}) => ({
  height: '200px',
  padding: '0 30px',
}));

export const MobileMeetingOverlayButton = styled(Button)<{
  sizewh?: string;
  bgcolor?: string;
  bdrcolor?: string;
}>(({ theme, sizewh = '60px', bgcolor = theme.palette.background.additional }) => ({
  width: sizewh,
  minWidth: sizewh,
  height: sizewh,
  minHeight: sizewh,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  margin: 0,
  background: `${bgcolor} !important`,
  borderRadius: '100px !important',
}));

export const MobileVideoGridWrapper = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignContent: 'flex-start',
  justifyContent: 'flex-start',
  margin: '0 13px 12px 10px',
  '& .videoContainer': {
    height: '200px',
    width: 'calc(50vw - 20px)',
    margin: 0,
    overflow: 'hidden',
  },
  '& .animate:nth-of-type(2n+1)': {
    '& .videoContainer': {
      marginRight: '12px',
    },
  },
  '& .animate:last-child:nth-of-type(2n+1)': {
    '& .videoContainer': {
      width: 'calc(100vw - 23px)',
      marginRight: 0,
    },
  },
  '& video': {
    width: 'auto !important',
  },
}));

export const MobileSidebarWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  minWidth: '100%',
  height: '100%',
  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  backgroundColor: theme.palette.background.secondary,
  overflow: 'hidden',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 90,
  '&.hide': {
    transform: 'translateX(100vw)',
  },
}));

export const MobileBackButtonWrapper = styled(Box)(() => ({
  position: 'fixed',
  top: '17px',
  left: '17px',
  zIndex: 25,
}));

export const MobileChatBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    height: '16px',
    minWidth: '16px',
    fontSize: '9px',
    fontFamily: 'Jost',
    backgroundColor: theme.palette.notifications.badges.additional,
  },
}));

export const TouchZone = styled('span')<{ width?: string; height?: string; border_radius?: string | number }>(
  ({ width = '10px', height = '10px', border_radius = 0 }) => ({
    width,
    height,
    borderRadius: border_radius,
    position: 'absolute',
  }),
);

export const MobileSidebarSettings = styled(Box)(({ theme }) => ({
  width: '100%',
  minWidth: '100%',
  height: '100%',
  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  backgroundColor: theme.palette.background.secondary,
  overflow: 'hidden',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 90,
  '&.hide': {
    transform: 'translateX(100vw)',
  },
}));

export const MobileNetworkWifiIcon = styled(Box)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    color: theme.palette.error.main,
    fontSize: '30px',
  },
  position: 'absolute',
  top: '-14px',
  right: '-14px',
}));
