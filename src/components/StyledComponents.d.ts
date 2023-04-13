import { TypographyProps } from '@mui/material';

declare module './StyledComponents' {
  interface IStyleProps {
    marginTop?: string | 0;
    fontWeight?: string | number;
    fontSize?: string;
    lineHeight?: string;
    color?: string;
  }

  interface IStyleChatMessageProps extends TypographyProps {
    variantstyle: 'primary' | 'secondary';
  }
}
