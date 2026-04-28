import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireStaff() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) redirect('/login')

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profileError || !profile || !['admin', 'employee'].includes(profile.role)) {
    redirect('/login')
  }

  return {
    user,
    role: profile.role as 'admin' | 'employee',
    name: profile.full_name as string | null,
  }
}
