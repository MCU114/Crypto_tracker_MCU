// React hook for polling cryptocurrency prices
// Provides near real-time updates without over-fetching or blocking renders

import { useState, useEffect, useCallback, useRef } from 'react'
import { CryptoPrice } from '@/src/types/market'

interface PricesResponse {
  data: CryptoPrice[]
  lastUpdated: string | null
  isStale: boolean
  _debug?: any
}

interface UsePricesPollingOptions {
  pollingInterval?: number // milliseconds
  enabled?: boolean
}

interface UsePricesPollingReturn {
  prices: CryptoPrice[]
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  isStale: boolean
  refetch: () => Promise<void>
}

/**
 * Hook for polling cryptocurrency prices from the API
 * Features:
 * - Fetches once on mount
 * - Polls at configurable interval
 * - Prevents multiple concurrent requests
 * - Updates data in-place without loading states after initial load
 * - Cleans up polling on unmount
 */
export function usePricesPolling(options: UsePricesPollingOptions = {}): UsePricesPollingReturn {
  const {
    pollingInterval = 15000, // 15 seconds default
    enabled = true
  } = options

  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isStale, setIsStale] = useState(false)

  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const isFetchingRef = useRef(false)
  const mountedRef = useRef(true)

  // Fetch function that prevents concurrent requests
  const fetchPrices = useCallback(async (showLoading = false): Promise<void> => {
    if (!enabled || !mountedRef.current) return
    if (isFetchingRef.current) {
      console.log('Price fetch already in progress, skipping')
      return
    }

    isFetchingRef.current = true

    if (showLoading) {
      setLoading(true)
    }

    try {
      setError(null)

      const response = await fetch('/api/prices')

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}`)
      }

      const data: PricesResponse = await response.json()

      if (mountedRef.current) {
        setPrices(data.data)
        setLastUpdated(data.lastUpdated ? new Date(data.lastUpdated) : null)
        setIsStale(data.isStale)
        setLoading(false)
      }

    } catch (err) {
      if (mountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices'
        setError(errorMessage)
        setLoading(false)
        console.error('Error fetching prices:', err)
      }
    } finally {
      isFetchingRef.current = false
    }
  }, [enabled])

  // Manual refetch function
  const refetch = useCallback(async (): Promise<void> => {
    await fetchPrices(true)
  }, [fetchPrices])

  // Set up polling
  useEffect(() => {
    if (!enabled) return

    // Initial fetch
    fetchPrices(true)

    // Set up polling
    const startPolling = () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }

      pollingRef.current = setInterval(() => {
        if (mountedRef.current) {
          fetchPrices(false) // Don't show loading for polling updates
        }
      }, pollingInterval)
    }

    // Start polling after initial fetch completes
    const timer = setTimeout(startPolling, 1000) // Small delay to ensure initial fetch starts

    return () => {
      clearTimeout(timer)
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [enabled, pollingInterval, fetchPrices])

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
        pollingRef.current = null
      }
    }
  }, [])

  return {
    prices,
    loading,
    error,
    lastUpdated,
    isStale,
    refetch
  }
}
