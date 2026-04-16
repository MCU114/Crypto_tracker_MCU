'use client';

import { WalletFilterType, WalletSortType } from '@/src/types/wallet';

interface WalletHeaderFiltersProps {
  filter: WalletFilterType;
  sort: WalletSortType;
  onFilterChange: (filter: WalletFilterType) => void;
  onSortChange: (sort: WalletSortType) => void;
}

export default function WalletHeaderFilters({
  filter,
  sort,
  onFilterChange,
  onSortChange,
}: WalletHeaderFiltersProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8 space-y-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Crypto wallet finder
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Find the right crypto wallet
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl">
              Compare hardware, software, browser, and mobile wallets by type, custody, supported networks, and use case.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 bg-slate-900/60 border border-slate-700 rounded-2xl p-3 md:p-4 shadow-lg shadow-slate-900/30">
            <div className="flex flex-wrap gap-3 flex-1 w-full md:w-auto">
              <select
                value={filter}
                onChange={(e) => onFilterChange(e.target.value as WalletFilterType)}
                className="px-4 py-2.5 border border-slate-600/80 rounded-xl bg-slate-900/60 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[170px]"
              >
                <option value="All">All wallets</option>
                <option value="Hardware only">Hardware only</option>
                <option value="Non-custodial only">Non-custodial only</option>
                <option value="Beginner friendly">Beginner friendly</option>
              </select>

              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value as WalletSortType)}
                className="px-4 py-2.5 border border-slate-600/80 rounded-xl bg-slate-900/60 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[170px]"
              >
                <option value="Name (A-Z)">Name (A-Z)</option>
                <option value="Name (Z-A)">Name (Z-A)</option>
                <option value="Type">Type</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
              <p className="text-[11px] text-slate-400 md:text-right">
                Live filters · No account required
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


