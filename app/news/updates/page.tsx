import PageShell from '@/src/components/layout/PageShell'
import ComingSoonSection from '@/src/components/common/ComingSoonSection'

export default function NewsUpdatesPage() {
  return (
    <PageShell>
      <ComingSoonSection
        eyebrow="Cryptopedia · News"
        title="News Updates Coming Soon"
        subtitle="Detailed news update features are under development."
        cardBody="We're building a dedicated updates feed for Hong Kong regulatory and market developments. Check back soon."
        primaryAction={{ href: '/news', label: 'Back to News' }}
      />
    </PageShell>
  )
}

