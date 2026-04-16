import Link from 'next/link';

export default function WalletComparePage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl">
      <div className="mb-8">
        <Link
          href="/wallets"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Wallets
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Wallet Comparison Tool
        </h1>
        <p className="text-slate-600">
          Detailed comparison of multiple crypto wallets side by side
        </p>
      </div>


      <div className="bg-white rounded-lg shadow p-12 text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Coming Soon</h2>
        <p className="text-slate-600 mb-6">
          This advanced tool will allow detailed comparison of multiple wallets
          with customizable criteria and side-by-side feature comparison.
        </p>
        <Link
          href="/wallets"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Wallets
        </Link>
      </div>
    </div>
  </div>
  );
}