'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BookOpen, ShoppingCart, Clock, CheckCircle, Lock, Award, TrendingUp, Play, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getSession } from '@/lib/supabase/auth'
import { getUserPurchases, getAllCourses, getUserCourseProgress } from '@/lib/supabase/courses'
import type { Course, UserCourseProgress } from '@/lib/supabase/courses'
import { getUserStats, getUserBadges } from '@/lib/supabase/gamification'
import UserStatsCard from '@/components/gamification/UserStatsCard'
import StreakCounter from '@/components/gamification/StreakCounter'
import BadgeCard from '@/components/gamification/BadgeCard'

interface CursoConProgreso extends Course {
  progress: number
  completedLessons: number
  isPurchased: boolean
}

export default function MiEscuelaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [cursosComprados, setCursosComprados] = useState<CursoConProgreso[]>([])
  const [cursosDisponibles, setCursosDisponibles] = useState<Course[]>([])
  const [stats, setStats] = useState({
    cursosCompletados: 0,
    cursosEnProgreso: 0,
    horasTotales: 0,
    progresoGeneral: 0
  })
  const [userStats, setUserStats] = useState<any>(null)
  const [recentBadges, setRecentBadges] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        // Verificar autenticación
        const { data: sessionData } = await getSession()
        if (!sessionData?.session) {
          router.push('/cursos/auth/login?redirect=/cursos/mi-escuela')
          return
        }

        const userId = sessionData.session.user.id
        setUserName(sessionData.session.user.user_metadata.name || sessionData.session.user.email.split('@')[0])

        // Cargar gamificación
        const [gamificationStats, badges] = await Promise.all([
          getUserStats(userId),
          getUserBadges(userId)
        ])
        setUserStats(gamificationStats)
        setRecentBadges(badges.slice(0, 6)) // Últimos 6 badges

        // Cargar todos los cursos
        const allCourses = await getAllCourses(false) // Solo publicados
        
        // Cargar cursos comprados
        const purchases = await getUserPurchases(userId)
        const purchasedCourseIds = new Set(purchases.map((p: any) => p.course_id))
        
        // Separar cursos: gratuitos y de pago
        const freeCourse = allCourses.find(c => c.is_free && c.is_published)
        const paidCourses = allCourses.filter(c => !c.is_free && c.is_published)
        
        // Cursos con progreso (gratuito + comprados)
        const cursosConProgreso: CursoConProgreso[] = []
        
        // SIEMPRE incluir el curso gratuito si existe
        if (freeCourse) {
          const progress = await getUserCourseProgress(userId, freeCourse.id)
          console.log('📊 Progreso curso gratuito:', {
            courseId: freeCourse.id,
            progress: progress
          })
          cursosConProgreso.push({
            ...freeCourse,
            progress: progress?.progress_percentage || 0,
            completedLessons: progress?.completed_lessons || 0,
            isPurchased: true
          })
        }
        
        // Agregar cursos comprados (de pago)
        for (const course of paidCourses) {
          if (purchasedCourseIds.has(course.id)) {
            const progress = await getUserCourseProgress(userId, course.id)
            console.log('📊 Progreso curso de pago:', {
              courseId: course.id,
              courseTitle: course.title,
              progress: progress
            })
            cursosConProgreso.push({
              ...course,
              progress: progress?.progress_percentage || 0,
              completedLessons: progress?.completed_lessons || 0,
              isPurchased: true
            })
          }
        }

        // Cursos disponibles para comprar (de pago que NO están comprados)
        const available = paidCourses.filter(course => 
          !purchasedCourseIds.has(course.id)
        )

        setCursosComprados(cursosConProgreso)
        setCursosDisponibles(available)

        // Calcular estadísticas
        const completados = cursosConProgreso.filter(c => c.progress === 100).length
        const enProgreso = cursosConProgreso.filter(c => c.progress > 0 && c.progress < 100).length
        const horasTotales = cursosConProgreso.reduce((acc, c) => acc + c.duration_minutes, 0)
        const progresoGeneral = cursosConProgreso.length > 0
          ? Math.round(cursosConProgreso.reduce((acc, c) => acc + c.progress, 0) / cursosConProgreso.length)
          : 0

        setStats({
          cursosCompletados: completados,
          cursosEnProgreso: enProgreso,
          horasTotales: Math.round(horasTotales / 60), // Convertir a horas
          progresoGeneral
        })

      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu escuela...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Header */}
      <section className="bg-gradient-to-r from-forest to-sage text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-full lg:max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Mi Escuela</h1>
                <p className="text-white/90">Bienvenido a tu panel de cursos</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-2xl font-bold">{stats.cursosCompletados}</span>
                </div>
                <p className="text-sm text-white/80">Cursos Completados</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-2xl font-bold">{stats.cursosEnProgreso}</span>
                </div>
                <p className="text-sm text-white/80">En Progreso</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6" />
                  <span className="text-2xl font-bold">{stats.horasTotales}</span>
                </div>
                <p className="text-sm text-white/80">Horas Totales</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-6 h-6" />
                  <span className="text-2xl font-bold">{stats.progresoGeneral}%</span>
                </div>
                <p className="text-sm text-white/80">Progreso General</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamificación Section */}
      {userStats && (
        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-full lg:max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* User Stats Card */}
                <div className="lg:col-span-2">
                  <UserStatsCard 
                    stats={userStats} 
                    userName={userName}
                    compact={false}
                  />
                </div>

                {/* Streak Counter */}
                <div>
                  <StreakCounter
                    currentStreak={userStats.current_streak_days}
                    longestStreak={userStats.longest_streak_days}
                    compact={false}
                    showMotivation={true}
                  />
                </div>
              </div>

              {/* Recent Badges */}
              {recentBadges.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <Award className="w-6 h-6 text-forest" />
                      <h3 className="text-2xl font-bold text-gray-900">Badges Recientes</h3>
                    </div>
                    <Link
                      href="/cursos/badges"
                      className="text-forest font-semibold hover:text-forest-dark transition flex items-center text-sm"
                    >
                      Ver todos
                      <Award className="w-4 h-4 ml-1" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {recentBadges.map((badge) => (
                      <BadgeCard
                        key={badge.id}
                        badge={{ ...badge, is_unlocked: true }}
                        size="md"
                      />
                    ))}
                  </div>

                  {recentBadges.length === 0 && (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Aún no tienes badges</p>
                      <p className="text-sm text-gray-400 mt-1">¡Completa lecciones para desbloquear logros!</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mis Cursos */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-full lg:max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Mis Cursos</h2>

            {cursosComprados.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Aún no tienes cursos
                </h3>
                <p className="text-gray-500 mb-6">
                  Explora nuestro catálogo y comienza tu aprendizaje
                </p>
                <Link
                  href="/cursos"
                  className="inline-block bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all"
                >
                  Ver Cursos Disponibles
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursosComprados.map((curso, index) => {
                  const difficultyColor = 
                    curso.difficulty === 'basico' ? 'bg-green-100 text-green-700' :
                    curso.difficulty === 'intermedio' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  
                  return (
                    <motion.div
                      key={curso.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100"
                    >
                      {/* Header con degradado suave */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor} capitalize`}>
                              {curso.difficulty}
                            </span>
                            {curso.is_free && (
                              <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-semibold">
                                GRATUITO
                              </span>
                            )}
                          </div>
                          {curso.progress === 100 && (
                            <span className="bg-forest/20 text-forest px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              COMPLETADO
                            </span>
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{curso.title}</h3>
                          <div 
                            className="text-gray-600 text-sm line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: curso.short_description || '' }}
                          />
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span className="font-medium">Progreso</span>
                            <span className="font-bold text-forest">{curso.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-forest to-sage rounded-full h-2 transition-all duration-500"
                              style={{ width: `${curso.progress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {curso.completedLessons}/{curso.total_lessons} lecciones
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {curso.duration_minutes} min
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-6 bg-white">
                        <Link
                          href={`/cursos/mi-escuela/${curso.slug}`}
                          className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all flex items-center justify-center whitespace-nowrap"
                        >
                          <Play className="w-5 h-5 mr-2 flex-shrink-0" />
                          {curso.progress === 0 ? 'Comenzar Curso' : curso.progress === 100 ? 'Revisar Curso' : 'Continuar Curso'}
                        </Link>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Cursos Disponibles */}
      {cursosDisponibles.length > 0 && (
        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-full lg:max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Cursos Disponibles</h2>
                  <p className="text-gray-600">Amplía tus conocimientos con más cursos específicos</p>
                </div>
                <Link
                  href="/cursos"
                  className="text-forest font-semibold hover:text-forest-dark transition flex items-center whitespace-nowrap"
                >
                  Ver todos
                  <ShoppingCart className="w-5 h-5 ml-2" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursosDisponibles.map((curso, index) => {
                  const difficultyColor = 
                    curso.difficulty === 'basico' ? 'bg-green-100 text-green-700' :
                    curso.difficulty === 'intermedio' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  
                  return (
                    <motion.div
                      key={curso.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100"
                    >
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative">
                        <div className="flex items-start justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColor} capitalize`}>
                            {curso.difficulty}
                          </span>
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{curso.title}</h3>
                          <div 
                            className="text-gray-600 text-sm line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: curso.short_description || '' }}
                          />
                        </div>
                        
                        {/* What you'll learn preview */}
                        {curso.what_you_learn && curso.what_you_learn.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Qué aprenderás:</p>
                            <ul className="space-y-1">
                              {curso.what_you_learn.slice(0, 2).map((item, idx) => (
                                <li key={idx} className="text-xs text-gray-600 flex items-start">
                                  <CheckCircle className="w-3 h-3 mr-1 mt-0.5 text-forest flex-shrink-0" />
                                  <span className="line-clamp-1">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {curso.duration_minutes} min
                          </span>
                          <span className="text-2xl font-bold text-gray-900">{curso.price.toFixed(2)}€</span>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-white">
                        <Link
                          href={`/cursos/comprar/${curso.slug}`}
                          className="w-full bg-gradient-to-r from-forest to-sage text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all flex items-center justify-center whitespace-nowrap"
                        >
                          <ShoppingCart className="w-5 h-5 mr-2 flex-shrink-0" />
                          Comprar Curso
                        </Link>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-full sm:max-w-4xl mx-auto bg-gradient-to-r from-forest to-sage rounded-2xl p-6 sm:p-8 md:p-12 text-white text-center">
            <Award className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              ¿Necesitas ayuda personalizada?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Si necesitas asesoramiento directo, consulta nuestros servicios de educación canina presencial.
            </p>
            <Link
              href="/servicios"
              className="inline-block bg-white text-forest font-bold py-3 px-8 rounded-lg hover:bg-white/90 transition-all"
            >
              Ver Servicios Presenciales
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
