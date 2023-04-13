import * as Yup from 'yup';
export const validationSchema = Yup.object({
    password: Yup.string()
        .min(4, 'Пароль слишком короткий — минимум 4 символа.')
        .matches(/[a-zA-Z]/, 'Пароль может содержать только латинские буквы.')
        .required('Поле пароль не может быть пустым.'),
    confirmPassword: Yup.string()
        .min(4, 'Пароль слишком короткий — минимум 4 символа.')
        .required()
        .oneOf([Yup.ref('password')], 'Пароли не совпадают')
})