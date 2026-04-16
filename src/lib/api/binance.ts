// Binance API client for klines and market data

export type BinanceInterval =
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1M'

export type BinanceKline = {
  openTime: number // ms
  open: number
  high: number
  low: number
  close: number
  volume: number
  closeTime: number // ms
  isFinal: boolean
}

export function normalizeTradingSymbol(input: string): string {
  // Accept: "BTC", "BTCUSDT", "BINANCE:BTCUSDT"
  const raw = input.includes(':') ? input.split(':').pop() || input : input
  const upper = raw.trim().toUpperCase()
  if (!upper) return 'BTCUSDT'
  if (upper.endsWith('USDT')) return upper
  // default quote for this app
  return `${upper}USDT`
}

export function timeframeToBinanceInterval(interval: string): BinanceInterval {
  // Accept app Timeframe values ("1m","5m","15m","1H","4H","1D","1W","1M") and some TradingView-like inputs ("60","240","1D")
  const normalized = interval.trim()

  // TradingView-style numeric minute intervals
  if (/^\d+$/.test(normalized)) {
    const minutes = Number(normalized)
    if (minutes === 1) return '1m'
    if (minutes === 3) return '3m'
    if (minutes === 5) return '5m'
    if (minutes === 15) return '15m'
    if (minutes === 30) return '30m'
    if (minutes === 60) return '1h'
    if (minutes === 120) return '2h'
    if (minutes === 240) return '4h'
    if (minutes === 360) return '6h'
    if (minutes === 480) return '8h'
    if (minutes === 720) return '12h'
    // fallback
    return '1h'
  }

  const upper = normalized.toUpperCase()
  switch (upper) {
    case '1M':
    case '1MO':
    case '1MON':
      return '1M'
    case '1W':
      return '1w'
    case '3D':
      return '3d'
    case '1D':
      return '1d'
    case '12H':
      return '12h'
    case '8H':
      return '8h'
    case '6H':
      return '6h'
    case '4H':
      return '4h'
    case '2H':
      return '2h'
    case '1H':
      return '1h'
    case '30M':
      return '30m'
    case '15M':
      return '15m'
    case '5M':
      return '5m'
    case '3M':
      return '3m'
    case '1M': // minute timeframe clashes with month; app uses "1m" for minute, so month handled above
      return '1M'
    case '1MIN':
      return '1m'
    case '1MINS':
      return '1m'
    case '1M ':
      return '1m'
    default:
      // app uses lowercase for minutes
      if (normalized === '1m' || normalized === '3m' || normalized === '5m' || normalized === '15m') {
        return normalized as BinanceInterval
      }
      return '1d'
  }
}

export async function fetchBinanceKlines(opts: {
  symbol: string
  interval: BinanceInterval
  limit?: number
  signal?: AbortSignal
}): Promise<BinanceKline[]> {
  const { symbol, interval, limit = 500, signal } = opts
  // Fetch via our own API route to avoid browser CORS/network policy issues.
  const url = `/api/binance/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(
    interval
  )}&limit=${encodeURIComponent(String(limit))}`

  const res = await fetch(url, { cache: 'no-store', signal })
  if (!res.ok) {
    throw new Error(`Binance klines request failed (${res.status})`)
  }

  const raw = (await res.json()) as any[]
  return raw.map((k) => ({
    openTime: Number(k[0]),
    open: Number(k[1]),
    high: Number(k[2]),
    low: Number(k[3]),
    close: Number(k[4]),
    volume: Number(k[5]),
    closeTime: Number(k[6]),
    isFinal: true,
  }))
}

export function openBinanceKlineSocket(opts: {
  symbol: string
  interval: BinanceInterval
  onKline: (k: BinanceKline) => void
  onError?: (err: unknown) => void
}): () => void {
  const { symbol, interval, onKline, onError } = opts
  const streamSymbol = symbol.toLowerCase()
  const streamInterval = interval.toLowerCase()
  const wsUrl = `wss://stream.binance.com:9443/ws/${streamSymbol}@kline_${streamInterval}`

  const ws = new WebSocket(wsUrl)

  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(String(ev.data))
      const k = msg?.k
      if (!k) return
      onKline({
        openTime: Number(k.t),
        open: Number(k.o),
        high: Number(k.h),
        low: Number(k.l),
        close: Number(k.c),
        volume: Number(k.v),
        closeTime: Number(k.T),
        isFinal: Boolean(k.x),
      })
    } catch (e) {
      onError?.(e)
    }
  }

  ws.onerror = (e) => onError?.(e)

  return () => {
    try {
      ws.close()
    } catch {
      // ignore
    }
  }
}
