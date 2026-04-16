'use client';

import { Wallet } from '@/src/types/wallet';
import { useState } from 'react';

interface WalletComparisonBarProps {
  selectedWallets: Wallet[];
  onClearSelection: () => void;
}

export default function WalletComparisonBar({ selectedWallets, onClearSelection }: WalletComparisonBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (selectedWallets.length === 0) {
    return null;
  }

  const maxWallets = 3;
  const displayWallets = selectedWallets.slice(0, maxWallets);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-8px_30px_rgba(15,23,42,0.1)] z-40">
        <div className="mx-auto w-full max-w-6xl lg:max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
                Selected ({selectedWallets.length}):
              </span>
              <div className="flex gap-2 flex-wrap">
                {displayWallets.map((wallet) => (
                  <span
                    key={wallet.id}
                    className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-medium"
                  >
                    {wallet.name}
                  </span>
                ))}
                {selectedWallets.length > maxWallets && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                    +{selectedWallets.length - maxWallets} more
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClearSelection}
                className="px-4 py-2 text-xs text-slate-500 hover:text-slate-900"
              >
                Clear
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-medium text-sm shadow-sm"
              >
                Compare now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/60 z-50"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
              <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                    Compare wallets
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Side‑by‑side view of type, custody, platforms, networks, and features.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="pb-3 pr-6 font-semibold text-slate-500 text-xs uppercase tracking-[0.16em]">
                          Feature
                        </th>
                        {displayWallets.map((wallet) => (
                          <th
                            key={wallet.id}
                            className="pb-3 px-4 font-semibold text-slate-900 text-sm"
                          >
                            {wallet.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Type</td>
                        {displayWallets.map((wallet) => (
                          <td key={wallet.id} className="py-3 px-4 text-slate-700">
                            <span className="badge-soft bg-blue-50 text-blue-700 border border-blue-200">
                              {wallet.type}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Custody</td>
                        {displayWallets.map((wallet) => (
                          <td key={wallet.id} className="py-3 px-4 text-slate-700">
                            {wallet.custody === 'Non-custodial' ? (
                              <span className="badge-soft bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Non-custodial
                              </span>
                            ) : (
                              <span className="badge-soft bg-amber-50 text-amber-700 border border-amber-200">
                                Custodial
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Platforms</td>
                        {displayWallets.map((wallet) => (
                          <td key={wallet.id} className="py-3 px-4 text-slate-700">
                            {wallet.platforms.join(', ')}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Networks</td>
                        {displayWallets.map((wallet) => (
                          <td key={wallet.id} className="py-3 px-4 text-slate-700">
                            {wallet.networks.join(', ')}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Key features</td>
                        {displayWallets.map((wallet) => (
                          <td key={wallet.id} className="py-3 px-4 text-slate-700">
                            {wallet.features.join(', ')}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Supported assets</td>
                        {displayWallets.map((wallet) => (
                          <td key={wallet.id} className="py-3 px-4 text-slate-700 font-mono">
                            {wallet.supportedAssets.join(', ')}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Use cases</td>
                        {displayWallets.map((wallet) => (
                          <td key={wallet.id} className="py-3 px-4 text-slate-700">
                            {wallet.useCases.join(', ')}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 pr-6 font-medium text-slate-700">Pros</td>
                        {displayWallets.map((wallet) => (
                          <td key={wallet.id} className="py-3 px-4 text-slate-700 text-xs">
                            {wallet.pros}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 pr-6 font-medium text-slate-700">Cons</td>
                        {displayWallets.map((wallet) => (
                          <td key={wallet.id} className="py-3 px-4 text-slate-700 text-xs">
                            {wallet.cons}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
