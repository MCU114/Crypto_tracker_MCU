'use client';

import { Exchange } from '@/src/types/exchange';

interface ExchangeCardProps {
  exchange: Exchange;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
}

export default function ExchangeCard({ exchange, isSelected, onToggleSelect }: ExchangeCardProps) {
  const productsText = exchange.products.join(', ');
  const fundingCountdown = '08:15:23'; // Static placeholder

  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white px-6 py-6 shadow-sm hover:shadow-md transition ${isSelected ? 'border-blue-500 shadow-md shadow-blue-100' : ''}`}
    >
      <div className="relative">
        {/* Top row: Logo, Name and License badge */}
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="flex items-start gap-3">
            {exchange.logoUrl && (
              <img
                src={exchange.logoUrl}
                alt={`${exchange.name} logo`}
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
              <h3 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
                {exchange.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {exchange.country} · Products: {productsText}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`badge-soft ${
                exchange.licensed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {exchange.licensed ? 'LICENSED' : 'UNLICENSED'}
            </span>
            {exchange.hasPerps && (
              <span className="badge-soft bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px]">
                Perps available
              </span>
            )}
          </div>
        </div>

        {/* Risk hint for unlicensed exchanges */}
        {!exchange.licensed && (
          <p className="mb-4 text-[11px] text-rose-500">
            Higher regulatory risk. Check legality in your country before using.
          </p>
        )}

        {/* Second row: Products and Funding */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Products
          </p>
          <span className="pill-tab bg-slate-50 border-slate-200 text-[11px]">
            {productsText}
          </span>
          {exchange.hasPerps && exchange.fundingRate !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-1 rounded-full border border-indigo-100">
                Funding {exchange.fundingRate}%
              </span>
              <span className="text-[11px] text-slate-500">Resets in {fundingCountdown}</span>
            </div>
          )}
        </div>

        {/* Third row: Tokens */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-sm font-medium text-slate-900">
              Tokens supported
              <span className="ml-2 text-base font-semibold text-slate-900">
                {exchange.tokensTotal}+
              </span>
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Majors: {exchange.tokensMajors} · Altcoins: {exchange.tokensAltcoins} · Memecoins:{' '}
            {exchange.tokensMemecoins}
          </p>
        </div>

        {/* Fourth row: Fees and Min deposit */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
              Trading fees
            </p>
            <p className="mt-1 text-sm text-slate-900">
              Maker <span className="font-semibold">{exchange.makerFee}%</span>{' '}
              <span className="text-slate-400">·</span> Taker{' '}
              <span className="font-semibold">{exchange.takerFee}%</span>
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.16em]">
              Min. deposit
            </p>
            <p className="mt-1 text-sm text-slate-900">
              <span className="font-semibold">${exchange.minDepositUsd}</span>{' '}
              <span className="text-slate-500">USD</span>
            </p>
          </div>
        </div>

        {/* Sponsored Placement Notice */}
        <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="badge-soft bg-amber-100 text-amber-800 border border-amber-200">
              Ad
            </span>
            <p className="text-xs text-amber-900">
              Sponsored placement – may offer referral bonuses or promotions.
            </p>
          </div>
        </div>

        {/* Bottom row: Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <button
            onClick={() => onToggleSelect(exchange.id)}
            className={`flex-1 px-5 py-3 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-500'
                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
            }`}
          >
            Compare
          </button>
          <a
            href={exchange.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-5 py-3 border border-slate-200 rounded-full text-center text-slate-700 bg-white hover:bg-slate-50 font-medium text-sm shadow-sm hover:shadow-md transition-all"
          >
            Visit exchange
          </a>
        </div>
      </div>
    </div>
  );
}

