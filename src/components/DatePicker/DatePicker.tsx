import React from 'react';
import ReactDatePicker, { ReactDatePickerProps, registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru/index';

import { StyledDatePicker } from 'components/StyledComponents';
import 'react-datepicker/dist/react-datepicker.min.css';

const DatePicker = (props: ReactDatePickerProps) => {
  registerLocale('ru-RU', ru);
  return (
    <StyledDatePicker>
      <ReactDatePicker locale="ru-RU" calendarClassName="datePicker" {...props}></ReactDatePicker>
    </StyledDatePicker>
  );
};

export default DatePicker;
