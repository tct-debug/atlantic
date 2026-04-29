'use server'

import { createClient } from '@/lib/supabase/server'
import { contactSchema } from './schemas'
import type { ContactFormData } from './types'

export async function submitContactMessage(
  data: ContactFormData
): Promise<{ error?: string }> {
  const result = contactSchema.safeParse(data)
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? 'Données invalides.' }
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('contact_messages').insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      company: result.data.company || null,
      message: result.data.message,
    })

    if (error) return { error: 'Impossible d\'envoyer votre message. Veuillez réessayer.' }
    return {}
  } catch {
    return { error: 'Erreur inattendue. Veuillez réessayer.' }
  }
}
