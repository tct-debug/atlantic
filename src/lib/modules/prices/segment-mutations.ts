'use server'

import { createClient } from '@/lib/supabase/server'
import { requireStaff } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { priceSchema } from './schemas'

export async function upsertSegmentPrice(
  productId: string,
  region: string | null,
  clientType: string | null,
  price: number
): Promise<{ error?: string }> {
  await requireStaff()

  const result = priceSchema.safeParse(price)
  if (!result.success) return { error: 'Prix invalide' }

  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  // Delete existing price for this segment/product/date (handles NULL comparison)
  let del = supabase
    .from('segment_prices')
    .delete()
    .eq('product_id', productId)
    .eq('effective_date', today)

  if (region) {
    del = del.eq('region', region).is('client_type', null)
  } else if (clientType) {
    del = del.eq('client_type', clientType).is('region', null)
  }
  await del

  const { error } = await supabase.from('segment_prices').insert({
    product_id: productId,
    region: region ?? null,
    client_type: clientType ?? null,
    price: result.data,
    currency: 'DZD',
    effective_date: today,
  })

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return {}
}
