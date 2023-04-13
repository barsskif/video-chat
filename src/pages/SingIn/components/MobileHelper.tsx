import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';

export const MobileHepler = ({
  isMove,
  setIsMove,
}: {
  isMove: boolean;
  setIsMove: Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (isMove) {
    setTimeout(() => {
      setIsMove(false);
    }, 3000);
  }

  return (
    <BoxStyled sx={{ transform: isMove ? 'translateY(0px)' : 'translateY(-200px)' }}>
      <Typography color="#fff" variant="h5">
        Данная функция находится в разработке!
      </Typography>
    </BoxStyled>
  );
};

const BoxStyled = styled(Box)(() => ({
  position: 'absolute',
  background: 'rgb(177 94 179)',
  textAlign: 'center',
  width: '100%',
  height: '50px',
  zIndex: '9',
  transition: 'all 1s',
}));
