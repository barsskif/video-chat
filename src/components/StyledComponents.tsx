import { Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectProps,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import isPropValid from '@emotion/is-prop-valid';

import singInImg from '../images/singIn.jpg';
import mainImg from '../images/main.jpg';
import notFoundImg from '../images/404.jpg';
import internalErrorImg from '../images/500.jpg';

import '../themes/palette.d';
import './StyledComponents.d';

export const StyledChatSendButton = styled(Button)(() => ({
  width: '36px',
  minWidth: '30px',
  height: '36px',
  borderRadius: '8px',
  padding: '6px 0 0 3px',
}));

export const StyledExpectationTitle = styled('p')(() => ({
  color: '#6B7280',
  fontSize: 16,
  padding: '8px 0 0 16px',
}));

export const StyledEndCallButton = styled(Button)(() => ({
  height: '40px',
  minHeight: '40px',
  maxWidth: '140px',
  marginLeft: '18px !important',
  textTransform: 'unset',
  padding: '0 16px',
  whiteSpace: 'nowrap',
  borderRadius: '8px',
}));

export const StyledAlertRecordStatus = styled(Alert)(() => ({
  position: 'absolute',
  left: '13px',
  top: '13px',
  backgroundColor: 'rgb(87 217 115)',
  borderRadius: '10px'
}));

export const StyledInvitation = styled(Button)(() => ({
  height: '40px',
  minHeight: '40px',
  maxWidth: '140px',
  marginLeft: '18px !important',
  textTransform: 'unset',
  padding: '0 16px',
  whiteSpace: 'nowrap',
  borderRadius: '8px',

  fontWeight: 500,
  fontSize: '12px',
  color: '#FFFFFF',
  backgroundColor: '#598200',
}));

export const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.additional,
  border: '1px solid',
  borderColor: theme.palette.primary.additional,
  fontSize: '10px',
  height: '18px',
  '& .MuiChip-label': {
    paddingLeft: 8,
    paddingRight: 8,
    color: '#2D8CFF',
  },
}));

export const StyledScrollList = styled(List)(({ theme }) => ({
  overflowY: 'scroll',
  overflowX: 'hidden',
  padding: '8px 0 30px 16px',
  height: '100%',
  '&::-webkit-scrollbar': {
    backgroundColor: 'unset',
    width: '18px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.scrollbar.thumb,
    borderRadius: '200px',
    border: '5px solid transparent',
    backgroundClip: 'padding-box',
  },
}));

export const StyledScrollListExpectation = styled(List)(({ theme, dense }) => ({
  overflowY: dense ? 'scroll' : 'visible',
  overflowX: 'visible',
  padding: '8px 16px 0 16px',
  '&::-webkit-scrollbar': {
    backgroundColor: 'unset',
    width: '18px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.scrollbar.thumb,
    borderRadius: '200px',
    border: '5px solid transparent',
    backgroundClip: 'padding-box',
  },
}));

export const StyledMeetingBox = styled(Box)(({ theme }) => ({
  height: '40px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0 10px',
  margin: 0,
  background: theme.palette.background.additional,
  border: '1px solid',
  borderColor: theme.palette.borders.light,
  borderRadius: '8px',
}));

export const SquareButton = styled(Button)(({ theme, color }) => ({
  width: '40px',
  minWidth: '40px',
  height: '40px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  margin: 0,
  background: color ? theme.palette[color].main : theme.palette.background.additional,
  border: '1px solid',
  borderColor: `${!color && theme.palette.borders.light}`,
  borderRadius: '8px',
  '& span': {
    paddingTop: '7px',
  },
  '&:hover': {
    backgroundColor: color ? theme.palette[color].light : theme.palette.background.secondary,
  },
  '&.Mui-disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    borderColor: theme.palette.borders.disabled,
    '& svg': {
      opacity: 0.5,
    },
  },
}));

