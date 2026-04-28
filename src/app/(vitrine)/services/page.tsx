import Link from 'next/link'
import { Factory, Truck, BookOpen, Handshake, ArrowRight } from 'lucide-react'

const SERVICES = [
  {
    icon: Factory,
    title: 'Production',
    description:
      'Fabrication de céréales transformées et d\'aliments composés dans nos unités de production algériennes, avec des contrôles qualité à chaque étape.',
    points: ['Maïs grain, orge, son de blé', 'Aliments composés pour bovins et ovins', 'Aliments volailles et équidés'],
  },
  {
    icon: Truck,
    title: 'Distribution',
    description:
      'Livraison dans toutes les wilayas grâce à notre réseau logistique. Commandes au détail ou en gros, selon vos besoins et votre planning d\'élevage.',
    points: ['Livraison sous 24 à 72 h', 'Camions adaptés (vrac ou palettes)', 'Suivi de commande en temps réel'],
  },
  {
    icon: BookOpen,
    title: 'Conseil & Expertise',
    description:
      'Notre équipe de spécialistes en nutrition animale vous aide à choisir les produits et les quantités adaptés à votre cheptel et à votre budget.',
    points: ['Diagnostic nutritionnel gratuit', 'Plans de rationnement personnalisés', 'Suivi des performances zootechniques'],
  },
  {
    icon: Handshake,
    title: 'Partenariats',
    description:
      'Nous travaillons avec les coopératives agricoles, les grandes exploitations et les distributeurs régionaux pour garantir un approvisionnement fluide.',
    points: ['Contrats d\'approvisionnement annuels', 'Tarifs préférentiels sur volume', 'Programme de fidélité éleveurs'],
  },
]

const ORDER_STEPS = [
  {
    step: '01',
    title: 'Contactez-nous',
    body: 'Appelez-nous ou remplissez le formulaire de contact. Un conseiller vous rappelle sous 24 h.',
  },
  {
    step: '02',
    title: 'Devis personnalisé',
    body: 'Nous établissons un devis adapté à vos volumes, votre espèce et votre wilaya de livraison.',
  },
  {
    step: '03',
    title: 'Confirmation',
    body: 'Vous validez la commande. Nous planifions la production et la logistique.',
  },
  {
    step: '04',
    title: 'Livraison',
    body: 'Votre commande est livrée à l\'adresse convenue, dans les délais garantis.',
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Page header */}
      <div className="bg-brand-green text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3 font-sans">
            Ce que nous faisons
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
            Nos services
          </h1>
          <p className="text-white/60 max-w-xl font-sans">
            De la production à la livraison, Atlantic couvre l&apos;ensemble de la chaîne de valeur
            pour les éleveurs algériens.
          </p>
        </div>
      </div>

      {/* Services grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map(({ icon: Icon, title, description, points }) => (
            <div
              key={title}
              className="bg-white rounded-xl border border-brand-wheat shadow-sm p-8"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center mb-5">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-serif text-xl font-bold text-brand-charcoal mb-3">{title}</h2>
              <p className="text-sm text-brand-charcoal/60 leading-relaxed mb-5 font-sans">
                {description}
              </p>
              <ul className="space-y-2">
                {points.map((point) => (
                  <li key={point} className="flex items-center gap-2.5 text-sm text-brand-charcoal/80 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How to order */}
      <section className="bg-brand-wheat py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3 font-sans">
              Simple et rapide
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal">
              Comment passer commande
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ORDER_STEPS.map(({ step, title, body }) => (
              <div key={step} className="relative">
                <div className="font-serif text-5xl font-bold text-brand-green/10 mb-3 select-none">
                  {step}
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-charcoal mb-2">{title}</h3>
                <p className="text-sm text-brand-charcoal/60 leading-relaxed font-sans">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-green text-white font-semibold text-sm rounded hover:bg-brand-green/90 transition-colors font-sans"
            >
              Commencer maintenant <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
