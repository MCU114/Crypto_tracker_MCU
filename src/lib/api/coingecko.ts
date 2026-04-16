// CoinGecko API client with rate limiting and retry logic
import { CryptoPrice, NewCoin, CoinDetails } from '@/src/types/market';
import { OHLCVPoint, Timeframe, TIMEFRAME_CONFIGS } from '@/src/types/chart';

// Rate limiting
const requestTimestamps: number[] = [];
const MAX_CALLS_PER_MINUTE = 15;

function enforceRateLimit(): void {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;

  // Remove timestamps older than 1 minute
  while (requestTimestamps.length > 0 && requestTimestamps[0] < oneMinuteAgo) {
    requestTimestamps.shift();
  }

  // If we've hit the limit, throw an error to prevent the call
  if (requestTimestamps.length >= MAX_CALLS_PER_MINUTE) {
    throw new Error('RATE_LIMIT_APPROACHING');
  }

  requestTimestamps.push(now);
}

// Helper function to retry requests with exponential backoff
async function fetchWithRetry(
  url: string,
  options: any = {},
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // If rate limited, wait and retry
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter 
          ? parseInt(retryAfter) * 1000 
          : Math.min(1000 * Math.pow(2, attempt), 10000); // Exponential backoff, max 10s
        
        if (attempt < maxRetries - 1) {
          console.warn(`Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries - 1) {
        const waitTime = 1000 * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError || new Error('Max retries exceeded');
}

async function coingeckoFetch<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  try {
    enforceRateLimit();

    const url = new URL(`https://api.coingecko.com/api/v3/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        url.searchParams.append(key, String(val));
      });
    }

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });

    if (res.status === 429) {
      throw new Error('COINGECKO_RATE_LIMITED');
    }

    if (!res.ok) {
      throw new Error(`CoinGecko error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error(`[CoinGecko] ${endpoint} failed:`, error);
    throw error;
  }
}

// Market data functions
export async function fetchMarkets(): Promise<CryptoPrice[]> {
  return coingeckoFetch('coins/markets', {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 100,
    page: 1,
    sparkline: 'false',
    price_change_percentage: '1h,24h,7d',
  });
}

export async function fetchAssetDetails(id: string): Promise<any> {
  return coingeckoFetch(`coins/${id}`, {
    localization: 'false',
    tickers: 'false',
    market_data: 'true',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'false',
  });
}

export async function fetchGlobalStats(): Promise<any> {
  return coingeckoFetch('global', {});
}

// Legacy API functions (from lib/api.ts)
export async function fetchTopCryptos(limit: number = 50, isServer: boolean = false): Promise<CryptoPrice[]> {
  try {
    const fetchOptions: any = {}
    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 300 }
    } else {
      fetchOptions.cache = 'no-store'
      fetchOptions.next = { revalidate: 300 }
    }
    
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=1h,24h,7d`
    const response = await fetchWithRetry(url, Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'no-store' })
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error(`Failed to fetch crypto prices: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching top cryptos:', error)
    throw error
  }
}

export async function fetchNewCoins(isServer: boolean = false): Promise<NewCoin[]> {
  try {
    const fetchOptions: any = {}
    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 600 }
    } else {
      fetchOptions.cache = 'no-store'
      fetchOptions.next = { revalidate: 600 }
    }
    
    const response = await fetchWithRetry(
      'https://api.coingecko.com/api/v3/search/trending',
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'no-store' }
    )
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error('Failed to fetch new coins')
    }
    
    const data = await response.json()
    
    const coinIds = data.coins.map((coin: any) => coin.item.id).join(',')
    
    if (!coinIds) {
      return []
    }
    
    const pricesFetchOptions: any = {}
    if (isServer && typeof window === 'undefined') {
      pricesFetchOptions.next = { revalidate: 600 }
    } else {
      pricesFetchOptions.cache = 'force-cache'
      pricesFetchOptions.next = { revalidate: 600 }
    }
    
    const pricesResponse = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&per_page=20&page=1&sparkline=false`,
      Object.keys(pricesFetchOptions).length > 0 ? pricesFetchOptions : { cache: 'no-store' }
    )
    
    if (!pricesResponse.ok) {
      if (pricesResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error('Failed to fetch coin prices')
    }
    
    const pricesData = await pricesResponse.json()
    
    return pricesData.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      fully_diluted_valuation: coin.fully_diluted_valuation,
      listing_date: 'N/A',
      platforms: {},
    })) as NewCoin[]
  } catch (error) {
    console.error('Error fetching new coins:', error)
    throw error
  }
}