export const MeetingOverlayWrapper = styled(Box)<{ sidebar: string }>(({ theme, sidebar }) => ({
  height: '60px',
  backgroundColor: theme.palette.background.secondary,
  borderLeft: '1px solid',
  borderTop: '1px solid',
  padding: '0 70px',
  zIndex: 999,
  borderColor: theme.palette.borders.main,
  '& .volumeBlock': {
    marginLeft: '58px',
    [theme.breakpoints.down(1200)]: {
      marginLeft: '16px',
    },
  },
  [theme.breakpoints.down(sidebar === 'true' ? 1430 : 980)]: {
    '& .volumeBlock': {
      marginLeft: 0,
    },
    '& .recordBlock': {
      display: 'none',
    },
  },
  [theme.breakpoints.down(sidebar === 'true' ? 1200 : 900)]: {
    '& .volumeBlock': {
      display: 'none',
    },
  },
  [theme.breakpoints.down(sidebar === 'true' ? 1070 : 0)]: {
    '& .videoSettingsButton': {
      display: 'none',
    },
  },
  [theme.breakpoints.down(sidebar === 'true' ? 1020 : 0)]: {
    padding: '0 22px',
  },
  [theme.breakpoints.down(sidebar === 'true' ? 920 : 0)]: {
    '& .switchSidebarButton': {
      display: 'none',
    },
    '& .switchCountIcon': {
      display: 'none',
    },
  },
}));

export const ColorizerSVG = styled('span')<{ type?: 'stroke' | 'fill' | 'all' }>(({ theme, color, type = 'fill' }) => ({
  '& path': (() => {
    const paletteColor = () => {
      switch (color) {
        case 'secondary':
          return theme.palette.icons.secondary;
        case 'active':
          return theme.palette.icons.active;
        case 'error':
          return theme.palette.error.main;
        case 'primary':
          return theme.palette.primary.main;
        default:
          return theme.palette.icons.primary;
      }
    };
    switch (type) {
      case 'stroke':
        return { fill: 'unset', stroke: paletteColor() };
      case 'fill':
        return { fill: paletteColor(), stroke: 'unset' };
      case 'all':
        return { fill: paletteColor(), stroke: paletteColor() };
      default:
        return { fill: 'unset', stroke: 'unset' };
    }
  })(),
}));

export const TabWrapper = styled(Box)(({ theme }) => ({
  borderBottom: '1px solid',
  borderColor: theme.palette.borders.main,
  display: 'flex',
  justifyContent: 'center',
  padding: '12px',
}));

export const StyledTab = styled(Tab)<{ point?: number }>(({ theme, point }) => ({
  color: theme.palette.secondary.main,
  minHeight: '32px',
  fontSize: '12px',
  width: '50%',
  '& path': {
    fill: theme.palette.icons.primary,
  },
  '&.Mui-selected': {
    backgroundColor: 'none',
    color: theme.palette.icons.active,
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '& path': {
      fill: theme.palette.icons.active,
    },
  },
  '&:after': {
    content: '""',
    width: '6px',
    height: '5px',
    backgroundColor: point ? theme.palette.notifications.error.primary : 'unset',
    marginLeft: '10px',
    borderRadius: '50px',
  },
}));

export const StyledTabsContainer = styled(Tabs)(({ theme }) => ({
  justifyContent: 'center',
  backgroundColor: theme?.palette.background.additional,
  height: '56px',
  borderRadius: '10px',
  width: '311px',
  '& .MuiTouchRipple-root': {
    display: 'none',
  },
  '& .MuiTabs-flexContainer': {
    height: '100%',
  },
  '& .MuiButtonBase-root': {
    zIndex: 2,
  },
  '& .MuiTabs-indicator': {
    height: 'calc(100% - 8px)',
    marginBottom: '4px',
    borderRadius: '8px',
    zIndex: 1,
    background: theme?.palette.primary.main,
  },
  '& .MuiTabs-scroller': {
    margin: '0 4px 0 4px',
  },
}));

export const SidebarWrapper = styled('div')(({ theme }) => ({
  width: '342px',
  minWidth: '342px',
  height: '100%',
  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  backgroundColor: theme.palette.background.secondary,
  borderLeft: `1px solid ${theme.palette.borders.main}`,
  overflow: 'hidden',
  zIndex: 10,
  '&.hide': {
    width: 0,
    minWidth: 0,
  },
}));

export const CustomImg = styled('img')(({ disabled }: { disabled?: boolean }) => ({
  filter: disabled ? 'grayscale(1)' : 'none',
}));

export const StyledDialogCross = styled(IconButton)(() => ({
  position: 'absolute',
  top: '3px',
  right: '3px',
}));

export const StyledCircularProgress = styled(CircularProgress)(({ wh_size = '80' }: { wh_size?: string }) => ({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  margin: 'auto',
  width: `${wh_size}px !important`,
  height: `${wh_size}px !important`,
  zIndex: 999,
}));

