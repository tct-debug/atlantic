import Link from 'next/link'
import {
  ArrowRight,
  Wheat,
  Leaf,
  CheckCircle2,
  Truck,
  Factory,
  ShieldCheck,
  Handshake,
  Users,
  Store,
  Building2,
  Ship,
  Warehouse,
} from 'lucide-react'
import { getActiveProducts } from '@/lib/modules/products/queries'
import { getCurrentPrices } from '@/lib/modules/prices/queries'
import { HeroSlider } from '@/components/vitrine/hero-slider'
import { AnimateIn } from '@/components/vitrine/animate-in'
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

const SERVICES = [
  {
    icon: Warehouse,
    title: 'Approvisionnement',
    desc: 'Sélection et approvisionnement de céréales et produits du soja auprès de nos partenaires, avec contrôle qualité à la réception.',
  },
  {
    icon: Truck,
    title: 'Logistique',
    desc: 'Livraison en vrac ou en sac sous 24 à 72 h dans les 48 wilayas, par notre propre flotte de camions.',
  },
  {
    icon: ShieldCheck,
    title: 'Qualité',
    desc: 'Analyse de l\'humidité, de la pureté et de la teneur en protéines. Certificats qualité sur demande.',
  },
  {
    icon: Handshake,
    title: 'Partenariats',
    desc: 'Contrats d\'approvisionnement annuels, tarifs préférentiels sur volume et programme de fidélité.',
  },
]

const OUR_CLIENTS = [
  { icon: Factory, label: 'Industriels de l\'alimentation' },
  { icon: Store, label: 'Distributeurs régionaux' },
  { icon: Users, label: 'Aviculteurs & éleveurs' },
  { icon: Building2, label: 'Grossistes en céréales' },
]

const OUR_SUPPLIERS = [
  { icon: Wheat, label: 'Coopératives agricoles algériennes' },
  { icon: Ship, label: 'Importateurs agréés' },
  { icon: Building2, label: 'Ports d\'Alger et d\'Oran' },
]

