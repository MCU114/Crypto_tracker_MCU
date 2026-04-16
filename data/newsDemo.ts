// Mock news items for Regulatory & Market News (demo data only)
export type NewsItem = {
  id: string
  source: 'SFC' | 'HKEX' | 'ETFs' | 'Other'
  date: string // ISO date
  title: string
  summary: string
  url?: string
}

export const newsDemo: NewsItem[] = [
  {
    id: 'sfc-guidance-2026-01-12',
    source: 'SFC',
    date: '2026-01-12',
    title: 'SFC issues updated guidance on virtual asset platforms',
    summary:
      'The Securities and Futures Commission published clarifications for custodial and licensing requirements for virtual asset trading platforms operating in Hong Kong.',
    url: '#',
  },
  {
    id: 'hkex-etf-approval-2026-01-10',
    source: 'HKEX',
    date: '2026-01-10',
    title: 'HKEX lists first spot crypto ETF applications for review',
    summary:
      'Hong Kong Exchanges and Clearing announced a review period for several spot crypto ETF applications as market participants increase institutional demand.',
    url: '#',
  },
  {
    id: 'etf-guidance-2026-01-08',
    source: 'ETFs',
    date: '2026-01-08',
    title: 'ETF issuers outline custody models for tokenized products',
    summary:
      'Issuer groups released proposed custody and insurance models to support tokenized ETF products, focusing on investor protections and auditability.',
    url: '#',
  },
  {
    id: 'sfc-enforcement-2026-01-06',
    source: 'SFC',
    date: '2026-01-06',
    title: 'SFC opens enforcement action against unlicensed broker',
    summary:
      'The commission announced enforcement measures targeting firms operating without the required licenses, signalling greater scrutiny in 2026.',
    url: '#',
  },
  {
    id: 'hkex-market-update-2026-01-04',
    source: 'HKEX',
    date: '2026-01-04',
    title: 'HKEX updates listing guidelines for digital asset-related firms',
    summary:
      'A set of listing rule updates were proposed to better align digital asset company disclosures with market standards.',
    url: '#',
  },
  {
    id: 'industry-roundup-2026-01-02',
    source: 'Other',
    date: '2026-01-02',
    title: 'Industry roundup: custody tech and insurer partnerships',
    summary:
      'Several custody providers announced partnerships with insurers to offer improved coverage for tokenized assets, aimed at institutional investors.',
    url: '#',
  },
]

export default newsDemo

