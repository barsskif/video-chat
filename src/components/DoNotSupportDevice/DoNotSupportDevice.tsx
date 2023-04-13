import styled from '@emotion/styled';
import React from 'react';

import Sorry from '../../images/sorry.png';

const StyledDivContainer = styled('div')(() => ({
  width: '100%',
  height: '100vh',
}));
const StyledDivDescription = styled('div')(() => ({
  display: 'flex',
  height: '100%',
  padding: 10,
  flexDirection: 'column',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const DoNotSupportDevice = () => {
  return (
    <StyledDivContainer>
      <StyledDivDescription>
        <img src={Sorry} alt="sory" width="200px" height="200px" />
        <p>
          Приносим свои извинения, но в данный момент приложение корректно работает только в браузере Google Chrome.
          <a href="https://play.google.com/store/apps/details?id=com.android.chrome">Cкачайте Google Chrome</a>
        </p>
      </StyledDivDescription>
    </StyledDivContainer>
  );
};
