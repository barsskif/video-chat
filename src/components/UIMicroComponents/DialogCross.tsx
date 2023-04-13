import  { FC } from 'react';

import { Close } from '@mui/icons-material';
import { IconButtonProps } from '@mui/material';

import { StyledDialogCross } from 'components/StyledComponents';

export const DialogCross: FC<IconButtonProps> = (props) => {
  return (
    <StyledDialogCross {...props}>
      <Close />
    </StyledDialogCross>
  );
};
