'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Trophy, Loader2, TrendingUp, Users, Award } from 'lucide-react'
import { getSession } from '@/lib/supabase/auth'
import { getLeaderboard } from '@/lib/supabase/gamification'
import Leaderboard from '@/components/gamification/Leaderboard'
import Link from 'next/link'

export default function LeaderboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState<any[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [period, setPeriod] = useState<'all_time' | 'this_month' | 'this_week'>('all_time')

  useEffect(() => {
    async function loadData() {
      try {
        const { data: sessionData } = await getSession()
        if (!sessionData?.session) {
          router.push('/cursos/auth/login?redirect=/cursos/leaderboard')
          return
        }

        const userId = sessionData.session.user.id
        setCurrentUserId(userId)

        // Cargar leaderboard
        const data = await getLeaderboard(50, period)
        setLeaderboardData(data)
      } catch (error) {
        console.error('Error cargando leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router, period])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando clasificación...</p>
        </div>
      </div>
    )
  }

  const periodLabels = {
    all_time: 'Todo el tiempo',
    this_month: 'Este mes',
    this_week: 'Esta semana'
  }

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
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Tabla de Clasificación</h1>
                <p className="text-white/90">Compite con otros estudiantes de Hakadogs</p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-4">
                <Users className="w-10 h-10" />
                <div>
                  <p className="text-2xl font-bold">{leaderboardData.length}</p>
                  <p className="text-sm text-white/80">Estudiantes Activos</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-4">
                <TrendingUp className="w-10 h-10" />
                <div>
                  <p className="text-2xl font-bold">
                    {leaderboardData[0]?.total_points.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-white/80">Puntos del Líder</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center space-x-4">
                <Award className="w-10 h-10" />
                <div>
                  <p className="text-2xl font-bold">
                    {leaderboardData[0]?.level || 0}
                  </p>
                  <p className="text-sm text-white/80">Nivel Máximo</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Period Filter */}
      <section className="py-6 bg-white border-b border-gray-200 sticky top-16 z-10 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Período</h3>
              <div className="flex space-x-2">
                {Object.entries(periodLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setPeriod(key as any)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      period === key
                        ? 'bg-forest text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <Leaderboard
              entries={leaderboardData}
              currentUserId={currentUserId}
              title={`Top ${leaderboardData.length} - ${periodLabels[period]}`}
              showTop={50}
            />
          </div>
        </div>
      </section>

      {/* Motivation Section */}
      <section className="py-12 bg-gradient-to-r from-forest to-sage">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Trophy className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              ¿Quieres subir en el ranking?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Completa más cursos, mantén tu racha activa y gana badges para acumular puntos
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/cursos/mi-escuela"
                className="bg-white text-forest font-bold py-3 px-8 rounded-lg hover:bg-white/90 transition-all"
              >
                Mis Cursos
              </Link>
              <Link
                href="/cursos/badges"
                className="bg-forest-dark text-white font-bold py-3 px-8 rounded-lg hover:bg-forest-dark/90 transition-all border-2 border-white"
              >
                Ver Badges
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              ¿Cómo funciona el ranking?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-forest" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Gana Puntos</h4>
                    <p className="text-sm text-gray-600">
                      Completa lecciones, cursos y desbloquea badges para acumular puntos de experiencia (XP).
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sage/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-sage" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Sube de Nivel</h4>
                    <p className="text-sm text-gray-600">
                      A medida que ganas XP, subirás de nivel. Cada nivel requiere más puntos que el anterior.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Compite</h4>
                    <p className="text-sm text-gray-600">
                      Tu posición en el ranking se basa en tus puntos totales. ¡Compite con otros estudiantes!
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Mantén tu Racha</h4>
                    <p className="text-sm text-gray-600">
                      Estudia todos los días para mantener tu racha activa y ganar badges especiales de constancia.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
