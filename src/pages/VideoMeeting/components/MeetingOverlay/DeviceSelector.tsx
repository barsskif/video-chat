import React, { ChangeEvent, FC, useMemo } from 'react';

import { FormControl } from '@mui/material';
import { IDevice } from 'types/share';

import { StyledMenuItem, StyledTextField } from 'components/StyledComponents';

import { ExpandMoreRounded } from '@mui/icons-material';

interface IDeviceSelectorProps {
  deviceList: IDevice[];
  label: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled: boolean;
}

export const DeviceSelector: FC<IDeviceSelectorProps> = (props) => {
  const { deviceList, label, value, onChange, disabled } = props;

  const devicesOptions = useMemo(() => {
    if (deviceList.length)
      return deviceList.map((device) => (
        <StyledMenuItem key={device.deviceId} value={device.deviceId}>
          {device.label}
        </StyledMenuItem>
      ));
  }, [deviceList]);

  return (
    <FormControl>
      <StyledTextField
        select
        fullWidth
        variant="outlined"
        disabled={disabled}
        value={value}
        onChange={onChange}
        label={label}
        height="44px"
        fontSize="14px"
        size="small"
        SelectProps={{
          IconComponent: ExpandMoreRounded,
        }}
        sx={{ width: '280px' }}
      >
        {devicesOptions}
        <StyledMenuItem disabled value="NotFound" sx={{ display: disabled ? 'block' : 'none' }}>
          Устройства в системе не обнаружены
        </StyledMenuItem>
      </StyledTextField>
    </FormControl>
  );
};
