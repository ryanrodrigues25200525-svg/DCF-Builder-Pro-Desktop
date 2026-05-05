import { PrecedentTransaction } from '@/core/types';

export interface PrecedentTransactionsProps {
    isDarkMode?: boolean;
    targetTicker: string;
    targetSector?: string;
    targetRevenue: number;
    targetEbitda: number;
    transactions?: PrecedentTransaction[];
    onDataChange?: (data: PrecedentTransaction[]) => void;
}

export interface PrecedentStats {
    count: number;
    medianEvRevenue: number;
    medianEvEbitda: number;
    medianPremium: number;
    totalValue: number;
}
