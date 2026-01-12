'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, TrendingUp, Users, Trophy, Sparkles, 
  BarChart3, PieChart, Activity, Calendar, Target,
  ArrowUp, ArrowDown, Minus, Loader2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface BadgeStats {
  id: string
  code: string
  name: string
  description: string
  icon: string
  category: string
  tier: string
  points: number
  rarity: string
  is_secret: boolean
  total_unlocked: number
  unlock_percentage: number
  recent_unlocks: number // Últimos 7 días
  trend: 'up' | 'down' | 'stable'
  first_unlock_date: string | null
  last_unlock_date: string | null
  avg_days_to_unlock: number
}

interface OverallStats {
  total_badges: number
  total_users: number
  total_unlocks: number
  avg_badges_per_user: number
  most_popular_badge: string
  rarest_badge: string
  completion_rate: number
}

export default function AdminBadgesPage() {
  const [loading, setLoading] = useState(true)
  const [badgesStats, setBadgesStats] = useState<BadgeStats[]>([])
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [sortBy, setSortBy] = useState<'popularity' | 'rarity' | 'recent'>('popularity')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    loadBadgeStats()
  }, [])

  const loadBadgeStats = async () => {
    try {
      const supabase = createClient()

      // 1. Obtener todos los badges con sus estadísticas
      const { data: badges } = await supabase
        .from('badges')
        .select('*')
        .order('category', { ascending: true })

      // 2. Obtener total de usuarios
      const { count: totalUsers } = await supabase
        .from('user_stats')
        .select('*', { count: 'exact', head: true })

      // 3. Para cada badge, obtener estadísticas detalladas
      const badgesWithStats = await Promise.all(
        (badges || []).map(async (badge: any) => {
          // Total desbloqueado
          const { count: totalUnlocked } = await supabase
            .from('user_badges')
            .select('*', { count: 'exact', head: true })
            .eq('badge_id', badge.id)
            .eq('is_unlocked', true)

          // Desbloqueos recientes (últimos 7 días)
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
          
          const { count: recentUnlocks } = await supabase
            .from('user_badges')
            .select('*', { count: 'exact', head: true })
            .eq('badge_id', badge.id)
            .eq('is_unlocked', true)
            .gte('earned_at', sevenDaysAgo.toISOString())

          // Desbloqueos de hace 14-7 días para calcular tendencia
          const fourteenDaysAgo = new Date()
          fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
          
          const { count: previousWeekUnlocks } = await supabase
            .from('user_badges')
            .select('*', { count: 'exact', head: true })
            .eq('badge_id', badge.id)
            .eq('is_unlocked', true)
            .gte('earned_at', fourteenDaysAgo.toISOString())
            .lt('earned_at', sevenDaysAgo.toISOString())

          // Calcular tendencia
          let trend: 'up' | 'down' | 'stable' = 'stable'
          if (recentUnlocks! > previousWeekUnlocks!) trend = 'up'
          else if (recentUnlocks! < previousWeekUnlocks!) trend = 'down'

          // Fechas de primer y último desbloqueo
          const { data: unlockDates } = await supabase
            .from('user_badges')
            .select('earned_at')
            .eq('badge_id', badge.id)
            .eq('is_unlocked', true)
            .order('earned_at', { ascending: true })
            .limit(1)

          const { data: lastUnlock } = await supabase
            .from('user_badges')
            .select('earned_at')
            .eq('badge_id', badge.id)
            .eq('is_unlocked', true)
            .order('earned_at', { ascending: false })
            .limit(1)

          const unlockPercentage = totalUsers! > 0 
            ? Math.round((totalUnlocked! / totalUsers!) * 100) 
            : 0

          return {
            ...badge,
            total_unlocked: totalUnlocked || 0,
            unlock_percentage: unlockPercentage,
            recent_unlocks: recentUnlocks || 0,
            trend,
            first_unlock_date: (unlockDates && unlockDates.length > 0) ? (unlockDates[0] as any).earned_at : null,
            last_unlock_date: (lastUnlock && lastUnlock.length > 0) ? (lastUnlock[0] as any).earned_at : null,
            avg_days_to_unlock: 0 // Podríamos calcular esto comparando con fecha de registro
          }
        })
      )

      // 4. Calcular estadísticas generales
      const totalUnlocks = badgesWithStats.reduce((sum, b) => sum + b.total_unlocked, 0)
      const avgBadgesPerUser = totalUsers! > 0 ? totalUnlocks / totalUsers! : 0
      
      const mostPopular = badgesWithStats.reduce((prev, curr) => 
        curr.total_unlocked > prev.total_unlocked ? curr : prev
      )
      
      const rarest = badgesWithStats
        .filter(b => !b.is_secret)
        .reduce((prev, curr) => 
          curr.total_unlocked < prev.total_unlocked ? curr : prev
        )

      const usersWithAllBadges = await supabase
        .from('user_stats')
        .select('total_badges')
        .eq('total_badges', badges?.length || 0)

      const completionRate = totalUsers! > 0 
        ? Math.round((usersWithAllBadges.data?.length || 0) / totalUsers! * 100)
        : 0

      setOverallStats({
        total_badges: badges?.length || 0,
        total_users: totalUsers || 0,
        total_unlocks: totalUnlocks,
        avg_badges_per_user: Math.round(avgBadgesPerUser * 10) / 10,
        most_popular_badge: mostPopular.name,
        rarest_badge: rarest.name,
        completion_rate: completionRate
      })

      setBadgesStats(badgesWithStats as BadgeStats[])
    } catch (error) {
      console.error('Error cargando estadísticas de badges:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filtrar y ordenar badges
  const filteredBadges = badgesStats
    .filter(b => filterCategory === 'all' || b.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'popularity') return b.total_unlocked - a.total_unlocked
      if (sortBy === 'rarity') return a.unlock_percentage - b.unlock_percentage
      if (sortBy === 'recent') return b.recent_unlocks - a.recent_unlocks
      return 0
    })

  const rarityColors: { [key: string]: string } = {
    common: 'bg-gray-500',
    rare: 'bg-blue-500',
    epic: 'bg-orange-500',
    legendary: 'bg-purple-500'
  }

  const categoryIcons: { [key: string]: string } = {
    progress: '🎯',
    courses: '📚',
    knowledge: '💡',
    time: '⏱️',
    special: '✨'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando estadísticas de badges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center mb-6"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Estadísticas de Badges</h1>
              <p className="text-white/90">Panel de administración y análisis</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overall Stats */}
      {overallStats && (
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center"
              >
                <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{overallStats.total_badges}</p>
                <p className="text-xs text-blue-700">Total Badges</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center"
              >
                <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{overallStats.total_users}</p>
                <p className="text-xs text-green-700">Usuarios Activos</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center"
              >
                <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">{overallStats.total_unlocks.toLocaleString()}</p>
                <p className="text-xs text-purple-700">Total Desbloqueos</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 text-center"
              >
                <BarChart3 className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-900">{overallStats.avg_badges_per_user}</p>
                <p className="text-xs text-amber-700">Media por Usuario</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-4 text-center"
              >
                <TrendingUp className="w-8 h-8 text-rose-600 mx-auto mb-2" />
                <p className="text-xl font-bold text-rose-900">{overallStats.completion_rate}%</p>
                <p className="text-xs text-rose-700">Completado Todo</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-4 text-center"
              >
                <Trophy className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-cyan-900 truncate">{overallStats.most_popular_badge}</p>
                <p className="text-xs text-cyan-700">Más Popular</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center"
              >
                <Target className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-900 truncate">{overallStats.rarest_badge}</p>
                <p className="text-xs text-gray-700">Más Raro</p>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
              >
                <option value="popularity">Más Popular</option>
                <option value="rarity">Más Raro</option>
                <option value="recent">Recientes (7 días)</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Categoría:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-forest focus:border-transparent"
              >
                <option value="all">Todas las categorías</option>
                <option value="progress">🎯 Progreso</option>
                <option value="courses">📚 Cursos</option>
                <option value="knowledge">💡 Conocimiento</option>
                <option value="time">⏱️ Racha</option>
                <option value="special">✨ Especiales</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Table */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Badge
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rareza
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Desbloqueos
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      % Usuarios
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Últimos 7 días
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tendencia
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Puntos
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Último Desbloqueo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBadges.map((badge, index) => (
                    <motion.tr
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{badge.icon}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">{badge.name}</p>
                              {badge.is_secret && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                                  SECRETO
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{categoryIcons[badge.category]} {badge.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white ${rarityColors[badge.rarity]}`}>
                          {badge.rarity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-lg font-bold text-gray-900">{badge.total_unlocked}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <p className="text-lg font-bold text-gray-900">{badge.unlock_percentage}%</p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-forest h-2 rounded-full transition-all"
                              style={{ width: `${badge.unlock_percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-lg font-semibold text-blue-600">{badge.recent_unlocks}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {badge.trend === 'up' && (
                          <div className="inline-flex items-center text-green-600">
                            <ArrowUp className="w-5 h-5" />
                          </div>
                        )}
                        {badge.trend === 'down' && (
                          <div className="inline-flex items-center text-red-600">
                            <ArrowDown className="w-5 h-5" />
                          </div>
                        )}
                        {badge.trend === 'stable' && (
                          <div className="inline-flex items-center text-gray-400">
                            <Minus className="w-5 h-5" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-sm font-semibold text-amber-600">+{badge.points}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {badge.last_unlock_date ? (
                          <p className="text-xs text-gray-600">
                            {new Date(badge.last_unlock_date).toLocaleDateString('es-ES', { 
                              day: 'numeric', 
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400">Nunca</p>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
