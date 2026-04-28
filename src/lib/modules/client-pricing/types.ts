// Phase 2 placeholder — not yet implemented

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
