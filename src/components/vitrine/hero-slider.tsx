'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

// ── Image replacement guide ──────────────────────────────────────────────────
// Each slide has an `image` prop that points to an external placeholder.
// To use your own photos:
//   1. Copy your file into  public/images/  (e.g. public/images/hero-silo.jpg)
//   2. Change the `image` value to  "/images/hero-silo.jpg"
//   3. Remove the `unoptimized` comment and switch to Next.js <Image> if you want
//      automatic optimisation (you'll need to remove the <img> tag below).
// ─────────────────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    // Replace with: /images/hero-grain-field.jpg  (wheat / grain field, Algeria)
    image: '/images/slide1.jpg',
    label: 'Négoce · Algérie',
    title: 'Votre partenaire en céréales et produits du soja',
    subtitle:
      'Atlantic distribue des céréales et produits du soja de qualité supérieure. Prix mis à jour chaque matin.',
    cta: { label: 'Voir les prix du jour', href: '/prix' },
    cta2: { label: 'Nous contacter', href: '/contact' },
  },
  {
    // Replace with: /images/hero-truck-road.jpg  (semi-truck on Algerian highway)
    image: '/images/truck.avif',
    label: 'Logistique · 48 wilayas',
    title: 'Livraison dans toutes les wilayas d\'Algérie',
    subtitle:
      'Notre flotte de camions assure des livraisons en vrac ou en sac, sous 24 à 72 h, partout sur le territoire national.',
    cta: { label: 'Nos services', href: '/services' },
    cta2: { label: 'Contactez-nous', href: '/contact' },
  },
  {
    // Replace with: /images/hero-silo.jpg  (grain silos / storage facility)
    image: '/images/silos-a-grain.jpg',
    label: 'Qualité · Sélection rigoureuse',
    title: 'Des céréales rigoureusement sélectionnées à la source',
    subtitle:
      'Maïs, orge, blé, soja, coque de soja — chaque lot est vérifié à la réception : humidité, pureté, teneur en protéines.',
    cta: { label: 'Voir nos produits', href: '/produits' },
    cta2: { label: 'En savoir plus', href: '/a-propos' },
  },
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5500)
    return () => clearInterval(timer)
  }, [next])

  const slide = SLIDES[current]

  return (
    <section className="relative flex items-center overflow-hidden" style={{ minHeight: '88vh' }}>
      {/* Background slides */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.52)' }} />
          {/* Green directional tint */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(26,61,46,0.72) 0%, rgba(26,61,46,0.2) 55%, transparent 100%)',
            }}
          />
        </div>
      ))}

      {/* Gold accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 z-10" style={{ background: '#c9a961' }} />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-28 w-full">
        <p className="text-white/80 text-xs font-semibold uppercase tracking-[0.25em] mb-6 font-sans transition-all">
          {slide.label}
        </p>
        <h1
          key={`title-${current}`}
          className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 max-w-3xl"
        >
          {slide.title}
        </h1>
        <p className="text-white/70 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-sans">
          {slide.subtitle}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href={slide.cta.href}
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm rounded transition-colors font-sans"
            style={{ background: '#c9a961', color: '#2d2d2d' }}
          >
            {slide.cta.label}
            <ArrowRight size={16} />
          </Link>
          <Link
            href={slide.cta2.href}
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold text-sm rounded hover:bg-white/10 transition-colors font-sans"
          >
            {slide.cta2.label}
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Diapositive précédente"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        aria-label="Diapositive suivante"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Aller à la diapositive ${i + 1}`}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === current ? '2rem' : '0.5rem',
              background: i === current ? '#c9a961' : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>
    </section>
  )
}
