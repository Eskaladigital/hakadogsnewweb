import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Singleton: crear una sola instancia del cliente
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

// Para uso en componentes del cliente
export const createClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseInstance
}

// Export default client
export const supabase = createClient()

// Alias para compatibilidad
export const createBrowserClient = createClient