export const ChatWrapper = styled(List)(({ theme }) => ({
  overflowY: 'scroll',
  overflowX: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '& > :first-of-type': {
    marginTop: 'auto',
  },
  '&::-webkit-scrollbar': {
    backgroundColor: 'unset',
    width: '18px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.scrollbar.thumb,
    borderRadius: '200px',
    border: '5px solid transparent',
    backgroundClip: 'padding-box',
  },
}));

export const StyledNoMessageInfo = styled(ListItem)(() => ({
  position: 'absolute',
  left: 0,
  right: 0,
  height: '95%',
  margin: 'auto',
  width: '140px',
}));

export const NoPlannedMeetingContainer = styled(Stack)(() => ({
  height: '70vh',
  margin: 'auto',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const StyleChatMessageContainer = styled(ListItem)(({ styleposition }: { styleposition: 'left' | 'right' }) => ({
  width: styleposition === 'right' ? '90%' : '96%',
  margin: styleposition === 'right' ? '2px 0 2px 10%' : '2px 10% 2px 0',
  flexDirection: styleposition === 'right' ? 'row' : 'row-reverse',
  justifyContent: styleposition === 'right' ? 'flex-end' : 'flex-end',
  alignItems: 'flex-end',
  padding: '8px',
}));

export const StyleChatMessage = styled(Box)<IStyleChatMessageProps>(({ variantstyle, theme }) => ({
  backgroundColor: variantstyle === 'primary' ? theme.palette.primary.additional : theme.palette.background.additional,
  borderColor:
    variantstyle === 'primary' ? theme.palette.primary.additional : theme.palette.borders.light + '!important',
  color: theme.palette.text.primary,
  borderRadius: `8px 8px ${variantstyle === 'primary' ? '0 8px' : '8px 0'}`,
  padding: '6px',
  whiteSpace: 'break-spaces',
  wordBreak: 'break-all',
  position: 'relative',
  '&:after': {
    content: "''",
    position: 'absolute',
    width: 0,
    height: 0,
    bottom: 0,
    right: variantstyle === 'primary' ? '-8px' : 'unset',
    left: variantstyle === 'primary' ? 'unset' : '-8px',
    border: '4px solid',
    borderColor: `transparent ${
      variantstyle === 'primary'
        ? 'transparent ' + theme.palette.primary.additional + ' ' + theme.palette.primary.additional
        : theme.palette.background.additional + ' ' + theme.palette.background.additional + ' transparent'
    }`,
  },
}));

export const StyleChatAvatar = styled(Avatar)<{ styleposition: 'left' | 'right' }>(({ theme, styleposition }) => ({
  margin: styleposition === 'right' ? '5px 0 5px 10px' : '0 10px 0 0',
  backgroundColor: styleposition === 'right' ? theme.palette.avatars.me : theme.palette.avatars.remote,
  borderRadius: '8px',
  '& svg': {
    color: theme.palette.icons.active,
  },
}));

//<Select> который нормально работает с переданной в startAdornment иконкой + принимает цветовую схему
export const IconSelect = styled(Select)<SelectProps>(({ theme, color }) => ({
  paddingLeft: '15px',
  height: '52px',
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.borders.light,
  },
  '& .MuiSelect-select': {
    paddingTop: '20px',
    paddingRight: '5px !important',
    paddingLeft: `${isMobile ? 14 : 30}px !important`,
    fontSize: '20px',
  },
  '& .MuiSvgIcon-root': {
    position: 'absolute',
    left: `${isMobile ? 4 : 15}px`,
  },
  '& > fieldset': {
    borderColor: color && theme.palette[color].main,
    borderRadius: '40px',
    '&.MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.borders.main,
    },
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.borders.light + ' !important',
  },
}));

//Одноцветный фон на всю страницу
export const RootBackground = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.background.root,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    backgroundColor: 'unset',
    width: '18px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.scrollbar.thumb,
    borderRadius: '200px',
    border: '5px solid transparent',
    backgroundClip: 'padding-box',
  },
}));

