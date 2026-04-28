import { Header } from '@/components/vitrine/header'
import { Footer } from '@/components/vitrine/footer'

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
