import Link from 'next/link'
import { requireStaff } from '@/lib/auth/guards'
import { getActiveProducts } from '@/lib/modules/products/queries'
import { getCurrentPrices } from '@/lib/modules/prices/queries'
import { getClients } from '@/lib/modules/clients/queries'
import { getClientPricesForAdmin } from '@/lib/modules/client-pricing/queries'
import { PriceEditor } from '@/components/admin/price-editor'
import { ClientsTab } from '@/components/admin/clients-tab'
import { ClientPriceEditor } from '@/components/admin/client-price-editor'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; client?: string }>
}) {
  const params = await searchParams
  const tab = params.tab ?? 'prix'
  const selectedClientId = params.client

  const { user, name } = await requireStaff()

  const [products, prices] = await Promise.all([
    getActiveProducts(),
    getCurrentPrices(),
  ])

  // Fetch client data only when on the clients tab
  const clients = tab === 'clients' ? await getClients() : []
  const selectedClient = selectedClientId
    ? (clients.find((c) => c.id === selectedClientId) ?? null)
    : null
  const clientPrices = selectedClient
    ? await getClientPricesForAdmin(selectedClientId!)
    : []

  // Build rows for the price editor
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

  const today = new Date().toLocaleDateString('fr-CA', {
    timeZone: 'Africa/Algiers',
  })
  const unpricedCount =
    prices.filter((p) => p.effective_date !== today).length +
    (products.length - prices.length)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
              Atlantic
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
        <div className="max-w-5xl mx-auto px-6 pb-2 flex items-center gap-2">
          {unpricedCount === 0 ? (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs text-gray-500">
                Tous les prix sont à jour pour aujourd&apos;hui.
              </span>
            </>
          ) : (
            <>
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-xs text-gray-500">
                {unpricedCount} produit{unpricedCount > 1 ? 's' : ''} sans prix pour
                aujourd&apos;hui.
              </span>
            </>
          )}
        </div>

        {/* Tab nav */}
        <div className="max-w-5xl mx-auto px-6 flex gap-1 border-t border-gray-100 pt-1">
          <Link
            href="/admin?tab=prix"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'prix'
                ? 'text-green-700 border-b-2 border-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Prix du jour
          </Link>
          <Link
            href="/admin?tab=clients"
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'clients'
                ? 'text-green-700 border-b-2 border-green-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Clients
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {tab === 'prix' && <PriceEditor rows={rows} />}

        {tab === 'clients' && (
          selectedClient ? (
            <ClientPriceEditor
              client={selectedClient}
              products={products}
              existingPrices={clientPrices}
            />
          ) : (
            <ClientsTab clients={clients} />
          )
        )}
      </main>
    </div>
  )
}
