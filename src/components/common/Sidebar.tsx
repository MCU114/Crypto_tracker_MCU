'use client';

import { SidebarFilters } from '@/src/types/exchange';

interface SidebarProps {
  filters: SidebarFilters;
  onFilterChange: (filters: SidebarFilters) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  filters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const updateFilter = (section: keyof SidebarFilters, key: string, value: boolean) => {
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
            Legal status
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.legalStatus.licensed}
                onChange={(e) => updateFilter('legalStatus', 'licensed', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Licensed</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.legalStatus.unlicensed}
                onChange={(e) => updateFilter('legalStatus', 'unlicensed', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Unlicensed</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-[0.16em]">
            Products
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.products.spot}
                onChange={(e) => updateFilter('products', 'spot', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Spot</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.products.derivatives}
                onChange={(e) => updateFilter('products', 'derivatives', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">Derivatives</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-[0.16em]">
            Min deposit (USD)
          </h3>
          <div className="space-y-2">
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.minDeposit.under50}
                onChange={(e) => updateFilter('minDeposit', 'under50', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">&lt; $50</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.minDeposit.between50and500}
                onChange={(e) => updateFilter('minDeposit', 'between50and500', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">$50 – $500</span>
            </label>
            <label className="flex items-center justify-between gap-2">
              <input
                type="checkbox"
                checked={filters.minDeposit.over500}
                onChange={(e) => updateFilter('minDeposit', 'over500', e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <span className="text-slate-700">&gt; $500</span>
            </label>
          </div>
        </div>

        <button
          onClick={onClearFilters}
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold tracking-wide mt-2"
        >
          Clear filters
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={onClose}
            />
            <div className="fixed left-0 top-0 h-full w-64 z-50 overflow-y-auto">
              {content}
            </div>
          </>
        )}
      </>
    );
  }

  return <aside className="w-64 flex-shrink-0 hidden lg:block">{content}</aside>;
}

