import { createClient } from '@/lib/supabase/server'
import type { CurrentPrice } from './types'

export async function getCurrentPrices(): Promise<CurrentPrice[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('current_prices')
    .select('*')

  if (error) throw new Error(error.message)
  return (data ?? []) as CurrentPrice[]
}
