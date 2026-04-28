import { getActiveProducts } from '@/lib/modules/products/queries'
import { getCurrentPrices } from '@/lib/modules/prices/queries'
import type { Product } from '@/lib/modules/products/types'

export const revalidate = 60

const CATEGORY_LABELS: Record<string, string> = {
  cereal: 'Céréales',
  feed: 'Aliments du bétail',
  raw_material: 'Matières premières',
}

const CATEGORY_ORDER = ['cereal', 'feed', 'raw_material']

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-DZ').format(price)
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('fr-DZ', {
    timeZone: 'Africa/Algiers',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function HomePage() {
  const [products, prices] = await Promise.all([
    getActiveProducts(),
    getCurrentPrices(),
  ])

  const priceMap = new Map(prices.map((p) => [p.product_id, p]))

  // Group by category, preserve display_order within each group
  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  const categories = CATEGORY_ORDER.filter((c) => grouped[c]?.length > 0)

  const today = new Date().toLocaleDateString('fr-DZ', {
    timeZone: 'Africa/Algiers',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <header className="bg-green-800 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-green-300 text-sm font-medium uppercase tracking-widest mb-3">
            Industrie agroalimentaire
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            AgriGrain Algérie
          </h1>
          <p className="text-green-200 text-lg max-w-xl">
            Production et distribution de céréales et aliments du bétail.
            Prix mis à jour quotidiennement.
          </p>
        </div>
      </header>

      {/* Price board */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-semibold text-gray-900">Prix du jour</h2>
          <span className="text-sm text-gray-500 capitalize">{today}</span>
        </div>

        {categories.length === 0 ? (
          <p className="text-gray-500">Aucun produit disponible.</p>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => (
              <section key={category}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  {CATEGORY_LABELS[category] ?? category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grouped[category].map((product) => {
                    const priceData = priceMap.get(product.id)

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
                      >
                        <p className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">
                          {product.unit}
                        </p>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          {product.name}
                        </h4>

                        {priceData ? (
                          <>
                            <p className="text-3xl font-bold text-gray-900">
                              {formatPrice(priceData.price)}
                              <span className="text-base font-normal text-gray-500 ml-1">
                                DZD
                              </span>
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              Mis à jour le {formatDateTime(priceData.updated_at)}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-gray-400 italic">
                            Prix non disponible
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
          <span>© {new Date().getFullYear()} AgriGrain Algérie</span>
          <a href="/login" className="hover:text-gray-600 transition-colors">
            Espace administrateur
          </a>
        </div>
      </footer>
    </div>
  )
}
