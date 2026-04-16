export interface SponsoredListAd {
  id: string
  title: string
  logoUrl: string
  description: string
  ctaText: string
  ctaUrl: string
  isSponsored?: boolean
}

export interface SponsoredSidebarAd {
  id: string
  title: string
  logoUrl: string
  description: string
  ctaUrl: string
}

export const mockListAds: SponsoredListAd[] = [
  {
    id: 'ad-1',
    title: 'Crypto.com Exchange',
    logoUrl: '/logos/crypto-com.png',
    description: 'Trade over 250+ cryptocurrencies with zero trading fees on select pairs. Get up to 10% back on all trades.',
    ctaText: 'Start Trading',
    ctaUrl: 'https://crypto.com/exchange',
    isSponsored: true,
  },
  {
    id: 'ad-2',
    title: 'KuCoin - Earn Rewards',
    logoUrl: '/logos/kucoin.png',
    description: 'Stake your crypto and earn up to 12% APY. Join over 20 million users worldwide.',
    ctaText: 'Earn Now',
    ctaUrl: 'https://www.kucoin.com',
    isSponsored: true,
  },
]

export const mockSidebarAds: SponsoredSidebarAd[] = [
  {
    id: 'sidebar-ad-1',
    title: 'Bybit',
    logoUrl: '/logos/bybit.png',
    description: 'Trade futures with leverage up to 100x',
    ctaUrl: 'https://www.bybit.com',
  },
  {
    id: 'sidebar-ad-2',
    title: 'Gate.io',
    logoUrl: '/logos/gateio.png',
    description: 'Launchpad for new crypto projects',
    ctaUrl: 'https://www.gate.io',
  },
]