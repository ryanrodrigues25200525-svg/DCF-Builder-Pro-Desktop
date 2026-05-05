import { formatMoney, formatPct } from './utils';
import { PrecedentStats } from './types';
import { GlassCard } from '@/components/ui/primitives/GlassCard';

interface PrecedentImpactProps {
    targetRevenue: number;
    targetEbitda: number;
    stats: PrecedentStats;
}

export const PrecedentImpact = ({
    targetRevenue,
    targetEbitda,
    stats,
}: PrecedentImpactProps) => {
    const impliedEvRevenue = targetRevenue * stats.medianEvRevenue;
    const impliedEvEbitda = targetEbitda > 0 ? targetEbitda * stats.medianEvEbitda : 0;

    const hasValidRevenueValuation = impliedEvRevenue > 0;
    const hasValidEbitdaValuation = impliedEvEbitda > 0;

    const blendedEv = (hasValidRevenueValuation && hasValidEbitdaValuation)
        ? (impliedEvRevenue + impliedEvEbitda) / 2
        : hasValidRevenueValuation ? impliedEvRevenue : impliedEvEbitda;

    return (
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <GlassCard variant="regular" className="border border-(--border-subtle) bg-linear-to-br from-(--bg-glass) to-transparent p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-(--text-tertiary)">Revenue Method EV</p>
                <p className="mt-2 text-[30px] font-black tracking-tighter tabular-nums text-(--text-primary)">
                    {hasValidRevenueValuation ? formatMoney(impliedEvRevenue) : 'N/A'}
                </p>
                <p className="mt-1 text-[11px] font-medium text-(--text-muted)">
                    {hasValidRevenueValuation ? `@ ${stats.medianEvRevenue.toFixed(1)}x EV/Rev` : 'Insufficient Data'}
                </p>
            </GlassCard>

            <GlassCard variant="regular" className="border border-(--border-subtle) bg-linear-to-br from-(--bg-glass) to-transparent p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-(--text-tertiary)">EBITDA Method EV</p>
                <p className="mt-2 text-[30px] font-black tracking-tighter tabular-nums text-(--text-primary)">
                    {hasValidEbitdaValuation ? formatMoney(impliedEvEbitda) : 'N/A'}
                </p>
                <p className="mt-1 text-[11px] font-medium text-(--text-muted)">
                    {hasValidEbitdaValuation ? `@ ${stats.medianEvEbitda.toFixed(1)}x EV/EBITDA` : 'Target EBITDA ≤ 0'}
                </p>
            </GlassCard>

            <GlassCard 
                variant="regular" 
                className="relative overflow-hidden border border-blue-500/30 bg-linear-to-br from-blue-600/10 via-blue-900/5 to-transparent p-5"
            >
                <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/10 blur-3xl" />
                <p className="text-[11px] font-black uppercase tracking-[0.08em] text-blue-600 dark:text-blue-400">Blended Implied EV</p>
                <p className="mt-2 text-[34px] font-black tracking-tighter tabular-nums text-(--text-primary)">
                    {blendedEv > 0 ? formatMoney(blendedEv) : 'N/A'}
                </p>
                <p className="mt-1 text-[11px] font-medium text-(--text-muted)">Median premium: {formatPct(stats.medianPremium)}</p>
            </GlassCard>
        </div>
    );
};

