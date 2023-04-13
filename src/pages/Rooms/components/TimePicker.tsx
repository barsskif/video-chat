import React, { FC, useMemo } from 'react';
import { IconSelect } from 'components/StyledComponents';
import { MenuItem, SelectChangeEvent, SelectProps, useTheme } from '@mui/material';
import { AccessTimeOutlined } from '@mui/icons-material';
import moment from 'moment';

interface ITimePicker extends SelectProps {
  selected: Date;
  minTime?: Date | false;
  onChangeDate: (date: Date) => void;
}

export const TimePicker: FC<ITimePicker> = ({ selected, onChangeDate, minTime, ...props }) => {
  // console.log('🚀 =====> selected', selected);
  const theme = useTheme();

  const timeList = useMemo(() => {
    const arr = [];

    const disabledTime = minTime &&
      Number(moment(minTime).format('D')) >= Number(moment(selected).format('D')) && {
        h: moment(minTime).hour(),
        m: moment(minTime).minute(),
      };

    for (let i = 0; i < 24; i++) {
      i &&
        arr.push(
          <MenuItem
            key={`${i}:00`}
            value={`${i}:00`}
            sx={{ fontSize: '14px' }}
            disabled={disabledTime && i < disabledTime.h}
          >
            {i}:00
          </MenuItem>,
        );
      arr.push(
        <MenuItem
          key={`${i}:30`}
          value={`${i}:30`}
          sx={{ fontSize: '14px' }}
          disabled={disabledTime && (i < disabledTime.h || (i < disabledTime.h && disabledTime.m >= 30))}
        >
          {i}:30
        </MenuItem>,
      );
    }
    return arr;
  }, [minTime]);

  const onChangeHandler = async (event: SelectChangeEvent<unknown> | never) => {
    if (typeof event.target.value !== 'string') return;
    const time = await event.target.value.split(':');
    const date = await moment(selected).hour(Number(time[0])).minute(Number(time[1])).toDate();
    onChangeDate(date);
  };

  return (
    <IconSelect
      variant="outlined"
      size="small"
      value={moment(selected).format('H:mm').toString()}
      onChange={onChangeHandler}
      startAdornment={<AccessTimeOutlined color="disabled" />}
      IconComponent={() => null}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: '300px',
            boxShadow: `0px 30px 60px ${theme.palette.shadows.main}`,
            transform: 'translateY(3px)',
          },
        },
      }}
      sx={{ minWidth: '90px' }}
      {...props}
    >
      {timeList}
    </IconSelect>
  );
};
