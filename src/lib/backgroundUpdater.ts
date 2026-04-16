// This runs once per Node process (production only) and refreshes the cache
// on a predictable, infrequent schedule to avoid rate limits.

import { fetchMarkets, fetchAssetDetails, fetchGlobalStats } from '@/src/lib/api/coingecko'
import { setCache } from '@/src/lib/cache'

let updaterStarted = false;

const CACHE_TTLS = {
  markets: 2 * 60 * 1000,    // 2 minutes (increased from 3)
  global: 2 * 60 * 1000,     // 2 minutes (increased from 3)
  asset: 5 * 60 * 1000,      // 5 minutes (reduced from 10) for asset details
};

const REFRESH_INTERVALS = {
  markets: 1 * 60 * 1000,    // Refresh every 1 minute (increased frequency)
  global: 1 * 60 * 1000,     // Refresh every 1 minute (increased frequency)
  assets: 3 * 60 * 1000,     // Refresh assets every 3 minutes (increased frequency)
};

// Priority assets to cache (matching the existing PRIORITY_COINS)
const PRIORITY_ASSETS = [
  'bitcoin', 'ethereum', 'tether', 'usd-coin', 'solana', 'binancecoin',
  'ripple', 'cardano', 'dogecoin', 'matic-network', 'avalanche-2',
  'chainlink', 'uniswap', 'cosmos', 'polkadot'
];

async function refreshMarkets() {
  try {
    console.log('[BackgroundUpdater] Refreshing markets...');
    const data = await fetchMarkets();
    setCache('markets', data, CACHE_TTLS.markets);
    console.log('[BackgroundUpdater] Markets refreshed successfully');
  } catch (error) {
    console.error('[BackgroundUpdater] Failed to refresh markets:', error);
    // Do NOT clear the cache; keep stale data
  }
}

async function refreshGlobalStats() {
  try {
    console.log('[BackgroundUpdater] Refreshing global stats...');
    const data = await fetchGlobalStats();
    setCache('global', data, CACHE_TTLS.global);
    console.log('[BackgroundUpdater] Global stats refreshed successfully');
  } catch (error) {
    console.error('[BackgroundUpdater] Failed to refresh global stats:', error);
    // Keep stale data if available
  }
}

async function refreshAssets() {
  console.log('[BackgroundUpdater] Refreshing asset details...');

  // Refresh priority assets one by one with optimized delays
  for (const assetId of PRIORITY_ASSETS) {
    try {
      const data = await fetchAssetDetails(assetId);
      setCache(`asset:${assetId}`, data, CACHE_TTLS.asset);
      console.log(`[BackgroundUpdater] Refreshed ${assetId}`);

      // Reduced delay between asset fetches (more rate limit headroom)
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`[BackgroundUpdater] Failed to refresh ${assetId}:`, error);
    }
  }

  console.log('[BackgroundUpdater] Asset details refresh completed');
}

export function startBackgroundUpdater() {
  if (updaterStarted || (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production')) {
    return; // Only run once, only in production
  }

  updaterStarted = true;
  console.log('[BackgroundUpdater] Starting background refresh scheduler');

  // Warm the cache immediately on startup
  refreshMarkets();
  refreshGlobalStats();
  refreshAssets();

  // Then refresh on intervals
  setInterval(refreshMarkets, REFRESH_INTERVALS.markets);
  setInterval(refreshGlobalStats, REFRESH_INTERVALS.global);
  setInterval(refreshAssets, REFRESH_INTERVALS.assets);

  console.log('[BackgroundUpdater] Scheduler running: markets every 1min, global every 1min, assets every 3min');
}
