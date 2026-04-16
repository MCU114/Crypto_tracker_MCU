import Link from 'next/link';
import PageShell from '@/src/components/layout/PageShell';

export default function NewsFiltersPage() {
  return (
    <PageShell
      hero={
        <div className="bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="py-6 space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cryptopedia · News</p>
              <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">News Filters</h1>
              <p className="mt-2 text-base text-slate-500 max-w-2xl">
                Customize your news feed with saved filters and personalized preferences.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="mt-6">
        <div className="mb-6">
          <Link href="/news" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800">
            ← Back to News
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white px-6 py-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Coming Soon</h2>
          <p className="text-slate-600 mb-6">
            This page will allow you to create and save custom filters for news content, including regulatory updates, exchange announcements, and market events.
          </p>
          <Link
            href="/news"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All News
          </Link>
        </div>
      </div>
    </PageShell>
  );
}