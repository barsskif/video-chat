import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// hooks
import { useAppDispatch } from 'hooks/redux';

//helper
import { convertData } from '../../../helpers/convertData';

// reduces
import { deletePlanningMeetings, editPlanningMeeting } from 'store/reducers/ActionCreate';

// types
import { IMeetingPlanned } from 'types/share';

// mui
import { Button, MenuItem, Popover, TableRow, Tooltip, Typography, useTheme } from '@mui/material';
import { StyledBoxBtns, StyledImgIcon, StyledMenu, StyledSpan, StyledTableCell } from '../MeetingsPalnnedStyles';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// images
import clipSvg from 'images/clipSvg.svg';

export const TableItem = ({ meeting }: { meeting: IMeetingPlanned }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [contextMenuPosition, setContextMenuPosition] = useState<null | HTMLElement>(null);
  const [popoverPosition, setPopoverPosition] = useState<HTMLElement | null>(null);
  const theme = useTheme();

  const handleMoreClick = (event: MouseEvent<HTMLElement>) => {
    setContextMenuPosition(event.currentTarget);
  };

  const injectInvite = (event: MouseEvent<HTMLElement>) => {
    setPopoverPosition(event['currentTarget']);
    navigator.clipboard.writeText(`${window.location.origin}/guest/${meeting.hashRoom}`);
  };

  const editMeeting = () => {
    navigate('/editPlannedMeeting/' + meeting.hashRoom);
  };

  const deleteMeeting = () => {
    dispatch(deletePlanningMeetings(meeting.hashRoom));
  };

  const handleClickStartMeeting = async () => {
    const data = {
      hash: meeting.hashRoom,
      isActive: true,
    };
    await dispatch(editPlanningMeeting(data));
    document.cookie = 'navigateTo=planned; path=/ max-age=21600';
    navigate(`/room/${meeting.hashRoom}`);
  };

  const contextMenuOptions = [
    { actionName: 'Начать сейчас', action: handleClickStartMeeting },
    { actionName: 'Изменить', action: editMeeting },
    { actionName: 'Удалить', action: deleteMeeting },
  ];

  const { convertedData, convertedDataStart, convertedDataEnd } = convertData(meeting.startDate, meeting.endDate);

  const open = Boolean(contextMenuPosition);
  return (
    <TableRow>
      <StyledTableCell align="left" component="th" scope="row" sx={{ padding: '10px', width: '20%' }}>
        <StyledSpan>{convertedData}</StyledSpan>
        <span>
          {convertedDataStart} - {convertedDataEnd}
        </span>
        <br></br>
      </StyledTableCell>
      <StyledTableCell component="th" scope="row" sx={{ width: '100%' }}>
        {meeting.roomName}
      </StyledTableCell>
      <StyledTableCell sx={{ width: '5%' }}>
        <StyledBoxBtns>
          <Tooltip title="Скопировать ссылку">
            <Button
              sx={{
                color: theme.palette.background.default,
                '&:hover': {
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: 'none',
                },
              }}
              onClick={injectInvite}
            >
              <StyledImgIcon src={clipSvg} />
            </Button>
          </Tooltip>
          <Popover
            open={popoverPosition !== null}
            anchorEl={popoverPosition}
            onClose={() => setPopoverPosition(null)}
            anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
            PaperProps={{
              style: {
                borderRadius: '8px',
                border: `1px solid ${theme.palette.borders.additional}`,
                boxShadow: `0px 8px 24px -4px ${theme.palette.shadows.main}`,
              },
            }}
          >
            <Typography sx={{ margin: '5px' }} variant="body1">
              Ссылка скопирована
            </Typography>
          </Popover>
          <Tooltip title="Действия">
            <Button
              sx={{
                color: theme.palette.background.default,
                '&:hover': {
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: 'none',
                },
              }}
              aria-label="more"
              id="long-button"
              aria-controls={open ? 'long-menu' : undefined}
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleMoreClick}
            >
              <MoreVertIcon
                sx={{
                  '&.MuiSvgIcon-root': {
                    fontSize: '1.2rem',
                    color: open ? theme.palette.background.iconMoreVert : theme.palette.action.disabled,
                  },
                }}
              />
            </Button>
          </Tooltip>
          <StyledMenu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={contextMenuPosition}
            open={open}
            onClose={() => setContextMenuPosition(null)}
          >
            {contextMenuOptions.map((option) => (
              <MenuItem
                key={option.actionName}
                onClick={option.action}
                sx={{
                  fontSize: '14px',
                  '&:hover': {
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.background.buttonSwitch,
                  },
                }}
              >
                {option.actionName}
              </MenuItem>
            ))}
          </StyledMenu>
        </StyledBoxBtns>
      </StyledTableCell>
    </TableRow>
  );
};
