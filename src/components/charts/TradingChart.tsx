'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ColorType,
  createChart,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  CandlestickData,
  HistogramData,
} from 'lightweight-charts'
import {
  fetchBinanceKlines,
  normalizeTradingSymbol,
  openBinanceKlineSocket,
  timeframeToBinanceInterval,
} from '@/src/lib/api/binance'

type TradingChartProps = {
  symbol: string
  interval: string // e.g. "1D" or "60" (minutes)
  height?: number
  width?: number
  className?: string
}

export default function TradingChart({ symbol, interval, height = 520, width, className }: TradingChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  const cleanupWsRef = useRef<null | (() => void)>(null)
  const didApplyInitialViewportRef = useRef(false)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const normalizedSymbol = useMemo(() => normalizeTradingSymbol(symbol), [symbol])
  const binanceInterval = useMemo(() => timeframeToBinanceInterval(interval), [interval])

  useEffect(() => {
    if (!containerRef.current) return

    // Reset error/loading when changing symbol/interval
    setLoading(true)
    setError(null)

    // Cleanup previous
    cleanupWsRef.current?.()
    cleanupWsRef.current = null
    chartRef.current?.remove()
    chartRef.current = null
    candleRef.current = null
    volumeRef.current = null
    didApplyInitialViewportRef.current = false

    const el = containerRef.current
    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: '#334155',
      },
      grid: {
        vertLines: { color: '#e2e8f0' },
        horzLines: { color: '#e2e8f0' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#e2e8f0' },
      timeScale: {
        borderColor: '#e2e8f0',
        timeVisible: true,
        secondsVisible: false,
        // Give some breathing room to the most recent candle (like TradingView)
        rightOffset: 5,
        barSpacing: 8,
      },
      width: width ?? el.clientWidth,
      height,
    })

    chartRef.current = chart

    const candle = chart.addCandlestickSeries({
      upColor: '#2854A5',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#2854A5',
      wickDownColor: '#ef4444',
    })
    candleRef.current = candle

    const volume = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    })
    chart.priceScale('volume').applyOptions({
      visible: true,
      borderColor: '#e2e8f0',
      scaleMargins: { top: 0.8, bottom: 0 },
    })
    volumeRef.current = volume

    const ro = new ResizeObserver(() => {
      if (!containerRef.current || !chartRef.current) return
      const nextWidth = width ?? containerRef.current.clientWidth
      chartRef.current.applyOptions({ width: nextWidth })

      // First-load fix: if the chart was initialized before layout settled,
      // apply viewport once we have a real width.
      if (!didApplyInitialViewportRef.current && nextWidth > 0) {
        didApplyInitialViewportRef.current = true
        chartRef.current.timeScale().fitContent()
        chartRef.current.timeScale().scrollToRealTime()
      }
    })
    ro.observe(el)

    let cancelled = false
    const ac = new AbortController()

    ;(async () => {
      try {
        const klines = await fetchBinanceKlines({
          symbol: normalizedSymbol,
          interval: binanceInterval,
          limit: 500,
          signal: ac.signal,
        })
        if (cancelled) return

        const candleData: CandlestickData[] = klines.map((k) => ({
          time: Math.floor(k.openTime / 1000) as any,
          open: k.open,
          high: k.high,
          low: k.low,
          close: k.close,
        }))

        const volumeData: HistogramData[] = klines.map((k) => ({
          time: Math.floor(k.openTime / 1000) as any,
          value: k.volume,
          color: k.close >= k.open ? 'rgba(40, 84, 165, 0.30)' : 'rgba(239, 68, 68, 0.30)',
        }))

        candle.setData(candleData)
        volume.setData(volumeData)

        // Fit + scroll AFTER layout settles. We also back this up in the ResizeObserver
        // callback to guarantee correct first-load sizing.
        requestAnimationFrame(() => {
          chart.timeScale().fitContent()
          chart.timeScale().scrollToRealTime()
          didApplyInitialViewportRef.current = true
        })

        // Live updates
        cleanupWsRef.current = openBinanceKlineSocket({
          symbol: normalizedSymbol,
          interval: binanceInterval,
          onKline: (k) => {
            if (!candleRef.current || !volumeRef.current) return
            const t = Math.floor(k.openTime / 1000) as any
            candleRef.current.update({
              time: t,
              open: k.open,
              high: k.high,
              low: k.low,
              close: k.close,
            })
            volumeRef.current.update({
              time: t,
              value: k.volume,
              color: k.close >= k.open ? 'rgba(40, 84, 165, 0.30)' : 'rgba(239, 68, 68, 0.30)',
            })
          },
          onError: () => {
            // Don't hard-fail the UI for transient WS issues; user still has historical candles.
          },
        })

        setLoading(false)
      } catch (e: any) {
        if (cancelled) return
        const msg =
          e?.name === 'AbortError'
            ? null
            : e?.message || 'Failed to load live chart. Please check your connection and try again.'
        if (msg) setError(msg)
        setLoading(false)
      }
    })()

    return () => {
      cancelled = true
      ac.abort()
      ro.disconnect()
      cleanupWsRef.current?.()
      cleanupWsRef.current = null
      chart.remove()
      chartRef.current = null
      candleRef.current = null
      volumeRef.current = null
    }
  }, [normalizedSymbol, binanceInterval, height, width])

  if (error) {
    return (
      <div className={className}>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="w-full relative"
        style={{
          height,
        }}
      >
        {/* Loading overlay (keep container mounted so chart has correct measurements) */}
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--brand-color)]" />
              <p className="text-slate-500">Loading live chart…</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

