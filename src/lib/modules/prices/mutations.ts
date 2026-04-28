'use server'

import { createClient } from '@/lib/supabase/server'

export async function upsertDailyPrice(
  productId: string,
  price: number
): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: 'Non authentifié' }

    const today = new Date().toISOString().split('T')[0]

    const { error } = await supabase.from('daily_prices').upsert(
      {
        product_id: productId,
        price,
        currency: 'DZD',
        effective_date: today,
        created_by: user.id,
      },
      { onConflict: 'product_id,effective_date' }
    )

    if (error) return { error: error.message }
    return {}
  } catch {
    return { error: 'Erreur inattendue. Veuillez réessayer.' }
  }
}
