import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

type Badge = Database['public']['Tables']['badges']['Row']
type UserBadge = Database['public']['Tables']['user_badges']['Row']
type UserStats = Database['public']['Tables']['user_stats']['Row']
type BadgeProgress = Database['public']['Tables']['badge_progress']['Row']

// ============================================
// BADGES
// ============================================

/**
 * Obtener todos los badges disponibles
 */
export async function getAllBadges(): Promise<Badge[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('badges')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })

  if (error) {
    console.error('Error obteniendo badges:', error)
    return []
  }

  return data || []
}

/**
 * Obtener badges ganados por un usuario
 */
export async function getUserBadges(userId: string): Promise<(Badge & { earned_at: string })[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      earned_at,
      is_unlocked,
      is_featured,
      badges (*)
    `)
    .eq('user_id', userId)
    .order('earned_at', { ascending: false })

  if (error) {
    console.error('Error obteniendo badges del usuario:', error)
    return []
  }

  // Transformar los datos
  return (data || []).map((item: any) => ({
    ...item.badges,
    earned_at: item.earned_at,
    is_unlocked: item.is_unlocked
  }))
}

/**
 * Obtener badges con su estado de desbloqueo para un usuario
 */
export async function getBadgesWithUserProgress(userId: string): Promise<(Badge & { earned_at?: string; is_unlocked: boolean })[]> {
  const supabase = createClient()
  
  // Obtener todos los badges
  const allBadges = await getAllBadges()
  
  // Obtener badges del usuario
  const userBadges = await getUserBadges(userId)
  
  // Crear un mapa de badges del usuario
  const userBadgeMap = new Map(userBadges.map(ub => [ub.id, ub]))
  
  // Combinar datos
  return allBadges.map(badge => {
    const userBadge = userBadgeMap.get(badge.id)
    return {
      ...badge,
      earned_at: userBadge?.earned_at,
      is_unlocked: !!userBadge
    }
  })
}

/**
 * Otorgar un badge a un usuario manualmente
 */
export async function awardBadge(userId: string, badgeCode: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('award_badge', {
    p_user_id: userId,
    p_badge_code: badgeCode
  } as any)

  if (error) {
    console.error('Error otorgando badge:', error)
    return false
  }

  return data === true
}

// ============================================
// USER STATS
// ============================================

/**
 * Obtener estadísticas de un usuario
 */
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error obteniendo stats del usuario:', error)
    return null
  }

  return data
}

/**
 * Crear o actualizar estadísticas del usuario
 */
export async function upsertUserStats(userId: string, stats: Partial<Omit<UserStats, 'id' | 'user_id' | 'created_at'>>): Promise<UserStats | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_stats')
    .upsert({
      user_id: userId,
      ...stats,
      updated_at: new Date().toISOString()
    } as any)
    .select()
    .single()

  if (error) {
    console.error('Error actualizando stats:', error)
    return null
  }

  return data
}

/**
 * Calcular nivel del usuario
 */
export async function calculateUserLevel(userId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.rpc('calculate_user_level' as any, {
    p_user_id: userId
  } as any)

  if (error) {
    console.error('Error calculando nivel:', error)
  }
}

// ============================================
// LEADERBOARD
// ============================================

interface LeaderboardEntry {
  user_id: string
  full_name: string
  avatar_url: string | null
  total_points: number
  level: number
  total_badges: number
  courses_completed: number
  rank: number
}

/**
 * Obtener el leaderboard (tabla de clasificación)
 */
export async function getLeaderboard(
  limit: number = 10,
  period: 'all_time' | 'this_month' | 'this_week' = 'all_time'
): Promise<LeaderboardEntry[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase.rpc('get_leaderboard' as any, {
    p_limit: limit,
    p_period: period
  } as any)

  if (error) {
    console.error('Error obteniendo leaderboard:', error)
    return []
  }

  return data || []
}

/**
 * Obtener posición del usuario en el ranking
 */
export async function getUserRank(userId: string): Promise<number | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_stats')
    .select('user_id, total_points')
    .order('total_points', { ascending: false }) as any

  if (error) {
    console.error('Error obteniendo ranking:', error)
    return null
  }

  const userIndex = (data || []).findIndex((entry: any) => entry.user_id === userId)
  return userIndex >= 0 ? userIndex + 1 : null
}

// ============================================
// BADGE PROGRESS
// ============================================

/**
 * Obtener progreso hacia badges no desbloqueados
 */
export async function getBadgeProgress(userId: string): Promise<BadgeProgress[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('badge_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error obteniendo progreso de badges:', error)
    return []
  }

  return data || []
}

// ============================================
// ACHIEVEMENTS
// ============================================

/**
 * Obtener logros del usuario
 */
export async function getUserAchievements(userId: string, limit: number = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)
    .order('achieved_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error obteniendo achievements:', error)
    return []
  }

  return data || []
}

/**
 * Registrar un logro del usuario
 */
export async function recordAchievement(
  userId: string,
  achievementType: string,
  achievementData: any,
  pointsEarned: number = 0
) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_type: achievementType,
      achievement_data: achievementData,
      points_earned: pointsEarned,
      achieved_at: new Date().toISOString()
    } as any)

  if (error) {
    console.error('Error registrando achievement:', error)
    return false
  }

  return true
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Verificar si el usuario tiene un badge específico
 */
export async function userHasBadge(userId: string, badgeCode: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_badges')
    .select('id')
    .eq('user_id', userId)
    .eq('badge_id', (
      supabase
        .from('badges')
        .select('id')
        .eq('code', badgeCode)
        .single()
    ))
    .single()

  return !!data && !error
}

/**
 * Obtener resumen de gamificación del usuario
 */
export async function getGamificationSummary(userId: string) {
  const [stats, badges, achievements] = await Promise.all([
    getUserStats(userId),
    getUserBadges(userId),
    getUserAchievements(userId, 5)
  ])

  return {
    stats,
    badges,
    recentAchievements: achievements
  }
}

/**
 * Obtener badges destacados del usuario (featured)
 */
export async function getFeaturedBadges(userId: string, limit: number = 3): Promise<Badge[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_badges')
    .select(`
      badges (*)
    `)
    .eq('user_id', userId)
    .eq('is_featured', true)
    .limit(limit)

  if (error) {
    console.error('Error obteniendo badges destacados:', error)
    return []
  }

  return (data || []).map((item: any) => item.badges)
}

/**
 * Marcar/desmarcar un badge como destacado
 */
export async function toggleFeaturedBadge(userId: string, badgeId: string, featured: boolean): Promise<boolean> {
  try {
    const supabase = createClient()
    
    // @ts-expect-error - Tipos de Supabase no coinciden
    const result = await supabase.from('user_badges').update({ is_featured: featured }).eq('user_id', userId).eq('badge_id', badgeId)

    if (result.error) {
      console.error('Error actualizando badge destacado:', result.error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error actualizando badge destacado:', error)
    return false
  }
}
