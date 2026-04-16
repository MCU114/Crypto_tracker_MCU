import { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/src/components/layout/PageShell';

export const metadata: Metadata = {
  title: 'Sign up / Log in | Cryptopedia',
  description: 'Join Cryptopedia for enhanced features and personalized crypto insights.',
};

export default function AuthPage() {
  return (
    <div className="py-8">
      <PageShell>
        <section className="brand-frame space-y-4">
          <header>
            <h1 className="text-3xl font-semibold text-white mb-1">Membership Features</h1>
            <p className="text-sm text-slate-100">Coming soon</p>
          </header>

          <div className="rounded-2xl bg-white shadow-sm p-4">
            <div className="p-12 text-center">
              <p className="text-slate-700 leading-relaxed max-w-2xl mx-auto">
                Enhanced features for registered users are currently in development.
                Stay tuned for personalized watchlists, advanced analytics, and exclusive market insights.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageShell>
    </div>
  );
}