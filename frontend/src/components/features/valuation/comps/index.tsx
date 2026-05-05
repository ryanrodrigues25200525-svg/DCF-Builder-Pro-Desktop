"use client";

import { memo } from 'react';
import { cn } from '@/core/utils/cn';
import { CompsTableProps } from './types';
import { useCompsEngine } from './useCompsEngine';
import { PeersSummary } from './PeersSummary';
import { ModelImpact } from './ModelImpact';
import { PeersTable } from './PeersTable';

export const CompsTableInstitutional = memo(function CompsTableInstitutional({
    isDarkMode = true,
    targetTicker,
    peers: externalPeers,
    onDataChange,
    modelExitMultiple,
    impliedSharePrice,
    currentSharePrice,
}: CompsTableProps) {
    const {
        peers,
        sparklineData,
        selectedPeersList,
        isPeerSelected,
        togglePeer,
        stats,
        modelImpactDelta,
        getPeerQualityScore,
    } = useCompsEngine(targetTicker, externalPeers, onDataChange, modelExitMultiple);

    return (
        <div
            data-local-theme={isDarkMode ? 'dark' : 'light'}
            className={cn(
                "comparables-theme-scope relative overflow-hidden rounded-4xl border shadow-[0_24px_64px_rgba(0,0,0,0.18)]",
                isDarkMode ? "border-white/10 bg-[#030913] shadow-[0_28px_90px_rgba(0,0,0,0.6)]" : "border-(--border-default) bg-white"
            )}
        >
            <div className="comparables-aurora pointer-events-none absolute inset-0">
                <div className="absolute -left-20 -top-28 h-[420px] w-[520px] rounded-full bg-sky-400/15 blur-[90px]" />
                <div className="absolute left-1/2 -top-24 h-[360px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[90px]" />
                <div className="absolute -right-20 top-0 h-[420px] w-[520px] rounded-full bg-emerald-400/12 blur-[90px]" />
            </div>

            <div className="relative border-b border-(--border-default) px-8 py-8 dark:border-white/10">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className={cn("text-[40px] font-black tracking-[-0.02em]", isDarkMode ? "text-white" : "text-slate-900")}>Peer Comparables</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "rounded-full border px-5 py-2 text-[13px] font-black uppercase tracking-[0.16em]",
                            isDarkMode
                                ? "border-sky-300/40 bg-sky-400/15 text-sky-100"
                                : "border-sky-300 bg-sky-100 text-sky-800"
                        )}>
                            {selectedPeersList.length} Selected
                        </div>
                        <div className={cn(
                            "rounded-full border px-5 py-2 text-[13px] font-black uppercase tracking-[0.16em]",
                            isDarkMode
                                ? "border-white/20 bg-white/5 text-white/75"
                                : "border-slate-300 bg-white text-slate-700"
                        )}>
                            {peers.length} Total
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative px-8 py-6">
                <PeersSummary isDarkMode={isDarkMode} stats={stats} />

                <ModelImpact 
                    isDarkMode={isDarkMode}
                    medianEvEbitda={stats.evEbitda.median}
                    modelExitMultiple={modelExitMultiple}
                    modelImpactDelta={modelImpactDelta}
                    impliedSharePrice={impliedSharePrice}
                    currentSharePrice={currentSharePrice}
                />

                <PeersTable 
                    isDarkMode={isDarkMode}
                    peers={peers}
                    isPeerSelected={isPeerSelected}
                    togglePeer={togglePeer}
                    getPeerQualityScore={getPeerQualityScore}
                    sparklineData={sparklineData}
                    stats={stats}
                />

                <div className={cn(
                    "mt-4 flex items-center justify-between border-t border-(--border-default) pt-4 text-[12px] font-semibold tracking-[0.08em]",
                    isDarkMode ? "text-white/45 dark:border-white/10" : "text-slate-600"
                )}>
                    <span className={cn(isDarkMode ? "text-white/45" : "text-slate-600")}>Selection updates peer median metrics in real time</span>
                    <span className={cn(isDarkMode ? "text-white/45" : "text-slate-600")}>Market data snapshot</span>
                </div>
            </div>
        </div>
    );
});

export default CompsTableInstitutional;
