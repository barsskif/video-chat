import { type PaletteOptions } from '@mui/material/styles';
import { typeThemesList } from 'types/share';

export const createPalette = (theme: typeThemesList): PaletteOptions => {
  const mainTheme = {
    background: {
      default: 'rgba(242,246,252,1)',
      root: '#FFF',
      secondary: '#fff',
      additional: 'rgba(255,0,0,0.02)',
      longMenuColor: 'rgba(255,0,0,0.12)',
      buttonSingIn: '#8C639B',
      buttonHoverSingIn: 'rgb(92, 66, 102)',
      buttonSwitch: '#9F4182',
      buttonPurple: '#D8BBE2',
      iconMoreVert: '#9F418C',
    },
    error: {
      main: '#EF4444',
    },
    primary: {
      main: '#007DFE',
      light: '#389aff',
      additional: 'rgba(255,0,0,0.03)',
    },
    secondary: {
      main: '#4A4A4A',
      light: '#9CA3AF',
      extraLight: '#949494',
    },
    success: {
      main: '#00BB29',
      light: '#1bd943',
    },
    action: {
      disabledBackground: 'rgba(0, 0, 0, 0.19)',
      disabled: 'rgba(0, 0, 0, 0.5)',
    },
    borders: {
      main: '#9CA3AF',
      light: '#6C6C92',
      disabled: 'rgba(255,0,0,0.04)',
      additional: '#8C639B',
    },
    text: {
      primary: '#212121',
      secondary: '#9CA3AF',
      additional: '#8C639B',
      title: '#1E1E1E'
    },
    textField: {
      main: '#9CA3AF',
      secondary: 'rgba(255,0,0,0.07)',
    },
    icons: {
      primary: '#9CA3AF',
      secondary: 'rgba(255,0,0,0.08)',
      active: '#FFFFFF',
    },
    translucent: {
      main: 'rgba(0, 0, 0, 0.5)',
    },
    scrollbar: {
      main: '#fdfdfd',
      thumb: '#dfdfdf',
    },
    notifications: {
      success: {
        primary: 'red',
      },
      warning: {
        primary: 'red',
      },
      info: {
        primary: 'red',
      },
      error: {
        primary: '#EF4444',
      },
      badges: {
        additional: '#334cefcf',
      },
    },
    shadows: {
      main: 'rgba(32, 56, 85, 0.15)',
    },
    datePicker: {
      border: '#aeaeae40',
      header: {
        background: '#389aff0f',
        bottomLine: '#389aff3b',
      },
      navigation: {
        active: '#9ca3af',
        disabled: 'rgba(156,163,175,0.49)',
        light: '#389aff',
      },
      day: {
        selected: '#007DFE',
        light: '#389aff3b',
      },
    },
    avatars: {
      me: '#598200',
      remote: '#1C65B0',
    },
  };
  const meetingTheme = {
    background: {
      default: 'rgba(242,246,252,1)',
      root: 'rgb(16,24,38)',
      secondary: '#17202E',
      additional: 'rgba(55, 65, 81, 0.5)',
      longMenuColor: '#27313F',
      black: '#000',
    },
    primary: {
      main: '#007DFE',
      light: '#389aff',
      additional: 'rgba(45, 140, 255, 0.1)',
    },
    secondary: {
      main: '#9CA3AF',
      light: '#717171',
      extraLight: '#949494',
    },
    success: {
      main: '#00BB29',
      light: '#1bd943',
    },
    action: {
      disabledBackground: 'rgba(0, 0, 0, 0.19)',
      disabled: 'rgba(0, 0, 0, 0.5)',
      closeTransparent: '#af2020c2',
    },
    borders: {
      main: 'rgba(55, 65, 81, 0.5)',
      light: 'rgba(75, 85, 99, 0.5)',
      disabled: '#4b55632e',
      additional: '#4B5563',
    },
    text: {
      primary: '#D1D5DB',
      secondary: '#6B7280',
      additional: '#9CA3AF',
    },
    textField: {
      main: '#717171',
      secondary: 'rgba(255,0,0,0.89)',
    },
    icons: {
      primary: '#FFF',
      secondary: '#374151',
      active: '#FFFFFF',
    },
    translucent: {
      main: 'rgba(0, 0, 0, 0.5)',
    },
    scrollbar: {
      main: '#fdfdfd',
      thumb: '#32435e4f',
    },
    notifications: {
      success: {
        primary: 'red',
      },
      warning: {
        primary: 'red',
      },
      info: {
        primary: 'red',
      },
      error: {
        primary: '#EF4444',
      },
      badges: {
        additional: '#334cefcf',
      },
    },
    shadows: {
      main: 'rgba(27, 46, 94, 0.08)',
    },
    datePicker: {
      border: '#aeaeae40',
      header: {
        background: '#389aff0f',
        bottomLine: '#389aff3b',
      },
      navigation: {
        active: '#007DFE',
        disabled: '#FFF',
        light: '#389aff',
      },
      day: {
        selected: '#007DFE',
        light: '#389aff3b',
      },
    },
    avatars: {
      me: '#598200',
      remote: '#1C65B0',
    },
  };
  switch (theme) {
    case 'main':
      return mainTheme;
    case 'meeting':
      return meetingTheme;
    default:
      return mainTheme;
  }
};
