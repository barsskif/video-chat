import React from 'react';

import { Box } from '@mui/material';

import { InternalErrorImg } from 'components/StyledComponents';

export const ErrorPage = () => {
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
        <InternalErrorImg height="100%" width="100%" />
      </Box>
    </>
  );
};
