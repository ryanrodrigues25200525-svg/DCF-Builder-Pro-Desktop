import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/core/utils/cn';
import { ComparableCompany } from '@/core/types';
import { 
    formatPrice, 
    formatMoneyCompact, 
    formatMult, 
    formatPct, 
    formatBeta,
    getSectorLabel 
} from './utils';
import { Sparkline } from './Sparkline';

interface PeerRowProps {
    peer: ComparableCompany;
    active: boolean;
    togglePeer: (ticker: string) => void;
    quality: number;
    sparklineData: number[];
}

export const PeerRow = ({
    peer,
    active,
    togglePeer,
    quality,
    sparklineData,
}: PeerRowProps) => {
    return (
        <motion.tr
            layout
            initial={false}
            animate={{
                opacity: active ? 1 : 0.58,
                scale: active ? 1 : 0.996,
            }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            whileTap={{ scale: 0.992 }}
            onClick={() => togglePeer(peer.ticker)}
            className={cn(
                "cursor-pointer transition-colors duration-300 ease-out",
                active 
                    ? "bg-transparent hover:bg-(--bg-glass) dark:hover:bg-white/4" 
                    : "bg-(--bg-glass) dark:bg-white/1"
            )}
        >
            <td className="border-b border-(--border-subtle) px-5 py-5 dark:border-white/[0.07]">
                <motion.div
                    className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md border transition-colors duration-300",
                        active 
                            ? "border-sky-300 bg-sky-500" 
                            : "border-(--border-default) bg-transparent dark:border-white/25"
                    )}
                    initial={false}
                    animate={{ scale: active ? 1 : 0.9 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePeer(peer.ticker);
                    }}
                >
                    <AnimatePresence initial={false}>
                        {active && (
                            <motion.svg
                                key="check"
                                className="h-3.5 w-3.5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.16, ease: 'easeOut' }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
                            </motion.svg>
                        )}
                    </AnimatePresence>
                </motion.div>
            </td>
            <td className="border-b border-(--border-subtle) px-5 py-5 dark:border-white/[0.07]">
                <div className="flex flex-col">
                    <div className="flex items-baseline gap-3">
                        <span className="text-[22px] leading-none font-black tracking-[0.03em] text-(--text-primary)">{peer.ticker}</span>
                        <span className="max-w-[280px] truncate text-[14px] font-medium text-(--text-secondary)">{peer.name}</span>
                    </div>
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-(--text-tertiary)">{getSectorLabel(peer)}</span>
                </div>
            </td>
            <td className="border-b border-(--border-subtle) px-5 py-5 text-right text-[18px] font-semibold tabular-nums tracking-tight text-(--text-primary) dark:border-white/[0.07]">
                {formatPrice(peer.price)}
            </td>
            <td className="border-b border-(--border-subtle) px-5 py-5 text-center dark:border-white/[0.07]">
                <Sparkline data={sparklineData} width={110} height={28} />
            </td>
            <td className="border-b border-(--border-subtle) px-5 py-5 text-right text-[18px] font-semibold tabular-nums text-(--text-secondary) dark:border-white/[0.07]">
                {formatMoneyCompact(peer.marketCap)}
            </td>
            <td className="border-b border-(--border-subtle) px-5 py-5 text-right text-[18px] font-semibold tabular-nums text-(--text-secondary) dark:border-white/[0.07]">
                {formatMoneyCompact(peer.enterpriseValue)}
            </td>
            <td className="border-b border-(--border-subtle) px-5 py-5 text-right text-[18px] font-black tabular-nums text-sky-500 dark:border-white/[0.07] dark:text-sky-300">
                {formatMult(peer.evRevenue)}
            </td>
            <td className="border-b border-(--border-subtle) px-5 py-5 text-right text-[18px] font-black tabular-nums text-indigo-500 dark:border-white/[0.07] dark:text-indigo-300">
                {formatMult(peer.evEbitda)}
            </td>
            <td className={cn(
                "border-b border-(--border-subtle) px-5 py-5 text-right text-[18px] font-black tabular-nums dark:border-white/[0.07]", 
                peer.revenueGrowth >= 0 ? "text-emerald-500 dark:text-emerald-300" : "text-red-500 dark:text-red-300"
            )}>
                {formatPct(peer.revenueGrowth)}
            </td>
            <td className="border-b border-(--border-subtle) px-5 py-5 text-right text-[18px] font-semibold tabular-nums text-(--text-primary) dark:border-white/[0.07]">
                {formatPct(peer.ebitdaMargin)}
            </td>
            <td className="border-b border-(--border-subtle) px-5 py-5 text-right text-[18px] font-semibold tabular-nums text-(--text-secondary) dark:border-white/[0.07]">
                {formatBeta(peer.beta)}
            </td>
            <td className="border-b border-(--border-subtle) px-5 py-5 text-right dark:border-white/[0.07]">
                <div className="inline-flex items-center gap-2">
                    <span className={cn(
                        "text-[18px] font-black tabular-nums",
                        quality >= 80 ? "text-emerald-500 dark:text-emerald-300" : 
                        quality >= 65 ? "text-sky-500 dark:text-sky-300" : 
                        quality >= 50 ? "text-amber-500 dark:text-amber-300" : 
                        "text-red-500 dark:text-red-300"
                    )}>
                        {quality}
                    </span>
                    <span className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        quality >= 80 ? "bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" : 
                        quality >= 65 ? "bg-sky-300" : 
                        quality >= 50 ? "bg-amber-300" : 
                        "bg-red-300"
                    )} />
                </div>
            </td>
        </motion.tr>
    );
};
