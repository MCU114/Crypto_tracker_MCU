// Responsibility: Branded "Coming Soon" state when a symbol is not available in local/demo data.
import Link from 'next/link';

export default function AssetNotFound({ symbol }: { symbol: string }) {
  return (
    <div className="py-8">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-white">Coming Soon</h1>
        <p className="mt-1 text-sm text-slate-100 max-w-2xl">
          We don&apos;t have listing information for <strong>{symbol.toUpperCase()}</strong> yet.
        </p>
      </header>

      <div className="rounded-lg bg-white shadow p-6">
        <p className="text-slate-700 mb-4">
          This asset may be newly listed or not yet added to our curated dataset.
        </p>
        <div className="flex gap-3">
          <Link
            href="/assets"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Assets
          </Link>
          <Link
            href="/new-coins"
            className="px-4 py-2 bg-slate-100 text-slate-900 rounded-md hover:bg-slate-200"
          >
            New Coins
          </Link>
        </div>
      </div>
    </div>
  );
}

