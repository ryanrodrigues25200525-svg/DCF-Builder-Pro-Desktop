import { cn } from '@/core/utils/cn';
import { formatMult } from './utils';

interface ModelImpactProps {
    isDarkMode: boolean;
    medianEvEbitda: number;
    modelExitMultiple?: number;
    modelImpactDelta: number;
    impliedSharePrice?: number;
    currentSharePrice?: number;
}

export const ModelImpact = ({
    isDarkMode,
    medianEvEbitda,
    modelExitMultiple,
    modelImpactDelta,
    impliedSharePrice,
    currentSharePrice,
}: ModelImpactProps) => {
    return (
        <div className={cn(
            "mb-8 rounded-[1.6rem] border px-6 py-5",
            isDarkMode ? "border-white/10 bg-white/4" : "border-slate-200 bg-slate-50"
        )}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className={cn(
                        "text-[12px] font-black uppercase tracking-[0.18em]",
                        isDarkMode ? "text-white/60" : "text-slate-600"
                    )}>Model Impact</p>
                    <p className={cn(
                        "mt-2 text-[15px] font-semibold",
                        isDarkMode ? "text-white/85" : "text-slate-700"
                    )}>
                        Selected peer medians flow directly into the DCF exit-multiple assumption. Changing the peer set reruns valuation immediately.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[560px]">
                    <div className={cn("rounded-2xl border px-4 py-4", isDarkMode ? "border-white/10 bg-[#0b1426]" : "border-slate-200 bg-white")}>
                        <p className={cn("text-[11px] font-black uppercase tracking-[0.14em]", isDarkMode ? "text-white/55" : "text-slate-500")}>Selected Peer Median</p>
                        <p className={cn("mt-2 text-[28px] font-black tabular-nums", isDarkMode ? "text-sky-300" : "text-sky-700")}>{formatMult(medianEvEbitda)}</p>
                        <p className={cn("mt-1 text-[12px] font-semibold", isDarkMode ? "text-white/55" : "text-slate-500")}>EV / EBITDA</p>
                    </div>
                    <div className={cn("rounded-2xl border px-4 py-4", isDarkMode ? "border-white/10 bg-[#0b1426]" : "border-slate-200 bg-white")}>
                        <p className={cn("text-[11px] font-black uppercase tracking-[0.14em]", isDarkMode ? "text-white/55" : "text-slate-500")}>Model Exit Multiple</p>
                        <p className={cn("mt-2 text-[28px] font-black tabular-nums", isDarkMode ? "text-indigo-300" : "text-indigo-700")}>{formatMult(modelExitMultiple ?? 0)}</p>
                        <p className={cn(
                            "mt-1 text-[12px] font-semibold",
                            modelImpactDelta > 0
                                ? "text-emerald-500"
                                : modelImpactDelta < 0
                                    ? "text-rose-500"
                                    : (isDarkMode ? "text-white/55" : "text-slate-500")
                        )}>
                            {modelExitMultiple !== undefined ? `${modelImpactDelta >= 0 ? '+' : ''}${modelImpactDelta.toFixed(1)}x vs selected median` : 'Awaiting model sync'}
                        </p>
                    </div>
                    <div className={cn("rounded-2xl border px-4 py-4", isDarkMode ? "border-white/10 bg-[#0b1426]" : "border-slate-200 bg-white")}>
                        <p className={cn("text-[11px] font-black uppercase tracking-[0.14em]", isDarkMode ? "text-white/55" : "text-slate-500")}>DCF Implied Share Price</p>
                        <p className={cn("mt-2 text-[28px] font-black tabular-nums", isDarkMode ? "text-emerald-300" : "text-emerald-700")}>
                            {impliedSharePrice && impliedSharePrice > 0 ? `$${impliedSharePrice.toFixed(2)}` : '—'}
                        </p>
                        <p className={cn("mt-1 text-[12px] font-semibold", isDarkMode ? "text-white/55" : "text-slate-500")}>
                            {currentSharePrice && currentSharePrice > 0 ? `vs CMP $${currentSharePrice.toFixed(2)}` : 'Live DCF output'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
