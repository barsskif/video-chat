import  { FC, SyntheticEvent, useState } from 'react';
import { Stack } from '@mui/material';
import { UserListDrawer } from 'pages/VideoMeeting/components/MeetingOverlay/UserListDrawer';
import { TextChat } from 'components/TextChat/TextChat';
import { SidebarWrapper, StyledTab, StyledTabsContainer, TabWrapper } from 'components/StyledComponents';

import { useAppSelector } from 'hooks/redux';
import { VideoSettings } from 'pages/VideoMeeting/components/VideoSettings';

import { ReactComponent as UserIcon } from '../../../images/user.svg';
import { ReactComponent as ChatIcon } from '../../../images/chat.svg';

interface RightMenuProps {
  visible: boolean;
  devicesSettingsMenu: boolean;
  meetingHash: string;
  sendChatMessage: (message: string) => void;
}

enum enumTabs {
  USER_LIST = 'users',
  CHAT = 'chat',
}

export const MeetingSidebar: FC<RightMenuProps> = (props) => {
  const { meetingHash, sendChatMessage, visible, devicesSettingsMenu } = props;
  const [tabValue, setTabValue] = useState(enumTabs.USER_LIST);
  const { countUnread } = useAppSelector((state) => state.ChatReducer);

  const tabChangeHandle = (event: SyntheticEvent, targetTab: enumTabs) => {
    setTabValue(targetTab);
  };

  const tabContent = () => {
    if (tabValue === enumTabs.USER_LIST) return <UserListDrawer meetingHash={meetingHash} />;
    return <TextChat chatVisible={visible} sendChatMessage={sendChatMessage} />;
  };

  const sidebarContent = () => {
    if (devicesSettingsMenu) return <VideoSettings />;
    return (
      <>
        <TabWrapper>
          <StyledTabsContainer value={tabValue} onChange={tabChangeHandle}>
            <StyledTab icon={<UserIcon />} iconPosition="start" value={enumTabs.USER_LIST} label="Участники" />
            <StyledTab icon={<ChatIcon />} iconPosition="start" value={enumTabs.CHAT} label="Чат" point={countUnread} />
          </StyledTabsContainer>
        </TabWrapper>
        {tabContent()}
      </>
    );
  };

  return (
    <>
      <SidebarWrapper className={!visible ? 'hide' : ''}>
        <Stack direction="column" height="100vh" minWidth="342px">
          {sidebarContent()}
        </Stack>
      </SidebarWrapper>
    </>
  );
};
