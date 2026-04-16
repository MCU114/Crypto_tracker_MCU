'use client'

interface SponsoredPlacementNoticeProps {
  websiteUrl?: string
  label?: string
  className?: string
}

export default function SponsoredPlacementNotice({ websiteUrl, label = 'Sponsored placement – may offer referral bonuses or promotions.', className = '' }: SponsoredPlacementNoticeProps) {
  return (
    <div className={`mb-4 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/80 px-3 py-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="badge-soft bg-amber-100 text-amber-800 border border-amber-200">Ad</span>
        <p className="text-xs text-amber-900">{label}</p>
      </div>
    </div>
  )
}

