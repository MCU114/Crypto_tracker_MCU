import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseServerClient: SupabaseClient | null = null

export function getSupabaseServerClient(): SupabaseClient {
  if (supabaseServerClient) {
    return supabaseServerClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }

  supabaseServerClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseServerClient
}
