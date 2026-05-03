'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setCustomerPrice, deleteCustomerPrice } from '@/lib/modules/client-pricing/mutations'
import { updateClientProfile, deleteClient } from '@/lib/modules/clients/mutations'
import type { CustomerPriceWithProduct } from '@/lib/modules/client-pricing/types'
import type { Product } from '@/lib/modules/products/types'
import type { Client, ClientType } from '@/lib/modules/clients/types'

function fmtUpdatedAt(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const isToday =
    d.toLocaleDateString('fr-DZ', { timeZone: 'Africa/Algiers' }) ===
    now.toLocaleDateString('fr-DZ', { timeZone: 'Africa/Algiers' })
  if (isToday) {
    return 'Aujourd\'hui ' + d.toLocaleTimeString('fr-DZ', {
      timeZone: 'Africa/Algiers',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return d.toLocaleDateString('fr-DZ', {
    timeZone: 'Africa/Algiers',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const CLIENT_TYPES: { value: ClientType; label: string }[] = [
  { value: 'gros', label: 'Gros' },
  { value: 'detail', label: 'Détail' },
  { value: 'supergros', label: 'Super gros' },
]

type RowStatus = 'idle' | 'saving' | 'saved' | 'error' | 'deleting'

type Props = {
  client: Client
  products: Product[]
  existingPrices: CustomerPriceWithProduct[]
}

function buildValues(products: Product[], prices: CustomerPriceWithProduct[]): Record<string, string> {
  const map = new Map(prices.map((p) => [p.product_id, p.price]))
  return Object.fromEntries(
    products.map((p) => [p.id, map.has(p.id) ? String(map.get(p.id)) : ''])
  )
}

export function ClientPriceEditor({ client, products, existingPrices }: Props) {
  const router = useRouter()

  // ── Price rows state ──────────────────────────────────────────────────────
  const [values, setValues] = useState<Record<string, string>>(() =>
    buildValues(products, existingPrices)
  )
  const [statuses, setStatuses] = useState<Record<string, RowStatus>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setValues(buildValues(products, existingPrices))
    setStatuses({})
    setErrors({})
  }, [existingPrices, products])

  // ── Profile editing state ─────────────────────────────────────────────────
  const [region, setRegion] = useState(client.region ?? '')
  const [clientType, setClientType] = useState<ClientType | ''>(client.client_type ?? '')
  const [profileStatus, setProfileStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [deleting, setDeleting] = useState(false)

  async function handleDeleteClient() {
    const confirmed = window.confirm(
      `Supprimer le compte de ${client.company_name ?? client.full_name ?? client.email} ? Cette action est irréversible.`
    )
    if (!confirmed) return
    setDeleting(true)
    const res = await deleteClient(client.id)
    if (res.error) {
      alert(res.error)
      setDeleting(false)
    } else {
      router.push('/admin?tab=clients')
    }
  }

  async function handleSaveProfile() {
    setProfileStatus('saving')
    const res = await updateClientProfile(client.id, {
      region,
      client_type: clientType,
    })
    if (res.error) {
      setProfileStatus('error')
    } else {
      setProfileStatus('saved')
      router.refresh()
    }
  }

  // ── Price row handlers ────────────────────────────────────────────────────
  function setStatus(id: string, s: RowStatus) {
    setStatuses((prev) => ({ ...prev, [id]: s }))
  }

  async function handleSavePrice(productId: string) {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <a
            href="/admin?tab=clients"
            className="shrink-0 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Retour
          </a>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {client.company_name ?? client.full_name ?? client.email}
            </h2>
            <p className="text-xs text-gray-400 truncate">{client.email}</p>
          </div>
        </div>
        <button
          onClick={handleDeleteClient}
          disabled={deleting}
          className="self-start sm:self-auto shrink-0 px-3 py-1.5 text-sm font-medium text-red-600
                     border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
        >
          {deleting ? 'Suppression…' : 'Supprimer le compte'}
        </button>
      </div>

      {/* ── Profile card ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Profil client</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Région / Wilaya</label>
            <input
              type="text"
              placeholder="ex: Alger, Oran, Constantine…"
              value={region}
              onChange={(e) => { setRegion(e.target.value); setProfileStatus('idle') }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Type de client</label>
            <select
              value={clientType}
              onChange={(e) => { setClientType(e.target.value as ClientType | ''); setProfileStatus('idle') }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            >
              <option value="">-- Non défini --</option>
              {CLIENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveProfile}
            disabled={profileStatus === 'saving'}
            className="px-5 py-2 bg-green-700 text-white text-sm font-medium rounded-lg
                       hover:bg-green-800 disabled:opacity-50 transition-colors"
          >
            {profileStatus === 'saving' ? 'Sauvegarde…' : 'Enregistrer le profil'}
          </button>
          {profileStatus === 'saved' && (
            <span className="text-xs text-green-600 font-medium">✓ Profil mis à jour</span>
          )}
          {profileStatus === 'error' && (
            <span className="text-xs text-red-500 font-medium">Erreur lors de la sauvegarde</span>
          )}
        </div>
      </div>

      {/* ── Negotiated prices table ───────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Prix négociés</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-3 sm:px-6 py-3 font-medium text-gray-600">Produit</th>
                <th className="hidden sm:table-cell text-left px-6 py-3 font-medium text-gray-600">Unité</th>
                <th className="text-left px-3 sm:px-6 py-3 font-medium text-gray-600">Prix négocié (DZD)</th>
                <th className="hidden sm:table-cell text-left px-6 py-3 font-medium text-gray-600">Mis à jour</th>
                <th className="px-3 sm:px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const status = statuses[product.id] ?? 'idle'
                const fieldError = errors[product.id]
                const hasExistingPrice = priceMap.has(product.id)

                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="hidden sm:table-cell px-6 py-4 text-gray-500">{product.unit}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
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
                          className="w-24 sm:w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm
                                     focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        />
                        {fieldError && (
                          <span className="text-xs text-red-500">{fieldError}</span>
                        )}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4 text-gray-400 text-xs font-sans">
                      {priceMap.has(product.id)
                        ? fmtUpdatedAt(existingPrices.find((p) => p.product_id === product.id)!.valid_from)
                        : '—'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3 justify-end">
                        {status === 'saved' && (
                          <span className="hidden sm:inline text-xs text-green-600 font-medium">✓ Enregistré</span>
                        )}
                        {status === 'error' && !fieldError && (
                          <span className="text-xs text-red-500">Erreur</span>
                        )}
                        {hasExistingPrice && (
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={status === 'deleting' || status === 'saving'}
                            className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                          >
                            {status === 'deleting' ? '…' : 'Supprimer'}
                          </button>
                        )}
                        <button
                          onClick={() => handleSavePrice(product.id)}
                          disabled={status === 'saving' || !values[product.id]}
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
    </div>
  )
}