export const StyledChatTextArea = styled(TextField)(() => ({
  '& .MuiInputBase-root': {
    fontSize: '14px',
    paddingRight: '80px',
    maxHeight: '250px',
    minHeight: `${isMobile ? 50 : 0}px`,
    paddingBottom: `${isMobile ? 20 : 10}px`,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '& > fieldset': {
      borderColor: 'transparent',
      '&.MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent',
      },
    },
  },
  '& .MuiInputBase-root:hover > fieldset': {
    borderColor: 'transparent',
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const StyledTextField = styled(TextField)<{ height?: string; fontSize?: string }>(
  ({ theme, height, fontSize }) => ({
    '& .MuiInputBase-input': {
      fontSize: '20px',
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
        left: '-9px',
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

export const VideoOverlayContainer = styled('div')(() => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  '&.speaker:before': {
    content: "''",
    height: '96.5%',
    width: '98%',
    borderRadius: '1%',
    display: 'inline-block',
    position: 'fixed',
    boxShadow: '0 0 0 2px rgb(0 49 100)',
  },
}));

export const VideoGridWrapper = styled('div')(() => ({
  margin: '52px 52px 25px 52px',
  height: '100%',
  position: 'relative',
}));

export const WrapperVideoContainer = styled('div')(() => ({
  '&.animate': {
    transitionDuration: '.3s',
    transitionProperty: 'width, height, transform, -webkit-transform',
  },
}));

export const VideoContainer = styled('div')<{ sidebar?: string }>(({ theme, sidebar }) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: ' rgba(55, 65, 81, 0.5)',
  border: '1px solid rgba(31, 41, 55, 0.5)',
  width: '98%',
  height: '96.5%',
  margin: 'auto',
  borderRadius: '8px',
  overflow: 'hidden',
  transition: 'width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  '&.bigScreen': {
    position: 'fixed',
    width: sidebar ? 'calc(100vw - 342px)' : '100vw !important',
    height: 'calc(100vh - 57px)',
    top: 0,
    right: sidebar ? 'unset' : 0,
    left: 0,
    margin: 'auto',
    transform: `translateX(0) translateY(0) !important`,
    zIndex: 6,
    '&:after': {
      content: '""',
      position: 'fixed',
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.palette.background.black,
      zIndex: '-1',
    },
    '&.mobile': {
      width: '100vw !important',
      height: '100vh',
      '& video': {
        width: '100% !important',
      },
    },
  },
}));

export const StyledRoundButton = styled(Button)(() => ({
  width: '86px',
  height: '86px',
  color: '#1976d2',
  border: '1px solid #1976d2',
  borderRadius: '100px !important',
  margin: '0 20px',
  '&.Mui-disabled': {
    color: 'grey',
    borderColor: 'grey',
  },
}));

export const StyledMeetingCardItem = styled(ListItem)(() => ({
  padding: '0 34px 30px 38px',
}));

export const MeetingCardButton = styled(Button)(() => ({
  fontSize: '8px',
  width: '71px',
  minWidth: '71px',
  height: '33px',
}));

export const StyledFooterWrapper = styled(Grid)(({ theme }) => ({
  padding: '0px 41px 15px 30px',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  position: 'absolute',
  bottom: 0,
  '& svg': {
    color: theme.palette.icons.primary,
    width: '14px',
    height: '14px',
  },
  '& a': {
    color: '#6C6C92',
  },

  ['@media (max-width:440px)']: {
    position: 'absolute',
    bottom: 0,
  },
}));

export const StyledHeaderWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  height: '50px',
  width: '100%',
  '& .container': {
    backgroundColor: theme.palette.background.root,
    paddingRight: '38px',
    width: 'calc(100% - 8px)',
  },
}));

export const StyledMeetingsList = styled(List)(({ theme }) => ({
  height: '136px',
  overflowY: 'auto',
  margin: '32px 0 0 0',
  padding: 0,
  '&::-webkit-scrollbar': {
    backgroundColor: 'unset',
    width: '18px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.scrollbar.thumb,
    borderRadius: '200px',
    border: '5px solid transparent',
    backgroundClip: 'padding-box',
  },
}));

export const SingInImg = styled(Box)(() => ({
  width: '36vw',
  maxWidth: '734px',
  minWidth: '100px',
  backgroundImage: `url(${singInImg})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
}));

export const MainImg = styled(Box)(() => ({
  maxWidth: '650px',
  backgroundImage: `url(${mainImg})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
}));

export const NotFoundImg = styled(Box)(() => ({
  maxWidth: '518px',
  maxHeight: '336px',
  backgroundImage: `url(${notFoundImg})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
}));

export const InternalErrorImg = styled(Box)(() => ({
  maxWidth: '518px',
  maxHeight: '336px',
  backgroundImage: `url(${internalErrorImg})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
}));

