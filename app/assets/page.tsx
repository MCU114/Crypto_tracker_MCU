import { Metadata } from 'next';
import Link from 'next/link';
import { type CryptoPrice } from '@/src/types/market';
import { formatCurrency, formatPercentage } from '@/src/lib/formatting';
import { getCache, isExpired, setCache } from '@/src/lib/cache';
import PageShell from '@/src/components/layout/PageShell';
import { fetchMarkets } from '@/src/lib/api/coingecko';

// Make this page dynamic with ISR - revalidate every 60 seconds
// This allows it to show fresh data without hitting CoinGecko during build
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Cryptocurrency Listing Info | Cryptopedia',
  description:
    'Recently listed and key cryptocurrencies with listing details. Explore major crypto assets available on Hong Kong exchanges.',
};

export default async function AssetsIndex() {
  let cryptos: CryptoPrice[] = [];
  let error: string | null = null;

  try {
    // Read from internal cache directly on the server to avoid making HTTP calls to our own API.
    // This prevents Node's fetch from needing an absolute URL and is deploy-safe.
    let entry = getCache<CryptoPrice[]>('markets');

    if (!entry || entry.value === null || isExpired(entry)) {
      try {
        // Attempt to fetch fresh market data and warm the cache (same logic as the API route).
        const fresh = await fetchMarkets();
        setCache('markets', fresh, 2 * 60 * 1000);
        entry = getCache<CryptoPrice[]>('markets');
      } catch (fetchErr) {
        console.warn('[AssetsPage] Failed to fetch fresh market data:', fetchErr);
      }
    }

    const data = entry?.value ?? [];
    cryptos = data.slice(0, 20);
  } catch (err) {
    error = 'Failed to load cryptocurrencies. The cache may not be warmed yet. Please try again in a few moments.';
    console.error('Error reading market cache:', err);
  }

  return (
    <div className="py-8">
      <PageShell>
        <section className="brand-frame space-y-4">
        <header>
          <h1 className="text-3xl font-semibold text-white">Asset Listings & Details</h1>
          <p className="mt-1 text-sm text-slate-100">
            Detailed information cards for major cryptocurrencies and their exchange listings.
          </p>
        </header>

        <div className="rounded-2xl bg-white shadow-sm p-4">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cryptos.map((crypto) => (
                <Link
                  key={crypto.id}
                  href={`/assets/${crypto.symbol.toUpperCase()}`}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center mb-4">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="h-12 w-12 rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600">
                          {crypto.name}
                        </h3>
                        <p className="text-sm text-slate-500 uppercase">
                          {crypto.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Price:</span>
                        <span className="text-sm font-medium text-slate-900">
                          {formatCurrency(crypto.current_price)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">24h Change:</span>
                        <span
                          className={`text-sm font-medium ${
                            crypto.price_change_percentage_24h == null
                              ? 'text-gray-400'
                              : crypto.price_change_percentage_24h >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                          }`}
                        >
                          {crypto.price_change_percentage_24h == null
                            ? '—'
                            : `${crypto.price_change_percentage_24h >= 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%`
                          }
                        </span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-200">
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                        View details
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>
      </section>
      </PageShell>
    </div>
  );
}

