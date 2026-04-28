import { createClient } from '@supabase/supabase-js'

// Bypasses RLS — only call from trusted server code (Route Handlers, Server
// Actions). Never import this in client components or expose it publicly.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
