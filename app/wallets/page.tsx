'use client';

import { useState, useMemo } from 'react';
import WalletSidebar from '@/src/components/common/WalletSidebar';
import WalletCard from '@/src/components/market/WalletCard';
import WalletComparisonBar from '@/src/components/market/WalletComparisonBar';
import PageShell from '@/src/components/layout/PageShell';
import PageToolbar from '@/src/components/common/PageToolbar';
import { mockWallets } from '@/data/mockWallets';
import { WalletFilterType, WalletSortType, WalletSidebarFilters, Network, UseCase } from '@/src/types/wallet';

const initialSidebarFilters: WalletSidebarFilters = {
  walletType: {
    hardware: false,
    software: false,
    browser: false,
    mobile: false,
  },
  custody: {
    custodial: false,
    nonCustodial: false,
  },
  networks: {
    bitcoin: false,
    ethereum: false,
    solana: false,
    multiChain: false,
  },
  useCase: {
    beginnerFriendly: false,
    defi: false,
    nfts: false,
    longTermStorage: false,
  },
};

export default function WalletsPage() {
  const [filter, setFilter] = useState<WalletFilterType>('All');
  const [sort, setSort] = useState<WalletSortType>('Name (A-Z)');
  const [sidebarFilters, setSidebarFilters] = useState<WalletSidebarFilters>(initialSidebarFilters);
  const [selectedWalletIds, setSelectedWalletIds] = useState<Set<string>>(new Set());
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filter and sort wallets
  const filteredAndSortedWallets = useMemo(() => {
    let filtered = [...mockWallets];

    // Apply main filter (top bar)
    if (filter === 'Hardware only') {
      filtered = filtered.filter((w) => w.type === 'Hardware');
    } else if (filter === 'Non-custodial only') {
      filtered = filtered.filter((w) => w.custody === 'Non-custodial');
    } else if (filter === 'Beginner friendly') {
      filtered = filtered.filter((w) => w.useCases.includes('Beginner friendly'));
    }

    // Apply sidebar filters
    const { walletType, custody, networks, useCase } = sidebarFilters;

    // Wallet type filters
    const typeFilters: string[] = [];
    if (walletType.hardware) typeFilters.push('Hardware');
    if (walletType.software) typeFilters.push('Software');
    if (walletType.browser) typeFilters.push('Browser');
    if (walletType.mobile) typeFilters.push('Mobile');

    if (typeFilters.length > 0) {
      filtered = filtered.filter((w) => typeFilters.includes(w.type));
    }

    // Custody filters
    const custodyFilters: string[] = [];
    if (custody.custodial) custodyFilters.push('Custodial');
    if (custody.nonCustodial) custodyFilters.push('Non-custodial');

    if (custodyFilters.length > 0) {
      filtered = filtered.filter((w) => custodyFilters.includes(w.custody));
    }

    // Network filters
    const networkFilters: string[] = [];
    if (networks.bitcoin) networkFilters.push('Bitcoin');
    if (networks.ethereum) networkFilters.push('Ethereum');
    if (networks.solana) networkFilters.push('Solana');
    if (networks.multiChain) networkFilters.push('Multi-chain');

    if (networkFilters.length > 0) {
      filtered = filtered.filter((w) =>
        w.networks.some((n: Network) => networkFilters.includes(n))
      );
    }

    // Use case filters
    const useCaseFilters: string[] = [];
    if (useCase.beginnerFriendly) useCaseFilters.push('Beginner friendly');
    if (useCase.defi) useCaseFilters.push('DeFi');
    if (useCase.nfts) useCaseFilters.push('NFTs');
    if (useCase.longTermStorage) useCaseFilters.push('Long-term storage');

    if (useCaseFilters.length > 0) {
      filtered = filtered.filter((w) =>
        w.useCases.some((uc: UseCase) => useCaseFilters.includes(uc))
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case 'Name (A-Z)':
          return a.name.localeCompare(b.name);
        case 'Name (Z-A)':
          return b.name.localeCompare(a.name);
        case 'Type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return sorted;
  }, [filter, sort, sidebarFilters]);

  const selectedWallets = useMemo(() => {
    return mockWallets.filter((w) => selectedWalletIds.has(w.id));
  }, [selectedWalletIds]);

  const handleToggleSelect = (id: string) => {
    const newSet = new Set(selectedWalletIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size < 3) {
        newSet.add(id);
      }
    }
    setSelectedWalletIds(newSet);
  };

  const handleClearFilters = () => {
    setSidebarFilters(initialSidebarFilters);
  };

  const handleClearSelection = () => {
    setSelectedWalletIds(new Set());
  };

  const toolbar = (
    <PageToolbar
      left={
        <>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as WalletFilterType)}
            className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All wallets</option>
            <option value="Hardware only">Hardware only</option>
            <option value="Non-custodial only">Non-custodial only</option>
            <option value="Beginner friendly">Beginner friendly</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as WalletSortType)}
            className="px-3 py-1.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Name (A-Z)">Name (A-Z)</option>
            <option value="Name (Z-A)">Name (Z-A)</option>
            <option value="Type">Type</option>
          </select>
        </>
      }
      right={
        <span className="text-xs text-slate-500">Compare features · Security ratings</span>
      }
    />
  )

  const mainContent = (
    <div className="grid gap-6 lg:grid-cols-[260px,minmax(0,1.7fr)]">
      {/* Filter Sidebar */}
      <WalletSidebar
        filters={sidebarFilters}
        onFilterChange={setSidebarFilters}
        onClearFilters={handleClearFilters}
        isMobile={false}
      />

      {/* Wallet Cards */}
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
        <WalletSidebar
          filters={sidebarFilters}
          onFilterChange={setSidebarFilters}
          onClearFilters={handleClearFilters}
          isMobile={true}
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
        />

        {filteredAndSortedWallets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No wallets found matching your filters.</p>
          </div>
        ) : (
          filteredAndSortedWallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              isSelected={selectedWalletIds.has(wallet.id)}
              onToggleSelect={handleToggleSelect}
            />
          ))
        )}
      </div>
    </div>
  )

  return (
    <div className="py-8">
      <PageShell>
        {/* Light-blue outer panel matching Prices/Assets/Exchanges pages */}
        <section className="brand-frame space-y-4">
          <header>
            <h1 className="text-3xl font-semibold text-white">Crypto Wallets</h1>
            <p className="mt-1 text-sm text-slate-200">
              Find the right wallet for your crypto storage and management needs. Compare security features, supported networks, and ease of use.
            </p>
          </header>

          {/* Card: toolbar */}
          <div className="rounded-2xl bg-white shadow-sm p-4">
            {toolbar}
          </div>

          {/* Card: main content (sidebar + wallet cards) */}
          <div className="rounded-2xl bg-white shadow-sm p-4">
            {mainContent}
          </div>
        </section>
      </PageShell>

      {/* Comparison Bar */}
      <WalletComparisonBar
        selectedWallets={selectedWallets}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}


