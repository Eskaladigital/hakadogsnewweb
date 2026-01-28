import { supabase } from './client'
import type { Database } from '@/types/database.types'

// =====================================================
// TIPOS DE DATOS
// =====================================================

export interface User {
  id: string
  email: string
  name: string | null
  role: string
  created_at: string
  last_sign_in: string | null
  email_confirmed_at: string | null
}

export interface UserWithStats extends User {
  courses_purchased: number
  courses_completed: number
  total_spent: number
  avg_progress: number
}

export interface UserRole {
  id: string
  user_id: string
  role: 'admin' | 'user' | 'instructor'
  created_at: string
  updated_at: string
}

// =====================================================
// FUNCIONES DE USUARIOS
// =====================================================

/**
 * Obtiene todos los usuarios con su rol
 */
export async function getAllUsers(): Promise<User[]> {
  // Supabase Admin SDK necesitaría acceso privilegiado
  // Por ahora, usamos una función RPC que ya creamos
  const { data, error } = await (supabase as any).rpc('get_recent_users', {
    limit_count: 1000 // Límite alto para obtener todos
  })
  
  if (error) {
    console.warn('⚠️ Error getting all users:', error.message || error)
    return [] // Devolver array vacío en lugar de lanzar error
  }
  
  return (data || []) as User[]
}

/**
 * Obtiene un usuario por ID con estadísticas
 */
export async function getUserWithStats(userId: string): Promise<UserWithStats | null> {
  // Primero obtenemos el usuario básico
  const { data: userData, error: userError } = await (supabase as any)
    .from('user_roles')
    .select(`
      *,
      users:auth.users(id, email, raw_user_meta_data, created_at, last_sign_in_at)
    `)
    .eq('user_id', userId)
    .single()
  
  if (userError) {
    console.error('Error getting user:', userError)
    return null
  }
  
  // Obtenemos estadísticas de cursos
  const { data: coursesData } = await (supabase as any)
    .from('course_purchases')
    .select('price_paid')
    .eq('user_id', userId)
    .not('purchase_date', 'is', null)
  
  const { data: progressData } = await (supabase as any)
    .from('user_course_progress')
    .select('progress_percentage')
    .eq('user_id', userId)
  
  const coursesCompleted = progressData?.filter((p: any) => p.progress_percentage === 100).length || 0
  const avgProgress = progressData && progressData.length > 0
    ? progressData.reduce((acc: number, p: any) => acc + p.progress_percentage, 0) / progressData.length
    : 0
  const totalSpent = coursesData?.reduce((acc: number, c: any) => acc + (c.price_paid || 0), 0) || 0
  
  return {
    id: userId,
    email: (userData as any).users.email,
    name: (userData as any).users.raw_user_meta_data?.name || null,
    role: userData.role,
    created_at: (userData as any).users.created_at,
    last_sign_in: (userData as any).users.last_sign_in_at,
    email_confirmed_at: (userData as any).users.email_confirmed_at,
    courses_purchased: coursesData?.length || 0,
    courses_completed: coursesCompleted,
    total_spent: totalSpent,
    avg_progress: avgProgress
  }
}

/**
 * Obtiene el rol de un usuario
 */
export async function getUserRole(userId: string): Promise<string> {
  const { data, error } = await (supabase as any).rpc('get_user_role', {
    user_uuid: userId
  })
  
  if (error) {
    console.error('Error getting user role:', error)
    return 'user'
  }
  
  return data as string
}

/**
 * Verifica si un usuario es admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc('is_admin', {
    user_uuid: userId
  })
  
  if (error) {
    console.error('Error checking if user is admin:', error)
    return false
  }
  
  return data as boolean
}

/**
 * Actualiza el rol de un usuario (solo admin)
 * Usa la función SQL admin_update_user_role que actualiza tanto user_roles como metadata
 */
export async function updateUserRole(
  userId: string,
  newRole: 'admin' | 'user' | 'instructor'
): Promise<UserRole> {
  // Usar la función RPC que actualiza en ambos lugares
  const { data, error } = await (supabase as any).rpc('admin_update_user_role', {
    target_user_id: userId,
    new_role: newRole
  })
  
  if (error) {
    console.error('Error updating user role:', error)
    throw new Error(error.message || 'Error al actualizar el rol. Verifica que tienes permisos de administrador.')
  }
  
  // Verificar si la respuesta indica error
  if (data && data.success === false) {
    console.error('Error en la función:', data.error)
    throw new Error(data.message || data.error || 'Error al actualizar el rol')
  }
  
  // Retornar un objeto compatible con UserRole
  return {
    id: '',
    user_id: userId,
    role: newRole,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as UserRole
}

/**
 * Busca usuarios por email o nombre
 */
export async function searchUsers(query: string): Promise<User[]> {
  const { data, error } = await (supabase as any).rpc('get_recent_users', {
    limit_count: 1000
  })
  
  if (error) {
    console.error('Error searching users:', error)
    throw error
  }
  
  // Filtrar en el cliente
  const filtered = (data as User[]).filter(user =>
    user.email.toLowerCase().includes(query.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(query.toLowerCase()))
  )
  
  return filtered
}

/**
 * Obtiene usuarios por rol
 */
export async function getUsersByRole(role: string): Promise<User[]> {
  const allUsers = await getAllUsers()
  return allUsers.filter(user => user.role === role)
}

/**
 * Elimina un usuario (solo admin - requiere Service Role Key)
 * NOTA: Esta función requiere permisos especiales en Supabase
 */
export async function deleteUser(userId: string): Promise<void> {
  // Primero eliminamos el rol del usuario
  const { error: roleError } = await (supabase as any)
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
  
  if (roleError) {
    console.error('Error deleting user role:', roleError)
    throw roleError
  }
  
  // Para eliminar el usuario de auth.users necesitamos usar la Admin API
  // Esto debe hacerse desde el backend con Service Role Key
  // Por ahora solo eliminamos el rol y los datos relacionados
  
  // Eliminar datos del usuario de otras tablas
  await (supabase as any).from('user_courses').delete().eq('user_id', userId)
  await (supabase as any).from('user_course_progress').delete().eq('user_id', userId)
  
  console.warn('Usuario desvinculado de datos, pero aún existe en auth.users')
}

/**
 * Obtiene estadísticas de actividad de un usuario
 */
export async function getUserActivityStats(userId: string) {
  const { data: purchases } = await (supabase as any)
    .from('course_purchases')
    .select('purchase_date')
    .eq('user_id', userId)
    .not('purchase_date', 'is', null)
    .order('purchase_date', { ascending: false })
  
  const { data: progress } = await (supabase as any)
    .from('user_course_progress')
    .select('*')
    .eq('user_id', userId)
  
  const lastPurchase = purchases && purchases.length > 0 ? purchases[0].purchase_date : null
  const coursesInProgress = progress?.filter((p: any) => p.progress_percentage > 0 && p.progress_percentage < 100).length || 0
  
  return {
    total_purchases: purchases?.length || 0,
    last_purchase: lastPurchase,
    courses_in_progress: coursesInProgress,
    last_activity: progress && progress.length > 0 
      ? progress.reduce((latest: string, p: any) => 
          new Date(p.updated_at) > new Date(latest) ? p.updated_at : latest, 
          progress[0].updated_at
        )
      : null
  }
}
