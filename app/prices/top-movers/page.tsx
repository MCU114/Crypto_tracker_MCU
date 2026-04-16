import Link from 'next/link';
import PageShell from '@/src/components/layout/PageShell';

export default function TopMoversPage() {
  return (
    <PageShell>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto w-full max-w-6xl lg:max-w-7xl">
          <div className="mb-8">
            <Link
              href="/prices"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              ← Back to Prices
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Today's Top Movers
            </h1>
            <p className="text-slate-600">
              Biggest gainers and losers in the last 24 hours
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Coming Soon</h2>
            <p className="text-slate-600 mb-6">
              This page will show the biggest cryptocurrency gainers and losers from the last 24 hours,
              filtered from our live market data.
            </p>
            <Link
              href="/prices"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Prices
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}