import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import PageShell from '@/src/components/layout/PageShell';
import { getCategoryBySlug, guideCategories } from '@/data/guideCategories';
import { getGuidesByCategory } from '@/data/guides';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  return guideCategories.map((category) => ({
    category: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);

  if (!category) {
    return {
      title: 'Category Not Found | Cryptopedia',
    };
  }

  return {
    title: `${category.name} Guides for Crypto Traders in Hong Kong | Cryptopedia`,
    description: category.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category);

  if (!category) {
    notFound();
  }

  const guides = getGuidesByCategory(category.slug);

  return (
    <div className="py-8">
      <PageShell>
        <section className="brand-frame space-y-4">
        <header>
          <p className="text-xs uppercase tracking-[0.2em] brand-icon">{`Guides · ${category.name}`}</p>
          <h1 className="text-3xl sm:text-4xl font-semibold text-white">{category.name}</h1>
          <p className="mt-2 text-sm text-slate-100 max-w-2xl">{category.description}</p>
        </header>

        <div className="rounded-2xl bg-white shadow-sm p-4">
          <div className="mb-6">
            <Link
              href="/guides"
              className="inline-flex items-center text-sm text-slate-600 hover:text-slate-800"
            >
              ← Back to guides
            </Link>
          </div>

          <div className="space-y-4">
            {guides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.categorySlug}/${guide.slug}`}
                className="rounded-2xl border border-slate-100 bg-white px-6 py-5 hover:shadow-sm block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge-soft bg-blue-50 text-blue-700 border border-blue-200">
                        {guide.tag}
                      </span>
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight mb-2">
                      {guide.title}
                    </h2>
                    <p className="text-sm text-slate-600">{guide.description}</p>
                  </div>
                  <div className="text-slate-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        </section>
      </PageShell>
    </div>
  );
}


