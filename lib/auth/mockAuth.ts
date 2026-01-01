// Usuarios de prueba locales (sin Supabase)
export interface MockUser {
  id: string
  email: string
  password: string
  name: string
  role: 'admin' | 'user'
  created_at: string
}

// Base de datos de usuarios en memoria
export const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'narciso.pardo@outlook.com',
    password: 'Hacka2016@',
    name: 'Narciso Pardo',
    role: 'admin',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@hakadogs.com',
    password: 'Hacka2016@',
    name: 'Usuario Demo',
    role: 'user',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'admin@hakadogs.com',
    password: 'admin123',
    name: 'Admin Hakadogs',
    role: 'admin',
    created_at: new Date().toISOString(),
  },
]

// Autenticación local
export const authenticateLocal = (email: string, password: string) => {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  )
  
  if (user) {
    // Crear sesión en localStorage
    const session = {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          name: user.name,
          role: user.role,
        },
      },
      access_token: `mock-token-${user.id}`,
      expires_at: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('hakadogs_session', JSON.stringify(session))
    }
    
    return { data: session, error: null }
  }
  
  return { 
    data: null, 
    error: { message: 'Credenciales incorrectas' } 
  }
}

// Obtener sesión actual
export const getLocalSession = () => {
  if (typeof window === 'undefined') {
    return { data: { session: null }, error: null }
  }
  
  const sessionStr = localStorage.getItem('hakadogs_session')
  
  if (!sessionStr) {
    return { data: { session: null }, error: null }
  }
  
  try {
    const session = JSON.parse(sessionStr)
    
    // Verificar si la sesión ha expirado
    if (session.expires_at < Date.now()) {
      localStorage.removeItem('hakadogs_session')
      return { data: { session: null }, error: null }
    }
    
    return { data: { session }, error: null }
  } catch (e) {
    return { data: { session: null }, error: null }
  }
}

// Cerrar sesión
export const signOutLocal = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hakadogs_session')
  }
  return { error: null }
}

// Registrar nuevo usuario
export const registerLocal = (email: string, password: string, name: string) => {
  // Verificar si el usuario ya existe
  const existingUser = mockUsers.find((u) => u.email === email)
  
  if (existingUser) {
    return {
      data: null,
      error: { message: 'El email ya está registrado' },
    }
  }
  
  // Crear nuevo usuario
  const newUser: MockUser = {
    id: String(mockUsers.length + 1),
    email,
    password,
    name,
    role: 'user',
    created_at: new Date().toISOString(),
  }
  
  mockUsers.push(newUser)
  
  // Auto-login después de registro
  return authenticateLocal(email, password)
}

