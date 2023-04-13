import moment from 'moment';

export const convertData = (dataStart: string, dataEnd?: string) => {
  moment.updateLocale('en', {
    weekdays: {
      standalone: 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
      format: 'Вс_Пн_Вт_Ср_Чт_Пт_Сб'.split('_'),
      isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/,
    },
  });

  const convertActualDate = moment.utc(new Date(dataStart)).format();
  const convertedData = moment(new Date(convertActualDate)).format('D.MM.YYYY dddd');
  const convertedDataStart = moment(moment.utc(dataStart).format().toString()).format('HH:mm');
  const convertedDataEnd = moment(moment.utc(dataEnd).format().toString()).format('HH:mm');

  return {convertedData, convertedDataStart, convertedDataEnd};
};