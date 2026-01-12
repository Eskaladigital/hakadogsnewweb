'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Award, Loader2, Trophy, Filter } from 'lucide-react'
import { getSession } from '@/lib/supabase/auth'
import { getBadgesWithUserProgress, getUserStats } from '@/lib/supabase/gamification'
import BadgeGrid from '@/components/gamification/BadgeGrid'
import type { Database } from '@/types/database.types'

type Badge = Database['public']['Tables']['badges']['Row'] & { 
  earned_at?: string
  is_unlocked: boolean 
}

export default function BadgesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [badges, setBadges] = useState<Badge[]>([])
  const [filteredBadges, setFilteredBadges] = useState<Badge[]>([])
  const [userName, setUserName] = useState('')
  const [stats, setStats] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    async function loadData() {
      try {
        const { data: sessionData } = await getSession()
        if (!sessionData?.session) {
          router.push('/cursos/auth/login?redirect=/cursos/badges')
          return
        }

        const userId = sessionData.session.user.id
        setUserName(sessionData.session.user.user_metadata.name || sessionData.session.user.email.split('@')[0])

        // Cargar badges y stats
        const [badgesData, statsData] = await Promise.all([
          getBadgesWithUserProgress(userId),
          getUserStats(userId)
        ])

        setBadges(badgesData)
        setFilteredBadges(badgesData)
        setStats(statsData)
      } catch (error) {
        console.error('Error cargando badges:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  // Aplicar filtros
  useEffect(() => {
    let filtered = badges

    // Filtro por estado
    if (filter === 'unlocked') {
      filtered = filtered.filter(b => b.is_unlocked)
    } else if (filter === 'locked') {
      filtered = filtered.filter(b => !b.is_unlocked)
    }

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(b => b.category === categoryFilter)
    }

    setFilteredBadges(filtered)
  }, [filter, categoryFilter, badges])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando badges...</p>
        </div>
      </div>
    )
  }

  const categories = [
    { value: 'all', label: 'Todos', icon: '🏅' },
    { value: 'progress', label: 'Progreso', icon: '🎯' },
    { value: 'courses', label: 'Cursos', icon: '📚' },
    { value: 'knowledge', label: 'Conocimiento', icon: '💡' },
    { value: 'time', label: 'Tiempo', icon: '⏱️' },
    { value: 'special', label: 'Especiales', icon: '✨' }
  ]

  const unlockedCount = badges.filter(b => b.is_unlocked).length
  const totalCount = badges.length
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mb-6"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Galería de Badges</h1>
                <p className="text-white/90">
                  {unlockedCount} de {totalCount} badges desbloqueados ({completionPercentage}%)
                </p>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progreso Total</span>
                <span className="text-lg font-bold">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-4">
                <motion.div
                  className="bg-white rounded-full h-4"
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Quick Stats */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{stats.level}</p>
                  <p className="text-sm text-white/80">Nivel</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{stats.total_points.toLocaleString()}</p>
                  <p className="text-sm text-white/80">Puntos</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{badges.filter(b => b.is_unlocked && b.rarity === 'legendary').length}</p>
                  <p className="text-sm text-white/80">Legendarios</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold">{stats.current_streak_days}</p>
                  <p className="text-sm text-white/80">Racha 🔥</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-gray-200 bg-white sticky top-16 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Filtros</h3>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Estado */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === 'all'
                      ? 'bg-forest text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todos ({totalCount})
                </button>
                <button
                  onClick={() => setFilter('unlocked')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === 'unlocked'
                      ? 'bg-forest text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Desbloqueados ({unlockedCount})
                </button>
                <button
                  onClick={() => setFilter('locked')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === 'locked'
                      ? 'bg-forest text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Bloqueados ({totalCount - unlockedCount})
                </button>
              </div>

              {/* Categorías */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      categoryFilter === cat.value
                        ? 'bg-sage text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Información de ayuda */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">💡</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 text-lg mb-2">
                    ¿Cómo conseguir badges?
                  </h3>
                  <p className="text-blue-800 mb-3">
                    Pasa el cursor sobre cualquier badge para ver los requisitos exactos. Aquí tienes una guía rápida:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="font-semibold text-gray-900 mb-1">🎯 Progreso</p>
                      <p className="text-sm text-gray-600">Completa lecciones y cursos</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="font-semibold text-gray-900 mb-1">🔥 Racha</p>
                      <p className="text-sm text-gray-600">Estudia días consecutivos</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <p className="font-semibold text-gray-900 mb-1">✨ Especiales</p>
                      <p className="text-sm text-gray-600">Cumple retos únicos</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {filteredBadges.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No se encontraron badges con estos filtros</p>
              </div>
            ) : (
              <BadgeGrid 
                badges={filteredBadges}
                columns={5}
                size="md"
                showProgress={true}
              />
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-forest to-sage">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Trophy className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              ¿Quieres desbloquear más badges?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Completa más cursos y lecciones para ganar nuevos logros
            </p>
            <button
              onClick={() => router.push('/cursos/mi-escuela')}
              className="bg-white text-forest font-bold py-3 px-8 rounded-lg hover:bg-white/90 transition-all"
            >
              Ir a Mi Escuela
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
