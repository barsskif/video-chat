import * as Yup from 'yup';
export const validationSchema = Yup.object({
  name: Yup.string().required('Это поле обязательно для заполнения'),
  email: Yup.string().email('Не валидная почта').required('Это поле обязательно для заполнения'),
  password: Yup.string()
      .min(4, 'Пароль слишком короткий — минимум 4 символа.')
      .matches(/[a-zA-Z]/, 'Пароль должен содержать латинские буквы.')
      .required('Поле пароль не может быть пустым.'),
});