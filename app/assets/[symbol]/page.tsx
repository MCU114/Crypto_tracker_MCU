import { Metadata } from 'next';
import { getAssetBySymbol } from '@/data/assets';
import AssetDetailClient from '@/src/components/assets/AssetDetailClient';
import { CoinDetails } from '@/src/types/market';
import AssetNotFound from '@/src/components/assets/AssetNotFound';
import PageShell from '@/src/components/layout/PageShell';
import newCoinsDemo from '@/data/newCoinsDemo';
import { Asset } from '@/src/types/asset';

interface AssetPageProps {
  params: {
    symbol: string;
  };
}

// Remove generateStaticParams - make this page dynamic/ISR instead
// This prevents build-time CoinGecko calls while still allowing good performance
export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }: AssetPageProps): Promise<Metadata> {
  const asset = getAssetBySymbol(params.symbol);
  if (asset) {
    return {
      title: `${asset.name} (${asset.symbol}) – overview and where to trade in Hong Kong | Cryptopedia`,
      description: `Learn about ${asset.name} (${asset.symbol}), a ${asset.category.toLowerCase()} crypto asset. Find where to trade ${asset.symbol} on licensed and unlicensed exchanges in Hong Kong.`,
    };
  }

  const demo = newCoinsDemo.find((c) => (c.symbol ?? '').toLowerCase() === params.symbol.toLowerCase());
  if (demo) {
    return {
      title: `${demo.name} (${demo.symbol}) – listing info (demo) | Cryptopedia`,
      description: `Demo listing information for ${demo.name} (${demo.symbol}).`,
    };
  }

  return {
    title: 'Asset Not Found | Cryptopedia',
  };
}

export default async function AssetPage({ params }: AssetPageProps) {
  const asset = getAssetBySymbol(params.symbol);
  const demo = newCoinsDemo.find((c) => (c.symbol ?? '').toLowerCase() === params.symbol.toLowerCase());

  // For demo new coins, synthesize an Asset-like object so we can reuse the same Listing Information UI.
  const assetForRender: Asset | null = asset
    ? asset
    : demo
      ? ({
          id: demo.id,
          symbol: demo.symbol.toUpperCase(),
          name: demo.name,
          // Use a generic category that fits the existing AssetCategory union.
          category: 'Other',
          baseChain: demo.network ?? '—',
          launchYear: demo.listing_date ? new Date(demo.listing_date).getFullYear() : new Date().getFullYear(),
          tradingPairs: ['USDT', 'USD'],
          logo: demo.symbol?.[0] ?? '•',
          description:
            'This is a newly discovered/demo listing. Full verified listing details and richer data cards are coming soon.',
          riskNote:
            'Coming soon: this listing is not yet fully verified. Treat all demo data as informational only.',
        } as unknown as Asset)
      : null;

  // Listing info pages are "wikipedia-style": no live market data or charts.
  const lastUpdated: number | null = null;
  const isStale = false;
  const coinDetails: CoinDetails | null = demo
    ? ({
        id: demo.id,
        symbol: demo.symbol.toLowerCase(),
        name: demo.name,
        image: { large: '', small: '' },
        market_data: {
          current_price: { usd: 0, hkd: 0 },
          price_change_percentage_24h: 0,
          market_cap: { usd: 0, hkd: 0 },
          fully_diluted_valuation: { usd: 0, hkd: 0 },
        },
        genesis_date: demo.listing_date ?? null,
        platforms: demo.platforms ?? {},
        links: {},
        description: { en: '' },
        tickers: [],
      } as CoinDetails)
    : null;

  // Note: existing coins intentionally render with `coinDetails = null` to avoid live market data.

  if (!assetForRender) {
    return (
      <div className="py-8">
        <PageShell>
          <section className="brand-frame space-y-4">
            <AssetNotFound symbol={params.symbol} />
          </section>
        </PageShell>
      </div>
    );
  }

  const assetWithLogo = assetForRender as any;
  return (
    <div className="py-8">
      <PageShell>
        <section className="brand-frame space-y-4">
        {/* Title on light blue */}
        <header className="mb-2">
          <h1 className="text-3xl font-bold text-white">
            Listing Information
          </h1>
          <p className="mt-1 text-sm brand-icon">
            Detailed information for this cryptocurrency and its listings.
          </p>

          {lastUpdated && (
            <p className="mt-2 text-sm brand-icon" suppressHydrationWarning>
              Last updated: {new Date(lastUpdated).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
              {isStale && <span className="text-amber-200 ml-2">(Data ~10min old)</span>}
            </p>
          )}
        </header>

        {/* White content area with separate cards (AssetDetailClient already renders card sections) */}
        <div className="space-y-4">
          <div className="space-y-6">
            <AssetDetailClient asset={assetWithLogo} coinDetails={coinDetails} />
          </div>
        </div>
        </section>
      </PageShell>
    </div>
  );
}

