import { Shield, Truck, Users, Leaf } from 'lucide-react'

const VALUES = [
  {
    icon: Shield,
    title: 'Qualité',
    body: 'Nos produits répondent aux normes les plus strictes. Chaque lot est contrôlé avant livraison pour garantir une composition optimale.',
  },
  {
    icon: Truck,
    title: 'Fiabilité',
    body: 'Livraisons dans les délais convenus dans toutes les wilayas. Nos équipes logistiques assurent un suivi rigoureux de chaque commande.',
  },
  {
    icon: Users,
    title: 'Proximité',
    body: 'Nous accompagnons chaque acheteur avec des conseils personnalisés. Notre équipe est disponible pour répondre à toutes vos questions.',
  },
  {
    icon: Leaf,
    title: 'Durabilité',
    body: 'Engagés pour une agriculture algérienne durable, nous privilégions les pratiques respectueuses de l\'environnement et des ressources naturelles.',
  },
]

const STATS = [
  { value: '2009', label: 'Année de création' },
  { value: '100%', label: 'Origine algérienne' },
  { value: '48', label: 'Wilayas desservies' },
  { value: '500+', label: 'Clients actifs' },
]

export default function AProposPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Page header */}
      <div className="bg-brand-green text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3 font-sans">
            Notre histoire
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
            À propos d&apos;Atlantic
          </h1>
          <p className="text-white/60 max-w-xl font-sans">
            Une entreprise algérienne fondée sur des valeurs d&apos;excellence et de proximité.
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3 font-sans">
            Notre parcours
          </p>
          <h2 className="font-serif text-3xl font-bold text-brand-charcoal mb-6 leading-tight">
            Né d&apos;une passion pour l&apos;agriculture algérienne
          </h2>
          <div className="space-y-4 text-brand-charcoal/70 leading-relaxed font-sans text-sm">
            <p>
              Fondée en 2009, Atlantic est née de la conviction que les acheteurs algériens
              méritaient un partenaire local capable de leur fournir des céréales et des
              produits du soja de qualité supérieure.
            </p>
            <p>
              Depuis plus de 15 ans, nous nous sommes spécialisés dans le négoce et la
              distribution de maïs, orge, soja et coque de soja, pour les besoins des
              industries agroalimentaires, des minoteries et des opérateurs de l&apos;élevage.
            </p>
            <p>
              Aujourd&apos;hui, Atlantic approvisionne plus de 500 clients dans l&apos;ensemble des
              48 wilayas, avec une chaîne logistique robuste et des prix mis à jour chaque jour.
            </p>
          </div>
        </div>

        {/* Story photo — replace with your own */}
        <div className="relative h-80 md:min-h-[420px] rounded-2xl overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://picsum.photos/seed/algeria-grain-field/600/500"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/*
            Replace with: /images/about-story.jpg
            Suggested: aerial photo of a grain field or silo complex in Algeria
          */}
          <div className="absolute inset-0 bg-brand-green/50" />
          <div className="absolute bottom-8 left-8 right-8 z-10">
            <blockquote className="font-serif text-xl font-bold text-white leading-snug">
              &ldquo;Votre partenaire en céréales et produits du soja.&rdquo;
            </blockquote>
            <div className="w-10 h-0.5 bg-brand-gold mt-4" />
            <p className="text-white/60 text-sm font-sans mt-3">Notre raison d&apos;être depuis 2009</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-brand-wheat py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-3 font-sans">
              Ce qui nous guide
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal">
              Nos valeurs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-xl border border-brand-wheat p-7 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-brand-green/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-green" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-brand-charcoal mb-2">{title}</h3>
                <p className="text-sm text-brand-charcoal/60 leading-relaxed font-sans">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-width facility photo strip */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://picsum.photos/seed/grain-warehouse-facility/1920/600"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        {/*
          Replace with: /images/about-facility.jpg
          Suggested: wide interior/exterior shot of your warehouse, silos, or loading dock
        */}
        <div className="absolute inset-0 bg-brand-charcoal/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-serif text-2xl md:text-3xl font-bold text-white text-center px-6">
            Des installations modernes au service de la qualité
          </p>
        </div>
      </div>

      {/* Stats */}
      <section className="bg-brand-green py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-4xl font-bold text-brand-gold mb-1">{stat.value}</p>
              <p className="text-sm text-white/60 font-sans">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="bg-brand-cream py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4 font-sans">
            Notre mission
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-charcoal mb-6 leading-tight">
            Contribuer à la souveraineté alimentaire de l&apos;Algérie
          </h2>
          <p className="text-brand-charcoal/60 leading-relaxed font-sans">
            Chaque jour, Atlantic œuvre pour que les acheteurs algériens puissent compter
            sur des approvisionnements réguliers, des prix transparents et un service
            irréprochable. Parce qu&apos;une filière céréalière forte, c&apos;est une Algérie forte.
          </p>
        </div>
      </section>
    </div>
  )
}
