import { createClient } from '@/lib/supabase/server'
import type { CustomerPriceWithProduct } from './types'

export async function getCustomerPrices(customerId: string): Promise<CustomerPriceWithProduct[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('customer_prices')
    .select(`
      id,
      product_id,
      price,
      currency,
      valid_from,
      valid_until,
      products (
        name,
        slug,
        category,
        unit
      )
    `)
    .eq('customer_id', customerId)
    .is('valid_until', null)
    .order('valid_from', { ascending: false })

  if (error || !data) return []

  return (data as any[]).map((row) => ({
    id: row.id,
    product_id: row.product_id,
    product_name: row.products.name,
    product_slug: row.products.slug,
    category: row.products.category,
    unit: row.products.unit,
    price: row.price,
    currency: row.currency,
    valid_from: row.valid_from,
    valid_until: row.valid_until,
  }))
}

export async function getClientPricesForAdmin(customerId: string): Promise<CustomerPriceWithProduct[]> {
  return getCustomerPrices(customerId)
}
