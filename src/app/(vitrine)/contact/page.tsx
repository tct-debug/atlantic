import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { ContactForm } from '@/components/vitrine/contact-form'

const CONTACT_DETAILS = [
  { icon: Mail,   label: 'Email',         value: 'contact@atlantic-dz.com' },
  { icon: Phone,  label: 'Téléphone',     value: '+213 (0) 0 00 00 00 00' },
  { icon: MapPin, label: 'Adresse',       value: 'Algérie' },
  { icon: Clock,  label: 'Disponibilité', value: 'Dim – Jeu, 8h – 17h' },
]

export default function ContactPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Page header */}
      <div className="bg-brand-green text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3 font-sans">
            Parlez-nous
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
            Contactez-nous
          </h1>
          <p className="text-white/60 max-w-xl font-sans">
            Une question, une demande de tarif, ou simplement envie d&apos;en savoir plus ?
            Notre équipe vous répond sous 24 heures ouvrées.
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form — wider column */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-brand-wheat shadow-sm p-8">
            <h2 className="font-serif text-2xl font-bold text-brand-charcoal mb-1">
              Envoyez-nous un message
            </h2>
            <p className="text-sm text-brand-charcoal/50 mb-7 font-sans">
              Remplissez le formulaire ci-dessous. Les champs marqués d&apos;un{' '}
              <span className="text-brand-gold">*</span> sont obligatoires.
            </p>
            <ContactForm />
          </div>
        </div>

        {/* Info — narrower column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Coordonnées */}
          <div className="bg-brand-green rounded-xl p-7 text-white">
            <h3 className="font-serif text-lg font-bold text-white mb-5">Coordonnées</h3>
            <ul className="space-y-5">
              {CONTACT_DETAILS.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-brand-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wide font-sans">{label}</p>
                    <p className="text-sm text-white font-sans mt-0.5">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Office / facility photo */}
          <div className="rounded-xl overflow-hidden h-44 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://picsum.photos/seed/office-modern-algeria/500/300"
              alt=""
              className="w-full h-full object-cover"
            />
            {/*
              Replace with: /images/contact-office.jpg
              Suggested: photo of your office reception, team, or loading facility
            */}
            <div className="absolute inset-0 bg-brand-charcoal/20" />
          </div>

          {/* Urgence card */}
          <div className="bg-brand-wheat rounded-xl p-7 border border-brand-wheat">
            <h3 className="font-serif text-base font-bold text-brand-charcoal mb-2">
              Demande urgente ?
            </h3>
            <p className="text-sm text-brand-charcoal/60 leading-relaxed font-sans">
              Pour toute urgence approvisionnement, appelez-nous directement.
              Nous traitons les commandes express en priorité.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
