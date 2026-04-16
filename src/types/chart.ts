// Chart types for TradingChart and TimeframeSelector

export type OHLCVPoint = {
  time: number; // Unix timestamp in milliseconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Timeframe = '1m' | '5m' | '15m' | '1H' | '4H' | '1D' | '1W' | '1M';

// Timeframe configurations for API calls
export const TIMEFRAME_CONFIGS = {
  '1m': { label: '1M', interval: '1', days: 1 },
  '5m': { label: '5M', interval: '5', days: 1 },
  '15m': { label: '15M', interval: '15', days: 1 },
  '1H': { label: '1H', interval: '1', days: 7 },
  '4H': { label: '4H', interval: '4', days: 30 },
  '1D': { label: '1D', interval: '1', days: 365 },
  '1W': { label: '1W', interval: '7', days: 365 * 2 },
  '1M': { label: '1M', interval: '30', days: 365 * 3 },
} as const;