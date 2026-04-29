import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Atlantic — Céréales & Produits du soja',
  description: "Votre partenaire en céréales et produits du soja. Production et distribution de maïs, orge, soja et coque de soja à travers toute l'Algérie.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} h-full`}>
      <body className="min-h-full antialiased font-sans">{children}</body>
    </html>
  )
}
