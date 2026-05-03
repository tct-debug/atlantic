'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, ChevronRight, ChevronLeft, X, ArrowRight } from 'lucide-react'

export type PriceItem = {
  productName: string
  price: number
  unit: string
  category: string
  updatedAt: string
}

const CATEGORY_LABELS: Record<string, string> = {
  cereal: 'Céréales',
  soy: 'Soja',
}

function fmt(n: number) {
  return new Intl.NumberFormat('fr-DZ').format(n)
}

function fmtTime(iso: string): string {
  const d = new Date(iso)
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
  return d.toLocaleDateString('fr-DZ', {
    timeZone: 'Africa/Algiers',
    day: 'numeric',
    month: 'short',
  })
}

// Group items by category preserving insertion order
function group(items: PriceItem[]): [string, PriceItem[]][] {
  const map = new Map<string, PriceItem[]>()
  for (const item of items) {
    if (!map.has(item.category)) map.set(item.category, [])
    map.get(item.category)!.push(item)
  }
  return Array.from(map.entries())
}

export function PriceSidebar({ items }: { items: PriceItem[] }) {
  // Desktop
  const [collapsed, setCollapsed] = useState(false)

  // Mobile bottom sheet
  const [mobileOpen, setMobileOpen] = useState(false)

  // Rotating ticker — cycles through products on the pill
  const [tickerIdx, setTickerIdx] = useState(0)
  const [tickerVisible, setTickerVisible] = useState(true)

  useEffect(() => {
    if (items.length <= 1) return
    const id = setInterval(() => {
      setTickerVisible(false)
      setTimeout(() => {
        setTickerIdx((i) => (i + 1) % items.length)
        setTickerVisible(true)
      }, 250)
    }, 2800)
    return () => clearInterval(id)
  }, [items.length])

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const ticker = items[tickerIdx]
  const grouped = group(items)

  const today = new Date().toLocaleDateString('fr-DZ', {
    timeZone: 'Africa/Algiers',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP — collapsible right-side panel
      ══════════════════════════════════════════════════════════════════ */}
      <div className="fixed right-0 top-24 z-40 hidden lg:flex items-start">
        {/* Toggle tab */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Afficher les prix' : 'Masquer les prix'}
          className="flex flex-col items-center justify-center w-7 py-4 rounded-l-lg shadow-lg transition-colors"
          style={{ background: '#1a3d2e' }}
        >
          {collapsed ? (
            <ChevronLeft size={13} style={{ color: '#c9a961' }} />
          ) : (
            <ChevronRight size={13} style={{ color: '#c9a961' }} />
          )}
          <span
            className="text-[9px] font-semibold uppercase tracking-widest mt-2 font-sans"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
              color: '#c9a961',
            }}
          >
            Prix
          </span>
        </button>

        {/* Panel */}
        <div
          className="overflow-hidden shadow-xl transition-all duration-300"
          style={{
            width: collapsed ? 0 : 214,
            background: 'linear-gradient(160deg, #1a3d2e 0%, #0f2318 100%)',
            borderRadius: '0 0 0 12px',
          }}
        >
          <div style={{ width: 214 }}>
            {/* Header */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-white/10">
              <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#c9a961' }} />
              <span
                className="text-xs font-semibold uppercase tracking-wide font-sans"
                style={{ color: '#c9a961' }}
              >
                Prix du jour
              </span>
              {/* Live dot */}
              <span className="ml-auto relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: '#c9a961' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#c9a961' }} />
              </span>
            </div>

            {/* Price list */}
            <div className="px-4 py-4 space-y-5">
              {grouped.map(([cat, catItems]) => (
                <div key={cat}>
                  <p
                    className="text-[9px] font-semibold uppercase tracking-widest mb-2.5 font-sans"
                    style={{ color: 'rgba(201,169,97,0.5)' }}
                  >
                    {CATEGORY_LABELS[cat] ?? cat}
                  </p>
                  <div className="space-y-3">
                    {catItems.map(({ productName, price, unit, updatedAt }) => (
                      <div key={productName}>
                        <p className="text-[10px] font-sans leading-none mb-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          {productName}
                        </p>
                        <p className="font-serif text-sm font-bold leading-none text-white">
                          {fmt(price)}
                          <span className="text-[9px] font-sans font-normal ml-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
                            DZD/{unit}
                          </span>
                        </p>
                        <p className="text-[9px] font-sans mt-0.5" style={{ color: 'rgba(255,255,255,0.2)' }}>
                          {fmtTime(updatedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <p className="text-xs font-sans" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  Aucun prix disponible
                </p>
              )}
            </div>

            {/* Footer link */}
            <div className="px-4 pb-4">
              <a
                href="/prix"
                className="flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-wide font-sans transition-colors"
                style={{
                  color: '#c9a961',
                  border: '1px solid rgba(201,169,97,0.25)',
                }}
              >
                Tous les prix
                <ArrowRight size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE — rotating pill ticker FAB
      ══════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-6 right-4 z-50 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2.5 h-12 pl-3 pr-4 rounded-full shadow-xl active:scale-95 transition-transform"
          style={{
            background: '#1a3d2e',
            border: '1px solid rgba(201,169,97,0.35)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,169,97,0.1)',
          }}
        >
          {/* Live dot */}
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: '#c9a961' }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#c9a961' }} />
          </span>

          {/* Rotating ticker text */}
          <div
            className="flex flex-col items-start transition-opacity duration-200"
            style={{ opacity: tickerVisible ? 1 : 0, minWidth: 110 }}
          >
            {ticker ? (
              <>
                <span className="text-[9px] uppercase tracking-widest font-sans leading-none" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {ticker.productName}
                </span>
                <span className="text-[13px] font-bold font-serif leading-none mt-0.5 text-white">
                  {fmt(ticker.price)}
                  <span className="text-[9px] font-sans font-normal ml-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    DZD
                  </span>
                </span>
              </>
            ) : (
              <span className="text-xs font-semibold font-sans text-white">Prix du jour</span>
            )}
          </div>

          {/* Divider + expand hint */}
          <span className="w-px h-5 flex-shrink-0" style={{ background: 'rgba(201,169,97,0.2)' }} />
          <TrendingUp size={14} style={{ color: '#c9a961' }} />
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE — backdrop
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 z-50 lg:hidden transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(3px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        onClick={() => setMobileOpen(false)}
      />

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE — bottom sheet
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden flex flex-col"
        style={{
          background: 'linear-gradient(175deg, #1e4534 0%, #0f2318 100%)',
          borderRadius: '24px 24px 0 0',
          transform: mobileOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '82vh',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(201,169,97,0.35)' }} />
        </div>

        {/* Sheet header */}
        <div className="flex items-center justify-between px-6 pt-3 pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(201,169,97,0.12)' }}
            >
              <TrendingUp size={16} style={{ color: '#c9a961' }} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white leading-none">Prix du jour</h3>
              <p className="text-[10px] font-sans capitalize mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {today}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: 'rgba(255,255,255,0.08)' }}
            aria-label="Fermer"
          >
            <X size={15} style={{ color: 'rgba(255,255,255,0.6)' }} />
          </button>
        </div>

        {/* Divider */}
        <div className="flex-shrink-0" style={{ height: 1, background: 'rgba(201,169,97,0.12)' }} />

        {/* Scrollable price list */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
          {grouped.map(([cat, catItems]) => (
            <div key={cat}>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-3 font-sans"
                style={{ color: 'rgba(201,169,97,0.55)' }}
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </p>
              <div className="space-y-1">
                {catItems.map(({ productName, price, unit, updatedAt }) => (
                  <div
                    key={productName}
                    className="flex items-center justify-between py-3.5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div>
                      <p className="text-white font-sans text-sm font-medium">{productName}</p>
                      <p className="text-[10px] font-sans mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Mis à jour {fmtTime(updatedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg font-bold" style={{ color: '#c9a961' }}>
                        {fmt(price)}
                      </p>
                      <p className="text-[10px] font-sans" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        DZD / {unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-center py-10 text-sm font-sans" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Aucun prix disponible pour le moment.
            </p>
          )}
        </div>

        {/* Footer CTA */}
        <div className="flex-shrink-0 px-6 py-5" style={{ borderTop: '1px solid rgba(201,169,97,0.1)' }}>
          <a
            href="/prix"
            className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl font-semibold text-sm font-sans transition-opacity active:opacity-70"
            style={{
              background: 'rgba(201,169,97,0.12)',
              border: '1px solid rgba(201,169,97,0.25)',
              color: '#c9a961',
            }}
          >
            Voir tous les prix
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </>
  )
}
