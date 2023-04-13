import { useState, useEffect, FormEvent, useMemo } from 'react';

import { isMobile } from 'react-device-detect';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { putEditUserData, putUploadAvatar } from 'store/reducers/ActionCreate';
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { IUser } from 'types/share';
import { funSliced } from 'utils/sliced';

import { Avatar, Grid, Box, IconButton } from '@mui/material';

import {
  CustomImg,
  StyledButtonPurple,
  StyledTypography,
  StyledButtonPrimaryPurple,
} from 'components/StyledComponents';

import UserProfileImg from 'images/profilImg.png';
import { ReactComponent as AvatarSvgEdit } from 'images/icon-avatar-edit.svg';
import { StyledAvatarWrap, StyledBtnUploadAvatar, StyledEditBtnAvatar, StyledGridWrap } from './StylesUserProfilePage';
import { stringAvatar } from '../../helpers/stringAvatar';
import appLayout from '../../hocs/appLayout';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';

const SERVER_URL: string | undefined = import.meta.env.REACT_APP_SERVER_URL;

type UploadAvatarType<T> = FormEvent<T> & { preventDefault: () => void; target: { files: any[] } }; //eslint-disable-line

const validationSchema = yup.object({
  userEmail: yup.string(),
  username: yup.string(),
});

export const UserProfilePage = appLayout(() => {
  const [isVisibleEditBtnAvatar, setIsVisibleEditBtnAvatar] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<IUser>({
    email: '',
    userName: '',
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.SingInReducer);

  // TODO: добавить с яндекс
  const urlAvatarImg = useMemo(() => {
    if (!user?.avatarUrl) return;
    const isGoogle = user?.avatarUrl?.includes('googleusercontent');
    if (isGoogle) {
      return user.avatarUrl;
    }
    return `${SERVER_URL}/${user?.avatarUrl}`;
  }, [user?.avatarUrl]);

  const handleSubmit = (value: IUser) => {
    const newUserData = {
      email: value.email,
      name: value.firstname,
    };
    dispatch(putEditUserData(newUserData));
  };

  const UploadAvatar = async (event: UploadAvatarType<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.target.files[0]) {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append('file', file);

      await dispatch(putUploadAvatar(file));
    }
  };

  const changeVisibleEditBtnAvatar = (value: boolean) => {
    return setIsVisibleEditBtnAvatar(value);
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
    onSubmit: handleSubmit,
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
        <StyledTypography marginBottom="50px">Профиль</StyledTypography>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-start"
          flexWrap="nowrap"
          style={{ height: '131px' }}
        >
          <StyledAvatarWrap
            onMouseEnter={() => changeVisibleEditBtnAvatar(true)}
            onMouseLeave={() => changeVisibleEditBtnAvatar(false)}
          >
            <Avatar
              {...stringAvatar(user?.firstname)}
              src={urlAvatarImg}
              sx={{ width: 110, height: 110, marginRight: '20px' }}
            />

            <StyledBtnUploadAvatar isVisible={isVisibleEditBtnAvatar}>
              <StyledEditBtnAvatar>
                <IconButton color="primary" aria-label="upload picture" component="label" onChange={UploadAvatar}>
                  <input hidden accept="image/*" type="file" />
                  <AvatarSvgEdit />
                </IconButton>
              </StyledEditBtnAvatar>
            </StyledBtnUploadAvatar>
          </StyledAvatarWrap>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            sx={{ marginLeft: '23px' }}
          >
            <StyledSpan>{funSliced(user?.firstname, 20)}</StyledSpan>
            <StyledSpan>{user?.email}</StyledSpan>
          </Grid>
        </Grid>
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Box
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              width: '100%',
              justifyContent: `${isMobile ? 'center' : ''}`,
            }}
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <>
              <StyledButtonPrimaryPurple
                sx={{
                  color: '#fff',
                  width: `${isMobile ? 160 : 228}px`,
                  height: '50px',
                  marginRight: '20px',
                  fontSize: `${isMobile ? 14 : 20}px !important`,
                }}
                onClick={() => navigate('/changeProfile')}
              >
                Изменить профиль
              </StyledButtonPrimaryPurple>
              <StyledButtonPurple
                sx={{
                  fontSize: `${isMobile ? 14 : 20}px !important`,
                  fontWeight: 400,
                  width: `${isMobile ? 160 : 228}px`,
                  height: '50px',
                }}
                onClick={() => navigate('/changePassword')}
              >
                Сменить пароль
              </StyledButtonPurple>
            </>
          </Box>
        </Grid>
      </Grid>

      <Grid>
        <CustomImg src={UserProfileImg} alt="UserProfileImg" sx={{ display: isMobile ? 'none' : 'block' }} />
      </Grid>
    </StyledGridWrap>
  );
});

const StyledSpan = styled('span')(() => ({
  fontSize: '20px',
  fontWeight: 400,
  fontFamily: 'Jost',
  marginBottom: '10px',
}));
