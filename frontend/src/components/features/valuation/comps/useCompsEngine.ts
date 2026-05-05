import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { ComparableCompany } from '@/core/types';
import { 
    normalizeComparablePeers, 
    median, 
    mean, 
    generateSparklineData 
} from './utils';
import { COMPS_DATABASE, DEFAULT_TECH_COMPS } from './constants';
import { ValuationStats } from './types';

export function useCompsEngine(
    targetTicker: string,
    externalPeers?: ComparableCompany[],
    onDataChange?: (data: ComparableCompany[]) => void,
    modelExitMultiple?: number
) {
    const peers = useMemo(() => {
        if (externalPeers !== undefined) {
            return normalizeComparablePeers(externalPeers);
        }
        const ticker = targetTicker.toUpperCase();
        // The service could be used here in an effect, but for now we maintain 
        // synchronous initialization from the database export to avoid UI flashing.
        // Future: Move this to an actual useEffect/fetch pattern.
        return normalizeComparablePeers(COMPS_DATABASE[ticker] || DEFAULT_TECH_COMPS);
    }, [targetTicker, externalPeers]);

    const sparklineData = useMemo(() => {
        const data: Record<string, number[]> = {};
        peers.forEach(peer => {
            const ticker = String(peer?.ticker || '').trim().toUpperCase();
            if (!ticker) return;
            data[ticker] = generateSparklineData(ticker);
        });
        return data;
    }, [peers]);

    const selectedPeersMap = useMemo<Record<string, boolean>>(() => {
        const selections: Record<string, boolean> = {};
        for (const peer of peers) {
            selections[peer.ticker] = peer.isSelected;
        }
        return selections;
    }, [peers]);

    const [selectionOverrides, setSelectionOverrides] = useState<Record<string, boolean>>({});
    const shouldSyncSelectionRef = useRef(false);

    const togglePeer = useCallback((ticker: string) => {
        shouldSyncSelectionRef.current = true;
        setSelectionOverrides(prev => {
            const baseSelection = selectedPeersMap[ticker] ?? false;
            const isCurrentlySelected = prev[ticker] !== undefined ? prev[ticker] : baseSelection;
            return { ...prev, [ticker]: !isCurrentlySelected };
        });
    }, [selectedPeersMap]);

    useEffect(() => {
        if (!shouldSyncSelectionRef.current) return;
        const updatedPeers = peers.map(p => ({
            ...p,
            isSelected: selectionOverrides[p.ticker] !== undefined ? selectionOverrides[p.ticker] : selectedPeersMap[p.ticker]
        }));
        onDataChange?.(updatedPeers);
        shouldSyncSelectionRef.current = false;
    }, [selectionOverrides, peers, selectedPeersMap, onDataChange]);

    const selectedPeersList = useMemo(() => {
        return peers.filter(p => {
            const baseSelection = selectedPeersMap[p.ticker];
            return selectionOverrides[p.ticker] !== undefined ? selectionOverrides[p.ticker] : baseSelection;
        });
    }, [peers, selectedPeersMap, selectionOverrides]);

    const isPeerSelected = useCallback((ticker: string) => {
        const baseSelection = selectedPeersMap[ticker] ?? false;
        return selectionOverrides[ticker] !== undefined ? selectionOverrides[ticker] : baseSelection;
    }, [selectedPeersMap, selectionOverrides]);

    const stats = useMemo<ValuationStats>(() => {
        const evRevenueValues = selectedPeersList.map(p => p.evRevenue).filter(v => v > 0);
        const evEbitdaValues = selectedPeersList.map(p => p.evEbitda).filter(v => v > 0 && v < 100);
        const revGrowthValues = selectedPeersList.map(p => p.revenueGrowth);
        const ebitdaMarginValues = selectedPeersList.map(p => p.ebitdaMargin);
        const betaValues = selectedPeersList
            .map(p => p.beta)
            .filter((v): v is number => v !== undefined && Number.isFinite(v) && v > 0 && v < 5);

        return {
            evRevenue: { median: median(evRevenueValues), mean: mean(evRevenueValues) },
            evEbitda: { median: median(evEbitdaValues), mean: mean(evEbitdaValues) },
            revGrowth: { median: median(revGrowthValues), mean: mean(revGrowthValues) },
            ebitdaMargin: { median: median(ebitdaMarginValues), mean: mean(ebitdaMarginValues) },
            beta: { median: median(betaValues), mean: mean(betaValues) },
        };
    }, [selectedPeersList]);

    const modelImpactDelta = modelExitMultiple !== undefined ? stats.evEbitda.median - modelExitMultiple : 0;

    const scoringRef = useMemo(() => {
        const selectedForScoring = selectedPeersList.length > 0 ? selectedPeersList : peers;
        return {
            sizeLog: median(selectedForScoring.map((p) => Math.log10(Math.max(1, p.marketCap || 1)))),
            growth: median(selectedForScoring.map((p) => p.revenueGrowth)),
            margin: median(selectedForScoring.map((p) => p.ebitdaMargin)),
            beta: median(selectedForScoring.map((p) => p.beta ?? 1)),
        };
    }, [selectedPeersList, peers]);

    const getPeerQualityScore = useCallback((peer: ComparableCompany) => {
        const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
        const sizeLog = Math.log10(Math.max(1, peer.marketCap || 1));
        const beta = peer.beta ?? scoringRef.beta;

        const sizeScore = clamp01(1 - Math.abs(sizeLog - scoringRef.sizeLog) / 2.0);
        const growthScore = clamp01(1 - Math.abs(peer.revenueGrowth - scoringRef.growth) / 0.5);
        const marginScore = clamp01(1 - Math.abs(peer.ebitdaMargin - scoringRef.margin) / 0.5);
        const betaScore = clamp01(1 - Math.abs(beta - scoringRef.beta) / 1.5);

        const weighted =
            sizeScore * 0.35 +
            growthScore * 0.25 +
            marginScore * 0.25 +
            betaScore * 0.15;

        return Math.round(weighted * 100);
    }, [scoringRef]);

    return {
        peers,
        sparklineData,
        selectedPeersList,
        isPeerSelected,
        togglePeer,
        stats,
        modelImpactDelta,
        getPeerQualityScore,
    };
}
