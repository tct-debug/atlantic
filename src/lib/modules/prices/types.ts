export type DailyPrice = {
  id: string
  product_id: string
  price: number
  currency: string
  effective_date: string
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

// Shape returned by the current_prices view (latest price per product).
export type CurrentPrice = {
  product_id: string
  slug: string
  name: string
  category: string
  unit: string
  price: number
  currency: string
  effective_date: string
  updated_at: string
}
