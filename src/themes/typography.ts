import { Palette, ThemeOptions } from '@mui/material';
import { CSSProperties } from 'react';

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    primary: true;
    secondary: true;
    additional: true;
    main: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    primary: CSSProperties;
    secondary: CSSProperties;
    additional: CSSProperties;
    main: CSSProperties;
  }

  interface TypographyVariantsOptions {
    primary?: CSSProperties;
    secondary?: CSSProperties;
    additional: CSSProperties;
    main: CSSProperties;
  }
}

type Func = (palette: Palette) => NonNullable<ThemeOptions['typography']>;

export const createTypography: Func = (palette) => ({
  h1: {
    fontSize: '2.5rem',
  },
  h2: {
    fontSize: '25px',
    fontFamily: 'Jost',
    color: palette.text.additional,
  },
  h3: {
    fontSize: '1.75rem',
  },
  h4: {
    fontSize: '1.5rem',
  },
  h5: {
    fontSize: '1.25rem',
  },
  h6: {
    fontSize: '1rem',
  },
  primary: {
    fontFamily: 'Jost',
    color: palette.text.primary,
  },
  secondary: {
    fontFamily: 'Jost',
    color: palette.text.secondary,
  },
  additional: {
    fontFamily: 'Jost',
    color: palette.text.additional,
  },
  allVariants: {
    fontFamily: 'Jost',
    fontSize: '12px',
    color: palette.text.primary,
  },
  main: {
    fontFamily: 'Jost',
    color: palette.primary.main,
  },
});
