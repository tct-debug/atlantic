'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CreateClientInput = {
  email: string
  password: string
  full_name: string
  company_name: string
}

export async function createNewClient(
  input: CreateClientInput
): Promise<{ error?: string }> {
  // Verify the caller is staff before using the admin key
  const supabase = await createSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Non autorisé.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'employee'].includes(profile.role)) {
    return { error: 'Non autorisé.' }
  }

  // Create the auth user (triggers profile auto-creation with role = 'client')
  const admin = createAdminClient()
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  })

  if (createError || !created.user) {
    return { error: createError?.message ?? 'Erreur lors de la création du compte.' }
  }

  // Update the auto-created profile with name and company
  const { error: updateError } = await admin
    .from('profiles')
    .update({
      full_name: input.full_name || null,
      company_name: input.company_name || null,
    })
    .eq('id', created.user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/admin')
  return {}
}
