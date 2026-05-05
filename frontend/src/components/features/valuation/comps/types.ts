import { ComparableCompany } from '@/core/types';

export interface CompsTableProps {
    isDarkMode?: boolean;
    targetTicker: string;
    targetRevenue: number;
    targetEbitda: number;
    peers?: ComparableCompany[];
    onDataChange?: (data: ComparableCompany[]) => void;
    modelExitMultiple?: number;
    impliedSharePrice?: number;
    currentSharePrice?: number;
}

export interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
}

export interface CompStats {
    median: number;
    mean: number;
}

export interface ValuationStats {
    evRevenue: CompStats;
    evEbitda: CompStats;
    revGrowth: CompStats;
    ebitdaMargin: CompStats;
    beta: CompStats;
}
