import { Dispatch, SetStateAction } from 'react';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';

import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

interface ITransitionsModalExitMeetProps {
    open: boolean;
    setResetPasswordModal: Dispatch<SetStateAction<boolean>>;
}

export const InfoResetPasswordModal = ({ open, setResetPasswordModal }: ITransitionsModalExitMeetProps) => {
    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={() => setResetPasswordModal(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 600,
                }}
            >
                <Fade in={open}>
                    <StyledBox>
                        <Typography variant="h5" sx={{ color: '#ffffff' }}>
                            На вашу почту
                        </Typography>
                        <Typography variant="h5" sx={{ color: '#ffffff' }}>
                            выслано письмо с ссылкой для сброса пароля!
                        </Typography>
                    </StyledBox>
                </Fade>
            </Modal>
        </>
    );
};

const StyledBox = styled(Box)(() => ({
    position: 'absolute',
    backgroundColor: 'rgb(16,24,38)',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 100,
    borderRadius: '8px',
    boxShadow: '24px',
    padding: 10,
}));
