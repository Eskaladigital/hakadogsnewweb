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
      // Log detallado del error para debugging
      console.error('🔴 Error de Supabase Auth:', {
        message: error.message,
        status: error.status,
        name: error.name,
      })
      
      // Mensaje personalizado según el tipo de error
      let errorMessage = error.message
      
      if (error.message.includes('Email not confirmed') || error.status === 400) {
        errorMessage = '⚠️ Tu email aún no está confirmado. Por favor, confirma tu email o contacta al administrador para activar tu cuenta.'
      } else if (error.message.includes('Invalid login credentials')) {
        errorMessage = '❌ Email o contraseña incorrectos. Verifica tus credenciales.'
      } else if (error.status === 400) {
        errorMessage = `⚠️ Error de autenticación (${error.status}): ${error.message}. Verifica que tu usuario esté confirmado en Supabase.`
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
    console.error('🔴 Error inesperado en signIn:', err)
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

    // Intentar obtener el rol desde múltiples fuentes
    let role: 'admin' | 'user' = 'user'
    
    // 1. Primero desde user_metadata (lo más común)
    const userMetadataRole = data.session.user.user_metadata?.role
    if (userMetadataRole === 'admin') {
      role = 'admin'
      console.log('✅ Rol encontrado en user_metadata:', userMetadataRole)
    }
    
    // 2. Si no está, intentar desde app_metadata
    if (role === 'user') {
      const appMetadataRole = (data.session.user.app_metadata as any)?.role
      if (appMetadataRole === 'admin') {
        role = 'admin'
        console.log('✅ Rol encontrado en app_metadata:', appMetadataRole)
      }
    }
    
    // 3. Si aún no está, intentar leer directamente desde raw_user_meta_data usando una función SQL
    // Esto requiere que el usuario tenga permisos para ejecutar funciones
    if (role === 'user') {
      try {
        // Usar una función SQL que lea directamente desde auth.users
        // Nota: Esto requiere permisos especiales, pero es más confiable
        const { data: roleData, error: roleError } = await supabase.rpc('get_user_role', {
          user_id: data.session.user.id
        }).single()
        
        if (!roleError && roleData && roleData === 'admin') {
          role = 'admin'
          console.log('✅ Rol encontrado mediante función SQL:', roleData)
        }
      } catch (rpcErr) {
        // Si la función no existe, continuar
        console.log('Función get_user_role no disponible, usando metadatos')
      }
    }
    
    // 4. Último recurso: consultar la tabla profiles (si existe)
    if (role === 'user') {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single()
        
        if (!profileError && profileData && profileData.role === 'admin') {
          role = 'admin'
          console.log('✅ Rol encontrado en tabla profiles:', profileData.role)
        }
      } catch (profileErr) {
        // Si la tabla profiles no existe o hay error, continuar con el rol por defecto
        console.log('No se pudo consultar tabla profiles:', profileErr)
      }
    }

    // Log final para debugging
    if (role === 'user') {
      console.warn('⚠️ Rol no encontrado como admin, usando user por defecto')
      console.log('Metadatos disponibles:', {
        user_metadata: data.session.user.user_metadata,
        app_metadata: data.session.user.app_metadata,
        email: data.session.user.email
      })
    }

    // Formatear la respuesta
    const session: AuthSession = {
      user: {
        id: data.session.user.id,
        email: data.session.user.email || '',
        user_metadata: {
          name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0],
          role: role,
        },
      },
      access_token: data.session.access_token,
      expires_at: new Date(data.session.expires_at || '').getTime(),
    }

    return { data: { session }, error: null }
  } catch (err) {
    console.error('Error en getSession:', err)
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
