import { NextRequest, NextResponse } from 'next/server';
import { getCache, isExpired, setCache } from '@/src/lib/cache';
import { fetchAssetDetails } from '@/src/lib/api/coingecko';

// Symbol to CoinGecko ID mapping
const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
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
};

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol.toUpperCase();
  const coinGeckoId = SYMBOL_TO_COINGECKO_ID[symbol];

  if (!coinGeckoId) {
    return NextResponse.json(
      { error: 'Asset not found' },
      { status: 404 }
    );
  }

  const cacheKey = `asset:${coinGeckoId}`;
  let entry = getCache(cacheKey);

  // If cache is empty or expired, try to fetch fresh data
  if (!entry || entry.value === null || isExpired(entry)) {
    let fetchSuccess = false;

    // Try up to 2 times to get fresh data
    for (let attempt = 1; attempt <= 2 && !fetchSuccess; attempt++) {
      try {
        console.log(`[API] Cache empty or stale for ${symbol}, fetching fresh data (attempt ${attempt})`);
        const freshData = await fetchAssetDetails(coinGeckoId);

        // Cache the fresh data
        setCache(cacheKey, freshData, 5 * 60 * 1000); // 5 minutes TTL
        entry = getCache(cacheKey);
        fetchSuccess = true;
        console.log(`[API] Fresh data fetched successfully for ${symbol}`);
      } catch (error) {
        console.warn(`[API] Fresh fetch attempt ${attempt} failed for ${symbol}:`, error);

        if (attempt < 2) {
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // If all fetch attempts failed, check if we have any existing data
    if (!fetchSuccess) {
      if (entry && entry.value) {
        console.log(`[API] Using existing cached data for ${symbol} after fetch failures`);
      } else {
        // No cached data at all - return a minimal response
        console.log(`[API] No cached data available for ${symbol} after retries, returning minimal response`);
        return NextResponse.json({
          data: null,
          stale: true,
          lastUpdated: Date.now(),
          message: 'Asset data temporarily unavailable.',
        });
      }
    }
  }

  const stale = entry ? isExpired(entry) : true;

  return NextResponse.json({
    data: entry?.value || null,
    stale,
    lastUpdated: entry?.updatedAt || Date.now(),
  });
}