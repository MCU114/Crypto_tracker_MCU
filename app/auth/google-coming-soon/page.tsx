import Link from 'next/link';
import PageShell from '@/src/components/layout/PageShell';
import ComingSoonSection from '@/src/components/common/ComingSoonSection';

export default function GoogleComingSoonPage() {
  return (
    <div className="py-8">
      <PageShell>
        <ComingSoonSection
          title="Google Login Coming Soon"
          subtitle="Google authentication will be available after we complete integration."
          cardBody="We're working on adding Google Login to make signing in easier. Once integrated, you'll be able to sign in with your Google account directly."
          primaryAction={{ href: '/', label: 'Back to Home' }}
          headerBackLink={{ href: '/', label: '← Back to Home' }}
        />
      </PageShell>
    </div>
  );
}

