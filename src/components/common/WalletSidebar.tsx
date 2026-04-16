'use client';

import { WalletSidebarFilters } from '@/src/types/wallet';

interface WalletSidebarProps {
  filters: WalletSidebarFilters;
  onFilterChange: (filters: WalletSidebarFilters) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function WalletSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
  isOpen = false,
  onClose,
}: WalletSidebarProps) {
  const updateFilter = (section: keyof WalletSidebarFilters, key: string, value: boolean) => {
    const newFilters = {
      ...filters,
      [section]: {
        ...filters[section],
        [key]: value,
      },
    };
    onFilterChange(newFilters);
  };

  const content = (
    <div className="bg-white/90 backdrop-blur-sm border-r border-slate-200 p-6 h-full">
      <h2 className="text-sm font-semibold text-slate-900 tracking-[0.18em] uppercase mb-5">
        Filters
      </h2>

      <div className="space-y-6 text-sm">
        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-[0.16em]">
            Wallet type
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.walletType.hardware}
                onChange={(e) => updateFilter('walletType', 'hardware', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Hardware</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.walletType.software}
                onChange={(e) => updateFilter('walletType', 'software', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Software</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.walletType.browser}
                onChange={(e) => updateFilter('walletType', 'browser', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Browser</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.walletType.mobile}
                onChange={(e) => updateFilter('walletType', 'mobile', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Mobile</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-[0.16em]">
            Custody
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.custody.custodial}
                onChange={(e) => updateFilter('custody', 'custodial', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Custodial</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.custody.nonCustodial}
                onChange={(e) => updateFilter('custody', 'nonCustodial', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Non-custodial</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-[0.16em]">
            Supported networks
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.networks.bitcoin}
                onChange={(e) => updateFilter('networks', 'bitcoin', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Bitcoin</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.networks.ethereum}
                onChange={(e) => updateFilter('networks', 'ethereum', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Ethereum</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.networks.solana}
                onChange={(e) => updateFilter('networks', 'solana', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Solana</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.networks.multiChain}
                onChange={(e) => updateFilter('networks', 'multiChain', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Multi-chain</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-[0.16em]">
            Use case
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.useCase.beginnerFriendly}
                onChange={(e) => updateFilter('useCase', 'beginnerFriendly', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Beginner friendly</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.useCase.defi}
                onChange={(e) => updateFilter('useCase', 'defi', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">DeFi</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.useCase.nfts}
                onChange={(e) => updateFilter('useCase', 'nfts', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">NFTs</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.useCase.longTermStorage}
                onChange={(e) => updateFilter('useCase', 'longTermStorage', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Long-term storage</span>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={onClearFilters}
        className="mt-6 text-xs text-slate-500 hover:text-slate-900 underline"
      >
        Clear filters
      </button>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={onClose}>
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-sm font-semibold">Filters</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
                  ✕
                </button>
              </div>
              {content}
            </div>
          </div>
        )}
      </>
    );
  }

  return <aside className="hidden lg:block w-64 flex-shrink-0">{content}</aside>;
}