export const StyledDatePicker = styled(Box)(({ theme }) => ({
  '& .datePicker': {
    borderRadius: '8px',
    borderColor: theme.palette.datePicker.border,
    boxShadow: `0px 8px 24px -4px ${theme.palette.shadows.main}`,
    '& .react-datepicker__navigation': {
      marginTop: '7px',
      '& *::before': {
        borderColor: theme.palette.datePicker.navigation.active,
      },
      '&:hover *::before': {
        borderColor: theme.palette.datePicker.navigation.light,
      },
      '&.react-datepicker__navigation--previous--disabled, .react-datepicker__navigation--next--disabled': {
        '& *::before': {
          borderColor: theme.palette.datePicker.navigation.disabled,
        },
        '&:hover *::before': {
          borderColor: theme.palette.datePicker.navigation.disabled,
        },
      },
    },
    '& .react-datepicker__header': {
      backgroundColor: theme.palette.datePicker.header.background,
      borderBottomColor: theme.palette.datePicker.header.bottomLine,
    },
    '& .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__time-name': {
      margin: '6px',
    },
    '& .react-datepicker__day:not(.react-datepicker__day--disabled, .react-datepicker__day--outside-month, .react-datepicker__day--selected):hover':
      {
        backgroundColor: theme.palette.datePicker.day.light,
      },
    '& .react-datepicker__day--selected': {
      backgroundColor: theme.palette.datePicker.day.selected,
      borderRadius: '8px',
    },
    '& .react-datepicker__current-month, .react-datepicker-time__header, .react-datepicker-year-header': {
      marginBottom: '10px',
      marginTop: '7px',
    },
    '& .react-datepicker__day--keyboard-selected': {
      backgroundColor: 'unset',
      color: 'unset',
    },
    '& .react-datepicker__day--outside-month': {
      color: theme.palette.datePicker.navigation.disabled,
      '&: hover': {
        backgroundColor: theme.palette.datePicker.day.light,
      },
    },
    '& .react-datepicker__day-name::first-letter': {
      textTransform: 'uppercase',
    },
    '& .react-datepicker__current-month::first-letter': {
      textTransform: 'uppercase',
    },
  },
}));

export const StyledSidebarButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.additional,
  borderRadius: '6px !important',
  fontSize: '10px',
  textTransform: 'unset',
  fontWeight: 300,
  lineHeight: '12px',
  minHeight: '26px',
  maxHeight: '26px',
  whiteSpace: 'nowrap',
  '&:hover': {
    backgroundColor: theme.palette.borders.light,
  },
}));

export const StyledVideoBlur = styled('div')(() => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
  '& video': {
    borderRadius: '0 !important',
  },
  '& .leftBlur, .rightBlur': {
    height: '100%',
    width: '-webkit-fill-available',
    position: 'relative',
    overflow: 'hidden',
  },
  '& .rightBlur': {
    marginLeft: '-1px',
    '&:after': {
      left: '-2px',
      content: '""',
      position: 'absolute',
      height: '100%',
      width: '5px',
      backdropFilter: 'blur(6px)',
      transform: 'scaleX(1000)',
      zIndex: 2,
    },
  },
  '& .leftBlur': {
    marginRight: '-1px',
    '&:after': {
      right: '-2px',
      content: '""',
      position: 'absolute',
      height: '100%',
      width: '5px',
      backdropFilter: 'blur(6px)',
      transform: 'scaleX(1000)',
      zIndex: 1,
    },
  },
}));

export const StyleLink = styled(Link, { shouldForwardProp: isPropValid })<IStyleProps>(
  ({
    theme,
    marginTop = '10px',
    fontWeight = 400,
    fontSize = '16px',
    lineHeight = 'unset',
    color = theme.palette.primary.main,
  }) => ({
    fontStyle: 'normal',
    textDecoration: 'none',
    marginTop,
    fontWeight,
    fontSize,
    lineHeight,
    color,
    fontFamily: 'Jost',
  }),
);

interface IStyleAvatarProps {
  borderRadius?: string | 0;
  width?: string | 0;
  height?: string | 0;
  backgroundColor: string;
}

export const StyleAvatar = styled(Avatar, { shouldForwardProp: isPropValid })<IStyleAvatarProps>(
  ({ borderRadius = '8px', width = '32px', height = '32px', backgroundColor }) => ({
    borderRadius,
    backgroundColor,
    width,
    height,
  }),
);

export const BoxNumberPeopleStyled = styled(Box)(() => ({
  width: '100%',
  fontFamily: 'Jost',
  textAlign: 'center',
  color: '#9CA3AF',
  padding: '20px 0px 10px 0px',
}));

