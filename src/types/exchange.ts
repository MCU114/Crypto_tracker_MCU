export type Country = 'HK' | 'UK' | 'US' | 'SG';
export type Product = 'Spot' | 'Derivatives';

export type Exchange = {
  id: string;
  name: string;
  country: Country;
  licensed: boolean;
  products: Product[];
  tokensTotal: number;
  tokensMajors: number;
  tokensAltcoins: number;
  tokensMemecoins: number;
  makerFee: number;      // percentage
  takerFee: number;      // percentage
  minDepositUsd: number;
  hasPerps: boolean;
  fundingRate?: number;  // optional, for perps
  logoUrl?: string;      // optional local logo image path (e.g., '/logos/binance.png')
  websiteUrl?: string;   // optional website URL for the exchange
};

export type FilterType =
  | 'Licensed only'
  | 'Licensed + unlicensed'
  | 'Spot only'
  | 'Derivatives only';
export type SortType = 'Fees (low to high)' | 'Fees (high to low)' | 'Tokens (high to low)' | 'Min deposit (low to high)';

export type SidebarFilters = {
  legalStatus: {
    licensed: boolean;
    unlicensed: boolean;
  };
  products: {
    spot: boolean;
    derivatives: boolean;
  };
  minDeposit: {
    under50: boolean;
    between50and500: boolean;
    over500: boolean;
  };
};

