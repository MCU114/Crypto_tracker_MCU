'use client'

import { formatCurrency } from '@/src/lib/formatting'
import { useState } from 'react'
import Link from 'next/link'
import TokenIcon from '@/src/components/common/TokenIcon'
import StatPill from '@/src/components/assets/StatPill'

type NewCoinDemo = {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap?: number | null
  fully_diluted_valuation?: number | null
  listing_date?: string
  platforms?: Record<string, string>
  icon?: string
  change24h?: number
  network?: string
  status?: 'New' | 'Trending' | 'Verified'
  listedDays?: number
}

interface NewCoinsListProps {
  coins: NewCoinDemo[]
}

export default function NewCoinsList({ coins }: NewCoinsListProps) {
  const [filter, setFilter] = useState<'all' | 'cex' | 'dex'>('all')

  const filtered = coins.filter((c) => {
    if (filter === 'all') return true
    // demo heuristic: consider networks as DEX or CEX listings placeholder
    if (filter === 'cex') return (c.network || '').toLowerCase() === 'ethereum'
    return (c.network || '').toLowerCase() !== 'ethereum'
  })

  if (filtered.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-slate-500">No new coins available at the moment.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-slate-600">Showing: <span className="font-medium text-slate-900">{filter === 'all' ? 'All' : filter === 'cex' ? 'CEX listings' : 'DEX listings'}</span></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>All</button>
          <button onClick={() => setFilter('cex')} className={`px-3 py-1 rounded-full text-sm ${filter === 'cex' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>CEX</button>
          <button onClick={() => setFilter('dex')} className={`px-3 py-1 rounded-full text-sm ${filter === 'dex' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>DEX</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {filtered.map((coin) => {
          return (
            <Link
              key={coin.id}
              href={`/assets/${coin.symbol.toLowerCase()}`}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-4">
                <TokenIcon label={coin.icon || coin.symbol} size={48} className="mr-4" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 hover:text-blue-600">{coin.name}</h3>
                  <p className="text-sm text-slate-500 uppercase">{coin.symbol}</p>
                  <div className="text-xs text-slate-400 mt-1">Listed {coin.listedDays ?? '—'} days ago</div>
                </div>
                <div>
                  <StatPill label={coin.status || 'New'} tone={coin.status === 'Trending' ? 'warning' : coin.status === 'Verified' ? 'success' : 'default'} />
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Price:</span>
                  <span className="text-sm font-medium text-slate-900">{formatCurrency(coin.current_price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">24h Change:</span>
                  <span className={`text-sm font-medium ${coin.change24h == null ? 'text-gray-400' : coin.change24h >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {coin.change24h == null ? '—' : `${coin.change24h >= 0 ? '+' : ''}${coin.change24h.toFixed(1)}%`}
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
          )
        })}
      </div>
    </div>
  )
}
