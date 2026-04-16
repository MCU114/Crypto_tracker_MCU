export type AssetCategory =
  | 'Layer 1'
  | 'Layer 2'
  | 'Stablecoin'
  | 'DeFi'
  | 'Meme'
  | 'Exchange Token'
  | 'NFT'
  | 'Wrapped Asset'
  | 'Lending'
  | 'Staked ETH';

export type Asset = {
  id: string;
  symbol: string;
  name: string;
  category: AssetCategory;
  baseChain: string;
  launchYear: number;
  tradingPairs: string[];
  logo?: string; // Optional emoji or short placeholder
  logoUrl?: string; // Optional URL to a logo image
  description: string;
  riskNote: string;
};


