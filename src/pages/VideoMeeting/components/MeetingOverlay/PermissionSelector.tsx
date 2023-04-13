import React, { ChangeEvent, Dispatch, FC, useMemo } from 'react';

import { FormControl } from '@mui/material';

import { StyledMenuItem, StyledTextField } from 'components/StyledComponents';
import { ExpandMoreRounded } from '@mui/icons-material';
import { IPermissionArr } from 'types/share';

interface IPermissionSelectorProps {
  disabled: boolean;
  setDisabledSubmit: Dispatch<React.SetStateAction<boolean>>;
  permissionArr: IPermissionArr[];
  videoPermission: string;
  onChangeSelectPermission: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const PermissionSelector: FC<IPermissionSelectorProps> = (props) => {
  const { disabled, permissionArr, videoPermission, onChangeSelectPermission } = props;

  const permissionOptions = useMemo(() => {
    return permissionArr.map((permission) => (
      <StyledMenuItem key={permission.id} value={permission.id}>
        {permission.name}
      </StyledMenuItem>
    ));
  }, []);

  return (
    <FormControl style={{ display: 'none' }}>
      <StyledTextField
        select
        fullWidth
        variant="outlined"
        disabled={disabled}
        value={videoPermission}
        onChange={onChangeSelectPermission}
        label={'Качество'}
        height="44px"
        fontSize="14px"
        size="small"
        SelectProps={{
          IconComponent: ExpandMoreRounded,
        }}
        sx={{ width: '280px' }}
      >
        {permissionOptions}
      </StyledTextField>
    </FormControl>
  );
};
