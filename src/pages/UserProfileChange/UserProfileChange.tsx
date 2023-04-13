import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { isMobile } from 'react-device-detect';

import { useFormik } from 'formik';

import { StyledGridWrap } from '../UserProfilePage/StylesUserProfilePage';
import { validationSchema } from './validationSchema';

import { putEditUserData } from 'store/reducers/ActionCreate';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IUser } from 'types/share';
import appLayout from '../../hocs/appLayout';

import { Box, Grid } from '@mui/material';
import {
  CustomImg,
  StyledButtonPurple,
  StyledTypography,
  StyledButtonPrimaryPurple,
  StyledTextField,
} from 'components/StyledComponents';

import UserProfileImg from 'images/profilImg.png';

export const UserProfileChange = appLayout(() => {
  const [dataUser, setDataUser] = useState<IUser>({
    email: '',
    userName: '',
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.SingInReducer);

  const handleSubmitFormEdit = ({ email, firstname: name }: IUser) => {
    const newUserData = {
      email,
      name,
    };

    dispatch(putEditUserData(newUserData));
    navigate('/userProfile');
  };

  useEffect(() => {
    if (user) {
      setDataUser({ ...user });
    }
  }, [user]);

  const formik = useFormik({
    initialValues: { ...dataUser },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: handleSubmitFormEdit,
  });

  return (
    <StyledGridWrap container direction="row" justifyContent="space-evenly" alignItems="center">
      <Grid
        container
        direction="column"
        justifyContent="space-evenly"
        alignItems="flex-start"
        style={{ width: '450px' }}
      >
        <StyledTypography marginBottom="50px">Редактирование профиля</StyledTypography>
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
            justifyContent: isMobile ? 'center' : undefined,
          }}
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <StyledTextField
            label="Имя*"
            value={formik.values.firstname || ''}
            fullWidth
            id="firstname"
            onChange={formik.handleChange}
            variant="outlined"
            color="textField"
            fontSize="20px"
            sx={{ width: '350px' }}
          />
          <StyledTextField
            label="Email*"
            value={formik.values.email}
            fullWidth
            id="email"
            onChange={formik.handleChange || ''}
            variant="outlined"
            fontSize="20px"
            color="textField"
            sx={{ width: '350px', marginTop: '31px' }}
            error={!!formik.errors.email}
            helperText={formik.errors.email}
          />
          <Grid container direction="row" justifyContent={isMobile ? 'center' : 'flex-start'} alignItems="flex-end">
            <StyledButtonPrimaryPurple
              sx={{
                color: '#fff',
                width: '152px',
                height: '50px',
                marginRight: '20px',
                fontSize: `${isMobile ? 14 : 20}px !important`,
              }}
              type="submit"
              disabled={!!formik.errors.email}
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
          </Grid>
        </Box>
      </Grid>
      <Grid>
        <CustomImg src={UserProfileImg} alt="UserProfileImg" sx={{ display: isMobile ? 'none' : 'block' }} />
      </Grid>
    </StyledGridWrap>
  );
});
