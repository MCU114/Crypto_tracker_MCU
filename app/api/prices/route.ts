import { NextRequest, NextResponse } from 'next/server';
import { getCache, isExpired, setCache } from '@/src/lib/cache';
import { fetchMarkets } from '@/src/lib/api/coingecko';

export async function GET(request: NextRequest) {
  let entry = getCache('markets');
  let fetchAttempted = false;

  // If cache is empty or expired, try to fetch fresh data
  if (!entry || entry.value === null || isExpired(entry)) {
    let fetchSuccess = false;

    // Try up to 2 times to get fresh data
    for (let attempt = 1; attempt <= 2 && !fetchSuccess; attempt++) {
      try {
        console.log(`[API] Cache empty or stale, fetching fresh data (attempt ${attempt})`);
        fetchAttempted = true;
        const freshData = await fetchMarkets();

        // Normalize CoinGecko response to use flat percentage fields (no _in_currency)
        const normalizedData = Array.isArray(freshData)
          ? freshData.map((coin: any) => {
              const normalized = {
                ...coin,
                // prefer flat fields if present, otherwise fall back to _in_currency variants
                price_change_percentage_1h:
                  coin.price_change_percentage_1h ?? coin.price_change_percentage_1h_in_currency ?? null,
                price_change_percentage_24h:
                  coin.price_change_percentage_24h ?? null,
                price_change_percentage_7d:
                  coin.price_change_percentage_7d ?? coin.price_change_percentage_7d_in_currency ?? null,
              }

              // Remove any _in_currency variants so we don't leak them to the client
              delete (normalized as any).price_change_percentage_1h_in_currency
              delete (normalized as any).price_change_percentage_7d_in_currency

              return normalized
            })
          : []

        // Cache the normalized data
        setCache('markets', normalizedData, 2 * 60 * 1000); // 2 minutes TTL
        entry = getCache('markets');
        fetchSuccess = true;
        console.log('[API] Fresh data fetched successfully');
      } catch (error) {
        console.warn(`[API] Fresh fetch attempt ${attempt} failed:`, error);

        if (attempt < 2) {
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // If all fetch attempts failed, check if we have any existing data
    if (!fetchSuccess) {
      if (entry && entry.value) {
        console.log('[API] Using existing cached data after fetch failures');
      } else {
        // No cached data at all - return empty array, let client show loading state
        console.log('[API] No cached data available after retries, returning empty array for loading state');
        return NextResponse.json({
          data: [],
          stale: true,
          lastUpdated: Date.now(),
          message: 'Loading market data...',
          fetchAttempted: true,
        });
      }
    }
  }

  const stale = entry ? isExpired(entry) : true;

  return NextResponse.json({
    data: entry?.value || [],
    stale,
    lastUpdated: entry?.updatedAt || Date.now(),
    message: stale ? 'Data may be up to 2 minutes old.' : 'Fresh data.',
    fetchAttempted, // For debugging
  });
}