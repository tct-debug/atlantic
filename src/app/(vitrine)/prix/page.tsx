import { getActiveProducts } from '@/lib/modules/products/queries'
import { getCurrentPrices } from '@/lib/modules/prices/queries'
import { Info } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export const revalidate = 60

const CATEGORY_LABELS: Record<string, string> = {
  cereal: 'Céréales',
  soy: 'Produits du soja',
}

const CATEGORY_ORDER = ['cereal', 'soy']

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-DZ').format(price)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-DZ', {
    timeZone: 'Africa/Algiers',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function PrixPage() {
  const [products, prices] = await Promise.all([
    getActiveProducts(),
    getCurrentPrices(),
  ])

  const priceMap = new Map(prices.map((p) => [p.product_id, p]))

  const grouped = products.reduce<Record<string, typeof products>>((acc, p) => {
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
    <div className="bg-brand-cream min-h-screen">
      {/* Page header */}
      <div className="bg-brand-green text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3 font-sans">
            Tarifs
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
            Prix du jour
          </h1>
          <p className="text-white/60 capitalize font-sans">{today}</p>
        </div>
      </div>

      {/* Price tables */}
      <div className="max-w-6xl mx-auto px-6 py-14 space-y-12">
        {categories.length === 0 ? (
          <p className="text-brand-charcoal/50 font-sans">Aucun prix disponible pour l&apos;instant.</p>
        ) : (
          categories.map((category) => (
            <section key={category}>
              <h2 className="font-serif text-2xl font-bold text-brand-charcoal mb-6">
                {CATEGORY_LABELS[category] ?? category}
              </h2>

              <div className="bg-white rounded-xl border border-brand-wheat shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-wheat bg-brand-wheat/30">
                      <th className="text-left px-6 py-3.5 font-semibold text-brand-charcoal/70 font-sans text-xs uppercase tracking-wide">
                        Produit
                      </th>
                      <th className="text-left px-6 py-3.5 font-semibold text-brand-charcoal/70 font-sans text-xs uppercase tracking-wide">
                        Unité
                      </th>
                      <th className="text-right px-6 py-3.5 font-semibold text-brand-charcoal/70 font-sans text-xs uppercase tracking-wide">
                        Prix (DZD)
                      </th>
                      <th className="text-right px-6 py-3.5 font-semibold text-brand-charcoal/70 font-sans text-xs uppercase tracking-wide hidden sm:table-cell">
                        Mis à jour
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-wheat">
                    {grouped[category].map((product) => {
                      const priceData = priceMap.get(product.id)

                      return (
                        <tr key={product.id} className="hover:bg-brand-cream/50 transition-colors">
                          <td className="px-6 py-5">
                            <span className="font-serif font-semibold text-brand-charcoal">
                              {product.name}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-brand-charcoal/50 font-sans">
                            {product.unit}
                          </td>
                          <td className="px-6 py-5 text-right">
                            {priceData ? (
                              <span className="font-serif text-xl font-bold text-brand-green">
                                {formatPrice(priceData.price)}
                              </span>
                            ) : (
                              <span className="text-brand-charcoal/30 italic text-sm font-sans">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-5 text-right text-brand-charcoal/40 text-xs font-sans hidden sm:table-cell">
                            {priceData ? formatDate(priceData.effective_date) : '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}

        <Separator className="bg-brand-wheat" />

        {/* Disclaimer */}
        <div className="flex items-start gap-3 text-sm text-brand-charcoal/50 font-sans">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-brand-gold" />
          <p>
            Prix indicatifs mis à jour quotidiennement, exprimés en dinars algériens (DZD) par tonne.
            Ces tarifs sont donnés à titre indicatif. Pour obtenir un tarif personnalisé adapté à
            votre volume et à votre localisation, veuillez{' '}
            <a href="/contact" className="text-brand-green font-medium hover:underline">
              nous contacter
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
