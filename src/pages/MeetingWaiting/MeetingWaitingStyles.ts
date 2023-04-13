import { styled } from '@mui/system';

import { Box, Typography } from '@mui/material';

//images
import MeetingWaitingImg from 'images/waiting.jpg';

export const MeetingWaitingImgComponent = styled(Box)(() => ({
    backgroundImage: `url(${MeetingWaitingImg})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
  }));
  
  export const TimeStyle = styled('span')(() => ({
    fontWeight: 500,
    fontSize: '24px',
    color: '#007DFE',
    marginLeft: '13px',
  }));
  
 export  const TypographyStyle = styled(Typography)(() => ({
    fontSize: '24px',
    color: '#9CA3AF',
  }));
  