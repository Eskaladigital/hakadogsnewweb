import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ ERROR: Variables de entorno de Supabase no configuradas')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ FALTA')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ FALTA')
  console.error('')
  console.error('📝 CONFIGURAR EN VERCEL:')
  console.error('1. Ve a Vercel Dashboard → Tu Proyecto → Settings → Environment Variables')
  console.error('2. Agrega NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.error('3. Obtén las credenciales de: https://supabase.com/dashboard → Settings → API')
}

// Singleton: crear una sola instancia del cliente
let supabaseInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Para uso en componentes del cliente
export const createClient = () => {
  if (!supabaseInstance) {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Variables de entorno de Supabase no configuradas. Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel.')
    }
    supabaseInstance = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // IMPORTANTE: Esto hace que el cliente use automáticamente el token
        // de la sesión del usuario en cada petición
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    })
  }
  return supabaseInstance
}

// Export default client
export const supabase = createClient()

// Alias para compatibilidad
export const createBrowserClient = createClient
