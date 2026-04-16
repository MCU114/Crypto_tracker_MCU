'use client'

import { useMemo, useState, useEffect } from 'react'
import AssetSelector from '@/src/components/assets/AssetSelector'
import TimeframeSelector from '@/src/components/charts/TimeframeSelector'
import { Timeframe } from '@/src/types/chart'
import { getAssetBySymbol } from '@/data/assets'
import { usePricesPolling } from '@/src/hooks/usePricesPolling'
import PageShell from '@/src/components/layout/PageShell'
import TradingChart from '@/src/components/charts/TradingChart'

// Whitelist of tokens that have USDT trading pairs on Binance
// These are verified to work with Binance klines API
const BINANCE_SUPPORTED_SYMBOLS = [
  'BTC',
  'ETH',
  'SOL',
  'BNB',
  'ADA',
  'XRP',
  'DOT',
  'AVAX',
  'LINK',
  'UNI',
  'ATOM',
  'DOGE',
  'TRX',
  'BCH',
  'WBTC',
] as const

export default function ChartsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC')
  const [timeframe, setTimeframe] = useState<Timeframe>('5m')
  const timeframeOptions = useMemo(() => ['5m', '15m', '1H', '4H', '1D'] as Timeframe[], [])

  // Use polling hook for crypto data (for asset selector)
  const { prices: cryptoData } = usePricesPolling({
    pollingInterval: 30000 // 30 seconds for charts page
  })

  // Ensure selected symbol is in the supported list, reset to BTC if not
  const validSelectedSymbol = useMemo(() => {
    if (BINANCE_SUPPORTED_SYMBOLS.includes(selectedSymbol.toUpperCase() as any)) {
      return selectedSymbol
    }
    return 'BTC'
  }, [selectedSymbol])

  // Reset to valid symbol if current selection is not supported
  useEffect(() => {
    if (validSelectedSymbol !== selectedSymbol) {
      setSelectedSymbol(validSelectedSymbol)
    }
  }, [validSelectedSymbol, selectedSymbol])

  const selectedAsset = getAssetBySymbol(validSelectedSymbol)
  // Find real crypto data for icons
  const selectedCrypto = cryptoData.find(crypto => crypto.symbol.toUpperCase() === validSelectedSymbol.toUpperCase())

  const handleSymbolChange = (symbol: string) => {
    // Only allow changing to supported symbols
    if (BINANCE_SUPPORTED_SYMBOLS.includes(symbol.toUpperCase() as any)) {
      setSelectedSymbol(symbol)
    }
  }

  const chartSymbol = useMemo(() => {
    // Default to the most liquid USDT pair on Binance for this app
    // TradingChart accepts "BTC", "BTCUSDT" or "BINANCE:BTCUSDT"
    return `${validSelectedSymbol}USDT`
  }, [validSelectedSymbol])

  return (
    <div className="py-8">
      <PageShell>
        {/* Light-blue outer panel */}
        <section className="brand-frame space-y-4">
        {/* Title on light blue */}
        <header>
          <h1 className="text-3xl font-semibold text-white">Chart</h1>
          <p className="mt-1 text-sm text-slate-100">
            Live candlesticks powered by Binance exchange data
          </p>
        </header>

        {/* Card 1: Controls (keeps the previous stacked layout) */}
        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <label className="text-sm font-medium text-gray-700 shrink-0">Asset</label>
                <AssetSelector
                  selectedSymbol={validSelectedSymbol}
                  onSymbolChange={handleSymbolChange}
                  cryptoData={cryptoData}
                  allowedSymbols={BINANCE_SUPPORTED_SYMBOLS}
                />
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <label className="text-sm font-medium text-gray-700 shrink-0">Timeframe</label>
                <TimeframeSelector
                  selectedTimeframe={timeframe}
                  onTimeframeChange={setTimeframe}
                  timeframes={timeframeOptions}
                  storageKey="charts-timeframe"
                  enablePersistence={false}
                />
              </div>
            </div>

            <div className="text-xs text-gray-500">
              Live candles via Binance (USDT pairs).
            </div>
          </div>
        </div>

        {/* Card 2: Chart Display */}
        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div>
            {/* Chart Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {selectedCrypto ? (
                  <img
                    src={selectedCrypto.image}
                    alt={selectedCrypto.name}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                    {validSelectedSymbol.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedAsset?.name || validSelectedSymbol} ({validSelectedSymbol})
                  </h2>
                  <p className="text-sm text-gray-500">
                    {timeframe} Chart
                  </p>
                </div>
                <div className="ml-auto text-xs text-gray-500">
                  {chartSymbol}
                </div>
              </div>
            </div>

            {/* Live TradingView-style chart */}
            <div className="p-2 sm:p-4">
              <TradingChart symbol={chartSymbol} interval={timeframe} height={600} />
            </div>
          </div>
        </div>
        </section>
      </PageShell>
    </div>
  )
}
