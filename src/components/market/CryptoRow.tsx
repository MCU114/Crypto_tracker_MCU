'use client'

import { CryptoPrice } from '@/src/types/market'
import { ReactNode, useState, useEffect } from 'react'
import { formatCurrency, formatPercentage, formatMarketCap, formatVolume } from '@/src/lib/formatting'
import { isInWatchlist, toggleWatchlist, type WatchlistItem } from '@/src/lib/watchlist'
import { useToast } from '@/src/hooks/useToast'
import TokenIcon from '@/src/components/common/TokenIcon'

interface CryptoRowProps {
  crypto: CryptoPrice
  index: number
  isLast?: boolean
  action?: ReactNode
}

export default function CryptoRow({ crypto, index, isLast = false, action }: CryptoRowProps) {
  const [isInWatchlistState, setIsInWatchlistState] = useState(() => isInWatchlist(crypto.id))
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number; placement: 'top' | 'bottom' }>({
    left: 0,
    top: 0,
    placement: 'top'
  })
  const [imageError, setImageError] = useState(false)
  const { addToast } = useToast()

  // Use CoinGecko image directly - no local file lookups
  const iconSrc = crypto.image

  useEffect(() => {
    // Hide tooltip on scroll to avoid stale position
    const onScroll = () => setShowTooltip(false)
    window.addEventListener('scroll', onScroll, true)
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [])

  const getChangeColor = (change: number | null | undefined) => {
    if (change === null || change === undefined) return 'text-slate-500'
    return change >= 0 ? 'text-emerald-500' : 'text-red-500'
  }

  const getTrendText = (change7d: number | null | undefined) => {
    if (change7d === null || change7d === undefined) return 'N/A'
    if (change7d > 5) return 'Strong Up'
    if (change7d > 0) return 'Uptrend'
    if (change7d > -5) return 'Flat'
    return 'Downtrend'
  }

  const handleWatchlistToggle = () => {
    const watchlistItem: WatchlistItem = {
      id: crypto.id,
      symbol: crypto.symbol,
      name: crypto.name
    }

    const wasAdded = toggleWatchlist(watchlistItem)
    setIsInWatchlistState(wasAdded)

    if (wasAdded) {
      addToast(`Added ${crypto.name} to Watchlist`)
    }
  }

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={filled ? "fill-blue-600 text-blue-600" : "text-slate-400"}
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )

  const starIcon = <StarIcon filled={isInWatchlistState} />

  const updateTooltipPositionFromRect = (rect: DOMRect, preferred: 'top' | 'bottom' = 'top') => {
    const centerX = Math.min(Math.max(rect.left + rect.width / 2, 8), window.innerWidth - 8)
    let top = rect.top - 8
    let placement: 'top' | 'bottom' = 'top'
    if (preferred === 'bottom' || rect.top < 48) {
      top = rect.bottom + 8
      placement = 'bottom'
    }
    setTooltipPos({ left: centerX, top, placement })
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    updateTooltipPositionFromRect(e.currentTarget.getBoundingClientRect())
    setShowTooltip(true)
  }
  const handleMouseLeave = () => {
    setShowTooltip(false)
  }

  return (
    <>
      <article
        className={[
          'grid grid-cols-[28px,32px,minmax(0,1.8fr),minmax(96px,1fr),72px,72px,72px,minmax(120px,1.1fr),minmax(120px,1.1fr)] md:grid-cols-[32px,40px,minmax(0,2.4fr),minmax(120px,1fr),80px,80px,80px,minmax(150px,1.1fr),minmax(150px,1.1fr)] items-center gap-3',
          'min-h-16 px-4 py-3 md:px-6 md:py-4',
          isLast ? 'rounded-b-xl' : ''
        ].join(' ')}
      >
      <div className="flex items-center justify-center">
        <button
          onClick={handleWatchlistToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative w-8 h-8 rounded-md hover:bg-slate-100 focus:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
          aria-pressed={isInWatchlistState}
          aria-label={isInWatchlistState ? `Remove ${crypto.name} from watchlist` : `Add ${crypto.name} to watchlist`}
        >
          {starIcon}
        </button>
      </div>

      <div className="text-sm text-slate-500 tabular-nums">
        {index + 1}
      </div>

      <div className="flex items-center gap-3 min-w-0 before:content-[''] after:content-['']">
        {!imageError && iconSrc ? (
          <img
            src={iconSrc}
            alt={crypto.name}
            width={24}
            height={24}
            className="h-6 w-6 rounded-full"
            onError={() => {
              // CoinGecko image failed, use TokenIcon fallback
              setImageError(true)
            }}
          />
        ) : (
          <TokenIcon label={crypto.symbol} size={24} className="flex-shrink-0" />
        )}
        <div className="min-w-0 flex items-center justify-between w-full">
          <div>
            <p className="text-sm font-medium text-slate-900 whitespace-normal break-words">
              {crypto.name}
            </p>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {crypto.symbol}
            </p>
          </div>
          {action ? <div className="ml-3 flex-shrink-0">{action}</div> : null}
        </div>
      </div>

      <div className="text-sm font-medium text-slate-900 text-right whitespace-nowrap tabular-nums">
        {formatCurrency(crypto.current_price)}
      </div>

      <div className={`text-sm font-medium text-right whitespace-nowrap tabular-nums ${getChangeColor(crypto.price_change_percentage_1h)}`}>
        {formatPercentage(crypto.price_change_percentage_1h)}
      </div>

      <div className={`text-sm font-medium text-right whitespace-nowrap tabular-nums ${getChangeColor(crypto.price_change_percentage_24h)}`}>
        {formatPercentage(crypto.price_change_percentage_24h)}
      </div>

      <div className={`text-sm font-medium text-right whitespace-nowrap tabular-nums ${getChangeColor(crypto.price_change_percentage_7d)}`}>
        {formatPercentage(crypto.price_change_percentage_7d)}
      </div>

      <div className="text-sm text-slate-500 text-right whitespace-nowrap tabular-nums">
        {formatVolume(crypto.total_volume)}
      </div>

      <div className="text-sm text-slate-500 text-right whitespace-nowrap tabular-nums">
        {formatMarketCap(crypto.market_cap)}
      </div>

      </article>

      {/* Tooltip rendered as fixed element so it's not clipped by parent overflow */}
      {showTooltip && (
        <div
          role="tooltip"
          style={{
            position: 'fixed',
            left: `${tooltipPos.left}px`,
            top: `${tooltipPos.top}px`,
            transform: 'translateX(-50%)',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
          className="px-2 py-1 bg-slate-900 text-white text-xs rounded max-w-xs break-words"
        >
          {isInWatchlistState ? 'Remove from watchlist' : 'Add to watchlist'}
        </div>
      )}
    </>
  )
}