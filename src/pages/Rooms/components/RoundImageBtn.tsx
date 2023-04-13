import React, { FC, forwardRef, ReactNode } from 'react';
import { StyledRoundButton } from 'components/StyledComponents';

import { ButtonProps } from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack, useTheme } from '@mui/material';

interface IRoundImageBtnProps extends ButtonProps {
  bottomLabel: string;
  children: ReactNode;
}

export const RoundImageBtn: FC<IRoundImageBtnProps> = forwardRef(({ bottomLabel, children, ...props }, ref) => {
  const theme = useTheme();
  return (
    <Stack direction="column" justifyContent="space-around" alignItems="center" spacing={1}>
      <StyledRoundButton {...props} ref={ref}>
        {children}
      </StyledRoundButton>
      <Typography
        color={props.disabled ? theme.palette.action.disabled : theme.palette.primary.main}
        fontSize="15px"
        whiteSpace="nowrap"
      >
        {bottomLabel}
      </Typography>
    </Stack>
  );
});

RoundImageBtn.displayName = 'RoundImageBtn';
