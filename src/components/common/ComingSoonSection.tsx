import Link from 'next/link'
import React from 'react'

interface ComingSoonSectionProps {
  eyebrow?: string
  title: string
  subtitle?: string
  cardTitle?: string
  cardBody: string
  primaryAction: { href: string; label: string }
  headerBackLink?: { href: string; label: string }
}

export default function ComingSoonSection({
  eyebrow,
  title,
  subtitle,
  cardTitle = 'Coming Soon',
  cardBody,
  primaryAction,
  headerBackLink,
}: ComingSoonSectionProps) {
  return (
    <section className="brand-frame space-y-4">
      <header>
        {headerBackLink ? (
          <Link href={headerBackLink.href} className="inline-flex items-center brand-icon mb-1">
            {headerBackLink.label}
          </Link>
        ) : null}
        {eyebrow ? <p className="text-xs uppercase tracking-[0.2em] brand-icon">{eyebrow}</p> : null}
        <h1 className="text-3xl sm:text-4xl font-semibold text-white">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-slate-100 max-w-2xl">{subtitle}</p> : null}
      </header>

      <div className="rounded-2xl bg-white shadow-sm p-4">
        <div className="p-12 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">{cardTitle}</h2>
          <p className="text-slate-600 mb-6">{cardBody}</p>
          <Link
            href={primaryAction.href}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {primaryAction.label}
          </Link>
        </div>
      </div>
    </section>
  )
}

