'use client';

import { useState } from 'react';
import PageShell from '@/src/components/layout/PageShell';
import { newsDemo, type NewsItem } from '@/data/newsDemo';
import NewsCard from '@/src/components/market/NewsCard';

const SOURCES: Array<'All' | 'SFC' | 'HKEX' | 'ETFs'> = ['All', 'SFC', 'HKEX', 'ETFs'];

export default function NewsIndex() {
  const [filter, setFilter] = useState<'All' | 'SFC' | 'HKEX' | 'ETFs'>('All');

  const filtered = newsDemo.filter((n) => {
    if (filter === 'All') return true;
    return n.source === filter;
  });

  return (
    <div className="py-8">
      <PageShell>
        <section className="brand-frame space-y-4">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] brand-icon">Cryptopedia · News</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">Regulatory &amp; Market News</h1>
          <p className="mt-2 text-sm text-slate-100 max-w-2xl">
            Stay updated with regulatory developments and listing news for Hong Kong crypto traders.
          </p>
        </header>

        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div className="mb-4 flex flex-wrap gap-2">
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${filter === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filtered.map((item: NewsItem) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
        </section>
      </PageShell>
    </div>
  );
}


