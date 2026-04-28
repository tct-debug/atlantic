export type ContactMessage = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  is_read: boolean
  created_at: string
}

export type ContactFormData = {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
}
