import React, { useMemo, useState } from 'react';

// react-router-dom
import { useNavigate } from 'react-router-dom';

import { isMobile } from 'react-device-detect';

// redux
import { useAppDispatch, useAppSelector } from 'hooks/redux';
import { SingInSlice } from 'store/reducers/SingInSlice';

// mui
import { Avatar, Box, Grid, IconButton, Menu, MenuItem, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CustomImg, StyledHeaderWrapper } from 'components/StyledComponents';

// image
import sliderIcon from '../../images/headerSliderIcon.png';
import { stringAvatar } from '../../helpers/stringAvatar';
import { ReactComponent as VideoFileIcon } from 'images/VideoFile.svg';
import { ReactComponent as LogoSingIn } from 'images/logoLMLast.svg';
import { ReactComponent as Letsmeet } from 'images/letsmeet.svg';

// types
import { IUser } from 'types/share';

const urlAvatar: string | undefined = import.meta.env.REACT_APP_SERVER_URL;

export const Header = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const matches = useMediaQuery('(max-width:280px)');

  const { logOut } = SingInSlice.actions;
  const { user } = useAppSelector((state) => state.SingInReducer) as { user: IUser };

  const urlAvatarImg = user?.avatarUrl !== null ? `${urlAvatar}/${user?.avatarUrl}` : '';

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenVis, setUserMenVis] = useState<boolean>(false);

  const userMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setUserMenVis(true);
  };

  const userMenuClose = () => {
    setAnchorEl(null);
    setUserMenVis(false);
  };

  const userLogOut = () => {
    userMenuClose();
    const token = localStorage.getItem('accessToken');
    document.cookie = `user=${token}; max-age=-1;`;
    localStorage.clear();
    dispatch(logOut());
    navigate('/');
  };

  const handleNavUserProfilePage = async () => {
    navigate('/userProfile');

    setUserMenVis(false);
  };

  const handleNavigateToMain = async () => {
    navigate('/rooms');

    setUserMenVis(false);
  };

  const recordsButton = useMemo(() => {
    return (
      <Box>
        <Tooltip title="Записи встреч">
          <IconButton onClick={() => navigate('/records')}>
            <VideoFileIcon width="30px" height="30px" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }, []);

  const navigationButton = () => {
    return (
      <Box>
        <Tooltip title="Запланированные конференции">
          <IconButton onClick={() => navigate('/planned')}>
            <CustomImg src={sliderIcon} width="28px" height="28px" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  return (
    <StyledHeaderWrapper top={23} zIndex={100}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="nowrap"
        sx={{ height: '50px' }}
      >
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
          {!isMobile && (
            <LogoSingIn width="40px" height="40px" style={{ margin: '10px 0px 0px 50px', transform: 'rotate(4deg)' }} />
          )}
          <Tooltip title="На главную">
            <TitleNameAppWrapStyle onClick={handleNavigateToMain}>
              <Letsmeet />
            </TitleNameAppWrapStyle>
          </Tooltip>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          flexWrap="nowrap"
          sx={{
            width: `${!matches && '50%'}`,
            marginRight: `${!matches && '46px'}`,
            marginBottom: `${matches && '10px'}`,
          }}
        >
          {navigationButton()}
          {!isMobile && recordsButton}
          <IconButton onClick={userMenuOpen}>
            <Avatar
              {...stringAvatar(user?.userName)}
              src={urlAvatarImg}
              sx={{ width: '30px', height: '30px', backgroundColor: theme.palette.background.buttonSwitch }}
            />
          </IconButton>
          <Menu id="avatar-menu" anchorEl={anchorEl} open={userMenVis} onClose={userMenuClose}>
            <MenuItem onClick={handleNavUserProfilePage}>Профиль</MenuItem>
            <MenuItem onClick={userLogOut}>Выйти</MenuItem>
          </Menu>
        </Grid>
      </Grid>
    </StyledHeaderWrapper>
  );
};

const TitleNameAppWrapStyle = styled(Grid)(() => ({
  fontFamily: 'Jost',
  marginLeft: '11px',
  fontSize: '40px',
  textTransform: 'uppercase',
  '&:hover': {
    cursor: 'pointer',
  },
}));
