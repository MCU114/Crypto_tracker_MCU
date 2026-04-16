import { Metadata } from 'next';
import PageShell from '@/src/components/layout/PageShell';

export const metadata: Metadata = {
  title: 'About Cryptopedia | Hong Kong Crypto Hub',
  description: 'Learn about Cryptopedia, your independent Hong Kong-focused crypto hub for comparing exchanges, wallets, and market opportunities.',
};

export default function AboutPage() {
  return (
    <PageShell>
      <div className="py-8">
        <section className="brand-frame space-y-4">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-white tracking-tight">About Cryptopedia</h1>
          </header>

          <div className="rounded-2xl bg-white shadow-sm p-6">
            <div className="space-y-5 text-sm text-slate-700 leading-relaxed">
              <p>
                Cryptopedia is built for users in Hong Kong who want a clear view of exchanges, wallets, and key crypto assets in one place.
              </p>

              <p>
                The site brings together prices, basic asset information, and high-level campaign or product details so you can compare options across different platforms.
              </p>

              <p>
                Cryptopedia is independent and product‑agnostic: listings and comparisons focus on factors such as licensing status, fees, supported tokens, and user experience. We do not provide investment advice or promote any specific product.
              </p>

              <p>
                Today, Cryptopedia includes pages for exchanges, wallets, prices, charts, new coins, news, and educational guides, with features evolving over time as the Hong Kong market develops.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}