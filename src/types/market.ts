// Market and price-related types

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_1h: number | null
  price_change_percentage_24h: number
  price_change_percentage_7d: number | null
  total_volume: number
  market_cap: number
  image: string
}

export interface NewCoin {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number | null
  fully_diluted_valuation: number | null
  listing_date: string
  platforms: Record<string, string>
}

export interface CoinDetails {
  id: string
  symbol: string
  name: string
  image: {
    large: string
    small: string
  }
  market_data: {
    current_price: { usd: number; hkd: number }
    price_change_percentage_24h: number
    market_cap: { usd: number; hkd: number }
    fully_diluted_valuation: { usd: number; hkd: number }
  }
  genesis_date: string | null
  platforms: Record<string, string>
  links: {
    homepage?: string[]
    whitepaper?: string
    twitter_screen_name?: string
    telegram_channel_identifier?: string
    subreddit_url?: string
  }
  description: {
    en: string
  }
  tickers?: Array<{
    base: string
    target: string
    market: {
      name: string
    }
    last: number
  }>
}
