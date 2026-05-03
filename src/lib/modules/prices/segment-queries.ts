import { createClient } from '@/lib/supabase/server'

export type SegmentPrice = {
  id: string
  product_id: string
  region: string | null
  client_type: string | null
  price: number
  currency: string
  effective_date: string
}

export async function getSegmentPrices(
  region?: string,
  clientType?: string
): Promise<SegmentPrice[]> {
  const supabase = await createClient()

  let query = supabase
    .from('segment_prices')
    .select('*')
    .order('effective_date', { ascending: false })

  if (region !== undefined && region !== '') {
    query = query.eq('region', region).is('client_type', null)
  } else if (clientType !== undefined && clientType !== '') {
    query = query.eq('client_type', clientType).is('region', null)
  }

  const { data, error } = await query
  if (error || !data) return []
  return data as SegmentPrice[]
}
