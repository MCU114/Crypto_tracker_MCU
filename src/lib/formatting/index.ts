// Utility functions for formatting data

export function formatCurrency(value: number): string {
  if (value < 0.01) {
    return `$${value.toFixed(6)}`
  }
  if (value < 1) {
    return `$${value.toFixed(4)}`
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercentage(value: number | null): string {
  if (value === null || value === undefined) {
    return 'N/A'
  }
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

export function formatMarketCap(value: number | null): string {
  if (value === null || value === undefined) {
    return 'N/A'
  }

  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  }
  return `$${value.toLocaleString()}`
}

export function formatVolume(value: number | null): string {
  if (value === null || value === undefined) {
    return 'N/A'
  }

  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  }
  return `$${value.toLocaleString()}`
}

export function formatDate(dateString: string): string {
  if (dateString === 'N/A' || !dateString) {
    return 'N/A'
  }
  
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}
