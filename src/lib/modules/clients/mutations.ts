'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ClientType } from './types'

export type CreateClientInput = {
  email: string
  password: string
  full_name: string
  company_name: string
  region: string
  client_type: ClientType | ''
}

export async function createNewClient(
  input: CreateClientInput
): Promise<{ error?: string }> {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'employee'].includes(profile.role)) {
    return { error: 'Non autorisé.' }
  }

  const admin = createAdminClient()
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  })

  if (createError || !created.user) {
    return { error: createError?.message ?? 'Erreur lors de la création du compte.' }
  }

  const { error: updateError } = await admin
    .from('profiles')
    .update({
      full_name: input.full_name || null,
      company_name: input.company_name || null,
      region: input.region || null,
      client_type: input.client_type || null,
    })
    .eq('id', created.user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/admin')
  return {}
}

export async function updateClientProfile(
  clientId: string,
  updates: { region?: string; client_type?: ClientType | '' }
): Promise<{ error?: string }> {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'employee'].includes(profile.role)) {
    return { error: 'Non autorisé.' }
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('profiles')
    .update({
      region: updates.region || null,
      client_type: updates.client_type || null,
    })
    .eq('id', clientId)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  return {}
}
