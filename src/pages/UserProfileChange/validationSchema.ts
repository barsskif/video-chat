import * as yup from 'yup';

const EMAIL_REGX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const validationSchema = yup.object({
  email: yup
    .string()
    .email('Введите корректный email')
    .required('Email обязателен для заполнения')
    .matches(EMAIL_REGX, 'Введите корректный email')
    .test('email', 'Введите корректный email', (value) => {
      if (value) {
        return yup.string().email().isValidSync(value);
      }
      return true;
    }),
  username: yup.string(),
});