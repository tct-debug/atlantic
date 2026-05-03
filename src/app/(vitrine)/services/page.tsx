import Link from 'next/link'
import { Factory, Truck, BookOpen, Handshake, Container, ArrowRight } from 'lucide-react'

const SERVICES = [
  {
    icon: Factory,
    title: 'Production',
    imageSeed: 'grain-production-factory',
    // Replace with: /images/service-production.jpg — inside a grain processing or storage facility
    description:
      'Production et stockage de céréales dans nos unités algériennes, avec des contrôles qualité à chaque étape.',
    points: ['Maïs, orge, blé, soja, coque de soja', 'Contrôle de l\'humidité et de la pureté', 'Stockage en silo selon les normes'],
  },
  {
    icon: Truck,
    title: 'Logistique',
    imageSeed: 'truck-highway-algeria',
    // Replace with: /images/service-logistique.jpg — semi-truck on an Algerian highway
    description:
      'Notre propre flotte de camions assure des livraisons fiables dans les 48 wilayas. Vrac ou en sac, grandes et petites quantités.',
    points: ['Livraison sous 24 à 72 h', 'Camions adaptés : vrac, palettes, big-bags', 'Suivi de commande en temps réel'],
  },
  {
    icon: Container,
    title: 'Distribution',
    imageSeed: 'port-containers-logistics',
    // Replace with: /images/service-distribution.jpg — containers at an Algerian port (Alger or Oran)
    description:
      'Nous gérons l\'ensemble de la chaîne de distribution, des ports d\'entrée jusqu\'au site de l\'acheteur, sans intermédiaire.',
    points: ['Import depuis les grands ports algériens', 'Réseau de dépôts régionaux', 'Commandes en vrac ou conditionnées'],
  },
  {
    icon: BookOpen,
    title: 'Qualité & Expertise',
    imageSeed: 'grain-quality-lab-analysis',
    // Replace with: /images/service-qualite.jpg — lab testing, grain sampling, or quality control
    description:
      'Notre équipe vous aide à choisir les produits et les qualités adaptés à vos besoins industriels ou de négoce.',
    points: ['Analyse de la teneur en protéines et humidité', 'Conseil en sourcing et saisonnalité', 'Certificats qualité sur demande'],
  },
  {
    icon: Handshake,
    title: 'Partenariats',
    imageSeed: 'business-partnership-handshake',
    // Replace with: /images/service-partenariats.jpg — business meeting or cooperative scene
    description:
      'Nous travaillons avec les coopératives agricoles, les industriels et les distributeurs régionaux pour garantir un approvisionnement fluide.',
    points: ['Contrats d\'approvisionnement annuels', 'Tarifs préférentiels sur volume', 'Programme de fidélité clients'],
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
    body: 'Nous établissons un devis adapté à vos volumes, votre produit et votre wilaya de livraison.',
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
            pour les acheteurs algériens.
          </p>
        </div>
      </div>

      {/* Services grid */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map(({ icon: Icon, title, imageSeed, description, points }) => (
            <div
              key={title}
              className="bg-white rounded-xl border border-brand-wheat shadow-sm overflow-hidden"
            >
              {/* Service image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <div className="h-48 overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${imageSeed}/700/300`}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {/*
                  Replace with: /images/service-{slug}.jpg
                  See the imageSeed comment above each service for the suggested photo subject
                */}
              </div>

              {/* Card body */}
              <div className="p-8">
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
            </div>
          ))}
        </div>
      </section>

      {/* Full-width logistics strip */}
      <div className="relative h-56 md:h-72 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/truck-convoy-sahara-road/1920/600"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        {/*
          Replace with: /images/services-logistics-strip.jpg
          Suggested: convoy of trucks on a Saharan or national highway, wide shot
        */}
        <div className="absolute inset-0 bg-brand-green/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-brand-gold text-xs font-semibold uppercase tracking-widest mb-3 font-sans">
            Notre réseau
          </p>
          <p className="font-serif text-2xl md:text-3xl font-bold text-white max-w-xl">
            Livraison garantie dans les 48 wilayas d&apos;Algérie
          </p>
        </div>
      </div>

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
