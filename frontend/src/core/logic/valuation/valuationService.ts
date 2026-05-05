import { ComparableCompany } from '@/core/types';
import { COMPS_DATABASE, GICS_SECTOR_BY_TICKER } from '@/core/data/comparable-companies';

/**
 * ValuationService handles the retrieval of market data for comparable companies
 * and precedent transactions. Currently, it pulls from local static data,
 * but it is designed to be easily swapped for asynchronous backend API calls.
 */
export class ValuationService {
    /**
     * Fetches a list of comparable peers for a given target ticker.
     * @param ticker The ticker symbol of the target company.
     * @returns A promise resolving to an array of ComparableCompany objects.
     */
    static async getComparablePeers(ticker: string): Promise<ComparableCompany[]> {
        const normalizedTicker = ticker.toUpperCase();
        
        // Simulate a small network delay to ensure async compatibility
        await new Promise(resolve => setTimeout(resolve, 100));

        const peers = COMPS_DATABASE[normalizedTicker];
        
        if (!peers) {
            // Return default tech peers (AAPL set) if ticker not found
            return COMPS_DATABASE['AAPL'] || [];
        }

        return peers;
    }

    /**
     * Gets the GICS sector for a specific ticker.
     */
    static getSectorByTicker(ticker: string): string {
        return GICS_SECTOR_BY_TICKER[ticker.toUpperCase()] || 'Other';
    }

    /**
     * Search for companies in the database by ticker or name.
     */
    static async searchCompanies(query: string): Promise<ComparableCompany[]> {
        const normalizedQuery = query.toUpperCase();
        const allPeers = Object.values(COMPS_DATABASE).flat();
        
        const results = allPeers.filter(p => 
            p.ticker.toUpperCase().includes(normalizedQuery) || 
            p.name.toUpperCase().includes(normalizedQuery)
        );

        // Deduplicate results by ticker
        const seen = new Set();
        return results.filter(p => {
            if (seen.has(p.ticker)) return false;
            seen.add(p.ticker);
            return true;
        });
    }
}
