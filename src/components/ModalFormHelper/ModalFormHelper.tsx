// components
import { validationSchema } from './components/validationSchema';
import { TextareaStyledModal, StyledTextFieldModal, ButtonStyledModal } from './ModalFromStyles';
import { useFormik } from 'formik';

// mui
import { FormControl, Box, Typography, Modal, useTheme } from '@mui/material';
import { isMobile } from 'react-device-detect';

// TODO: доделать, когда будет сделан бэк на отправку почты + any поменять
export const ModalFormHelper = ({ openModal, changeOpenModal }: { openModal: boolean; changeOpenModal: any }) => {
  const theme = useTheme();
  const handleSubmitForm = async (values: { nameUser: string; emailUser: string; commentUser: string }) => {
    return;
  };

  const formik = useFormik({
    initialValues: {
      nameUser: '',
      emailUser: '',
      commentUser: '',
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmitForm,
  });

  const changeModalFormHelper = () => {
    return changeOpenModal(!openModal);
  };

  const { commentUser, emailUser, nameUser } = formik.values;

  return (
    <>
      <Modal
        open={openModal}
        onClose={changeModalFormHelper}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '70%' : 400,
            boxShadow: '0px 5px 15px rgba(92, 66, 102, 0.7)',
            border: `2px solid ${theme.palette.borders.light}`,
            borderRadius: '28px',
            backgroundColor: theme.palette.background.root,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
          component="form"
          onSubmit={formik.handleSubmit}
        >
          <Typography id="modal-modal-title" variant="h2" component="h2" textAlign="center" marginBottom="20px">
            Отправка предложения в команду разработчиков
          </Typography>
          <FormControl>
            <StyledTextFieldModal
              className="Focus-shadow"
              value={nameUser}
              color="primary"
              id="nameUser"
              type="text"
              name="nameUser"
              label="Имя"
              required
              variant="outlined"
              fontSize="20px"
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl>
            <StyledTextFieldModal
              className="absoluteError topError Focus-shadow"
              type="email"
              value={emailUser}
              color="primary"
              id="emailUser"
              name="emailUser"
              required
              label="Email"
              fontSize="20px"
              variant="outlined"
              onChange={formik.handleChange}
            />
          </FormControl>
          <FormControl>
            <TextareaStyledModal
              className="Focus-shadow"
              required
              id="commentUser"
              name="commentUser"
              value={commentUser}
              color="primary"
              placeholder="Ваше предложение"
              onChange={formik.handleChange}
            />
          </FormControl>
          <ButtonStyledModal type="submit">Отправить</ButtonStyledModal>
        </Box>
      </Modal>
    </>
  );
};
