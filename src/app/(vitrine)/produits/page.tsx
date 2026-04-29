import { Suspense } from 'react'
import { getActiveProducts } from '@/lib/modules/products/queries'
import { ProductGrid } from '@/components/vitrine/product-grid'

export const revalidate = 300

async function ProductsContent() {
  const products = await getActiveProducts()
  return <ProductGrid products={products} />
}

export default function ProduitsPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      {/* Page header */}
      <div className="bg-brand-green text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-brand-gold text-xs font-semibold uppercase tracking-[0.25em] mb-3 font-sans">
            Notre gamme
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-3">
            Nos produits
          </h1>
          <p className="text-white/60 max-w-xl font-sans">
            Des céréales et produits du soja sélectionnés pour leur qualité.
            Disponibles à la tonne, livrés partout en Algérie.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <Suspense
          fallback={
            <div className="text-brand-charcoal/40 text-sm font-sans">
              Chargement des produits…
            </div>
          }
        >
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  )
}
