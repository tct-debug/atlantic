export type CustomerPrice = {
  id: string
  customer_id: string
  product_id: string
  price: number
  currency: string
  valid_from: string
  valid_until: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type CustomerPriceWithProduct = {
  id: string
  product_id: string
  product_name: string
  product_slug: string
  category: string
  unit: string
  price: number
  currency: string
  valid_from: string
  valid_until: string | null
}
