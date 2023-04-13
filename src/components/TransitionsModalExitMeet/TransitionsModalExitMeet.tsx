import React, { FC } from 'react';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';

import { styled } from '@mui/material/styles';

interface ITransitionsModalExitMeetProps {
  endCallHandler: (isDelete: boolean) => Promise<void>;
  handleCloseModalExit: () => void;
  open: boolean;
}

export const TransitionsModalExitMeet: FC<ITransitionsModalExitMeetProps> = ({
  open,
  endCallHandler,
  handleCloseModalExit,
}) => {
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleCloseModalExit}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 600,
        }}
      >
        <Fade in={open}>
          <StyledBox>
            <Button variant="contained" onClick={() => endCallHandler(true)}>
              Завершить для Всех
            </Button>
            <Button variant="contained" color="error" onClick={() => endCallHandler(false)}>
              Выйти
            </Button>
          </StyledBox>
        </Fade>
      </Modal>
    </>
  );
};

const StyledBox = styled(Box)(() => ({
  position: 'absolute',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  backgroundColor: 'rgb(16,24,38)',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 100,
  borderRadius: '8px',
  boxShadow: '24px',
  padding: 4,
}));