export const StyledButtonPurple = styled(Button)(({ theme }) => ({
  cursor: 'pointer',
  textAlign: 'center',
  fontSize: `${isMobile ? 11 : 13}px !important`,
  background: theme.palette.background.buttonPurple,
  borderRadius: '40px !important',
  color: theme.palette.background.buttonSwitch,
  textTransform: 'none',
  marginTop: '30px',
  '&:hover': {
    backgroundColor: theme.palette.background.buttonPurple,
    color: theme.palette.background.buttonSwitch,
  },
}));

export const StyledTypography = styled(Typography)(() => ({
  textAlign: 'left',
  fontWeight: '700',
  fontFamily: 'Jost',
  color: 'black',
  fontSize: '32px',
}));

export const StyledButtonPrimaryPurple = styled(Button)(({ theme }) => ({
  width: `${isMobile ? 240 : 350}px`,
  height: '50px',
  fontSize: '20px',
  textTransform: 'none',

  borderRadius: '40px !important',
  backgroundColor: theme.palette.background.buttonSwitch,
  '&:hover': {
    backgroundColor: theme.palette.background.buttonSwitch,
    color: theme.palette.icons.active,
  },
}));

export const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: theme.palette.background.buttonSwitch,
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: theme.palette.background.buttonPurple,
  },
}));

export const ListStyled = styled(List)(() => ({
  padding: '10px 20px',
  textAlign: 'center',
  maxHeight: '60%',
  overflow: 'auto',
  fontSize: '14px',
}));

export const ButtonStyled = styled(Button)(({ theme }) => ({
  border: `1px solid ${theme.palette.borders.light}`,
  width: '100%',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  fontSize: `${isMobile ? 11 : 13}px !important`,
}));

export const StyleLogo = styled('span')(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  fontSize: '36px',
  color: theme.palette.text.additional,
  paddingTop: '50px',
  alignItems: 'center',
  '& span': {
    color: '#8484B6',
    margin: '0px 11px 0px 11px',
  },
  ['@media (max-width:500px)']: {
    fontSize: '26px',
  },
}));

export const BoxImgs = styled('div')(() => ({
  display: 'flex',
  margin: '50px 0px',
  alignItems: 'flex-end',
  justifyContent: 'center',
  flexDirection: 'row',

  padding: '0px 20px',
  ['@media (max-width:540px)']: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  ['@media (max-width:600px), (max-height: 800px) ']: {
    display: 'none',
  },
}));

export const BoxImg = styled('div')(() => ({
  textAlign: 'center',
  alignItems: 'center',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  margin: '0px 5%',
}));

export const ImgSingInStyled = styled('img')(() => ({
  maxWidth: '256px',
  maxHeight: '178px',
}));

export const StyleTitleSingIn = styled('span')(({ theme }) => ({
  fontSize: '36px',
  color: theme.palette.text.additional,
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  textAlign: 'center',
  fontFamily: 'Jost',
  ['@media (max-width:500px)']: {
    fontSize: '26px',
  },
}));

export const StyleSpan = styled('span')(({ theme }) => ({
  fontSize: '30px',
  color: theme.palette.text.additional,
  fontFamily: 'Jost',
}));

export const StyleButton = styled(Button)<{ minwidth?: string; minheight?: string; backgroundcolor: string }>(
  ({ theme, minwidth, minheight, backgroundcolor }) => ({
    minWidth: minwidth || '100%',
    minHeight: minheight || '52px',
    fontSize: '20px',
    color: theme.palette.background.root,
    fontWeight: '400',
    fontFamily: 'Jost',
    textTransform: 'none',
    borderRadius: '50px !important',
    backgroundColor: backgroundcolor,
    '&:hover': {
      backgroundColor: backgroundcolor,
    },
  }),
);

export const StyledImgLogo = styled('img')(() => ({
  height: '40px',
  width: '40px',
}));

export const StyledBoxPagesComponent = styled(Box)(() => ({
  minHeight: 'calc(100vh - 20px)',
  maxHeight: 'calc(100vh - 100px)',
}));

export const StyledBtnCreateJoin = styled(Button)(({ theme }) => ({
  borderRadius: '28px !important',
  height: isMobile ? '15vh' : '123px',
  color: theme.palette.background.root,
  fontSize: '16px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  width: '253px',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgb(177 94 179)',
  },
  background: 'rgb(177 94 179)',
  flexDirection: 'column',
  fontFamily: 'Jost',
}));

export const GridStyledRooms = styled(Grid)(() => ({
  justifyContent: 'center',
  alignItems: 'center',
  width: '156px',
  ['@media (max-width:450px)']: {
    width: '300px',
  },
}));
