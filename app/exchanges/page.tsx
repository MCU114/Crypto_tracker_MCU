'use client';

import { useState, useMemo } from 'react';
import Sidebar from '@/src/components/common/Sidebar';
import ExchangeCard from '@/src/components/market/ExchangeCard';
import ComparisonBar from '@/src/components/market/ComparisonBar';
import PageShell from '@/src/components/layout/PageShell';
import PageToolbar from '@/src/components/common/PageToolbar';
import { ErrorBoundary } from '@/src/components/common/ErrorBoundary';
import { mockExchanges } from '@/data/mockExchanges';
import { Exchange, SortType, SidebarFilters } from '@/src/types/exchange';

type LicenseFilter = 'All exchanges' | 'Licensed' | 'Unlicensed';
const DEFAULT_LICENSE_FILTER: LicenseFilter = 'All exchanges';

const initialSidebarFilters: SidebarFilters = {
  legalStatus: {
    licensed: false,
    unlicensed: false,
  },
  products: {
    spot: false,
    derivatives: false,
  },
  minDeposit: {
    under50: false,
    between50and500: false,
    over500: false,
  },
};

export default function ExchangesPage() {
  const [licenseFilter, setLicenseFilter] = useState<LicenseFilter>(DEFAULT_LICENSE_FILTER);
  const [sort, setSort] = useState<SortType>('Fees (low to high)');
  const [sidebarFilters, setSidebarFilters] = useState<SidebarFilters>(initialSidebarFilters);
  const [selectedExchangeIds, setSelectedExchangeIds] = useState<Set<string>>(new Set());
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter and sort exchanges (locked to Hong Kong)
  const filteredAndSortedExchanges = useMemo(() => {
    let filtered = [...mockExchanges];

    // Apply country filter (locked to HK)
    filtered = filtered.filter((ex) => ex.country === 'HK');

    // Apply license filter
    if (licenseFilter === 'Licensed') {
      filtered = filtered.filter((ex) => ex.licensed);
    } else if (licenseFilter === 'Unlicensed') {
      filtered = filtered.filter((ex) => !ex.licensed);
    }
    // "All exchanges" shows all by license

    // Apply sidebar filters
    const { legalStatus, products, minDeposit } = sidebarFilters;

    // Legal status filters
    if (legalStatus.licensed && !legalStatus.unlicensed) {
      filtered = filtered.filter((ex) => ex.licensed);
    } else if (legalStatus.unlicensed && !legalStatus.licensed) {
      filtered = filtered.filter((ex) => !ex.licensed);
    }

    // Products filters
    if (products.spot && !products.derivatives) {
      filtered = filtered.filter((ex) => ex.products.includes('Spot') && !ex.products.includes('Derivatives'));
    } else if (products.derivatives && !products.spot) {
      filtered = filtered.filter((ex) => ex.products.includes('Derivatives') && !ex.products.includes('Spot'));
    } else if (products.spot && products.derivatives) {
      filtered = filtered.filter((ex) => ex.products.includes('Spot') && ex.products.includes('Derivatives'));
    }

    // Min deposit filters
    const depositFilters: boolean[] = [];
    if (minDeposit.under50) depositFilters.push(true);
    if (minDeposit.between50and500) depositFilters.push(true);
    if (minDeposit.over500) depositFilters.push(true);

    if (depositFilters.length > 0) {
      filtered = filtered.filter((ex) => {
        if (minDeposit.under50 && ex.minDepositUsd < 50) return true;
        if (minDeposit.between50and500 && ex.minDepositUsd >= 50 && ex.minDepositUsd <= 500) return true;
        if (minDeposit.over500 && ex.minDepositUsd > 500) return true;
        return false;
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'Fees (low to high)':
          return a.takerFee - b.takerFee;
        case 'Fees (high to low)':
          return b.takerFee - a.takerFee;
        case 'Tokens (high to low)':
          return b.tokensTotal - a.tokensTotal;
        case 'Min deposit (low to high)':
          return a.minDepositUsd - b.minDepositUsd;
        default:
          return 0;
      }
    });

    return sorted;
  }, [licenseFilter, sort, sidebarFilters]);

  const selectedExchanges = useMemo(() => {
    return mockExchanges.filter((ex) => selectedExchangeIds.has(ex.id));
  }, [selectedExchangeIds]);

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedExchangeIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size < 3) {
        newSet.add(id);
      }
    }
    setSelectedExchangeIds(newSet);
  };

  const handleClearFilters = () => {
    setSidebarFilters(initialSidebarFilters);
    setLicenseFilter(DEFAULT_LICENSE_FILTER);
  };

  const handleClearSelection = () => {
    setSelectedExchangeIds(new Set());
  };

  const toolbar = (
    <PageToolbar
      left={
        <>
          <select
            value={licenseFilter}
            onChange={(e) => setLicenseFilter(e.target.value as LicenseFilter)}
            className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All exchanges">All exchanges</option>
            <option value="Licensed">Licensed</option>
            <option value="Unlicensed">Unlicensed</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortType)}
            className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Fees (low to high)">Fees (low to high)</option>
            <option value="Fees (high to low)">Fees (high to low)</option>
            <option value="Tokens (high to low)">Tokens (high to low)</option>
            <option value="Min deposit (low to high)">Min deposit (low to high)</option>
            <option value="Name (A-Z)">Name (A-Z)</option>
          </select>
        </>
      }
      right={
        <span className="text-xs text-slate-500">Compare fees · License status</span>
      }
    />
  )

  const mainContent = (
    <div className="grid gap-6 lg:grid-cols-[260px,minmax(0,1fr)]">
      {/* Filter Sidebar */}
      <Sidebar
        filters={sidebarFilters}
        onFilterChange={setSidebarFilters}
        onClearFilters={handleClearFilters}
        isMobile={false}
      />

      {/* Exchange Cards */}
      <div className="space-y-4">
        {/* Mobile Filters Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all shadow-sm hover:shadow-md"
          >
            Filters
          </button>
        </div>

        {/* Mobile Sidebar Modal */}
        <Sidebar
          filters={sidebarFilters}
          onFilterChange={setSidebarFilters}
          onClearFilters={handleClearFilters}
          isMobile={true}
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
        />

        {filteredAndSortedExchanges.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No exchanges found matching your filters.</p>
            <p className="text-gray-400 text-sm mt-2">Country: HK</p>
          </div>
        ) : (
          filteredAndSortedExchanges.map((exchange) => (
            <ErrorBoundary key={exchange.id}>
              <ExchangeCard
                exchange={exchange}
                isSelected={selectedExchangeIds.has(exchange.id)}
                onToggleSelect={handleToggleSelect}
              />
            </ErrorBoundary>
          ))
        )}
      </div>

    </div>
  )

  return (
    <div className="py-8">
      <PageShell>
        {/* Light-blue outer panel matching Prices/Assets pages */}
        <section className="brand-frame space-y-4">
          <header>
            <h1 className="text-3xl font-semibold text-white">Find the right crypto exchange</h1>
            <p className="mt-1 text-sm text-slate-200">
              Compare licensed crypto exchanges in Hong Kong by fees and features.
            </p>
          </header>

          {/* Card: toolbar / filters */}
          <div className="rounded-2xl bg-white shadow-sm p-4">
            {toolbar}
          </div>

          {/* Card: main content (sidebar + cards) */}
          <div className="rounded-2xl bg-white shadow-sm p-4">
            {mainContent}
          </div>
        </section>
      </PageShell>

      {/* Comparison Bar */}
      <ComparisonBar
        selectedExchanges={selectedExchanges}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}


