import React, { useState } from 'react';

import { isMobile } from 'react-device-detect';

import { FormikState, useFormik } from 'formik';
import * as yup from 'yup';

import { putEditPassword } from 'store/reducers/ActionCreate';

import { Grid, Box, IconButton, Typography, useTheme } from '@mui/material';

import { CustomImg, StyledButtonPurple, StyledButtonPrimaryPurple, StyledTextField } from 'components/StyledComponents';

import UserProfileImg from 'images/UserChangePassord.png';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import appLayout from '../../hocs/appLayout';
import { useNavigate } from 'react-router-dom';
import { StyledGridWrap } from 'pages/UserProfilePage/StylesUserProfilePage';
import { StyledTypography } from 'components/StyledComponents';

export const UserChangePassword = appLayout(() => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isShowOldPass, setIsShowOldPass] = useState<boolean>(false);
  const [isShowPass, setIsShowPass] = useState<boolean>(false);
  const theme = useTheme();

  const validationSchema = yup.object({
    oldPassword: yup.string()
    .min(4, 'Пароль слишком короткий — минимум 4 символа.')
    .matches(/[a-zA-Z]/, 'Пароль может содержать только латинские буквы.')
    .required('Полеобязателено для заполнения'),
    newPassword: yup
    .string()
    .min(4, 'Пароль слишком короткий — минимум 4 символа.')
    .matches(/[a-zA-Z]/, 'Пароль может содержать только латинские буквы.')
    .required('Полеобязателено для заполнения'),
  });

  interface IMyFormValues {
    oldPassword: string;
    newPassword: string;
  }

  interface IResetForm {
    resetForm: (
      nextState?:
        | Partial<
            FormikState<{
              oldPassword: string;
              newPassword: string;
            }>
          >
        | undefined,
    ) => void;
  }

  const handleSubmitForm = async (value: IMyFormValues, { resetForm }: IResetForm) => {
    const data = await putEditPassword({
      oldPassword: value.oldPassword,
      newPassword: value.newPassword,
    });
 
    if (data.statusCode === 400) {
      setErrorMessage(data.description);
    }

    if (data && data.statusCode === 200) {
      resetForm();
      setErrorMessage(null);
      navigate('/userProfile');
    }
  };

  const formikModal = useFormik({
    initialValues: { oldPassword: '', newPassword: '' },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmitForm,
  });

  const showPassBtn = (
    <IconButton onClick={() => setIsShowPass((prev) => !prev)}>
      {!isShowPass ? <VisibilityOffOutlined color={'disabled'} /> : <VisibilityOutlined color={'disabled'} />}
    </IconButton>
  );

  const showOldPassBtn = (
    <IconButton onClick={() => setIsShowOldPass((prev) => !prev)}>
      {!isShowOldPass ? <VisibilityOffOutlined color={'disabled'} /> : <VisibilityOutlined color={'disabled'} />}
    </IconButton>
  );

  return (
    <StyledGridWrap container direction="row" justifyContent="space-evenly" alignItems="center">
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        alignItems="flex-start"
        style={{ width: '450px' }}
      >
        <StyledTypography marginBottom="50px">Изменение пароля</StyledTypography>
        {errorMessage!==null &&
          <Typography variant='h6' color={theme.palette.error.main} margin={'0px 0px 14px 15px'}>Неверный пароль</Typography>
        }
        <Box component="form" noValidate onSubmit={formikModal.handleSubmit}>
          <StyledTextField
            label="Текущий пароль"
            required
            type={!isShowOldPass ? 'password' : 'text'}
            value={formikModal.values.oldPassword}
            fullWidth
            id="oldPassword"
            onChange={formikModal.handleChange}
            variant="outlined"
            color="textField"
            fontSize="20px"
            sx={{ width: '350px' }}
            style={{ marginBottom: 23 }}
            autoComplete="off"
            InputProps={{
              endAdornment: showOldPassBtn,
            }}
            error={!!formikModal.errors.oldPassword}
            helperText={formikModal.errors.oldPassword}
          />
          <StyledTextField
            label="Новый пароль"
            required
            type={!isShowPass ? 'password' : 'text'}
            value={formikModal.values.newPassword}
            fullWidth
            id="newPassword"
            onChange={formikModal.handleChange}
            variant="outlined"
            color="textField"
            fontSize="20px"
            sx={{ width: '350px' }}
            style={{ marginBottom: 23 }}
            autoComplete="off"
            InputProps={{
              endAdornment: showPassBtn,
            }}
            error={!!formikModal.errors.newPassword}
            helperText={formikModal.errors.newPassword}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              width: '100%',
              justifyContent: `${isMobile ? 'center' : ''}`,
            }}
          >
            <StyledButtonPrimaryPurple
              sx={{
                color: '#fff',
                width: '152px',
                height: '50px',
                marginRight: '20px',
                fontSize: `${isMobile ? 14 : 20}px !important`,
              }}
              type="submit"
              disabled={!(!!formikModal.values.newPassword && !!formikModal.values.oldPassword)}
            >
              Сохранить
            </StyledButtonPrimaryPurple>
            <StyledButtonPurple
              sx={{
                fontSize: `${isMobile ? 14 : 20}px !important`,
                fontWeight: 400,
                width: '142px',
                height: '50px',
              }}
              onClick={() => navigate('/userProfile')}
            >
              Отмена
            </StyledButtonPurple>
          </Box>
        </Box>
      </Grid>
      <Grid>
        <CustomImg src={UserProfileImg} alt="UserProfileImg" sx={{ display: isMobile ? 'none' : 'block' }} />
      </Grid>
    </StyledGridWrap>
  );
});
