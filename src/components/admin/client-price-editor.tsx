'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setCustomerPrice, deleteCustomerPrice } from '@/lib/modules/client-pricing/mutations'
import type { CustomerPriceWithProduct } from '@/lib/modules/client-pricing/types'
import type { Product } from '@/lib/modules/products/types'
import type { Client } from '@/lib/modules/clients/types'

type RowStatus = 'idle' | 'saving' | 'saved' | 'error' | 'deleting'

type Props = {
  client: Client
  products: Product[]
  existingPrices: CustomerPriceWithProduct[]
}

function buildValues(
  products: Product[],
  prices: CustomerPriceWithProduct[]
): Record<string, string> {
  const map = new Map(prices.map((p) => [p.product_id, p.price]))
  return Object.fromEntries(
    products.map((p) => [p.id, map.has(p.id) ? String(map.get(p.id)) : ''])
  )
}

export function ClientPriceEditor({ client, products, existingPrices }: Props) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildValues(products, existingPrices)
  )
  const [statuses, setStatuses] = useState<Record<string, RowStatus>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sync when server passes fresh existingPrices after router.refresh()
  useEffect(() => {
    setValues(buildValues(products, existingPrices))
    setStatuses({})
    setErrors({})
  }, [existingPrices])

  function setStatus(id: string, s: RowStatus) {
    setStatuses((prev) => ({ ...prev, [id]: s }))
  }

  async function handleSave(productId: string) {
    const raw = parseFloat(values[productId])
    if (isNaN(raw) || raw < 0) {
      setErrors((prev) => ({ ...prev, [productId]: 'Prix invalide' }))
      return
    }
    setErrors((prev) => ({ ...prev, [productId]: '' }))
    setStatus(productId, 'saving')
    const res = await setCustomerPrice(client.id, productId, raw)
    if (res.error) {
      setStatus(productId, 'error')
      setErrors((prev) => ({ ...prev, [productId]: res.error! }))
    } else {
      setStatus(productId, 'saved')
      router.refresh()
    }
  }

  async function handleDelete(productId: string) {
    setStatus(productId, 'deleting')
    const res = await deleteCustomerPrice(client.id, productId)
    if (res.error) {
      setStatus(productId, 'error')
    } else {
      setValues((prev) => ({ ...prev, [productId]: '' }))
      setStatus(productId, 'idle')
      router.refresh()
    }
  }

  const priceMap = new Map(existingPrices.map((p) => [p.product_id, p.price]))

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <a
          href="/admin?tab=clients"
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Retour
        </a>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {client.company_name ?? client.full_name ?? client.email}
          </h2>
          <p className="text-xs text-gray-400">{client.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-3 font-medium text-gray-600">Produit</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Unité</th>
              <th className="text-left px-6 py-3 font-medium text-gray-600">Prix négocié (DZD)</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => {
              const status = statuses[product.id] ?? 'idle'
              const fieldError = errors[product.id]
              const hasExistingPrice = priceMap.has(product.id)

              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-500">{product.unit}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="Non défini"
                        value={values[product.id] ?? ''}
                        onChange={(e) => {
                          setValues((prev) => ({ ...prev, [product.id]: e.target.value }))
                          setStatus(product.id, 'idle')
                          setErrors((prev) => ({ ...prev, [product.id]: '' }))
                        }}
                        className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm
                                   focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                      {fieldError && (
                        <span className="text-xs text-red-500">{fieldError}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      {status === 'saved' && (
                        <span className="text-xs text-green-600 font-medium">✓ Enregistré</span>
                      )}
                      {status === 'error' && !fieldError && (
                        <span className="text-xs text-red-500">Erreur</span>
                      )}
                      {hasExistingPrice && (
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={status === 'deleting' || status === 'saving'}
                          className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                        >
                          {status === 'deleting' ? '…' : 'Supprimer'}
                        </button>
                      )}
                      <button
                        onClick={() => handleSave(product.id)}
                        disabled={status === 'saving' || !values[product.id]}
                        className="px-4 py-1.5 bg-green-700 text-white text-sm font-medium rounded-lg
                                   hover:bg-green-800 disabled:opacity-50 transition-colors"
                      >
                        {status === 'saving' ? 'Sauvegarde…' : 'Enregistrer'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
