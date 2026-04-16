'use client'

import { SponsoredSidebarAd } from '@/data/mockAds'

interface SidebarSponsoredCardProps {
  ads: SponsoredSidebarAd[]
}

export default function SidebarSponsoredCard({ ads }: SidebarSponsoredCardProps) {
  return (
    <div className="card-surface p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">
        Sponsored
      </h3>
      <div className="space-y-3">
        {ads.map((ad) => (
          <a
            key={ad.id}
            href={ad.ctaUrl}
            className="block p-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-xs font-medium text-slate-600">
                {ad.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {ad.title}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {ad.description}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}