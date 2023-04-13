// react
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

// react router dom
import { useNavigate } from 'react-router-dom';

// redux
import { authorize, resetPasswordByMail, userFetch } from 'store/reducers/ActionCreate';
import { SingInSlice } from 'store/reducers/SingInSlice';

// hooks
import { useAppDispatch, useAppSelector } from 'hooks/redux';

// jwt_decode
import jwt_decode from 'jwt-decode';

// MUI
import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { ClearOutlined, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';

// components
import { Loader } from 'components/Loader/Loader';
import { InfoResetPasswordModal } from 'components/InfoResetPasswordModal/InfoResetPasswordModal';
import { ImagesSingInComponents } from 'components/ImagesSingInComponents/ImagesSingInComponents';

// styles
import { StyleLink, StyleButton, StyleLogo, StyleTitleSingIn, StyledBtnCreateJoin } from 'components/StyledComponents';
import { StyledBoxLine, StyledBox, StyledTextFieldSingIn } from './SingInStyles';

// hocks
import appLayout from '../../hocs/appLayout';

// images
import { ReactComponent as LogoSingIn } from 'images/logoLMLast.svg';
import { ReactComponent as UserStartSvg } from 'images/userStartSvg.svg';
import { ReactComponent as Letsmeet } from 'images/letsmeet.svg';

// types
import { enumLocalStorage, IJwtTokenData } from 'types/share';
import { OAuthIcons } from 'components/OAuthIcons/OAuthIcons';
import { StyledLimitTitle } from 'pages/Rooms/StylesRooms';
import { MobileHepler } from './components/MobileHelper';

const ssoUrl: string = import.meta.env.REACT_APP_SSO_SERVER;

export const SingIn = appLayout(() => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const { user, isLoading, error } = useAppSelector((state) => state.SingInReducer);
  const { singInError } = SingInSlice.actions;

  const [showPass, setShowPass] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [resetPasswordModal, setResetPasswordModal] = useState<boolean>(false);
  const [errorSingIn, setErrorSingIn] = useState<boolean>(true);
  const [isMove, setIsMove] = useState<boolean>(false);

  const errorMessage = () => {
    if (!error) return '';
    switch (error as unknown as string) {
      case 'Request failed with status code 401':
        return 'Неверный email или пароль';
      default:
        return String(error);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    localStorage.removeItem('role');
    localStorage.removeItem('userData');
  }, []);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorSingIn(false);
    }
    if (!email) return dispatch(singInError('Поле email не должно быть пустым'));
    if (!password) return dispatch(singInError("Поле 'пароль' не должно быть пустым"));
    dispatch(authorize({ email, password }));
    setErrorSingIn(false);
  };

  const handleResetPassword = async () => {
    if (!email) return dispatch(singInError('Поле email не должно быть пустым'));
    const data = await resetPasswordByMail(email);

    if (data === 'Error') return console.log('opps');
    dispatch(singInError(null));
    setEmail('');

    return setResetPasswordModal(true);
  };

  useEffect(() => {
    if (localStorage.getItem(enumLocalStorage.ACCESS_TOKEN)) {
      const decodedToken = jwt_decode(localStorage.getItem(enumLocalStorage.ACCESS_TOKEN) as string) as IJwtTokenData;

      if (decodedToken.guest === 'True') return;
      dispatch(userFetch());
    }
  }, []);

  useEffect(() => {
    if (user && !isLoading && !error && localStorage.getItem(enumLocalStorage.ACCESS_TOKEN)) {
      navigate('/rooms');
    }
  }, [navigate, isLoading, error, user]);

  const clearInputBtn = email && (
    <IconButton onClick={resetForm}>
      <ClearOutlined color={'disabled'} />
    </IconButton>
  );

  const showPassBtn = (
    <IconButton onClick={() => setShowPass(!showPass)}>
      {showPass ? <VisibilityOffOutlined color={'disabled'} /> : <VisibilityOutlined color={'disabled'} />}
    </IconButton>
  );

  const changeIsMove = () => {
    if (!isMobile) return;
    setIsMove(true);
  };

  if (isLoading) return <Loader />;

  return (
    <Box>
      <MobileHepler isMove={isMove} setIsMove={setIsMove} />
      <StyleLogo>
        <LogoSingIn width="40px" height="40px" transform="rotate(4)" style={{ marginRight: '10px' }} /> <Letsmeet />
      </StyleLogo>
      <StyleTitleSingIn>Быстрые видеозвонки для всех</StyleTitleSingIn>
      <InfoResetPasswordModal open={resetPasswordModal} setResetPasswordModal={setResetPasswordModal} />
      <Grid
        container
        direction={{ xs: 'column', sm: 'row', md: 'row' }}
        justifyContent="center"
        alignItems="center"
        wrap="nowrap"
        padding={isMobile ? '20px 0px 0px 0px' : '68px 0px 0px 0px'}
        minHeight="320px"
        paddingLeft={{ sm: 'initial' }}
      >
        <Box component="form" onSubmit={submitHandler} minWidth={{ xs: '290px', sm: '340px' }} maxWidth={'350px'}>
          <Stack direction="column" gap={2}>
            <FormControl>
              <StyledTextFieldSingIn
                className="absoluteError topError Focus-shadow"
                type="email"
                value={email}
                color="primary"
                label="Email"
                fontSize="20px"
                variant="outlined"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                error={!!error}
                helperText={errorMessage()}
                InputProps={{
                  endAdornment: clearInputBtn,
                }}
              />
            </FormControl>
            <FormControl>
              <StyledTextFieldSingIn
                className="Focus-shadow"
                type={!showPass ? 'password' : 'text'}
                value={password}
                color="primary"
                label="Пароль"
                variant="outlined"
                autoComplete="off"
                fontSize="20px"
                error={!!error}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: showPassBtn,
                }}
              />
            </FormControl>
          </Stack>
          <Stack direction="column" marginTop="16px">
            <StyleButton
              sx={{ marginTop: '15px' }}
              type="submit"
              variant="contained"
              backgroundcolor={theme.palette.background.buttonSingIn}
              disabled={isLoading}
              endIcon={isLoading && <CircularProgress sx={{ maxWidth: '18px', maxHeight: '18px' }} />}
            >
              Войти
            </StyleButton>
            <Stack direction="row" justifyContent="space-around" alignItems="flex-start">
              <Stack sx={{ marginTop: '23px', marginRight: '26px' }}>
                {errorSingIn ? (
                  <>
                    <StyleLink to="/registration" marginTop={0} color={theme.palette.text.additional}>
                      Зарегистрироваться
                    </StyleLink>
                  </>
                ) : (
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
                )}
              </Stack>
              <OAuthIcons ssoUrl={ssoUrl} />
            </Stack>
          </Stack>
        </Box>
        <StyledBoxLine
          display={{ xs: 'none', sm: 'block' }}
          margin={{
            sm: '0px 20px 102px 20px',
            md: '0px 60px 102px 60px',
            lg: '0px 110px 102px 110px',
          }}
        ></StyledBoxLine>
        <StyledBox
          minWidth={{ xs: '290px', sm: '340px' }}
          maxWidth={'328px'}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
        >
          <Tooltip title="Данная функция находится в разработке" placement="bottom">
            <StyledBtnCreateJoin onClick={changeIsMove}>
              <UserStartSvg style={{ marginBottom: '7px' }} />
              Создать встречу
              <StyledLimitTitle sx={{ marginBottom: '5px' }}>до 100 участников</StyledLimitTitle>
            </StyledBtnCreateJoin>
          </Tooltip>
          <Typography
            variant="h2"
            textAlign={'center'}
            marginTop={'35px'}
            color={theme.palette.borders.light}
            fontSize={'16px'}
            lineHeight={'20px'}
          >
            <b>Без регистрации</b> доступно всё, кроме списка запланированных встреч.
          </Typography>
        </StyledBox>
      </Grid>
      <ImagesSingInComponents />
    </Box>
  );
}, false);
