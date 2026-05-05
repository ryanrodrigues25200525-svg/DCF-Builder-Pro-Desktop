import { useState, useMemo } from 'react';
import { PrecedentTransaction } from '@/core/types';
import { calculateTransactionStats } from '@/core/data/precedent-transactions';

export const usePrecedentEngine = (
    externalTransactions: PrecedentTransaction[] | undefined,
    onDataChange?: (data: PrecedentTransaction[]) => void,
    targetSector: string = 'Technology'
) => {
    const baseTransactions = useMemo(() => {
        return externalTransactions || [];
    }, [externalTransactions]);

    const [isAdding, setIsAdding] = useState(false);

    const normalizedSector = useMemo(() => {
        const raw = (targetSector || '').trim();
        if (!raw || raw.toLowerCase() === 'unknown' || raw.toLowerCase() === 'n/a') {
            return 'Technology';
        }
        return raw;
    }, [targetSector]);

    const stats = useMemo(() => {
        const selected = baseTransactions.filter(t => t.isSelected);
        return calculateTransactionStats(selected);
    }, [baseTransactions]);

    const toggleTransaction = (id: string) => {
        const updated = baseTransactions.map(t =>
            t.id === id ? { ...t, isSelected: !t.isSelected } : t
        );
        onDataChange?.(updated);
    };

    const deleteTransaction = (id: string) => {
        onDataChange?.(baseTransactions.filter(t => t.id !== id));
    };

    const addTransaction = (newTxn: PrecedentTransaction) => {
        onDataChange?.([...baseTransactions, newTxn]);
        setIsAdding(false);
    };

    return {
        baseTransactions,
        isAdding,
        setIsAdding,
        normalizedSector,
        stats,
        toggleTransaction,
        deleteTransaction,
        addTransaction,
    };
};
