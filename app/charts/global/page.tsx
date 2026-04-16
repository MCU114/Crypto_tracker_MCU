import Link from 'next/link';
import { formatCurrency } from '@/src/lib/formatting';
import { type CryptoPrice } from '@/src/types/market';
import { getCache, isExpired, setCache } from '@/src/lib/cache';
import { fetchMarkets } from '@/src/lib/api/coingecko';

// Make this page dynamic with ISR
export const revalidate = 60; // Revalidate every 60 seconds

export default async function GlobalChartPage() {
  let marketData: CryptoPrice[] = [];
  let totalMarketCap = 0;
  let error: string | null = null;

  try {
    // Read market data directly from cache on the server to avoid internal HTTP calls.
    let entry = getCache<CryptoPrice[]>('markets');

    if (!entry || entry.value === null || isExpired(entry)) {
      try {
        const fresh = await fetchMarkets();
        setCache('markets', fresh, 2 * 60 * 1000);
        entry = getCache<CryptoPrice[]>('markets');
      } catch (fetchErr) {
        console.warn('[GlobalChartPage] Failed to fetch fresh market data:', fetchErr);
      }
    }

    const data = entry?.value ?? [];
    marketData = data.slice(0, 10); // Top 10 for display
    totalMarketCap = marketData.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  } catch (err) {
    error = 'Failed to load market data. The cache may not be warmed yet.';
    console.error('Error reading market cache:', err);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl">
      <div className="mb-8">
        <Link
          href="/charts"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Charts
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Global Market Overview
        </h1>
        <p className="text-slate-600">
          Overall cryptocurrency market capitalization and top asset performance
        </p>
      </div>

      {error ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Data Loading</h2>
          <p className="text-yellow-700">{error}</p>
          <p className="text-yellow-600 text-sm mt-2">
            Market data is being fetched in the background. Please refresh in a few moments.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Market Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Market Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {marketData.length}
                </div>
                <div className="text-sm text-slate-600">Top Assets Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalMarketCap)}
                </div>
                <div className="text-sm text-slate-600">Total Market Cap (Top 10)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  Live Data
                </div>
                <div className="text-sm text-slate-600">From Cache</div>
              </div>
            </div>
          </div>

          {/* Top Assets Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Top 10 Cryptocurrencies</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Asset
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      24h Change
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Market Cap
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {marketData.map((coin) => (
                    <tr key={coin.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={coin.image}
                            alt={coin.name}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {coin.name}
                            </div>
                            <div className="text-sm text-slate-500 uppercase">
                              {coin.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatCurrency(coin.current_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-sm font-medium ${
                            coin.price_change_percentage_24h == null
                              ? 'text-gray-400'
                              : coin.price_change_percentage_24h >= 0
                                ? 'text-green-600'
                                : 'text-red-600'
                          }`}
                        >
                          {coin.price_change_percentage_24h == null
                            ? '—'
                            : `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {formatCurrency(coin.market_cap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}