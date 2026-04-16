// API endpoint for asset chart data
// Note: Chart data is not implemented in the new cache system
// Returns placeholder response for compatibility

import { NextRequest, NextResponse } from 'next/server'

// Symbol to CoinGecko ID mapping
const symbolToCoinGeckoId: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'SOL': 'solana',
  'BNB': 'binancecoin',
  'XRP': 'ripple',
  'ADA': 'cardano',
  'DOGE': 'dogecoin',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'DOT': 'polkadot',
}

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol.toUpperCase();
  const coinGeckoId = symbolToCoinGeckoId[symbol];

  if (!coinGeckoId) {
    return NextResponse.json(
      {
        error: 'Chart data not available for this symbol',
        message: 'Historical data is only available for major cryptocurrencies'
      },
      { status: 404 }
    );
  }

  // Return placeholder response for now
  // Chart data implementation can be added later if needed
  const response = {
    symbol,
    coinGeckoId,
    days: 7,
    timeframe: '1D',
    chartData: null, // No chart data available in new cache system
    ohlcvData: null,
    lastUpdated: null,
    cacheWarmed: true,
    message: 'Chart data not yet implemented in new cache system'
  };

  const headers = new Headers();
  headers.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

  return NextResponse.json(response, { headers });
}