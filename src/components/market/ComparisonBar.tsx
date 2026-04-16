'use client';

import { Exchange } from '@/src/types/exchange';
import { useState } from 'react';

interface ComparisonBarProps {
  selectedExchanges: Exchange[];
  onClearSelection: () => void;
}

export default function ComparisonBar({ selectedExchanges, onClearSelection }: ComparisonBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (selectedExchanges.length === 0) {
    return null;
  }

  const maxExchanges = 3;
  const displayExchanges = selectedExchanges.slice(0, maxExchanges);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-8px_30px_rgba(15,23,42,0.1)] z-40">
        <div className="mx-auto w-full max-w-6xl lg:max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
                Selected ({selectedExchanges.length}):
              </span>
              <div className="flex gap-2 flex-wrap">
                {displayExchanges.map((exchange) => (
                  <span
                    key={exchange.id}
                    className="px-3 py-1 bg-slate-900 text-white rounded-full text-xs font-medium"
                  >
                    {exchange.name}
                  </span>
                ))}
                {selectedExchanges.length > maxExchanges && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs">
                    +{selectedExchanges.length - maxExchanges} more
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
                    Compare exchanges
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Side‑by‑side view of fees, tokens, legal status, and minimum deposits.
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
                        {displayExchanges.map((exchange) => (
                          <th
                            key={exchange.id}
                            className="pb-3 px-4 font-semibold text-slate-900 text-sm"
                          >
                            {exchange.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Legal status</td>
                        {displayExchanges.map((exchange) => (
                          <td key={exchange.id} className="py-3 px-4 text-slate-700">
                            {exchange.licensed ? (
                              <span className="badge-soft bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Licensed
                              </span>
                            ) : (
                              <span className="badge-soft bg-rose-50 text-rose-700 border border-rose-200">
                                Unlicensed
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Products</td>
                        {displayExchanges.map((exchange) => (
                          <td key={exchange.id} className="py-3 px-4 text-slate-700">
                            {exchange.products.join(', ')}
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Fees</td>
                        {displayExchanges.map((exchange) => (
                          <td key={exchange.id} className="py-3 px-4 text-slate-700">
                            Maker {exchange.makerFee}% · Taker {exchange.takerFee}%
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-slate-100">
                        <td className="py-3 pr-6 font-medium text-slate-700">Tokens</td>
                        {displayExchanges.map((exchange) => (
                          <td key={exchange.id} className="py-3 px-4 text-slate-700">
                            {exchange.tokensTotal}+ total
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-3 pr-6 font-medium text-slate-700">Min deposit</td>
                        {displayExchanges.map((exchange) => (
                          <td key={exchange.id} className="py-3 px-4 text-slate-700">
                            ${exchange.minDepositUsd} USD
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

