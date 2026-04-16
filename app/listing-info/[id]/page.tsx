import { redirect } from 'next/navigation';
import { fetchCoinDetails } from '@/src/lib/api/coingecko';

interface ListingInfoDetailRedirectProps {
  params: {
    id: string;
  };
}

// Mapping from CoinGecko IDs to symbols for common coins
const coinGeckoIdToSymbol: Record<string, string> = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'tether': 'USDT',
  'usd-coin': 'USDC',
  'solana': 'SOL',
  'binancecoin': 'BNB',
  'ripple': 'XRP',
  'cardano': 'ADA',
  'dogecoin': 'DOGE',
  'matic-network': 'MATIC',
  'avalanche-2': 'AVAX',
  'chainlink': 'LINK',
  'uniswap': 'UNI',
  'cosmos': 'ATOM',
  'polkadot': 'DOT',
};

export default async function ListingInfoDetailRedirect({ params }: ListingInfoDetailRedirectProps) {
  const coinId = decodeURIComponent(params.id);
  
  // First try the static mapping
  const symbol = coinGeckoIdToSymbol[coinId.toLowerCase()];
  
  if (symbol) {
    redirect(`/assets/${symbol}`);
  }
  
  // If not in static mapping, try to fetch from API to get symbol
  try {
    const coinDetails = await fetchCoinDetails(coinId, true);
    if (coinDetails) {
      // Try to find asset by symbol
      const upperSymbol = coinDetails.symbol.toUpperCase();
      redirect(`/assets/${upperSymbol}`);
    }
  } catch (err) {
    console.warn('Failed to fetch coin details for redirect:', err);
  }
  
  // Fallback to assets index if we can't determine the symbol
  redirect('/assets');
}
