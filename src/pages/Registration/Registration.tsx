import { FC, useState } from 'react';

import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { registration, resetPasswordByMail } from 'store/reducers/ActionCreate';

import { RegistrationFrom } from './components/RegistrationForm';
import { OAuthIcons } from 'components/OAuthIcons/OAuthIcons';

import { useFormik } from 'formik';
import { isMobile } from 'react-device-detect';

import { SingInSlice } from 'store/reducers/SingInSlice';
import appLayout from '../../hocs/appLayout';
import { InfoResetPasswordModal } from 'components/InfoResetPasswordModal/InfoResetPasswordModal';

import { Box, Grid, Stack, Tooltip, Typography, useTheme } from '@mui/material';

import {
  StyleLogo,
  StyleTitleSingIn,
  StyledCircularProgress,
  StyleButton,
  StyleLink,
} from 'components/StyledComponents';

import { ReactComponent as LogoSingIn } from 'images/logoLMLast.svg';
import { ReactComponent as Letsmeet } from 'images/letsmeet.svg';
import { Item } from 'pages/Registration/RegistrationStyles';
import { validationSchema } from 'pages/Registration/validationSchema';
import { ImagesSingInComponents } from 'components/ImagesSingInComponents/ImagesSingInComponents';

const ssoUrl: string = import.meta.env.REACT_APP_SSO_SERVER;

export const Registration: FC = appLayout((): JSX.Element => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { isLoading, errorMessage } = useAppSelector((state) => state.RegistrationReducer);
  const { singInError } = SingInSlice.actions;
  const [resetPasswordModal, setResetPasswordModal] = useState<boolean>(false);

  const handleSubmit = (values: { name: string; email: string; password: string }) => {
    dispatch(
      registration({
        email: values.email,
        password: values.password,
        name: values.name,
      }),
    );
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleResetPassword = async () => {
    if (!formik.values.email) return dispatch(singInError('Поле email не должно быть пустым'));
    const data = await resetPasswordByMail(formik.values.email);
    if (data === 'Error') {
      return console.log('apps');
    }
    dispatch(singInError(null));
    formik.values.email = '';
    return setResetPasswordModal(true);
  };

  if (isMobile) {
    return (
      <Item>
        <StyleLogo>
          <LogoSingIn width="40px" height="40px" transform="rotate(4)" style={{ marginRight: '10px' }} /> <Letsmeet />
        </StyleLogo>
        <StyleTitleSingIn sx={{ marginBottom: '40px' }}>Быстрые видео звонки для всех</StyleTitleSingIn>
        <InfoResetPasswordModal open={resetPasswordModal} setResetPasswordModal={setResetPasswordModal} />
        {errorMessage !== null && (
          <Typography variant="h6" color={theme.palette.error.main} margin={'0px 0px 14px 15px'} textAlign={'center'}>
            Пользователь с таким адресом электронной почты существует
          </Typography>
        )}
        <Box
          component="form"
          minWidth={{ xs: '290px', sm: '299px' }}
          onSubmit={formik.handleSubmit}
          style={{ width: '80%' }}
        >
          <RegistrationFrom formik={formik} />
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginTop: '5px' }}></Stack>
          <Stack direction="row" justifyContent="center" alignItems="center" marginTop="20px">
            <StyleButton
              type="submit"
              variant="contained"
              minheight="52px"
              backgroundcolor={theme.palette.background.buttonSingIn}
            >
              Зарегистрироваться
            </StyleButton>
          </Stack>
          <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ marginTop: '10px' }}>
            <Stack>
              <StyleLink fontSize={'16px'} to="/" marginTop={0} color={theme.palette.text.additional}>
                Войти
              </StyleLink>
            </Stack>
            <Typography
              marginTop={0}
              color={theme.palette.text.additional}
              fontWeight={400}
              fontSize={'16px'}
              sx={{
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={handleResetPassword}
            >
              <Tooltip title="Для востановления пароля требуется заполнить поле Email" placement="bottom">
                <span>Забыли пароль?</span>
              </Tooltip>
            </Typography>
          </Stack>
          <OAuthIcons ssoUrl={ssoUrl} />
        </Box>
      </Item>
    );
  }

  return (
    <>
      {isLoading && <StyledCircularProgress color="primary" />}
      <StyleLogo>
        <LogoSingIn width="40px" height="40px" transform="rotate(4)" style={{ marginRight: '10px' }} /> <Letsmeet />
      </StyleLogo>
      <StyleTitleSingIn sx={{ marginBottom: '60px' }}>Быстрые видео звонки для всех</StyleTitleSingIn>
      <InfoResetPasswordModal open={resetPasswordModal} setResetPasswordModal={setResetPasswordModal} />
      <Grid container rowSpacing={1} justifyContent={'center'} columnSpacing={{ xs: 1, sm: 2, md: 2 }}>
        <Item>
          {errorMessage !== null && (
            <Typography variant="h6" color={theme.palette.error.main} margin={'0px 0px 14px 15px'}>
              Пользователь с таким адресом электронной почты существует
            </Typography>
          )}
          <Box component="form" minWidth={{ xs: '290px', sm: '340px' }} onSubmit={formik.handleSubmit}>
            <RegistrationFrom formik={formik} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" marginTop="20px">
              <StyleButton
                type="submit"
                variant="contained"
                backgroundcolor={theme.palette.background.buttonSingIn}
                sx={{ minHeight: '52px', fontSize: '20px', width: '350px' }}
              >
                Зарегистрироваться
              </StyleButton>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginTop: '10px' }}>
              <Stack>
                <StyleLink to="/" marginTop={0} color={theme.palette.text.additional} sx={{ marginLeft: '20px' }}>
                  Войти
                </StyleLink>
              </Stack>
              <Typography
                marginTop={0}
                color={theme.palette.text.additional}
                fontWeight={400}
                fontSize={'16px'}
                sx={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  marginRight: '9px',
                }}
                onClick={handleResetPassword}
              >
                <Tooltip title="Для востановления пароля требуется заполнить поле Email" placement="bottom">
                  <span>Забыли пароль?</span>
                </Tooltip>
              </Typography>
            </Stack>
            <OAuthIcons ssoUrl={ssoUrl} />
          </Box>
        </Item>
      </Grid>
      <ImagesSingInComponents />
    </>
  );
}, false);
