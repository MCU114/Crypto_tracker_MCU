'use client'

import { useEffect, useState } from 'react'
import { getWatchlist, type WatchlistItem } from '@/src/lib/watchlist'
import { fetchCoinById } from '@/src/lib/api/coingecko'
import { type CryptoPrice } from '@/src/types/market'
import { usePricesPolling } from '@/src/hooks/usePricesPolling'
import { formatCurrency, formatPercentage, formatMarketCap } from '@/src/lib/formatting'
import MarketTable from '@/src/components/market/MarketTable'
import PageShell from '@/src/components/layout/PageShell'

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [cryptoData, setCryptoData] = useState<Map<string, CryptoPrice>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use polling hook for bulk price data
  const { prices: allCryptos, loading: pricesLoading, error: pricesError } = usePricesPolling({
    pollingInterval: 30000 // 30 seconds for watchlist (less critical than prices page)
  })

  // Load watchlist and process price data
  useEffect(() => {
    const items = getWatchlist()
    setWatchlist(items)

    if (items.length === 0) {
      setLoading(false)
      return
    }

    // If prices are still loading, wait
    if (pricesLoading) {
      setLoading(true)
      return
    }

    // If there was an error with prices, show it
    if (pricesError) {
      setError(`Failed to load price data: ${pricesError}`)
      setLoading(false)
      return
    }

    // Process the price data
    const processPriceData = async () => {
      try {
        const dataMap = new Map<string, CryptoPrice>()

        // Get data from the cached prices
        allCryptos.forEach((crypto) => {
          if (items.some((item) => item.id === crypto.id)) {
            dataMap.set(crypto.id, crypto)
          }
        })

        // For any items not found in cached data, fetch individually
        // Add small delays to avoid rate limiting
        const missingItems = items.filter((item) => !dataMap.has(item.id))
        if (missingItems.length > 0) {
          // Fetch with delays to avoid rate limiting
          for (let i = 0; i < missingItems.length; i++) {
            const item = missingItems[i]
            if (i > 0) {
              // Add 200ms delay between requests to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 200))
            }
            try {
              const coinData = await fetchCoinById(item.id, false)
              if (coinData) {
                dataMap.set(item.id, coinData)
              }
            } catch (err) {
              console.warn(`Failed to fetch data for ${item.name} (${item.id}):`, err)
              // Continue with other coins even if one fails
            }
          }
        }

        setCryptoData(dataMap)
        setError(null)
        setLoading(false)
      } catch (err) {
        console.error('Error processing watchlist data:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(`Failed to load watchlist: ${errorMessage}. Please try again later.`)
        setLoading(false)
      }
    }

    processPriceData()
  }, [allCryptos, pricesLoading, pricesError])

  // Removal is handled via the star button in each row (toggleWatchlist).
  // No explicit remove button is needed here.

  if (loading) {
    return (
      <div className="py-8">
        <PageShell>
          <div className="text-center">
            <p className="text-slate-500">Loading watchlist...</p>
          </div>
        </PageShell>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <PageShell>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </PageShell>
      </div>
    )
  }

  return (
    <div className="py-8">
      <PageShell>
        {/* Light-blue outer panel for Watchlist */}
        <section className="brand-frame space-y-4">
        {/* Title on light blue */}
        <header>
          <h1 className="text-3xl font-semibold text-white">My Watchlist</h1>
          <p className="mt-1 text-sm text-slate-100">Track your favorite cryptocurrencies</p>
        </header>

        {/* White card containing the watchlist/table */}
        <div className="rounded-2xl bg-white shadow-sm p-4">
          {watchlist.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 mb-4">Your watchlist is empty.</p>
              <p className="text-sm text-slate-400">Add coins from the Prices or New Coins pages to get started.</p>
            </div>
          ) : (
            // Build assets array in the same order as the watchlist, omitting missing market data
            (() => {
              const assets = watchlist.map((item) => cryptoData.get(item.id)).filter((a): a is CryptoPrice => !!a)
              return <MarketTable assets={assets} />
            })()
          )}
        </div>
        </section>
      </PageShell>
    </div>
  )
}
