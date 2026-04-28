import { createClient } from '@/lib/supabase/server'
import type { Product } from './types'

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as Product[]
}
