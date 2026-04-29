import Link from 'next/link'
import { ArrowRight, Wheat, Leaf, CheckCircle2 } from 'lucide-react'
import { getActiveProducts } from '@/lib/modules/products/queries'
import { getCurrentPrices } from '@/lib/modules/prices/queries'
import type { Product } from '@/lib/modules/products/types'

export const revalidate = 60

// ─── Constants ────────────────────────────────────────────────────────────────

const TRUST_STATS = [
  { value: '15+', label: 'Années d\'expérience' },
  { value: '100%', label: 'Produits algériens' },
  { value: '48', label: 'Wilayas desservies' },
  { value: '500+', label: 'Clients fidèles' },
]

const CATEGORY_LABELS: Record<string, string> = {
  cereal: 'Céréales',
  soy: 'Produits du soja',
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  cereal: <Wheat className="w-7 h-7 text-brand-gold" />,
  soy: <Leaf className="w-7 h-7 text-brand-gold" />,
}

const ABOUT_POINTS = [
  'Production et sélection de céréales et produits du soja de qualité',
  'Approvisionnement fiable en maïs, orge, soja et coque de soja',
  'Livraison rapide dans toutes les wilayas d\'Algérie',
  'Tarifs mis à jour chaque jour pour une totale transparence',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-DZ').format(price)
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [products, prices] = await Promise.all([
    getActiveProducts(),
    getCurrentPrices(),
  ])

  const priceMap = new Map(prices.map((p) => [p.product_id, p]))

  // Group products by category
  const categoryGroups = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  const categories = Object.keys(categoryGroups)

  // Top 3 priced products for preview section
  const pricedProducts = products
    .filter((p) => priceMap.has(p.id))
    .slice(0, 3)

  const today = new Date().toLocaleDateString('fr-DZ', {
    timeZone: 'Africa/Algiers',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-center"
        style={{ minHeight: '80vh' }}
      >
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1a3d2e 0%, #0f2318 60%, #162d20 100%)',
          }}
        />
        {/* Gold accent bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold" />

        <div className="relative max-w-6xl mx-auto px-6 py-24 w-full">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-[0.25em] mb-6 font-sans">
            Production & Distribution · Algérie
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 max-w-3xl">
            Votre partenaire en céréales et produits du soja
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-sans">
            Atlantic produit et distribue des céréales et produits du soja de qualité
            supérieure. Prix mis à jour chaque matin.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/prix"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-charcoal font-semibold text-sm rounded hover:bg-brand-gold/90 transition-colors font-sans"
            >
              Voir les prix du jour
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold text-sm rounded hover:bg-white/10 transition-colors font-sans"
            >
              Demander un devis
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <section className="bg-brand-cream border-y border-brand-wheat">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl font-bold text-brand-green mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-brand-charcoal/60 font-sans">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Prices preview ───────────────────────────────────────────────── */}
      <section className="bg-brand-wheat py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-2 font-sans">
                Marché
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal">
                Cours du jour
              </h2>
              <p className="text-brand-charcoal/50 mt-1 text-sm capitalize font-sans">{today}</p>
            </div>
            <Link
              href="/prix"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green/80 transition-colors font-sans"
            >
              Tous les prix <ArrowRight size={14} />
            </Link>
          </div>

          {pricedProducts.length === 0 ? (
            <p className="text-brand-charcoal/50 font-sans">Aucun prix disponible.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pricedProducts.map((product) => {
                const priceData = priceMap.get(product.id)!
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-brand-wheat shadow-sm p-6"
                  >
                    <p className="text-xs font-medium text-brand-gold uppercase tracking-wide mb-1 font-sans">
                      {CATEGORY_LABELS[product.category] ?? product.category}
                    </p>
                    <h3 className="font-serif text-lg font-semibold text-brand-charcoal mb-4">
                      {product.name}
                    </h3>
                    <p className="font-serif text-3xl font-bold text-brand-green">
                      {formatPrice(priceData.price)}
                      <span className="text-sm font-sans font-normal text-brand-charcoal/50 ml-1">
                        DZD / {product.unit}
                      </span>
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-6 sm:hidden text-center">
            <Link
              href="/prix"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green font-sans"
            >
              Voir tous les prix <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── About preview ────────────────────────────────────────────────── */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3 font-sans">
              Notre entreprise
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal mb-6 leading-tight">
              Un partenaire de confiance depuis plus de 15 ans
            </h2>
            <p className="text-brand-charcoal/70 leading-relaxed mb-6 font-sans">
              Atlantic est une entreprise algérienne spécialisée dans le négoce et la
              distribution de céréales et de produits du soja. Notre mission : fournir
              des matières premières de qualité supérieure aux acheteurs de tout le pays.
            </p>
            <ul className="space-y-3 mb-8">
              {ABOUT_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-brand-charcoal/80 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/a-propos"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green/80 transition-colors font-sans"
            >
              En savoir plus <ArrowRight size={14} />
            </Link>
          </div>

          {/* Decorative panel */}
          <div className="relative h-64 md:h-auto md:min-h-[340px] rounded-2xl overflow-hidden bg-brand-green flex items-center justify-center">
            <div className="text-center px-8">
              <p className="font-serif text-5xl font-bold text-brand-gold mb-2">15+</p>
              <p className="text-white/70 text-sm font-sans">années d&apos;expérience</p>
              <div className="mt-6 w-12 h-0.5 bg-brand-gold mx-auto" />
              <p className="font-serif text-2xl font-bold text-white mt-6">Atlantic</p>
              <p className="text-brand-gold/70 text-xs uppercase tracking-widest font-sans mt-1">
                Céréales & Soja
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products preview ─────────────────────────────────────────────── */}
      <section className="bg-brand-wheat py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-2 font-sans">
                Notre gamme
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal">
                Nos produits
              </h2>
            </div>
            <Link
              href="/produits"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green/80 transition-colors font-sans"
            >
              Voir le catalogue <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category) => {
              const count = categoryGroups[category].length
              return (
                <Link
                  key={category}
                  href={`/produits?categorie=${category}`}
                  className="group bg-white rounded-xl border border-brand-wheat shadow-sm p-7 hover:border-brand-gold/40 hover:shadow-md transition-all"
                >
                  <div className="mb-4">{CATEGORY_ICONS[category]}</div>
                  <h3 className="font-serif text-lg font-semibold text-brand-charcoal mb-1 group-hover:text-brand-green transition-colors">
                    {CATEGORY_LABELS[category] ?? category}
                  </h3>
                  <p className="text-sm text-brand-charcoal/50 font-sans">
                    {count} produit{count > 1 ? 's' : ''}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────────────── */}
      <section className="bg-brand-green py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-brand-gold text-xs font-semibold uppercase tracking-[0.25em] mb-4 font-sans">
            Contactez-nous
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto leading-tight">
            Prêt à passer commande ou à obtenir un tarif personnalisé ?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto font-sans">
            Notre équipe vous répond sous 24 h et vous accompagne à chaque étape.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-brand-charcoal font-semibold text-sm rounded hover:bg-brand-gold/90 transition-colors font-sans"
          >
            Demander un devis <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}
