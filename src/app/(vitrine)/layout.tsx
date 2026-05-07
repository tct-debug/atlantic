import { Header } from '@/components/vitrine/header'
import { Footer } from '@/components/vitrine/footer'
import { PriceSidebar } from '@/components/vitrine/price-sidebar'
import { getActiveProducts } from '@/lib/modules/products/queries'
import { getCurrentPrices } from '@/lib/modules/prices/queries'

export default async function VitrineLayout({ children }: { children: React.ReactNode }) {
  const [products, prices] = await Promise.all([
    getActiveProducts(),
    getCurrentPrices(),
  ])

  const priceMap = new Map(prices.map((p) => [p.product_id, p]))

  const sidebarItems = products
    .filter((p) => priceMap.has(p.id))
    .map((p) => ({
      productName: p.name,
      price: priceMap.get(p.id)!.price,
      unit: p.unit,
      category: p.category,
      updatedAt: priceMap.get(p.id)!.updated_at,
      slug: p.slug,
      imageUrl: p.image_url,
    }))

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream">
      <Header />
      <PriceSidebar items={sidebarItems} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
