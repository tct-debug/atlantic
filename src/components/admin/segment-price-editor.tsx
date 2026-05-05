'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { upsertSegmentPrice } from '@/lib/modules/prices/segment-mutations'
import { priceSchema } from '@/lib/modules/prices/schemas'
import type { Product } from '@/lib/modules/products/types'
import type { SegmentPrice } from '@/lib/modules/prices/segment-queries'
import { getProductImageSrc } from '@/lib/product-images'

const CLIENT_TYPES = [
  { value: 'gros', label: 'Gros' },
  { value: 'detail', label: 'Détail' },
  { value: 'supergros', label: 'Super gros' },
]

type Props = {
  products: Product[]
  mode: 'region' | 'type' | null
  segmentValue: string | null
  existingPrices: SegmentPrice[]
}

type RowStatus = 'idle' | 'saving' | 'saved' | 'error'

export function SegmentPriceEditor({ products, mode: initMode, segmentValue: initVal, existingPrices }: Props) {
  const router = useRouter()

  const [mode, setMode] = useState<'region' | 'type'>(initMode ?? 'region')
  const [regionInput, setRegionInput] = useState(initMode === 'region' ? (initVal ?? '') : '')
  const [typeInput, setTypeInput] = useState(initMode === 'type' ? (initVal ?? '') : '')

  const priceMap = new Map(existingPrices.map((p) => [p.product_id, p.price]))
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(products.map((p) => [p.id, String(priceMap.get(p.id) ?? '')]))
  )
  const [statuses, setStatuses] = useState<Record<string, RowStatus>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  function load() {
    const val = mode === 'region' ? regionInput.trim() : typeInput
    if (!val) return
    const params = new URLSearchParams({ tab: 'tarifs', mode, val })
    router.push(`/admin?${params.toString()}`)
  }

  async function handleSave(productId: string) {
    const raw = parseFloat(values[productId])
    const result = priceSchema.safeParse(raw)
    if (!result.success) {
      setErrors((prev) => ({ ...prev, [productId]: 'Prix invalide' }))
      return
    }
    setErrors((prev) => ({ ...prev, [productId]: '' }))
    setStatuses((prev) => ({ ...prev, [productId]: 'saving' }))

    const region = mode === 'region' ? (initVal ?? null) : null
    const clientType = mode === 'type' ? (initVal ?? null) : null
    const res = await upsertSegmentPrice(productId, region, clientType, result.data)

    if (res.error) {
      setStatuses((prev) => ({ ...prev, [productId]: 'error' }))
      setErrors((prev) => ({ ...prev, [productId]: res.error! }))
    } else {
      setStatuses((prev) => ({ ...prev, [productId]: 'saved' }))
    }
  }

  const isLoaded = initMode !== null && initVal !== null && initVal !== ''

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Prix par segment</h2>
        <span className="text-xs text-gray-400 font-sans">
          Définissez des prix spécifiques par région ou type de client
        </span>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        {/* Mode toggle */}
        <div className="flex gap-4 mb-5">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="region"
              checked={mode === 'region'}
              onChange={() => setMode('region')}
              className="accent-green-700"
            />
            <span className="text-sm font-medium text-gray-700">Par région (wilaya)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="mode"
              value="type"
              checked={mode === 'type'}
              onChange={() => setMode('type')}
              className="accent-green-700"
            />
            <span className="text-sm font-medium text-gray-700">Par type de client</span>
          </label>
        </div>

        {/* Value input */}
        <div className="flex items-end gap-3">
          {mode === 'region' ? (
            <div className="flex-1 max-w-xs">
              <label className="block text-xs font-medium text-gray-600 mb-1">Région / Wilaya</label>
              <input
                type="text"
                placeholder="ex: Alger, Oran, Constantine…"
                value={regionInput}
                onChange={(e) => setRegionInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          ) : (
            <div className="flex-1 max-w-xs">
              <label className="block text-xs font-medium text-gray-600 mb-1">Type de client</label>
              <select
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
              >
                <option value="">-- Sélectionner --</option>
                {CLIENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={load}
            className="px-5 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors"
          >
            Charger les prix
          </button>
        </div>
      </div>

      {/* Price table */}
      {isLoaded && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {initMode === 'region' ? `Région : ${initVal}` : `Type : ${CLIENT_TYPES.find(t => t.value === initVal)?.label ?? initVal}`}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-3 sm:px-6 py-3 font-medium text-gray-600">Produit</th>
                <th className="hidden sm:table-cell text-left px-6 py-3 font-medium text-gray-600">Unité</th>
                <th className="text-left px-3 sm:px-6 py-3 font-medium text-gray-600">Prix segment (DZD)</th>
                <th className="px-3 sm:px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const status = statuses[product.id] ?? 'idle'
                const fieldError = errors[product.id]
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getProductImageSrc(product.slug)}
                          alt=""
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover flex-shrink-0"
                        />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-gray-500">{product.unit}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          placeholder="—"
                          value={values[product.id]}
                          onChange={(e) => {
                            setValues((prev) => ({ ...prev, [product.id]: e.target.value }))
                            setStatuses((prev) => ({ ...prev, [product.id]: 'idle' }))
                            setErrors((prev) => ({ ...prev, [product.id]: '' }))
                          }}
                          className="w-24 sm:w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                        />
                        {fieldError && <span className="text-xs text-red-500">{fieldError}</span>}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3 justify-end">
                        {status === 'saved' && <span className="hidden sm:inline text-xs text-green-600 font-medium">✓ Enregistré</span>}
                        {status === 'error' && !fieldError && <span className="text-xs text-red-500 font-medium">Erreur</span>}
                        <button
                          onClick={() => handleSave(product.id)}
                          disabled={status === 'saving'}
                          className="px-3 sm:px-4 py-1.5 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors whitespace-nowrap"
                        >
                          {status === 'saving' ? '…' : 'Enregistrer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {!isLoaded && (
        <div className="bg-white rounded-xl border border-gray-200 border-dashed p-12 text-center">
          <p className="text-gray-400 text-sm font-sans">
            Sélectionnez une région ou un type de client, puis cliquez sur &ldquo;Charger les prix&rdquo;.
          </p>
        </div>
      )}
    </div>
  )
}
