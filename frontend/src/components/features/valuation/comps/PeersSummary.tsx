import { cn } from '@/core/utils/cn';
import { formatMult, formatPct, formatBeta } from './utils';
import { ValuationStats } from './types';

interface PeersSummaryProps {
    isDarkMode: boolean;
    stats: ValuationStats;
}

export const PeersSummary = ({ isDarkMode, stats }: PeersSummaryProps) => {
    return (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div className={cn(
                "group relative rounded-[1.6rem] border p-6 transform-gpu will-change-transform transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none",
                isDarkMode
                    ? "border-sky-300/25 bg-linear-to-br from-sky-500/25 via-blue-600/15 to-blue-900/20"
                    : "border-cyan-300 bg-linear-to-br from-sky-500 via-blue-600 to-indigo-700 shadow-[0_24px_65px_rgba(37,99,235,0.55)]"
            )}>
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Median EV/Rev</p>
                <p className="mt-3 text-[42px] leading-none font-black tabular-nums text-white">{formatMult(stats.evRevenue.median)}</p>
            </div>
            <div className={cn(
                "group relative rounded-[1.6rem] border p-6 transform-gpu will-change-transform transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none",
                isDarkMode
                    ? "border-indigo-300/25 bg-linear-to-br from-indigo-500/25 via-violet-600/15 to-indigo-900/20"
                    : "border-violet-300 bg-linear-to-br from-indigo-500 via-violet-600 to-fuchsia-700 shadow-[0_24px_65px_rgba(139,92,246,0.55)]"
            )}>
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Median EV/EBITDA</p>
                <p className="mt-3 text-[42px] leading-none font-black tabular-nums text-white">{formatMult(stats.evEbitda.median)}</p>
            </div>
            <div className={cn(
                "group relative rounded-[1.6rem] border p-6 transform-gpu will-change-transform transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none",
                isDarkMode
                    ? "border-emerald-300/20 bg-linear-to-br from-emerald-500/20 via-teal-700/15 to-emerald-900/20"
                    : "border-emerald-300 bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-[0_24px_65px_rgba(16,185,129,0.52)]"
            )}>
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Revenue Growth</p>
                <p className="mt-3 text-[42px] leading-none font-black tabular-nums text-white">{formatPct(stats.revGrowth.median)}</p>
            </div>
            <div className={cn(
                "group relative rounded-[1.6rem] border p-6 transform-gpu will-change-transform transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none",
                isDarkMode
                    ? "border-amber-300/20 bg-linear-to-br from-amber-500/18 via-orange-600/14 to-amber-900/20"
                    : "border-amber-300 bg-linear-to-br from-amber-500 via-orange-500 to-rose-600 shadow-[0_24px_65px_rgba(249,115,22,0.52)]"
            )}>
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-white">EBITDA Margin</p>
                <p className="mt-3 text-[42px] leading-none font-black tabular-nums text-white">{formatPct(stats.ebitdaMargin.median)}</p>
            </div>
            <div className={cn(
                "group relative rounded-[1.6rem] border p-6 transform-gpu will-change-transform transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none",
                isDarkMode
                    ? "border-slate-300/20 bg-linear-to-br from-slate-400/18 via-slate-700/16 to-slate-900/22"
                    : "border-slate-300 bg-linear-to-br from-slate-400 via-slate-500 to-slate-700 shadow-[0_24px_65px_rgba(100,116,139,0.45)]"
            )}>
                <p className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Median Beta</p>
                <p className="mt-3 text-[42px] leading-none font-black tabular-nums text-white">{formatBeta(stats.beta.median)}</p>
            </div>
        </div>
    );
};
