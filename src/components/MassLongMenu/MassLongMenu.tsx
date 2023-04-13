import React from 'react';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { optionsEnum } from 'types/share';
import { Stack, Typography } from '@mui/material';
import { ColorizerSVG, StyledSidebarButton } from 'components/StyledComponents';
import { ReactComponent as SubMenuBtn } from '../../images/sub-menu-btn.svg';

const ITEM_HEIGHT = 48;

interface IOptions {
  title: string;
  action: optionsEnum;
}

interface ILongMenu {
  options: IOptions[];
}

export const MassLongMenu = (props: ILongMenu) => {
  const { options } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickItem = async (option: string) => {
    console.log('click', option);
    handleClose();
  };

  return (
    <>
      <StyledSidebarButton variant="contained" onClick={handleClick} sx={{ maxWidth: '111px', paddingLeft: '12px' }}>
        <Stack direction="row" alignItems="center" spacing="6.5px">
          <Typography fontSize="10px">Отключить всем</Typography>
          <ColorizerSVG sx={{ marginTop: '2.5px', display: 'flex', alignItems: 'flex-end' }}>
            <SubMenuBtn width="2px" height="10px" />
          </ColorizerSVG>
        </Stack>
      </StyledSidebarButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderRadius: '8px',
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
            transform: 'translateX(40%) translateY(-17%)',
          },
        }}
      >
        {options.map(({ action, title }) => (
          <MenuItem key={action} onClick={() => handleClickItem(action)}>
            {title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
