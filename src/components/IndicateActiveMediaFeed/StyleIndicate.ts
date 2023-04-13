import styled from '@emotion/styled';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';

export const StylePositionAudioIndicator = styled('div')(() => ({
  position: 'absolute',
  bottom: -1,
  right: -1,
  width: 90,
  height: 32,
  background: 'rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(0, 0, 0, 0.5)',
  borderRadius: '6px 0px 8px 0px',
  zIndex: 4,
}));

export const StyleNameFeed = styled('p')(() => ({
  fontSize: 12,
  color: '#FFFFFF',
  fontFamily: 'Jost',
  zIndex: 4,
  margin: '0 10px 0 10px',
}));

export const StyleBoxWrapperMobile = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: '45px',
  background: 'linear-gradient(to top, #181515 0%, #fff0 100%)',
  zIndex: 3,
}));

export const StyleMobileIndicate = styled('span')(() => ({
  display: 'flex',
  marginLeft: '5px',
  height: '100%',
  alignItems: 'center',
}));

export const StyleGridNameIndicate = styled(Grid)(() => ({
  height: '100%',
  color: 'aliceblue',
  fontFamily: 'Jost',
  textTransform: 'lowercase',
  fontSize: '12px',
}));

export const StyleNameSignatureBlock = styled('div')(() => ({
  position: 'absolute',
  bottom: -1,
  left: -1,
  minWidth: 90,
  height: 32,
  background: 'rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(0, 0, 0, 0.5)',
  borderRadius: '0px 6px 0px 8px',
  fontSize: 12,
  color: '#FFFFFF',
  fontFamily: 'Jost',
  zIndex: 4,
}));
