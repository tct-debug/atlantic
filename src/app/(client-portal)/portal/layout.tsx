import Link from 'next/link'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-700">
              Atlantic
            </p>
            <h1 className="text-lg font-bold text-gray-900">Espace client</h1>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Site public
            </Link>
            <form action="/logout" method="POST">
              <button
                type="submit"
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </div>
  )
}
