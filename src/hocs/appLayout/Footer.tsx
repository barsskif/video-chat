import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// mui
import { Box, Link as MuiLink, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Copyright } from '@mui/icons-material';
import Modal from '@mui/material/Modal';

//components
import { StyledFooterWrapper } from 'components/StyledComponents';
import { ModalFormHelper } from 'components/ModalFormHelper/ModalFormHelper';

export const Footer = () => {
  const queryMobileViewer = useMediaQuery('(min-width:550px)');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const theme = useTheme();

  const navigate = useNavigate();

  const changeOpenModal = (open: boolean) => {
    setOpenModal(open);
  };
  const [isClick, setClick] = useState(false);
  let click = 0;

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handelClick = () => {
    click++;
    if (click >= 5) {
      setClick(true);
      click = 0;
    }
  };

  const handleClose = () => {
    click++;
    if (click >= 10) {
      setClick(false);
    }
  };

  const modal = () => {
    return (
      <Modal
        open={isClick}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="parent-modal-title">Мое обращение мои дорогие!</h2>
          <p id="parent-modal-description">
            Дорогие Настя, Влад, ну и себя бы хотел упомянуть (Перепелюков Андрей) - я хотел бы выразить свою искреннюю
            благодарность Вам за ваше невероятное усердие, профессионализм и умение создавать высококачественное
            программное обеспечение. Ваша работа действительно удивительна и важна для многих других, которые используют
            этот продукт. Я хотел бы также упомянуть ПМ Кристину за ее отличную работу в руководстве проектами и
            координации работы между отделами. Без ее усилий, наша команда не смогла бы достичь таких выдающихся
            результатов. Все вы, Настя, Влад и Кристина - самые лучшие в мире и настоящие профессионалы в своей области.
            Я глубоко уважаю вашу работу и очень ценю вклад, который вы в этот продукт и в отрасль в целом. Спасибо вам
            за все, что вы делаете!
          </p>
        </Box>
      </Modal>
    );
  };

  // TODO: сделать открытие модального окна, когда сделают бэк
  if (queryMobileViewer)
    return (
      <>
        <ModalFormHelper openModal={openModal} changeOpenModal={changeOpenModal} />
        {modal()}
        <StyledFooterWrapper container direction="row" gap={2}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Copyright />
            <Typography sx={{ fontSize: '16px', color: theme.palette.borders.light }} onClick={handelClick}>
              Let`s meet
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography>
              <MuiLink
                underline="none"
                color="inherit"
                // onClick={()=>setOpenModal(true)}
                sx={{ fontSize: '16px', cursor: 'pointer' }}
              >
                Помощь
              </MuiLink>
            </Typography>
            <Box paddingLeft="53px">
              <Typography
                sx={{ fontSize: '16px', color: theme.palette.borders.light, cursor: 'pointer' }}
                onClick={() => navigate('/privacyPolicy')}
              >
                Политика конфиденциальности
              </Typography>
            </Box>
          </Stack>
        </StyledFooterWrapper>
      </>
    );

  // TODO: сделать открытие модального окна, когда сделают бэк
  return (
    <>
      <ModalFormHelper openModal={openModal} changeOpenModal={changeOpenModal} />
      {modal()}
      <StyledFooterWrapper container direction="row" gap={1}>
        <Box fontSize={'15px'}>
          <Typography
            sx={{ fontSize: '12px', color: theme.palette.borders.light, cursor: 'pointer' }}
            onClick={() => navigate('/privacyPolicy')}
          >
            Политика конфиденциальности
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography fontSize={'15px'}>
            <MuiLink
              underline="none"
              color="inherit"
              // onClick={()=>setOpenModal(true)}
              sx={{ fontSize: '12px', cursor: 'pointer' }}
            >
              Помощь
            </MuiLink>
          </Typography>
        </Stack>
      </StyledFooterWrapper>
    </>
  );
};
