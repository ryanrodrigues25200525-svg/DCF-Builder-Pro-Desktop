import { cn } from '@/core/utils/cn';
import { ComparableCompany } from '@/core/types';
import { ValuationStats } from './types';
import { PeerRow } from './PeerRow';
import { PeersTableHeader } from './PeersTableHeader';
import { PeersTableStats } from './PeersTableStats';

interface PeersTableProps {
    isDarkMode: boolean;
    peers: ComparableCompany[];
    isPeerSelected: (ticker: string) => boolean;
    togglePeer: (ticker: string) => void;
    getPeerQualityScore: (peer: ComparableCompany) => number;
    sparklineData: Record<string, number[]>;
    stats: ValuationStats;
}

export const PeersTable = ({
    isDarkMode,
    peers,
    isPeerSelected,
    togglePeer,
    getPeerQualityScore,
    sparklineData,
    stats,
}: PeersTableProps) => {
    return (
        <div
            className={cn(
                "comparables-table-shell overflow-hidden rounded-[1.6rem] border backdrop-blur-xl",
                isDarkMode
                    ? "border-white/10 bg-[rgba(8,14,28,0.65)]"
                    : "border-(--border-default) bg-white"
            )}
        >
            <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full border-separate border-spacing-0">
                    <PeersTableHeader />
                    <tbody className="text-sm">
                        {peers.map((peer) => (
                            <PeerRow
                                key={peer.ticker}
                                peer={peer}
                                active={isPeerSelected(peer.ticker)}
                                togglePeer={togglePeer}
                                quality={getPeerQualityScore(peer)}
                                sparklineData={sparklineData[peer.ticker] || []}
                            />
                        ))}
                        <PeersTableStats isDarkMode={isDarkMode} stats={stats} />
                    </tbody>
                </table>
            </div>
        </div>
    );
};
