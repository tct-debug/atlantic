'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/modules/products/types'
import { cn } from '@/lib/utils'
import { Wheat, Leaf } from 'lucide-react'
import { getProductImageSrc } from '@/lib/product-images'

const CATEGORY_LABELS: Record<string, string> = {
  cereal: 'Céréales',
  soy: 'Produits du soja',
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  cereal: <Wheat className="w-5 h-5 text-brand-gold" />,
  soy: <Leaf className="w-5 h-5 text-brand-gold" />,
}

const CATEGORY_ORDER = ['cereal', 'soy']

export function ProductGrid({ products }: { products: Product[] }) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-brand-wheat shadow-sm overflow-hidden flex flex-col"
          >
            {/* Product image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="h-44 overflow-hidden bg-brand-wheat/40">
              <img
                src={getProductImageSrc(product.slug, product.image_url)}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              {/*
                To replace this image:
                Option A — Supabase: set the image_url column for this product in the products table
                Option B — Local file: put your photo at /public/images/products/{slug}.jpg
                           and set image_url to "/images/products/{slug}.jpg" in Supabase
              */}
            </div>

            {/* Card body */}
            <div className="p-7 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-4">
                <Badge
                  variant="outline"
                  className="text-xs border-brand-gold/40 text-brand-gold bg-brand-gold/5 font-sans"
                >
                  {CATEGORY_LABELS[product.category] ?? product.category}
                </Badge>
                <div className="w-8 h-8 rounded-lg bg-brand-green/8 flex items-center justify-center flex-shrink-0">
                  {CATEGORY_ICONS[product.category]}
                </div>
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
