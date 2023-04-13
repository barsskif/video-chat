import { Palette, ThemeOptions } from '@mui/material';

type Func = (palette: Palette) => NonNullable<ThemeOptions['components']>;

export const createComponents: Func = (palette) => ({
  MuiButton: {
    defaultProps: {
      style: {
        boxShadow: 'none',
        borderRadius: '8px',
      },
    },
  },
  MuiLink: {
    styleOverrides: {
      root: {
        fontFamily: 'Jost',
        fontSize: '12px',
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: palette.text.secondary,
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        color: palette.text.primary,
      },
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        color: palette.icons.primary,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        background: palette.background.secondary,
        borderColor: palette.background.secondary,
        borderRadius: 0,
        '& .MuiList-root': {
          background: palette.background.secondary,
        },
        '&::-webkit-scrollbar': {
          backgroundColor: 'unset',
          width: '18px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: palette.scrollbar.thumb,
          borderRadius: '200px',
          border: '5px solid transparent',
          backgroundClip: 'padding-box',
        },
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      root: {
        color: palette?.text?.primary ?? 'red',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: palette?.borders?.main ?? 'red',
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        '&.MuiFormLabel-colorSecondary': {
          color: palette.text.secondary,
        },
      },
    },
  },
  MuiAvatar: {
    styleOverrides: {
      root: {
        textTransform: 'uppercase',
      },
    },
  },
});
