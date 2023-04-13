import { Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { isMobile } from 'react-device-detect';

export const StyledBox = styled(Box)(() => ({
  alignItems: 'center',
  paddingBottom: isMobile ? '0' : '107px',
}));

export const StyledBoxLine = styled(Box)(({ theme }) => ({
  background: theme.palette.background.buttonPurple,
  width: '1px',
  height: '189px',
}));

export const StyledTextFieldSingIn = styled(TextField)<{ height?: string; fontSize?: string }>(
  ({ theme, height, fontSize }) => ({
    '& .MuiInputBase-input': {
      fontSize: '20px',
      padding: '10px 20px 15px 20px',
      '&:-webkit-autofill': {
        boxShadow: '10px 10px 10px 30px white inset !important',
      },
    },
    '&.Focus-shadow .MuiInputBase-root': {
      transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      '&.Mui-focused': {
        boxShadow: '0px 5px 15px rgba(92, 66, 102, 0.7)',
        '&.Mui-error': {
          boxShadow: '0px 5px 15px rgba(125, 0, 0, 0.3)',
        },
      },
    },
    '& .MuiSelect-icon': {
      color: theme.palette.icons.secondary,
    },
    '& .MuiInputLabel-root': {
      ...(fontSize && { fontSize }),
      left: '6px',
      '&.Mui-focused': {
        color: theme.palette.text.additional,
      },
    },
    '&:hover': {
      '& .MuiInputLabel-root.Mui-focused': {
        color: theme.palette.text.additional,
      },
      '& .Mui-error.MuiFormLabel-root.Mui-focused': {
        color: theme.palette.error.main,
      },
    },
    '& .Mui-error.MuiFormLabel-root.Mui-focused': {
      color: theme.palette.error.main,
    },
    '& .MuiInputBase-root': {
      ...(height && { height }),
      ...(fontSize && { fontSize }),
      '&.Mui-focused': {
        '& > fieldset': {
          borderColor: theme.palette.borders.light + ' !important',
        },
      },
      '&.Mui-error': {
        '& > fieldset': {
          borderColor: theme.palette.error.main + ' !important',
        },
      },
      borderRadius: '30px',
      '& > fieldset': {
        borderColor: theme.palette.borders.main,
        boxSizing: 'border-box',
        ...(height && { height: `calc(${height} + 3px)` }),
        '&.MuiOutlinedInput-notchedOutline': {
          borderColor: theme.palette.borders.main,
          padding: '10px 14px',
        },
      },
    },
    '& .MuiInputBase-root:hover ': {
      '& > fieldset': {
        borderColor: theme.palette.borders.light,
      },
    },
    '&.absoluteError': {
      '& .MuiFormHelperText-root': {
        position: 'absolute',
        bottom: '-22px',
        left: 0,
      },
      '&.topError': {
        '& .MuiFormHelperText-root': {
          bottom: 'unset',
          left: 'unset',
          top: '-32px',
          right: 0,
        },
      },
    },
  }),
);
