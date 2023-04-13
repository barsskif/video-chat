import React, { useEffect } from 'react';
import { ReactNode, useState } from 'react';
import { Palette, Theme } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createPalette } from './palette';
import { createComponents } from './components';
import { createTypography } from './typography';
import './typography';
import { typeThemesList } from 'types/share';
import { useAppSelector } from 'hooks/redux';

export type ThemeProviderProps = {
  children: ReactNode;
};

const appCreateTheme = (paletteTheme: typeThemesList): Theme => {
  const palette = createPalette(paletteTheme);
  return createTheme({
    palette: palette,
    components: createComponents(palette as Palette),
    typography: createTypography(palette as Palette),
  });
};

export const AppThemeProvider = (props: ThemeProviderProps): JSX.Element => {
  const [theme, setTheme] = useState(() => appCreateTheme('main'));
  const { theme: themePreset } = useAppSelector((state) => state.DifferentStatesSlice);

  useEffect(() => {
    setTheme(appCreateTheme(themePreset));
  }, [themePreset]);

  return <ThemeProvider theme={theme}>{props.children}</ThemeProvider>;
};