const ABOUT_POINTS = [
  'Négoce et distribution de céréales et produits du soja de qualité',
  'Approvisionnement fiable en maïs, orge, blé, soja et coque de soja',
  'Livraison rapide dans toutes les wilayas d\'Algérie',
  'Tarifs mis à jour chaque jour pour une totale transparence',
]

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

  const categoryGroups = products.reduce<Record<string, Product[]>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = []
    acc[p.category].push(p)
    return acc
  }, {})

  const categories = Object.keys(categoryGroups)

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
      {/* ── Hero Slider ──────────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ── Prices preview ───────────────────────────────────────────────── */}
      <section className="bg-brand-wheat py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
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
          </AnimateIn>

          {pricedProducts.length === 0 ? (
            <p className="text-brand-charcoal/50 font-sans">Aucun prix disponible.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pricedProducts.map((product, i) => {
                const priceData = priceMap.get(product.id)!
                return (
                  <AnimateIn key={product.id} delay={i * 80}>
                    <div className="bg-white rounded-xl border border-brand-wheat shadow-sm p-6 h-full">
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
                  </AnimateIn>
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

      {/* ── Services strip ───────────────────────────────────────────────── */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-2 font-sans">
                  Ce que nous faisons
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal">
                  Nos services
                </h2>
              </div>
              <Link
                href="/services"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-green/80 transition-colors font-sans"
              >
                Voir le détail <ArrowRight size={14} />
              </Link>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map(({ icon: Icon, title, desc }, i) => (
              <AnimateIn key={title} delay={i * 80}>
                <div className="bg-white rounded-xl border border-brand-wheat shadow-sm p-7 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center mb-5 flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-charcoal mb-2">{title}</h3>
                  <p className="text-sm text-brand-charcoal/60 leading-relaxed font-sans flex-1">{desc}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products preview ─────────────────────────────────────────────── */}
      <section className="bg-brand-wheat py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
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
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((category, i) => {
              const count = categoryGroups[category].length
              return (
                <AnimateIn key={category} delay={i * 80}>
                  <Link
                    href={`/produits?categorie=${category}`}
                    className="group bg-white rounded-xl border border-brand-wheat shadow-sm p-7 hover:border-brand-gold/40 hover:shadow-md transition-all block h-full"
                  >
                    <div className="mb-4">{CATEGORY_ICONS[category]}</div>
                    <h3 className="font-serif text-lg font-semibold text-brand-charcoal mb-1 group-hover:text-brand-green transition-colors">
                      {CATEGORY_LABELS[category] ?? category}
                    </h3>
                    <p className="text-sm text-brand-charcoal/50 font-sans">
                      {count} produit{count > 1 ? 's' : ''}
                    </p>
                  </Link>
                </AnimateIn>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── About preview ────────────────────────────────────────────────── */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <AnimateIn>
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
          </AnimateIn>

          <AnimateIn delay={120}>
            <div className="relative h-64 md:h-auto md:min-h-[340px] rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://picsum.photos/seed/grain-silo-aerial/600/450"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/*
                Replace with: /images/about-silo.jpg
                Suggested: aerial or wide-angle photo of grain silos, a field, or your facility
              */}
              <div className="absolute inset-0 bg-brand-green/65" />
              <div className="relative z-10 text-center px-8 h-full flex flex-col items-center justify-center py-10">
                <p className="font-serif text-5xl font-bold text-brand-gold mb-2">15+</p>
                <p className="text-white/70 text-sm font-sans">années d&apos;expérience</p>
                <div className="mt-6 w-12 h-0.5 bg-brand-gold mx-auto" />
                <p className="font-serif text-2xl font-bold text-white mt-6">Atlantic</p>
                <p className="text-brand-gold/70 text-xs uppercase tracking-widest font-sans mt-1">
                  Céréales &amp; Soja
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Nos clients & fournisseurs ───────────────────────────────────── */}
      <section className="bg-brand-wheat py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimateIn>
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3 font-sans">
                Notre écosystème
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal">
                Clients &amp; fournisseurs
              </h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimateIn delay={60}>
              <div className="bg-white rounded-2xl border border-brand-wheat shadow-sm p-8 h-full">
                <h3 className="font-serif text-xl font-bold text-brand-charcoal mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full inline-block bg-brand-gold" />
                  Nos clients
                </h3>
                <ul className="space-y-4">
                  {OUR_CLIENTS.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-green/8 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand-green" />
                      </div>
                      <span className="text-sm font-medium text-brand-charcoal/80 font-sans">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>

            <AnimateIn delay={120}>
              <div className="bg-white rounded-2xl border border-brand-wheat shadow-sm p-8 h-full">
                <h3 className="font-serif text-xl font-bold text-brand-charcoal mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full inline-block bg-brand-gold" />
                  Nos fournisseurs
                </h3>
                <ul className="space-y-4">
                  {OUR_SUPPLIERS.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-green/8 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand-green" />
                      </div>
                      <span className="text-sm font-medium text-brand-charcoal/80 font-sans">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── Trust stats (bottom) ─────────────────────────────────────────── */}
      <section className="bg-brand-green py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {TRUST_STATS.map((stat, i) => (
            <AnimateIn key={stat.label} delay={i * 80}>
              <div className="text-center">
                <p className="font-serif text-4xl font-bold text-brand-gold mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-white/60 font-sans">{stat.label}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── CTA banner ───────────────────────────────────────────────────── */}
      <section className="bg-brand-cream py-20">
        <AnimateIn>
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-brand-gold text-xs font-semibold uppercase tracking-[0.25em] mb-4 font-sans">
              Contactez-nous
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal mb-4 max-w-2xl mx-auto leading-tight">
              Prêt à passer commande ou à obtenir un tarif personnalisé ?
            </h2>
            <p className="text-brand-charcoal/60 mb-8 max-w-md mx-auto font-sans">
              Notre équipe vous répond sous 24 h et vous accompagne à chaque étape.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 font-semibold text-sm rounded transition-colors font-sans"
              style={{ background: '#1a3d2e', color: '#fff' }}
            >
              Nous contacter <ArrowRight size={16} />
            </Link>
          </div>
        </AnimateIn>
      </section>
    </>
  )
}
