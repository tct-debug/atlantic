import { requireStaff } from '@/lib/auth/guards'
import { getActiveProducts } from '@/lib/modules/products/queries'
import { getCurrentPrices } from '@/lib/modules/prices/queries'
import { PriceEditor } from '@/components/admin/price-editor'

export default async function AdminPage() {
  const { user, name } = await requireStaff()

  const [products, prices] = await Promise.all([
    getActiveProducts(),
    getCurrentPrices(),
  ])

  const priceMap = new Map(prices.map((p) => [p.product_id, p]))

  const rows = products.map((p) => {
    const priceData = priceMap.get(p.id)
    return {
      productId: p.id,
      productName: p.name,
      unit: p.unit,
      currentPrice: priceData?.price ?? 0,
      updatedAt: priceData?.updated_at ?? null,
    }
  })

  // Products that have no price entry yet today
  const today = new Date().toLocaleDateString('fr-CA', {
    timeZone: 'Africa/Algiers',
  }) // ISO date YYYY-MM-DD
  const unpricedCount = prices.filter((p) => p.effective_date !== today).length +
    (products.length - prices.length)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
              AgriGrain Algérie
            </p>
            <h1 className="text-lg font-bold text-gray-900">Tableau de bord</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{name ?? user.email}</span>
            <form action="/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>

        {/* Status bar */}
        <div className="max-w-5xl mx-auto px-6 pb-3 flex items-center gap-2">
          {unpricedCount === 0 ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">
                Tous les prix sont à jour pour aujourd'hui.
              </span>
            </>
          ) : (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-gray-500">
                {unpricedCount} produit{unpricedCount > 1 ? 's' : ''} sans prix pour aujourd'hui.
              </span>
            </>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <PriceEditor rows={rows} />
      </main>
    </div>
  )
}
