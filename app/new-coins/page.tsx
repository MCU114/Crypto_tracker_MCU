import NewCoinsList from '@/src/components/market/NewCoinsList'
import PageShell from '@/src/components/layout/PageShell';
import newCoinsDemo from '@/data/newCoinsDemo'

export const revalidate = 600 // Demo data; revalidate kept for parity with other pages

export default async function NewCoinsPage() {
  // TODO: Wire to real API for recent listings. Using demo/mock data for now.
  const newCoins = newCoinsDemo

  return (
    <div className="py-8">
      <PageShell>
        <section className="brand-frame space-y-4">
        <header>
          <h1 className="text-3xl font-semibold text-white">New Coins Discovery</h1>
          <p className="mt-1 text-sm text-slate-100 max-w-2xl">
            Explore recently listed and trending demo cryptocurrencies.
          </p>
        </header>

        <div className="rounded-2xl bg-white shadow-sm p-4">
          <NewCoinsList coins={newCoins} />
        </div>
        </section>
      </PageShell>
    </div>
  )
}
