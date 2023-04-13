export const handleError = (err: string) => {
  switch (err) {
    case 'Network Error':
      return ' У вас что то с интернетом! МЫ ВСЕ УМРЕМ';
    default: return
  }
};
