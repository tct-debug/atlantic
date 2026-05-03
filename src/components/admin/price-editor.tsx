'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { upsertDailyPrice } from '@/lib/modules/prices/mutations'
import { priceSchema } from '@/lib/modules/prices/schemas'

type PriceRow = {
  productId: string
  productName: string
  unit: string
  currentPrice: number
  updatedAt: string | null
}

function formatUpdatedAt(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const isToday =
    d.toLocaleDateString('fr-DZ', { timeZone: 'Africa/Algiers' }) ===
    now.toLocaleDateString('fr-DZ', { timeZone: 'Africa/Algiers' })

  if (isToday) {
    return d.toLocaleTimeString('fr-DZ', {
      timeZone: 'Africa/Algiers',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return d.toLocaleString('fr-DZ', {
    timeZone: 'Africa/Algiers',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

type RowStatus = 'idle' | 'saving' | 'saved' | 'error'

export function PriceEditor({ rows }: { rows: PriceRow[] }) {
  const router = useRouter()

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(rows.map((r) => [r.productId, String(r.currentPrice)]))
  )
  const [statuses, setStatuses] = useState<Record<string, RowStatus>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  function setStatus(id: string, s: RowStatus) {
    setStatuses((prev) => ({ ...prev, [id]: s }))
  }

  async function handleSave(productId: string) {
    const raw = parseFloat(values[productId])
    const result = priceSchema.safeParse(raw)

    if (!result.success) {
      setErrors((prev) => ({ ...prev, [productId]: 'Prix invalide' }))
      return
    }

    setErrors((prev) => ({ ...prev, [productId]: '' }))
    setStatus(productId, 'saving')

    const res = await upsertDailyPrice(productId, result.data)

    if (res.error) {
      setStatus(productId, 'error')
      setErrors((prev) => ({ ...prev, [productId]: res.error! }))
    } else {
      setStatus(productId, 'saved')
      router.refresh()
    }
  }

  const today = new Date().toLocaleDateString('fr-DZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Mise à jour des prix</h2>
        <span className="text-sm text-gray-500 capitalize">{today}</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-3 sm:px-6 py-3 font-medium text-gray-600">Produit</th>
              <th className="hidden sm:table-cell text-left px-6 py-3 font-medium text-gray-600">Unité</th>
              <th className="text-left px-3 sm:px-6 py-3 font-medium text-gray-600">Prix (DZD)</th>
              <th className="hidden md:table-cell text-left px-6 py-3 font-medium text-gray-600">Dernière mise à jour</th>
              <th className="px-3 sm:px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => {
              const status = statuses[row.productId] ?? 'idle'
              const fieldError = errors[row.productId]

              return (
                <tr key={row.productId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">
                    {row.productName}
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 text-gray-500">{row.unit}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={values[row.productId]}
                        onChange={(e) => {
                          setValues((prev) => ({
                            ...prev,
                            [row.productId]: e.target.value,
                          }))
                          setStatus(row.productId, 'idle')
                          setErrors((prev) => ({ ...prev, [row.productId]: '' }))
                        }}
                        className="w-24 sm:w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm
                                   focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      />
                      {fieldError && (
                        <span className="text-xs text-red-500">{fieldError}</span>
                      )}
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-gray-400 text-xs">
                    {formatUpdatedAt(row.updatedAt)}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3 justify-end">
                      {status === 'saved' && (
                        <span className="text-xs text-green-600 font-medium hidden sm:inline">✓ Enregistré</span>
                      )}
                      {status === 'error' && !fieldError && (
                        <span className="text-xs text-red-500 font-medium">Erreur</span>
                      )}
                      <button
                        onClick={() => handleSave(row.productId)}
                        disabled={status === 'saving'}
                        className="px-3 sm:px-4 py-1.5 bg-green-700 text-white text-sm font-medium rounded-lg
                                   hover:bg-green-800 disabled:opacity-50 transition-colors whitespace-nowrap"
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
    </div>
  )
}
