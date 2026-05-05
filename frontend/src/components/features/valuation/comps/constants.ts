import { ComparableCompany } from '@/core/types';

import { 
    COMPS_DATABASE as DB, 
    GICS_SECTOR_BY_TICKER as SECTORS 
} from '@/core/data/comparable-companies';

export const GICS_SECTOR_BY_TICKER = SECTORS;
export const COMPS_DATABASE = DB;


export const DEFAULT_TECH_COMPS: ComparableCompany[] = COMPS_DATABASE['AAPL'];
