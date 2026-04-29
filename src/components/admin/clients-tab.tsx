'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createNewClient } from '@/lib/modules/clients/mutations'
import type { Client } from '@/lib/modules/clients/types'

const EMPTY_FORM = { email: '', password: '', full_name: '', company_name: '' }

export function ClientsTab({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await createNewClient(form)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setShowForm(false)
      setForm(EMPTY_FORM)
      setLoading(false)
      router.refresh()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Clients</h2>
        <button
          onClick={() => { setShowForm((v) => !v); setError(null) }}
          className="px-4 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 transition-colors"
        >
          {showForm ? 'Annuler' : '+ Nouveau client'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4"
        >
          <h3 className="font-semibold text-gray-900">Créer un compte client</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={field('email')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={field('password')}
                placeholder="8 caractères minimum"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Nom complet</label>
              <input
                type="text"
                value={form.full_name}
                onChange={field('full_name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Entreprise</label>
              <input
                type="text"
                value={form.company_name}
                onChange={field('company_name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Création…' : 'Créer le compte'}
          </button>
        </form>
      )}

      {clients.length === 0 ? (
        <p className="text-gray-400 text-sm py-10 text-center">Aucun client enregistré.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-600">Nom</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Entreprise</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Email</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {client.full_name ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{client.company_name ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-500">{client.email}</td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={`/admin?tab=clients&client=${client.id}`}
                      className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
                    >
                      Modifier les prix →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
