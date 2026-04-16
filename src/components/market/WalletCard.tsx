'use client';

import { Wallet } from '@/src/types/wallet';
import SponsoredPlacementNotice from '@/src/components/ads/SponsoredPlacementNotice';

interface WalletCardProps {
  wallet: Wallet;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function WalletCard({ wallet, isSelected, onToggleSelect }: WalletCardProps) {
  return (
    <div className={`card-surface p-5 md:p-6 ${isSelected ? 'border-2 border-blue-500 shadow-md shadow-blue-100' : ''}`}>
      <div className="relative">
        {/* Top row: Logo, Name and Type badge */}
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="flex items-start gap-3">
            {wallet.logoUrl && (
              <img
                src={wallet.logoUrl}
                alt={`${wallet.name} logo`}
                className="w-14 h-14 rounded-lg object-contain flex-shrink-0 border border-slate-200 bg-white p-1"
                loading="lazy"
                onError={(e) => {
                  try {
                    e.currentTarget.style.display = 'none';
                  } catch (err) {
                    // Silently fail
                  }
                }}
              />
            )}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight">
                {wallet.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">{wallet.type} · {wallet.custody}</p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span className="badge-soft bg-blue-50 text-blue-700 border border-blue-200">
              {wallet.type}
            </span>
            <span className={`badge-soft ${
              wallet.custody === 'Non-custodial'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {wallet.custody}
            </span>
          </div>
        </div>

        {/* Platforms */}
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 mb-2">
            Platforms
          </p>
          <div className="flex flex-wrap gap-2">
            {wallet.platforms.map((platform) => (
              <span key={platform} className="pill-tab bg-slate-50 border-slate-200 text-[11px]">
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Networks */}
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 mb-2">
            Supported networks
          </p>
          <div className="flex flex-wrap gap-2">
            {wallet.networks.map((network) => (
              <span key={network} className="pill-tab bg-indigo-50 text-indigo-700 border-indigo-200 text-[11px]">
                {network}
              </span>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 mb-2">
            Key features
          </p>
          <p className="text-xs text-slate-600">{wallet.features.join(' · ')}</p>
        </div>

        {/* Supported Assets */}
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 mb-2">
            Supported major assets
          </p>
          <p className="text-sm text-slate-900 font-mono">{wallet.supportedAssets.join(', ')}</p>
        </div>

        {/* Pros and Cons */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2">
            <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-[0.16em] mb-1">
              Pros
            </p>
            <p className="text-xs text-emerald-900">{wallet.pros}</p>
          </div>
          <div className="rounded-xl bg-rose-50 border border-rose-100 px-3 py-2">
            <p className="text-[11px] font-semibold text-rose-700 uppercase tracking-[0.16em] mb-1">
              Cons
            </p>
            <p className="text-xs text-rose-900">{wallet.cons}</p>
          </div>
        </div>

        {/* Sponsored placement */}
        <SponsoredPlacementNotice websiteUrl={wallet.websiteUrl} />

        {/* Bottom row: Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={() => onToggleSelect(wallet.id)}
            className={`flex-1 px-5 py-3 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-500'
                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
            }`}
          >
            Compare
          </button>
          <a
            href={wallet.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-5 py-3 border border-slate-200 rounded-full text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm text-center shadow-sm hover:shadow-md transition-all"
          >
            Visit wallet
          </a>
        </div>
      </div>
    </div>
  );
}


