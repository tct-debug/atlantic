import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AgriGrain Algérie',
  description: 'Prix des céréales et aliments du bétail en temps réel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
