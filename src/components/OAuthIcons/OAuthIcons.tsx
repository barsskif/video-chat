import { IconButton, Stack, Tooltip, Link as MuiLink, Box } from '@mui/material';

import { CustomImg } from '../StyledComponents';

import googleImg from 'images/Google.png';
import vkImg from 'images/VK.png';
import yandexImg from 'images/yandex.png';

export const OAuthIcons = ({ ssoUrl }: { ssoUrl: string }) => {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" marginTop="20px" marginBottom="40px">
      <Tooltip title="Авторизация через google аккаунт" followCursor>
        <Box>
          <MuiLink href={`${ssoUrl}/Auth/login/google`}>
            <IconButton sx={{ width: '34px', height: '34px' }}>
              <CustomImg src={googleImg} alt="google auth" width={'30px'} />
            </IconButton>
          </MuiLink>
        </Box>
      </Tooltip>
      <Tooltip title="Функция в разработке" placement="bottom">
        <Box>
          <IconButton disabled sx={{ width: '34px', height: '34px' }}>
            <CustomImg src={vkImg} alt="vk auth" disabled width={'30px'} />
          </IconButton>
        </Box>
      </Tooltip>
      <Tooltip title="Авторизация через yandex аккаунт" placement="bottom">
        <Box>
          <MuiLink href={`${ssoUrl}/Auth/login/yandex`}>
            <IconButton sx={{ width: '32px', height: '32px' }}>
              <CustomImg src={yandexImg} alt="yandex auth" width={'26px'} />
            </IconButton>
          </MuiLink>
        </Box>
      </Tooltip>
    </Stack>
  );
};
