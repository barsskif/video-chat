import React, { FC } from 'react';

import { Box } from '@mui/material';

import { NotFoundImg, StyleLink } from 'components/StyledComponents';

export const NotFound: FC = () => {
  return (
    <>
      <Box
        marginTop="52px"
        height="calc(100vh - 52px - 100px)"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        padding="0 20px"
      >
        <NotFoundImg height="100%" width="100%" />
        <StyleLink marginTop="63px" fontSize="24px" lineHeight="28px" to={'/rooms'} sx={{ textTransform: 'uppercase' }}>
          На главную
        </StyleLink>
      </Box>
    </>
  );
};
