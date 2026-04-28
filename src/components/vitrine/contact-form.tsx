'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { submitContactMessage } from '@/lib/modules/contact/mutations'
import { CheckCircle2 } from 'lucide-react'

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)
    setFieldErrors({})
    setLoading(true)

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem('email') as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value.trim(),
      company: (form.elements.namedItem('company') as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim(),
    }

    const res = await submitContactMessage(data)

    if (res.error) {
      setServerError(res.error)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4">
        <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-7 h-7 text-brand-green" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-brand-charcoal mb-2">
          Message envoyé
        </h3>
        <p className="text-brand-charcoal/60 text-sm max-w-xs font-sans">
          Merci pour votre message. Notre équipe vous répondra dans un délai de 24 heures ouvrées.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-medium text-brand-charcoal font-sans">
            Nom complet <span className="text-brand-gold">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Votre nom"
            className="border-brand-wheat focus-visible:ring-brand-gold bg-white font-sans"
          />
          {fieldErrors.name && (
            <p className="text-xs text-red-500 font-sans">{fieldErrors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium text-brand-charcoal font-sans">
            Adresse email <span className="text-brand-gold">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="vous@exemple.com"
            className="border-brand-wheat focus-visible:ring-brand-gold bg-white font-sans"
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-500 font-sans">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium text-brand-charcoal font-sans">
            Téléphone <span className="text-brand-charcoal/30 text-xs">(optionnel)</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+213 0 XX XX XX XX"
            className="border-brand-wheat focus-visible:ring-brand-gold bg-white font-sans"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company" className="text-sm font-medium text-brand-charcoal font-sans">
            Société / Exploitation <span className="text-brand-charcoal/30 text-xs">(optionnel)</span>
          </Label>
          <Input
            id="company"
            name="company"
            placeholder="Nom de votre structure"
            className="border-brand-wheat focus-visible:ring-brand-gold bg-white font-sans"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-sm font-medium text-brand-charcoal font-sans">
          Message <span className="text-brand-gold">*</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Décrivez votre besoin : produits souhaités, quantités estimées, wilaya de livraison…"
          className="border-brand-wheat focus-visible:ring-brand-gold bg-white font-sans resize-none"
        />
        {fieldErrors.message && (
          <p className="text-xs text-red-500 font-sans">{fieldErrors.message}</p>
        )}
      </div>

      {serverError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 font-sans">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-semibold font-sans"
      >
        {loading ? 'Envoi en cours…' : 'Envoyer le message'}
      </Button>
    </form>
  )
}
