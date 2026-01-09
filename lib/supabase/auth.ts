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
      // Mensaje personalizado según el tipo de error
      let errorMessage = error.message
      
      if (error.message.includes('Email not confirmed')) {
        errorMessage = '⚠️ Tu email aún no está confirmado. Revisa tu bandeja de entrada o contacta al administrador.'
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = '❌ Email o contraseña incorrectos. Verifica tus credenciales.'
      }
      
      return { data: null, error: { message: errorMessage } }
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
        emailRedirectTo: `${window.location.origin}/cursos/mi-escuela`,
      },
    })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    if (!data.user) {
      return { 
        data: null, 
        error: { message: 'Error al crear la cuenta' } 
      }
    }

    // Si el usuario fue creado pero no tiene sesión, necesita confirmar email
    if (!data.session) {
      return { 
        data: null, 
        error: { 
          message: '✅ Cuenta creada exitosamente. Por favor, verifica tu email para activarla. Si no ves el email, revisa tu carpeta de spam o contacta al administrador para confirmar tu cuenta manualmente.' 
        } 
      }
    }

    // Formatear la respuesta si hay sesión (login automático)
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
