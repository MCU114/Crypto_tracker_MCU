'use client'

import { CryptoPrice } from '@/src/types/market'
import { formatCurrency, formatPercentage, formatMarketCap } from '@/src/lib/formatting'
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from '@/src/lib/watchlist'
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PriceTableProps {
  cryptos: CryptoPrice[]
}

export default function PriceTable({ cryptos }: PriceTableProps) {
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set())

  // Load watchlist on mount
  useEffect(() => {
    const ids = new Set<string>()
    cryptos.forEach((crypto) => {
      if (isInWatchlist(crypto.id)) {
        ids.add(crypto.id)
      }
    })
    setWatchlistIds(ids)
  }, [cryptos])

  const handleWatchlistToggle = (crypto: CryptoPrice) => {
    const isWatched = watchlistIds.has(crypto.id)
    
    if (isWatched) {
      removeFromWatchlist(crypto.id)
      setWatchlistIds((prev) => {
        const next = new Set(prev)
        next.delete(crypto.id)
        return next
      })
    } else {
      addToWatchlist({
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
      })
      setWatchlistIds((prev) => new Set(prev).add(crypto.id))
    }
  }

  if (cryptos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-slate-500">No cryptocurrency data available.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Coin
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                24h Change
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                Market Cap
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Watch
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {cryptos.map((crypto, index) => {
              const isWatched = watchlistIds.has(crypto.id)
              const changeColor =
                crypto.price_change_percentage_24h >= 0
                  ? 'text-green-600'
                  : 'text-red-600'

              return (
                <tr
                  key={crypto.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center min-w-0">
                      <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="h-8 w-8 rounded-full mr-3"
                      />
                      <Link
                        href={`/assets/${crypto.symbol.toUpperCase()}`}
                        className="hover:underline"
                      >
                        <div>
                          <div className="text-sm font-medium text-slate-900 hover:text-blue-600 whitespace-normal break-words">
                            {crypto.name}
                          </div>
                          <div className="text-sm text-slate-500 uppercase">
                            {crypto.symbol}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-slate-900">
                    {formatCurrency(crypto.current_price)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${changeColor}`}>
                    {formatPercentage(crypto.price_change_percentage_24h)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-500">
                    {formatMarketCap(crypto.market_cap)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleWatchlistToggle(crypto)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        isWatched
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                      aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      {isWatched ? '✓' : '+'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
