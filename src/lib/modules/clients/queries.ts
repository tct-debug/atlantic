import { createClient } from '@/lib/supabase/server'
import type { Client } from './types'

export async function getClients(): Promise<Client[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, company_name, region, client_type, is_active, created_at')
    .eq('role', 'client')
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as Client[]
}
