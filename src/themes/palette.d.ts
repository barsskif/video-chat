import { PaletteColorOptions } from '@mui/material';
import { SimplePaletteColorOptions } from '@mui/material/styles/createPalette';

interface extendedPrimaryPaletteColorOptions extends PaletteColorOptions {
  additional: string;
}

interface extendedSecondaryPaletteColorOptions extends PaletteColorOptions {
  extraLight: string;
}

interface extendedBackgroundPaletteColorOptions extends PaletteColorOptions {
  longMenuColor: string;
  root: string;
  black: string;
}

interface extendedBorderPaletteColorOptions extends SimplePaletteColorOptions {
  disabled: string;
  additional: string;
}

interface textPaletteColorOptions {
  primary: string;
  secondary: string;
  additional: string;
  title: string
}

interface iconsPaletteColorOptions {
  primary: string;
  secondary: string;
  active: string;
}

interface scrollbarPaletteOptions {
  main: string;
  thumb: string;
}

interface notificationsColorOptions {
  success: {
    primary: string;
  };
  warning: {
    primary: string;
  };
  info: {
    primary: string;
  };
  error: {
    primary: string;
  };
  badges: {
    additional: string;
  };
}

interface datePickerPaletteColorOptions {
  border: string;
  header: {
    background: string;
    bottomLine: string;
  };
  navigation: {
    active: string;
    disabled: string;
    light: string;
  };
  day: {
    selected: string;
    light: string;
  };
}

interface avatarsPaletteColorOptions {
  me: string;
  remote: string;
}

declare module '@mui/material/styles/createPalette' {
  export interface PaletteColor {
    extraLight: string;
    additional: string;
  }

  export interface TypeBackground {
    longMenuColor: string;
    root: string;
    secondary: string;
    additional: string;
    black: string;
    buttonSingIn: string;
    buttonHoverSingIn: string;
    buttonSwitch: string;
    buttonPurple: string;
    iconMoreVert: string;
  }

  export interface TypeText {
    primary: string;
    secondary: string;
    additional: string;
    title: string
  }

  export interface TypeAction {
    closeTransparent: string;
  }

  export interface Palette {
    primary: extendedPrimaryPaletteColorOptions;
    secondary: extendedSecondarySimplePaletteColorOptions;
    background: extendedBackgroundPaletteColorOptions;
    icons: iconsPaletteColorOptions;
    translucent: SimplePaletteColorOptions;
    text: textPaletteColorOptions;
    scrollbar: scrollbarPaletteOptions;
    textField: SimplePaletteColorOptions;
    borders: extendedBorderPaletteColorOptions;
    notifications: notificationsColorOptions;
    shadows: SimplePaletteColorOptions;
    datePicker: datePickerPaletteColorOptions;
    avatars: avatarsPaletteColorOptions;
  }

  export interface PaletteOptions {
    primary: extendedPrimaryPaletteColorOptions;
    secondary: extendedSecondaryPaletteColorOptions;
    background: extendedBackgroundPaletteColorOptions;
    icons: iconsPaletteColorOptions;
    translucent: PaletteColorOptions;
    text: textPaletteColorOptions;
    scrollbar: scrollbarPaletteOptions;
    textField: PaletteColorOptions;
    borders: extendedBorderPaletteColorOptions;
    notifications: notificationsColorOptions;
    shadows: PaletteColorOptions;
    datePicker: datePickerPaletteColorOptions;
    avatars: avatarsPaletteColorOptions;
  }
}

declare module '@mui/icons-material' {
  interface SvgIconPropsColorOverrides {
    icons: true;
  }
}

declare module '@mui/material/SvgIcon' {
  interface SvgIconPropsColorOverrides {
    icons: true;
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    textField: true;
  }
}

declare module '@mui/material/InputBase' {
  interface InputBasePropsColorOverrides {
    textField: true;
  }
}
