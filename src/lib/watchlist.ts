// Utilities for managing watchlist in localStorage

export interface WatchlistItem {
  id: string
  symbol: string
  name: string
}

const WATCHLIST_KEY = 'crypto-info-watchlist'

// Get watchlist from localStorage
export function getWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading watchlist from localStorage:', error)
    return []
  }
}

// Add coin to watchlist
export function addToWatchlist(coin: WatchlistItem): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    const watchlist = getWatchlist()
    
    // Check if coin already exists
    if (watchlist.some((item) => item.id === coin.id)) {
      return
    }
    
    watchlist.push(coin)
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist))
  } catch (error) {
    console.error('Error adding to watchlist:', error)
  }
}

// Remove coin from watchlist
export function removeFromWatchlist(coinId: string): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    const watchlist = getWatchlist()
    const filtered = watchlist.filter((item) => item.id !== coinId)
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error removing from watchlist:', error)
  }
}

// Check if coin is in watchlist
export function isInWatchlist(coinId: string): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const watchlist = getWatchlist()
  return watchlist.some((item) => item.id === coinId)
}

// Toggle coin in watchlist (add if not present, remove if present)
export function toggleWatchlist(coin: WatchlistItem): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const wasInWatchlist = isInWatchlist(coin.id)

  if (wasInWatchlist) {
    removeFromWatchlist(coin.id)
  } else {
    addToWatchlist(coin)
  }

  return !wasInWatchlist // Return true if added, false if removed
}
