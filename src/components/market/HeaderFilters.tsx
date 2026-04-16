'use client';

import { Country, FilterType, SortType } from '@/src/types/exchange';

interface HeaderFiltersProps {
  country: Country;
  filter: FilterType;
  sort: SortType;
  onCountryChange: (country: Country) => void;
  onFilterChange: (filter: FilterType) => void;
  onSortChange: (sort: SortType) => void;
  onShowExchanges: () => void;
}

export default function HeaderFilters({
  country,
  filter,
  sort,
  onCountryChange,
  onFilterChange,
  onSortChange,
  onShowExchanges,
}: HeaderFiltersProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8 space-y-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Crypto exchange finder
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Find the right crypto exchange
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl">
              Compare licensed and unlicensed crypto exchanges by country, products, fees, and
              minimum deposit.
            </p>
            <p className="text-[11px] text-slate-400">
              Default view shows licensed exchanges only. You can choose to include unlicensed
              exchanges with higher regulatory risk.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 bg-slate-900/60 border border-slate-700 rounded-2xl p-3 md:p-4 shadow-lg shadow-slate-900/30">
            <div className="flex flex-wrap gap-3 flex-1 w-full md:w-auto">
              <select
                value={country}
                onChange={(e) => onCountryChange(e.target.value as Country)}
                className="px-4 py-2.5 border border-slate-600/80 rounded-xl bg-slate-900/60 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[110px]"
              >
                <option value="HK">HK</option>
                <option value="UK">UK</option>
                <option value="US">US</option>
                <option value="SG">SG</option>
              </select>

              <select
                value={filter}
                onChange={(e) => onFilterChange(e.target.value as FilterType)}
                className="px-4 py-2.5 border border-slate-600/80 rounded-xl bg-slate-900/60 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[170px]"
              >
                <option value="Licensed only">Licensed only</option>
                <option value="Licensed + unlicensed">Licensed + unlicensed</option>
                <option value="Spot only">Spot only</option>
                <option value="Derivatives only">Derivatives only</option>
              </select>

              <select
                value={sort}
                onChange={(e) => onSortChange(e.target.value as SortType)}
                className="px-4 py-2.5 border border-slate-600/80 rounded-xl bg-slate-900/60 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[170px]"
              >
                <option value="Fees (low to high)">Fees (low to high)</option>
                <option value="Fees (high to low)">Fees (high to low)</option>
                <option value="Tokens (high to low)">Tokens (high to low)</option>
                <option value="Min deposit (low to high)">Min deposit (low to high)</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
              <button
                onClick={onShowExchanges}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-slate-900 font-medium text-sm whitespace-nowrap shadow-md shadow-blue-500/30"
              >
                Show Exchanges
              </button>
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


