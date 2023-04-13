import {ChangeEvent, FormEvent, useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {useAppDispatch, useAppSelector} from 'hooks/redux';
import {VideoSettingsSlice} from 'store/reducers/VideoSettingsSlice';

import {connection} from 'utils/SignalRSocket';

import {ServerErrorDescriptionEnum} from 'types/share';

import appLayout from '../../hocs/appLayout';
import {ColorizerSVG, CustomImg, StyledTextField} from 'components/StyledComponents';

import {Box, Button, IconButton, Link, Stack} from '@mui/material';

import guestImage from '../../images/GuestImage.png';
import {ReactComponent as MicActiveIcon} from '../../images/mic-active-outlined.svg';
import {ReactComponent as MicInactiveIcon} from '../../images/mic-inactive.svg';
import {ReactComponent as CamActiveIcon} from '../../images/CamActive.svg';
import {ReactComponent as CamInactiveIcon} from '../../images/no-video-cam.svg';
import {enumLocalStorage} from 'types/share';
import {loginGuest, meetingExists} from 'store/reducers/ActionCreate';
import {DifferentStatesSlice} from 'store/reducers/DifferentStatesSlice';
import {useCookieHandler} from "hooks/useCookieHandler";

export const GuestAccess = appLayout(() => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {meetingHash} = useParams();

    const {
        user,
        videoStatus,
        audioStatus,
        meetingHash: meetingStateHash,
        error: meetingStateError,
        statusConnectionSignalR,
        metingInfo
    } = useAppSelector((state) => ({
        user: state.SingInReducer.user,
        videoStatus: state.VideoSettingsReducer.videoStatus,
        audioStatus: state.VideoSettingsReducer.audioStatus,
        meetingHash: state.MeetingReducer.meetingHash,
        metingInfo: state.MeetingReducer.currentMeeting,
        error: state.MeetingReducer.error,
        statusConnectionSignalR: state.DifferentStatesSlice.statusConnectionSignalR
    }))

    const {
        switchAudio,
        switchVideo
    } = VideoSettingsSlice.actions;

    const {reducerStatusConnectionSignalR} = DifferentStatesSlice.actions;

    const recoverGuestName = localStorage.getItem(enumLocalStorage.GUEST_NAME);
    const [guestName, setGuestName] = useState<string>(recoverGuestName ?? '');
    const [validationError, setValidationError] = useState<string>('');
    const [devMode, setDevMode] = useState<boolean>(false);
    const [connectionId, setConnectionId] = useState<string | null>(null);

    useEffect(() => {
        localStorage.removeItem(enumLocalStorage.USER_DATA);
    }, []);

    const startSocketSignalR = async () => {
        if (statusConnectionSignalR) return;
        try {
            await connection.start();
            setConnectionId(connection.connectionId);
            dispatch(reducerStatusConnectionSignalR(true));
        } catch (err) {
            console.log(err);
            dispatch(reducerStatusConnectionSignalR('не удалось подключиться к сокетам'));
        }
    };

    useCookieHandler(setGuestName)

    useEffect(() => {

        if (user && meetingStateHash && !validationError && !meetingStateError) {
            navigate(`/room/${meetingHash}`, {state: {role: 'guest'}});
        }

        if (
            meetingStateError?.description === ServerErrorDescriptionEnum.MEETING_NOT_ACTIVE &&
            sessionStorage.getItem('accessEnter') === 'false'
        ) {
            navigate('/meetingWaiting', {state: {role: 'guest', meetingHash: meetingHash, connectionId: connectionId}});
        }
    }, [user, meetingHash, meetingStateHash, validationError, meetingStateError, metingInfo]);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        if (user && meetingHash) {
            await startSocketSignalR();
            await dispatch(meetingExists(meetingHash));
            localStorage.setItem(enumLocalStorage.GUEST_NAME, user?.userName || '');
            return;
        }

        if (!validationError && nameValidate(guestName)) {
            localStorage.setItem(enumLocalStorage.GUEST_NAME, guestName);
            localStorage.setItem(enumLocalStorage.USER_DATA, JSON.stringify({userName: guestName, userEmail: 'Гость'}));
            sessionStorage.setItem('accessEnter', 'false');

            if (!user) {
                localStorage.setItem('role', 'guest');
            }

            if (meetingHash && !user) {
                await dispatch(loginGuest(guestName));
                await startSocketSignalR();
                await dispatch(meetingExists(meetingHash));
            }
        }
        document.cookie = `userName=${guestName}; path=/; max-age=315360000`;
    };

    const micButton = useMemo(() => {
        const onClickHandler = () => {
            dispatch(switchAudio(!audioStatus));
        };
        const icon = (): JSX.Element => {
            if (audioStatus) return <MicActiveIcon width="13" height="20px" viewBox="0 0 15 20"/>;
            return <MicInactiveIcon width="13" height="20px" viewBox="3 5 15 10"/>;
        };
        return (
            <IconButton onClick={onClickHandler} id="bot-btn-mic">
                <Box width="20px" height="20px" padding="0 2px 4px 2px">
                    <ColorizerSVG>{icon()}</ColorizerSVG>
                </Box>
            </IconButton>
        );
    }, [audioStatus, dispatch, switchAudio]);

    const camButton = useMemo(() => {
        const onClickHandler = () => dispatch(switchVideo(!videoStatus));
        const icon = () => {
            if (videoStatus) return <CamActiveIcon width="20px" height="20px" viewBox="0 0 20 15"/>;
            return <CamInactiveIcon width="20px" height="20px" viewBox="1 3 20 15"/>;
        };
        return (
            <IconButton onClick={onClickHandler}>
                <Box width="20px" height="20px" padding="0 2px 4px 2px">
                    <ColorizerSVG>{icon()}</ColorizerSVG>
                </Box>
            </IconButton>
        );
    }, [dispatch, switchVideo, videoStatus]);

    const nameValidate = (value: string) => {
        if (value === 'ЯТвойКодПи') return setDevMode(true);
        if (value.length > 31 && !devMode) return setValidationError('Максимальное количество символов - 30');
        if (validationError) setValidationError('');
        return true;
    };

    const onChangeNameHandler = (event: ChangeEvent<HTMLInputElement>) => {
        if (nameValidate(event.target.value)) setGuestName(event.target.value);
    };

    const relocate = () => {
        navigate('/');
    };

    return (
        <>
            <Box component="form" padding="0 20px" height="calc(100vh - 100px)" onSubmit={submitHandler}
                 id="form-bot-record">
                <Stack
                    height="calc(100% - 100px)"
                    minHeight="320px"
                    maxWidth="525px"
                    minWidth="300px"
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    margin="auto"
                >
                    <Box marginBottom="29px" maxWidth="60vh">
                        <CustomImg width="100%" alt="image" src={guestImage}/>
                    </Box>
                    <Stack direction="column" maxWidth="380px" width="100%">
                        <Stack direction="column" marginBottom="39px" width="100%" spacing={1}>
                            <Link onClick={relocate} sx={{textDecoration: 'none'}} alignSelf="flex-end">
                                Регистрация
                            </Link>
                            <StyledTextField
                                className="absoluteError"
                                id="bot-input"
                                type="text"
                                value={guestName}
                                onChange={onChangeNameHandler}
                                color="primary"
                                label="Ваше имя"
                                fullWidth
                                variant="outlined"
                                fontSize="16px"
                                helperText={
                                    validationError !== '' ? validationError : meetingStateError && 'Конференция уже не существует'
                                }
                            />
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                            <Stack direction="row" marginLeft="7px">
                                {micButton}
                                {camButton}
                            </Stack>
                            <Button
                                id="btn-bot-record"
                                variant="contained"
                                onClick={submitHandler}
                                disabled={!!validationError || !!meetingStateError}
                                sx={{width: '192px', height: '52px'}}
                            >
                                Подключиться
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
}, false);
