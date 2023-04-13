import { useMemo } from "react";

import { Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { StyledAlertRecordStatus } from "components/StyledComponents";

interface IIsRecordMsgProps {
    isLoading: boolean;
    isRecord: boolean;
    recordBotError: string
}

const ProgressComponent = () => {
    return (
        <Stack spacing={2} direction="row">
            <CircularProgress color="secondary" size={20}/>
        </Stack>
    )
}

export const IsRecordMsg = ({ isLoading, isRecord, recordBotError }: IIsRecordMsgProps) => useMemo(() => {
    if (isLoading) {
        return (
            <StyledAlertRecordStatus severity="info" icon={<ProgressComponent/>}>
                Включение записи конференции!
            </StyledAlertRecordStatus>
        )
    }

    if (isRecord) return <StyledAlertRecordStatus severity="success">Идет запись!</StyledAlertRecordStatus>

    if (recordBotError) return <StyledAlertRecordStatus severity="error">{recordBotError}</StyledAlertRecordStatus>

    return <></>

}, [isLoading, isRecord])