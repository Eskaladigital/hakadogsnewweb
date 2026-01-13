'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Star, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Filter,
  ChevronDown,
  Eye,
  BookOpen,
  CheckCircle,
  XCircle,
  BarChart3,
  Award
} from 'lucide-react'
import { getSession } from '@/lib/supabase/auth'
import { getAllReviewsAdmin, getOverallReviewStats } from '@/lib/supabase/reviews'
import type { AdminReviewData } from '@/lib/supabase/reviews'
import { useRouter } from 'next/navigation'

export default function ValoracionesAdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState<AdminReviewData[]>([])
  const [filteredReviews, setFilteredReviews] = useState<AdminReviewData[]>([])
  const [stats, setStats] = useState({
    total_reviews: 0,
    avg_overall_rating: 0,
    courses_with_reviews: 0,
    high_engagement_reviews: 0,
    low_engagement_reviews: 0
  })
  
  const [filters, setFilters] = useState({
    course: 'all',
    engagement: 'all', // all, high (>=70), medium (30-69), low (<30)
    rating: 'all', // all, excellent (4-5), good (3-4), poor (1-3)
    sortBy: 'recent' // recent, rating_high, rating_low, engagement_high
  })

  useEffect(() => {
    checkAuthAndLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    applyFilters()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviews, filters])

  const checkAuthAndLoad = async () => {
    try {
      const { data } = await getSession()
      if (!data?.session) {
        router.push('/administrator')
        return
      }

      // Verificar rol admin desde user_metadata
      const role = data.session.user?.user_metadata?.role
      if (role !== 'admin') {
        router.push('/administrator')
        return
      }

      await loadData()
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/administrator')
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [reviewsData, statsData] = await Promise.all([
        getAllReviewsAdmin(),
        getOverallReviewStats()
      ])

      setReviews(reviewsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...reviews]

    // Filtro por curso
    if (filters.course !== 'all') {
      filtered = filtered.filter(r => r.course_id === filters.course)
    }

    // Filtro por engagement
    if (filters.engagement !== 'all') {
      if (filters.engagement === 'high') {
        filtered = filtered.filter(r => r.user_engagement_score >= 70)
      } else if (filters.engagement === 'medium') {
        filtered = filtered.filter(r => r.user_engagement_score >= 30 && r.user_engagement_score < 70)
      } else if (filters.engagement === 'low') {
        filtered = filtered.filter(r => r.user_engagement_score < 30)
      }
    }

    // Filtro por rating
    if (filters.rating !== 'all') {
      if (filters.rating === 'excellent') {
        filtered = filtered.filter(r => r.overall_rating >= 4)
      } else if (filters.rating === 'good') {
        filtered = filtered.filter(r => r.overall_rating >= 3 && r.overall_rating < 4)
      } else if (filters.rating === 'poor') {
        filtered = filtered.filter(r => r.overall_rating < 3)
      }
    }

    // Ordenar
    if (filters.sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (filters.sortBy === 'rating_high') {
      filtered.sort((a, b) => b.overall_rating - a.overall_rating)
    } else if (filters.sortBy === 'rating_low') {
      filtered.sort((a, b) => a.overall_rating - b.overall_rating)
    } else if (filters.sortBy === 'engagement_high') {
      filtered.sort((a, b) => b.user_engagement_score - a.user_engagement_score)
    }

    setFilteredReviews(filtered)
  }

  const uniqueCourses = Array.from(new Set(reviews.map(r => r.course_id))).map(id => {
    const review = reviews.find(r => r.course_id === id)
    return { id, title: review?.course_title || '' }
  })

  const getEngagementColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100'
    if (score >= 30) return 'text-amber-600 bg-amber-100'
    return 'text-red-600 bg-red-100'
  }

  const getEngagementLabel = (score: number) => {
    if (score >= 70) return 'Alta'
    if (score >= 30) return 'Media'
    return 'Baja'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Star className="w-12 h-12 animate-spin text-forest mx-auto mb-4" />
          <p className="text-gray-600">Cargando valoraciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Star className="w-8 h-8 text-gold fill-gold" />
          Valoraciones de Cursos
        </h1>
        <p className="text-gray-600">
          Analiza el feedback de los estudiantes para mejorar la calidad de los cursos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-forest">
          <div className="flex items-center justify-between mb-2">
            <MessageSquare className="w-8 h-8 text-forest" />
            <span className="text-3xl font-bold text-gray-900">{stats.total_reviews}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Total Valoraciones</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gold">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-8 h-8 text-gold fill-gold" />
            <span className="text-3xl font-bold text-gray-900">
              {stats.avg_overall_rating.toFixed(1)}
            </span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Rating Promedio</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <span className="text-3xl font-bold text-gray-900">{stats.courses_with_reviews}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Cursos Valorados</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-3xl font-bold text-gray-900">{stats.high_engagement_reviews}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Alto Engagement</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-8 h-8 text-red-500" />
            <span className="text-3xl font-bold text-gray-900">{stats.low_engagement_reviews}</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">Bajo Engagement</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por curso */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
            <select
              value={filters.course}
              onChange={(e) => setFilters({ ...filters, course: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-forest transition-colors"
            >
              <option value="all">Todos los cursos</option>
              {uniqueCourses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>

          {/* Filtro por engagement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Engagement</label>
            <select
              value={filters.engagement}
              onChange={(e) => setFilters({ ...filters, engagement: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-forest transition-colors"
            >
              <option value="all">Todos</option>
              <option value="high">Alto (≥70)</option>
              <option value="medium">Medio (30-69)</option>
              <option value="low">Bajo (&lt;30)</option>
            </select>
          </div>

          {/* Filtro por rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-forest transition-colors"
            >
              <option value="all">Todos</option>
              <option value="excellent">Excelente (4-5 ⭐)</option>
              <option value="good">Bueno (3-4 ⭐)</option>
              <option value="poor">Mejorable (&lt;3 ⭐)</option>
            </select>
          </div>

          {/* Ordenar por */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-lg p-2 focus:border-forest transition-colors"
            >
              <option value="recent">Más recientes</option>
              <option value="rating_high">Rating más alto</option>
              <option value="rating_low">Rating más bajo</option>
              <option value="engagement_high">Mayor engagement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Valoraciones */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Curso</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usuario</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Rating</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Dificultad</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Comprensión</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Duración</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Test</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Engagement</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Progreso</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                    <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p>No hay valoraciones con los filtros seleccionados</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.review_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{review.course_title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{review.user_email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        <span className="font-bold text-gray-900">
                          {review.overall_rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-600">{review.rating_difficulty}/5</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-600">{review.rating_comprehension}/5</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-600">{review.rating_duration}/5</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-600">{review.rating_test_difficulty}/5</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEngagementColor(review.user_engagement_score)}`}>
                        {review.user_engagement_score} - {getEngagementLabel(review.user_engagement_score)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <BookOpen className="w-3 h-3" />
                          {review.completed_lessons}/{review.total_lessons}
                        </div>
                        <div className="flex items-center justify-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {review.tests_passed}/{review.tests_attempted} tests
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('es-ES')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comentarios (si existen) */}
      {filteredReviews.filter(r => r.comment).length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-forest" />
            Comentarios de Estudiantes
          </h2>
          <div className="space-y-4">
            {filteredReviews.filter(r => r.comment).map((review) => (
              <div key={review.review_id} className="border-l-4 border-forest pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{review.course_title}</p>
                    <p className="text-sm text-gray-500">{review.user_email}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="font-bold text-gray-900">{review.overall_rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-gray-700 italic">&quot;{review.comment}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
