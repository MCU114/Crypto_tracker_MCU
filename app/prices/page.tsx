import PricesClient from './PricesClient'
import { getCache, isExpired, setCache } from '@/src/lib/cache';
import { fetchMarkets } from '@/src/lib/api/coingecko';
import { type CryptoPrice } from '@/src/types/market';

// Server component that passes initial data
export default async function PricesPage() {
  try {
    // Read cached market data directly on the server. Avoid fetching our own API via HTTP
    // because Node's fetch requires an absolute URL in this runtime.
    let entry = getCache<CryptoPrice[]>('markets');

    if (!entry || entry.value === null || isExpired(entry)) {
      try {
        const fresh = await fetchMarkets();
        setCache('markets', fresh, 2 * 60 * 1000);
        entry = getCache('markets');
      } catch (err) {
        console.warn('[PricesPage] Failed to warm cache:', err);
      }
    }

    const data: CryptoPrice[] = entry?.value ?? [];
    return <PricesClient initialPrices={data} />
  } catch (error) {
    console.error('Failed to get initial prices:', error)
    // Fall back to client-side loading if server fetch fails
    return <PricesClient initialPrices={[]} />
  }
}
