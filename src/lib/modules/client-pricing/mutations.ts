'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setCustomerPrice(
  customerId: string,
  productId: string,
  price: number
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  // Remove any existing active price for this customer + product
  const { error: deleteError } = await supabase
    .from('customer_prices')
    .delete()
    .eq('customer_id', customerId)
    .eq('product_id', productId)
    .is('valid_until', null)

  if (deleteError) return { error: deleteError.message }

  const { error: insertError } = await supabase
    .from('customer_prices')
    .insert({
      customer_id: customerId,
      product_id: productId,
      price,
      currency: 'DZD',
      valid_from: today,
    })

  if (insertError) return { error: insertError.message }

  revalidatePath('/admin')
  revalidatePath('/portal')
  return {}
}

export async function deleteCustomerPrice(
  customerId: string,
  productId: string
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('customer_prices')
    .delete()
    .eq('customer_id', customerId)
    .eq('product_id', productId)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/portal')
  return {}
}
