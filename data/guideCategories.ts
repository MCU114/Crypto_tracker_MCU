import { GuideCategory } from '@/src/types/guide';

export const guideCategories: GuideCategory[] = [
  {
    id: '1',
    slug: 'technical-indicators',
    name: 'Technical Indicators',
    description: 'Learn essential technical indicators like RSI, MACD, moving averages, and more to analyze crypto price movements.',
  },
  {
    id: '2',
    slug: 'candlestick-patterns',
    name: 'Candlestick Patterns',
    description: 'Master candlestick patterns to identify market trends, reversals, and entry/exit points in crypto trading.',
  },
  {
    id: '3',
    slug: 'risk-management',
    name: 'Risk Management',
    description: 'Essential strategies for managing risk, setting stop-losses, position sizing, and protecting your capital.',
  },
  {
    id: '4',
    slug: 'crypto-basics',
    name: 'Crypto Basics',
    description: 'Fundamental concepts for beginners: wallets, exchanges, blockchain basics, and getting started with crypto.',
  },
];

export function getCategoryBySlug(slug: string): GuideCategory | undefined {
  return guideCategories.find((category) => category.slug === slug);
}


