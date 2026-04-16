'use client'

import Link from 'next/link'
import { NewsItem } from '@/data/newsDemo'

interface NewsCardProps {
  item: NewsItem
}

export default function NewsCard({ item }: NewsCardProps) {
  const dateLabel = new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <article className="rounded-2xl border border-slate-100 bg-white px-6 py-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">{item.source}</span>
        <time className="text-xs text-slate-400">{dateLabel}</time>
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
      <p className="text-sm text-slate-600 line-clamp-3 mb-4">{item.summary}</p>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
        <Link href="/news/updates" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
          View updates →
        </Link>
      </div>
    </article>
  )
}

