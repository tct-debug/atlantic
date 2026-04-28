'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { getActiveProducts } from '@/lib/modules/products/queries'
import type { Product } from '@/lib/modules/products/types'
import { cn } from '@/lib/utils'
import { Package } from 'lucide-react'

// This page needs to be a client component for tab interaction,
// but data fetching stays in the module layer (passed as props from a server wrapper).
// To keep the pattern clean, we use a server component as the entry point.
import { Suspense } from 'react'

const CATEGORY_LABELS: Record<string, string> = {
  cereal: 'Céréales',
  feed: 'Aliments du bétail',
  raw_material: 'Matières premières',
}

const CATEGORY_ORDER = ['cereal', 'feed', 'raw_material']

export const revalidate = 300

// ─── Client island: tab filter ───────────────────────────────────────────────

function ProductGrid({ products }: { products: Product[] }) {
  const categories = CATEGORY_ORDER.filter((c) =>
    products.some((p) => p.category === c)
  )
  const [active, setActive] = useState<string>('all')

  const filtered =
    active === 'all' ? products : products.filter((p) => p.category === active)

  return (
    <>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActive('all')}
          className={cn(
            'px-4 py-1.5 rounded-full text-sm font-medium transition-colors font-sans',
            active === 'all'
              ? 'bg-brand-green text-white'
              : 'bg-brand-wheat text-brand-charcoal hover:bg-brand-wheat/70'
          )}
        >
          Tous les produits
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors font-sans',
              active === cat
                ? 'bg-brand-green text-white'
                : 'bg-brand-wheat text-brand-charcoal hover:bg-brand-wheat/70'
            )}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-brand-wheat shadow-sm p-7 flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <Badge
                variant="outline"
                className="text-xs border-brand-gold/40 text-brand-gold bg-brand-gold/5 font-sans"
              >
                {CATEGORY_LABELS[product.category] ?? product.category}
              </Badge>
              <Package className="w-4 h-4 text-brand-charcoal/20 flex-shrink-0" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-brand-charcoal mb-2 leading-snug">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-brand-charcoal/60 leading-relaxed mb-4 font-sans flex-1">
                {product.description}
              </p>
            )}
            <div className="mt-auto pt-4 border-t border-brand-wheat">
              <span className="text-xs text-brand-charcoal/40 uppercase tracking-wide font-sans">
                Unité de vente : {product.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-brand-charcoal/50 text-center py-12 font-sans">
          Aucun produit dans cette catégorie.
        </p>
      )}
    </>
  )
}

// ─── Server component ─────────────────────────────────────────────────────────

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
            Des céréales et aliments du bétail produits et sélectionnés pour leur qualité.
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
