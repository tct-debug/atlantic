export type ClientType = 'gros' | 'detail' | 'supergros'

export type Client = {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  region: string | null
  client_type: ClientType | null
  is_active: boolean
  created_at: string
}
