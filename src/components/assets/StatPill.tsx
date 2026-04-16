'use client'

interface StatPillProps {
  label: string
  tone?: 'default' | 'success' | 'warning'
}

export default function StatPill({ label, tone = 'default' }: StatPillProps) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium'
  const toneClass =
    tone === 'success'
      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
      : tone === 'warning'
      ? 'bg-amber-50 text-amber-700 border border-amber-100'
      : 'bg-slate-50 text-slate-700 border border-slate-100'

  return <span className={`${base} ${toneClass}`}>{label}</span>
}

