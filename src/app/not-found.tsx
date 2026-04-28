import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-700 mb-4">
          AgriGrain Algérie
        </p>
        <h1 className="text-7xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-500 mb-8">Cette page n'existe pas.</p>
        <Link
          href="/"
          className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
