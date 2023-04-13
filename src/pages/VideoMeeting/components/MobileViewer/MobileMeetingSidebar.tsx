import React, { FC } from 'react';

import { ArrowBackRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import { MobileBackButtonWrapper, MobileSidebarWrapper } from 'components/MobileStyledComponents';
import { TextChat } from 'components/TextChat/TextChat';

interface IMobileMeetingSidebarProps {
  visible: boolean;
  sendChatMessage: (message: string) => void;
  toggleSidebar: () => void;
}

export const MobileMeetingSidebar: FC<IMobileMeetingSidebarProps> = (props) => {
  const { visible, sendChatMessage, toggleSidebar } = props;

  return (
    <MobileSidebarWrapper className={!visible ? 'hide' : ''}>
      <MobileBackButtonWrapper>
        <IconButton onClick={toggleSidebar}>
          <ArrowBackRounded />
        </IconButton>
      </MobileBackButtonWrapper>
      <TextChat chatVisible={visible} sendChatMessage={sendChatMessage} />
    </MobileSidebarWrapper>
  );
};
