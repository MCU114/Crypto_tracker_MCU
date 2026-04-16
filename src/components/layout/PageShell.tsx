'use client'

import { ReactNode } from 'react'
import Navbar from './Navbar'
import FooterDisclaimer from './FooterDisclaimer'

interface PageShellProps {
  title?: string
  subtitle?: string
  toolbar?: ReactNode
  hero?: ReactNode
  children: ReactNode
  showBanner?: boolean
}

// Unified PageShell that includes navbar, banner, content frame, and footer
export default function PageShell({ 
  title, 
  subtitle, 
  toolbar, 
  hero, 
  children,
  showBanner = true
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <header>
        <Navbar />
      </header>

      {/* Top Horizontal Ad Banner */}
      {showBanner && (
        <div className="w-full border-b bg-white">
          <div className="w-full py-3">
            <div className="relative w-full overflow-hidden bg-slate-50" style={{ aspectRatio: '970/90' }}>
              <img
                src="/banners/square-ad-rec-mcm.jpg"
                alt="Top advertisement"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* hero can be full-bleed if provided; otherwise render title/subtitle */}
        {hero ? (
          <div>{hero}</div>
        ) : title ? (
          <div className="pt-6 pb-2">
            <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{title}</h1>
            {subtitle ? <p className="mt-2 text-slate-500 max-w-2xl">{subtitle}</p> : null}
          </div>
        ) : null}

        {/* toolbar sits below hero/title */}
        {toolbar ? <div className="mt-6">{toolbar}</div> : null}

        {/* main content */}
        <main className="mt-8">{children}</main>
      </div>

      {/* Footer disclaimer */}
      <div className="pb-8 mt-12">
        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <section className="brand-frame">
            <div className="brand-inner">
              <FooterDisclaimer />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
