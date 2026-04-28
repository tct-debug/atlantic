// Phase 2 — client portal (not yet built)
// This route is scaffolded so the URL /portal is reserved.
export default function PortalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-green-700 mb-4">
          AgriGrain Algérie
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Espace client</h1>
        <p className="text-gray-500 mb-8">
          Cette fonctionnalité sera disponible prochainement.
        </p>
        <a
          href="/"
          className="text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
        >
          ← Retour à l'accueil
        </a>
      </div>
    </div>
  )
}
