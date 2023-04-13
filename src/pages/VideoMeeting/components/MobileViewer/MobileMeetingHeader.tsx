import { Dispatch, FC, SetStateAction } from 'react';
import { useAppSelector } from 'hooks/redux';

import { Box, Stack } from '@mui/material';

import { ColorizerSVG } from 'components/StyledComponents';
import { MobileChatBadge } from 'components/MobileStyledComponents';

import { ReactComponent as ChatIcon } from '../../../../images/chat.svg';
import { ReactComponent as SettingsIcon } from '../../../../images/Settings.svg';

interface IMobileMeetingHeaderProps {
    toggleSidebar: () => void;
    setMobileDeviceSettings: Dispatch<SetStateAction<boolean>>;
}

export const MobileMeetingHeader: FC<IMobileMeetingHeaderProps> = ({ toggleSidebar, setMobileDeviceSettings }) => {
    const { countUnread } = useAppSelector((state) => state.ChatReducer);

    return (
        <Stack height="73px" width="100%" direction="row" justifyContent="flex-end" alignItems="center">
            <Box onClick={() => setMobileDeviceSettings((prev) => !prev)} marginRight="20px" marginTop="6px" height="15px">
                <SettingsIcon width="25px" height="25px" viewBox="0 0 25 25"/>
            </Box>
            <Box marginRight="20px" marginTop="6px" height="15px" onClick={toggleSidebar}>
                <MobileChatBadge badgeContent={countUnread} color="primary">
                    <ColorizerSVG type="stroke">
                        <ChatIcon/>
                    </ColorizerSVG>
                </MobileChatBadge>
            </Box>
        </Stack>
    );
};
