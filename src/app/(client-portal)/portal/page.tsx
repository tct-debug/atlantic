import { requireClient } from '@/lib/auth/guards'
import { getCustomerPrices } from '@/lib/modules/client-pricing/queries'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-DZ').format(price)
}

function formatUpdatedAt(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isToday =
    d.toLocaleDateString('fr-DZ', { timeZone: 'Africa/Algiers' }) ===
    now.toLocaleDateString('fr-DZ', { timeZone: 'Africa/Algiers' })

  if (isToday) {
    return 'Aujourd\'hui à ' + d.toLocaleTimeString('fr-DZ', {
      timeZone: 'Africa/Algiers',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return d.toLocaleDateString('fr-DZ', {
    timeZone: 'Africa/Algiers',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function PortalPage() {
  const { user, name, company } = await requireClient()
  const prices = await getCustomerPrices(user.id)

  const displayName = company ?? name ?? user.email

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-sm text-gray-500">{displayName}</p>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">Vos tarifs négociés</h2>
      </div>

      {prices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
          <p className="text-gray-500">Aucun tarif personnalisé pour l&apos;instant.</p>
          <p className="text-sm text-gray-400 mt-2">
            Contactez-nous pour établir vos prix négociés.
          </p>
          <a
            href="/contact"
            className="inline-block mt-5 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
          >
            Nous contacter →
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-600">Produit</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Unité</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">Votre prix (DZD)</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600 hidden sm:table-cell">
                  Mis à jour
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prices.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{p.product_name}</td>
                  <td className="px-6 py-4 text-gray-500">{p.unit}</td>
                  <td className="px-6 py-4 text-right font-bold text-green-700 text-base">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-400 text-xs font-sans hidden sm:table-cell">
                    {formatUpdatedAt(p.valid_from)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
