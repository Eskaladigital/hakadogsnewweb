import { createClient } from './client'

export interface AuthSession {
  user: {
    id: string
    email: string
    user_metadata: {
      name?: string
      role?: 'admin' | 'user'
    }
  }
  access_token: string
  expires_at: number
}

// Iniciar sesión con Supabase
export const signIn = async (email: string, password: string) => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    if (!data.session || !data.user) {
      return { data: null, error: { message: 'No se pudo iniciar sesión' } }
    }

    // Formatear la respuesta para mantener compatibilidad
    const session: AuthSession = {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        user_metadata: {
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
          role: data.user.user_metadata?.role || 'user',
        },
      },
      access_token: data.session.access_token,
      expires_at: new Date(data.session.expires_at || '').getTime(),
    }

    return { data: session, error: null }
  } catch (err: any) {
    return { data: null, error: { message: err.message || 'Error al iniciar sesión' } }
  }
}

// Registrar nuevo usuario con Supabase
export const signUp = async (email: string, password: string, name: string) => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'user',
        },
      },
    })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    if (!data.session || !data.user) {
      return { 
        data: null, 
        error: { message: 'Registro exitoso. Por favor verifica tu email para activar tu cuenta.' } 
      }
    }

    // Formatear la respuesta
    const session: AuthSession = {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        user_metadata: {
          name: data.user.user_metadata?.name || name,
          role: data.user.user_metadata?.role || 'user',
        },
      },
      access_token: data.session.access_token,
      expires_at: new Date(data.session.expires_at || '').getTime(),
    }

    return { data: session, error: null }
  } catch (err: any) {
    return { data: null, error: { message: err.message || 'Error al registrarse' } }
  }
}

// Obtener sesión actual de Supabase
export const getSession = async () => {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error || !data.session) {
      return { data: { session: null }, error: null }
    }

    // Formatear la respuesta
    const session: AuthSession = {
      user: {
        id: data.session.user.id,
        email: data.session.user.email || '',
        user_metadata: {
          name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0],
          role: data.session.user.user_metadata?.role || 'user',
        },
      },
      access_token: data.session.access_token,
      expires_at: new Date(data.session.expires_at || '').getTime(),
    }

    return { data: { session }, error: null }
  } catch (err) {
    return { data: { session: null }, error: null }
  }
}

// Cerrar sesión de Supabase
export const signOut = async () => {
  const supabase = createClient()
  
  try {
    const { error } = await supabase.auth.signOut()
    return { error: error ? { message: error.message } : null }
  } catch (err: any) {
    return { error: { message: err.message || 'Error al cerrar sesión' } }
  }
}
