import { NextResponse } from 'next/server'
import { BinanceInterval } from '@/src/lib/api/binance'

export const runtime = 'nodejs'

// Very small in-memory cache to smooth over transient Binance / network issues
// in production (especially on Vercel). This lives per Lambda instance.
type CacheEntry = {
  data: any
  expiresAt: number
}

const CACHE_TTL_MS = 15_000 // 15 seconds is enough for near-real-time charts
const klinesCache = new Map<string, CacheEntry>()

function makeCacheKey(symbol: string, interval: string, limit: number) {
  return `${symbol}:${interval}:${limit}`
}

function isValidInterval(v: string): v is BinanceInterval {
  return [
    '1m',
    '3m',
    '5m',
    '15m',
    '30m',
    '1h',
    '2h',
    '4h',
    '6h',
    '8h',
    '12h',
    '1d',
    '3d',
    '1w',
    '1M',
  ].includes(v)
}

function isValidSymbol(v: string): boolean {
  // Binance symbols are uppercase letters/numbers, no separators.
  return /^[A-Z0-9]{5,20}$/.test(v)
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const symbol = (searchParams.get('symbol') || '').toUpperCase()
  const interval = searchParams.get('interval') || ''
  const limitRaw = searchParams.get('limit') || '500'
  const limit = Math.max(1, Math.min(1000, Number(limitRaw) || 500))

  if (!isValidSymbol(symbol)) {
    return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 })
  }
  if (!isValidInterval(interval)) {
    return NextResponse.json({ error: 'Invalid interval' }, { status: 400 })
  }

  const cacheKey = makeCacheKey(symbol, interval, limit)
  const now = Date.now()
  const cached = klinesCache.get(cacheKey)
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached.data)
  }

  const url = `https://api.binance.com/api/v3/klines?symbol=${encodeURIComponent(
    symbol
  )}&interval=${encodeURIComponent(interval)}&limit=${encodeURIComponent(String(limit))}`

  let lastError: unknown = null

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, {
        // let Binance handle its own caching; we keep a tiny app-level cache above
        cache: 'no-store',
      })

      if (!res.ok) {
        const body = await res.text().catch(() => '')
        lastError = { status: res.status, body }

        // If Binance is briefly unhappy (5xx), retry a couple of times.
        if (res.status >= 500 && res.status < 600 && attempt < 2) {
          await new Promise((r) => setTimeout(r, 150 * (attempt + 1)))
          continue
        }

        // Soft-fallback: if we have recent cached data, return that instead of 5xx
        if (cached && cached.expiresAt > now - CACHE_TTL_MS * 2) {
          return NextResponse.json(cached.data)
        }

        return NextResponse.json(
          { error: `Binance upstream error (${res.status})`, details: body.slice(0, 200) },
          { status: 502 }
        )
      }

      const data = await res.json()
      klinesCache.set(cacheKey, { data, expiresAt: now + CACHE_TTL_MS })
      return NextResponse.json(data)
    } catch (err) {
      lastError = err
      // network/DNS/etc – small backoff then retry
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 150 * (attempt + 1)))
        continue
      }
    }
  }

  // Network / DNS / repeated failures: fall back to cache if possible
  if (cached && cached.expiresAt > now - CACHE_TTL_MS * 2) {
    return NextResponse.json(cached.data)
  }

  return NextResponse.json(
    { error: 'Failed to reach Binance klines API after retries', details: String(lastError).slice(0, 200) },
    { status: 502 }
  )
}

