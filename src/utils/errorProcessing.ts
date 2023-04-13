import { enumError } from 'types/share';

export const errorProcessing = (error: string | undefined) => {
  if(!error) return
  switch (error.toLowerCase()) {
    case enumError.USER_NOT_FOUND:
      return 'Не удалось найти такого пользователя';
    case enumError.INCORRECT_PASSWORD:
      return 'Не правильный логин или пароль';
    case enumError.INVALID_USERNAME_OR_PASSWORD:
      return 'Не правильный логин или пароль';
    default:
      return '';
  }
};
