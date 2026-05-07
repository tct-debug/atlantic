import Link from 'next/link'

const COMPANY_LINKS = [
  { href: '/a-propos', label: 'À propos' },
  { href: '/services', label: 'Services' },
  { href: '/produits', label: 'Produits' },
  { href: '/prix', label: 'Prix du jour' },
]

const CONTACT_INFO = [
  { label: 'Email', value: 'contact@atlantic-dz.com' },
  { label: 'Téléphone', value: '+213 (0) 0 00 00 00 00' },
  { label: 'Wilaya', value: 'Algérie' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-charcoal text-brand-cream/80">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <p className="font-serif text-2xl font-bold text-brand-cream mb-1">Atlantic</p>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-gold mb-4 font-sans">
            Transport & Logistique
          </p>
          <p className="text-sm leading-relaxed text-brand-cream/60 max-w-xs">
            Votre partenaire en transport et distribution de céréales et produits du soja,
            partout en Algérie.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">
            Navigation
          </p>
          <ul className="space-y-2.5">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-brand-cream/70 hover:text-brand-cream transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="text-sm text-brand-cream/70 hover:text-brand-cream transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-gold mb-4">
            Coordonnées
          </p>
          <ul className="space-y-2.5">
            {CONTACT_INFO.map((item) => (
              <li key={item.label} className="text-sm">
                <span className="text-brand-cream/40 block text-xs">{item.label}</span>
                <span className="text-brand-cream/80">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-cream/40">
          <span>© {year} Atlantic. Tous droits réservés.</span>
          <Link href="/login" className="hover:text-brand-cream/70 transition-colors">
            Espace administrateur
          </Link>
        </div>
      </div>
    </footer>
  )
}
