import * as Yup from 'yup';
export const validationSchema = Yup.object({
  nameUser: Yup.string().required('Это поле обязательно для заполнения'),
  emailUser: Yup.string().email('Не валидная почта').required('Это поле обязательно для заполнения'),
  commentUser: Yup.string().required('Это поле обязательно для заполнения'),
});
