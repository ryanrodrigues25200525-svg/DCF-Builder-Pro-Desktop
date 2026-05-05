import { cn } from '@/core/utils/cn';
import { 
    formatMult, 
    formatPct, 
    formatBeta 
} from './utils';
import { ValuationStats } from './types';

interface PeersTableStatsProps {
    isDarkMode: boolean;
    stats: ValuationStats;
}

export const PeersTableStats = ({
    isDarkMode,
    stats,
}: PeersTableStatsProps) => {
    return (
        <>
            <tr className={cn(isDarkMode ? "bg-sky-500/6" : "bg-sky-50")}>
                <td className="border-t border-(--border-default) px-5 py-6 dark:border-white/15" colSpan={6}>
                    <span className={cn("text-[14px] font-black uppercase tracking-[0.2em]", isDarkMode ? "text-white/75" : "text-slate-700")}>Peer Median</span>
                </td>
                <td className="border-t border-(--border-default) px-5 py-6 text-right text-[20px] font-black text-sky-500 dark:border-white/15 dark:text-sky-300">{formatMult(stats.evRevenue.median)}</td>
                <td className="border-t border-(--border-default) px-5 py-6 text-right text-[20px] font-black text-indigo-500 dark:border-white/15 dark:text-indigo-300">{formatMult(stats.evEbitda.median)}</td>
                <td className="border-t border-(--border-default) px-5 py-6 text-right text-[20px] font-black text-emerald-500 dark:border-white/15 dark:text-emerald-300">{formatPct(stats.revGrowth.median)}</td>
                <td className="border-t border-(--border-default) px-5 py-6 text-right text-[20px] font-black text-amber-600 dark:border-white/15 dark:text-amber-200">{formatPct(stats.ebitdaMargin.median)}</td>
                <td className="border-t border-(--border-default) px-5 py-6 text-right text-[20px] font-black text-(--text-primary) dark:border-white/15 dark:text-white/90">{formatBeta(stats.beta.median)}</td>
                <td className="border-t border-(--border-default) px-5 py-6 text-right text-[20px] font-black text-(--text-tertiary) dark:border-white/15 dark:text-white/40">-</td>
            </tr>
            <tr className={cn(isDarkMode ? "bg-[#050b18]/80" : "bg-slate-50")}>
                <td className="border-t border-(--border-default) px-5 py-5 dark:border-white/10" colSpan={6}>
                    <span className={cn("text-[14px] font-black uppercase tracking-[0.2em]", isDarkMode ? "text-white/60" : "text-slate-600")}>Peer Mean</span>
                </td>
                <td className="border-t border-(--border-default) px-5 py-5 text-right text-[18px] text-(--text-secondary) dark:border-white/10 dark:text-white/70">{formatMult(stats.evRevenue.mean)}</td>
                <td className="border-t border-(--border-default) px-5 py-5 text-right text-[18px] text-(--text-secondary) dark:border-white/10 dark:text-white/70">{formatMult(stats.evEbitda.mean)}</td>
                <td className="border-t border-(--border-default) px-5 py-5 text-right text-[18px] text-(--text-secondary) dark:border-white/10 dark:text-white/70">{formatPct(stats.revGrowth.mean)}</td>
                <td className="border-t border-(--border-default) px-5 py-5 text-right text-[18px] text-(--text-secondary) dark:border-white/10 dark:text-white/70">{formatPct(stats.ebitdaMargin.mean)}</td>
                <td className="border-t border-(--border-default) px-5 py-5 text-right text-[18px] text-(--text-secondary) dark:border-white/10 dark:text-white/70">{formatBeta(stats.beta.mean)}</td>
                <td className="border-t border-(--border-default) px-5 py-5 text-right text-[18px] text-(--text-tertiary) dark:border-white/10 dark:text-white/35">-</td>
            </tr>
        </>
    );
};