export async function fetchCoinById(coinId: string, isServer: boolean = false): Promise<CryptoPrice | null> {
  try {
    const fetchOptions: any = {}
    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 300 }
    } else {
      fetchOptions.cache = 'no-store'
      fetchOptions.next = { revalidate: 300 }
    }
    
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}&sparkline=false`
    const response = await fetchWithRetry(
      url,
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'no-store' }
    )
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`Rate limited when fetching coin ${coinId}`)
      } else {
        console.warn(`Failed to fetch coin ${coinId}: ${response.status} ${response.statusText}`)
      }
      return null
    }
    
    const data = await response.json()
    if (data.length === 0) {
      return null
    }
    
    return data[0] as CryptoPrice
  } catch (error) {
    console.error(`Error fetching coin ${coinId}:`, error)
    return null
  }
}

export async function fetchCoinDetails(coinId: string, isServer: boolean = false): Promise<CoinDetails | null> {
  try {
    const fetchOptions: any = {}
    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 600 }
    } else {
      fetchOptions.cache = 'no-store'
      fetchOptions.next = { revalidate: 600 }
    }
    
    const response = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`,
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'force-cache' }
    )
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn(`Rate limited when fetching coin details for ${coinId}`)
      } else {
        console.warn(`Failed to fetch coin details for ${coinId}: ${response.status} ${response.statusText}`)
      }
      return null
    }
    
    const data = await response.json()
    return data as CoinDetails
  } catch (error) {
    console.error(`Error fetching coin details for ${coinId}:`, error)
    return null
  }
}

// Historical data functions
export async function fetchHistoricalData(
  coinId: string,
  days: number = 7,
  isServer: boolean = false
): Promise<{ time: number; price: number }[]> {
  try {
    const fetchOptions: any = {}

    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 600 }
    } else {
      fetchOptions.cache = 'force-cache'
      fetchOptions.next = { revalidate: 600 }
    }

    const response = await fetchWithRetry(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'force-cache' }
    )

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error('Failed to fetch historical data')
    }

    const data = await response.json()

    return data.prices.map(([time, price]: [number, number]) => ({
      time,
      price,
    }))
  } catch (error) {
    console.error('Error fetching historical data:', error)
    throw error
  }
}

// OHLCV data functions
export async function fetchOHLCVData(
  coinId: string,
  timeframe: Timeframe = '1D',
  isServer: boolean = false
): Promise<OHLCVPoint[]> {
  try {
    const config = TIMEFRAME_CONFIGS[timeframe]
    const fetchOptions: any = {}

    if (isServer && typeof window === 'undefined') {
      fetchOptions.next = { revalidate: 600 }
    } else {
      fetchOptions.cache = 'force-cache'
      fetchOptions.next = { revalidate: 600 }
    }

    let url: string
    if (['1m', '5m', '15m', '1H', '4H'].includes(timeframe)) {
      url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${config.days}`
    } else {
      const to = Math.floor(Date.now() / 1000)
      const from = to - (config.days * 24 * 60 * 60)
      url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`
    }

    const response = await fetchWithRetry(
      url,
      Object.keys(fetchOptions).length > 0 ? fetchOptions : { cache: 'no-store' }
    )

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.')
      }
      throw new Error('Failed to fetch OHLCV data')
    }

    const data = await response.json()

    if (['1m', '5m', '15m', '1H', '4H'].includes(timeframe)) {
      return data.map(([time, open, high, low, close]: [number, number, number, number, number]) => {
        const normalizedTime = time > 1e12 ? Math.floor(time / 1000) : time
        return {
          time: normalizedTime,
          open,
          high,
          low,
          close,
          volume: 0,
        }
      })
    } else {
      const prices = data.prices || []
      const volumes = data.total_volumes || []

      return prices.map(([time, close]: [number, number], index: number) => {
        const volume = volumes[index]?.[1] || 0
        const normalizedTime = time > 1e12 ? Math.floor(time / 1000) : time
        return {
          time: normalizedTime,
          open: close,
          high: close,
          low: close,
          close,
          volume,
        }
      })
    }
  } catch (error) {
    console.error('Error fetching OHLCV data:', error)
    console.warn('Falling back to mock OHLCV data')
    return generateMockOHLCVData(coinId, timeframe)
  }
}

