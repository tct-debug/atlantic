export type Product = {
  id: string
  slug: string
  name: string
  category: string
  description: string | null
  unit: string
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}
