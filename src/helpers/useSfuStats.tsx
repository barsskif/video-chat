import {useEffect, useState} from 'react';

export interface IUseSfuStats {
    sfuRef: { current: { webrtcStuff: { pc: RTCPeerConnection } } }; // update type to include RTCPeerConnection
    type?: string;
    webRTCStatus: boolean;
    pollInterval?: number; //интервал опроса (по умолчанию 5с)
    lossTrashHold?: number; //порог срабатывания (по умолчанию 40%)
}

interface RTCStatsReportWithType extends RTCStatsReport {
    type: string;
    kind: string
}

interface RTCInboundRtpStreamStats extends RTCRtpStreamStats {
    packetsReceived: number;
    packetsLost: number;
    packetsDiscarded: number;
    packetsReordered: number;
    bytesReceived: number;
    headerBytesReceived: number;
    bytesLost: number;
    jitter: number;
    fractionLost: number;
    packetsReceivedWithMarker: number;
    packetsReceivedLate: number;
    packetsReceivedInOrder: number;
    packetsReceivedOutOfOrder: number;
    packetsRepaired: number;
    fecPacketsReceived: number;
    fecPacketsDiscarded: number;
    bytesReceivedForFec: number;
    bytesRepaired: number;
    totalPackets: number;
    estimatedPlayoutTimestamp: number | null;
    lastPacketReceivedTimestamp: number | null;
    delayedPacketCount: number;
    delayedPacketCountCumulative: number;
    fecPacketsRecovered: number;
    packetsLostTotal: number;
}


export const useSfuStats = (props: IUseSfuStats): [number | null] => {
    const {
        sfuRef,
        webRTCStatus,
        pollInterval = 5000,
        lossTrashHold = 40
    } = props;

    const [packetLoss, setPacketLoss] = useState<number | null>(null);

    useEffect(() => {
        if (!webRTCStatus) return;
        const statsParser = async () => {
            const stats: RTCStatsReport = await sfuRef.current.webrtcStuff.pc.getStats();

            stats.forEach((stat: RTCStatsReportWithType): void => {
                if (stat.type === 'inbound-rtp' && stat.kind === 'audio') {
                    const inboundStats: RTCInboundRtpStreamStats = stat as unknown as RTCInboundRtpStreamStats;
                    if (inboundStats.fractionLost && inboundStats.fractionLost > lossTrashHold / 100) {
                        setPacketLoss(Math.round(inboundStats.fractionLost * 100));
                    } else {
                        setPacketLoss(null);
                    }
                }
            });
        };
        const intervalId = setInterval(statsParser, pollInterval);

        return () => clearInterval(intervalId);
    }, [webRTCStatus]);

    return [packetLoss];
};





