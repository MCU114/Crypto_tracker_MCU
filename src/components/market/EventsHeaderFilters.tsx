'use client';

import { EventType } from '@/src/types/event';

interface EventsHeaderFiltersProps {
  selectedExchange: string;
  selectedEventType: EventType | 'All';
  exchangeNames: string[];
  eventTypes: (EventType | 'All')[];
  onExchangeChange: (exchange: string) => void;
  onEventTypeChange: (type: EventType | 'All') => void;
}

export default function EventsHeaderFilters({
  selectedExchange,
  selectedEventType,
  exchangeNames,
  eventTypes,
  onExchangeChange,
  onEventTypeChange,
}: EventsHeaderFiltersProps) {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="mx-auto w-full max-w-6xl lg:max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6 md:py-8 space-y-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Exchange campaigns & promotions
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Exchange Events
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl">
              Ongoing promos and airdrops by exchange. Find the latest trading competitions, fee rebates, and special offers.
            </p>
            <p className="text-[11px] text-slate-400">
              Browse active campaigns from major crypto exchanges. Sponsored events are clearly marked.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4 bg-slate-900/60 border border-slate-700 rounded-2xl p-3 md:p-4 shadow-lg shadow-slate-900/30">
            <div className="flex flex-wrap gap-3 flex-1 w-full md:w-auto">
              <select
                value={selectedExchange}
                onChange={(e) => onExchangeChange(e.target.value)}
                className="px-4 py-2.5 border border-slate-600/80 rounded-xl bg-slate-900/60 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
              >
                {exchangeNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={selectedEventType}
                onChange={(e) => onEventTypeChange(e.target.value as EventType | 'All')}
                className="px-4 py-2.5 border border-slate-600/80 rounded-xl bg-slate-900/60 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-3">
              <p className="text-[11px] text-slate-400 md:text-right">
                Live events · Updated regularly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