// Generate mock OHLCV data for development and testing
export function generateMockOHLCVData(
  coinId: string,
  timeframe: Timeframe = '1D',
  dataPoints: number = 200
): OHLCVPoint[] {
  const config = TIMEFRAME_CONFIGS[timeframe]
  const now = Date.now()
  const intervalMs = getTimeframeIntervalMs(timeframe)

  const basePrices: Record<string, number> = {
    btc: 95000,
    bitcoin: 95000,
    eth: 3200,
    ethereum: 3200,
    sol: 180,
    solana: 180,
    bnb: 420,
    binancecoin: 420,
    ada: 0.58,
    cardano: 0.58,
    xrp: 1.20,
    ripple: 1.20,
    dot: 8.50,
    polkadot: 8.50,
    avax: 42,
    avalanche: 42,
    link: 18,
    chainlink: 18,
    ltc: 95,
    litecoin: 95,
    polygon: 0.72,
    uniswap: 12.80,
    cosmos: 11.20,
    algorand: 0.18,
    vechain: 0.035,
    stellar: 0.15,
    tron: 0.12,
    internetcomputer: 12.50,
    filecoin: 5.80,
    hedera: 0.08,
    flow: 0.95,
    multiversx: 48,
    theta: 1.85,
    axieinfinity: 8.50,
    fantom: 0.48,
    near: 3.20,
    eos: 0.95,
    apecoin: 1.80,
    thegraph: 0.18,
    sand: 0.55,
    mana: 0.48,
    enjincoin: 0.32,
    gala: 0.042,
    'matic-network': 0.72,
    'wrapped-bitcoin': 95000,
    'dai': 1.00,
    'shiba-inu': 0.000028,
    'leo-token': 5.20,
    'crypto-com-chain': 0.12,
    'okb': 58,
    'bitcoin-cash': 320,
    'quant-network': 95,
    'iota': 0.28,
    'neutrino': 18,
    'maker': 2200,
    'helium': 4.80,
    'lido-dao': 2.80,
    'bitcoin-cash-sv': 85,
    'ecash': 0.000052,
    'zcash': 42,
    'neo': 15,
    'waves': 2.50,
    'basic-attention-token': 0.28,
    'dash': 38,
    'decentraland': 0.52,
    'aave': 125,
    'compound-governance-token': 65,
    'sushi': 1.45,
    '1inch': 0.42,
    'curve-dao-token': 0.68,
    'yearn-finance': 8200,
    'balancer': 4.50,
    'ren': 0.072,
    'loopring': 0.32,
    'republic-protocol': 0.058,
    'bancor': 0.62,
    'kyber-network-crystal': 0.85,
    '0x': 0.48,
    'synthetix': 3.20,
    'reserve-rights-token': 0.0038,
    'origin-protocol': 0.12,
    'uma': 2.40,
    'band-protocol': 1.85,
  }

  const basePrice = basePrices[coinId.toLowerCase()] || 100
  let currentPrice = basePrice

  const data: OHLCVPoint[] = []

  for (let i = dataPoints - 1; i >= 0; i--) {
    const time = now - (i * intervalMs)
    const timeSec = Math.floor(time / 1000)
    const volatility = 0.02
    const change = (Math.random() - 0.5) * 2 * volatility
    const open = currentPrice
    const close = open * (1 + change)
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5)
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5)
    const volume = Math.random() * 1000000 + 100000

    data.push({
      time: timeSec,
      open,
      high,
      low,
      close,
      volume,
    })

    currentPrice = close
  }

  return data
}

function getTimeframeIntervalMs(timeframe: Timeframe): number {
  switch (timeframe) {
    case '1m': return 60 * 1000
    case '5m': return 5 * 60 * 1000
    case '15m': return 15 * 60 * 1000
    case '1H': return 60 * 60 * 1000
    case '4H': return 4 * 60 * 60 * 1000
    case '1D': return 24 * 60 * 60 * 1000
    case '1W': return 7 * 24 * 60 * 60 * 1000
    case '1M': return 30 * 24 * 60 * 60 * 1000
    default: return 24 * 60 * 60 * 1000
  }
}
