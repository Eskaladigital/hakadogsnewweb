'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/supabase/auth'
import { getAllCourses, getAdminStats, deleteCourse, type Course } from '@/lib/supabase/courses'
import { BookOpen, TrendingUp, DollarSign, Users, Plus, Edit, Trash2, Eye } from 'lucide-react'

export default function AdministratorPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    totalSales: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await getSession()
      const session = data?.session
      
      if (!session || session.user?.user_metadata?.role !== 'admin') {
        router.push('/cursos/auth/login?redirect=/administrator')
      } else {
        setIsAdmin(true)
        loadData()
      }
    }
    
    checkAuth()
  }, [router])

  const loadData = async () => {
    try {
      const [coursesData, statsData] = await Promise.all([
        getAllCourses(true),
        getAdminStats()
      ])
      setCourses(coursesData)
      setStats(statsData)
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar el curso "${title}"? Esta acción no se puede deshacer.`)) {
      return
    }

    try {
      await deleteCourse(id)
      setCourses(courses.filter(c => c.id !== id))
      alert('Curso eliminado exitosamente')
      loadData()
    } catch (error) {
      console.error('Error eliminando curso:', error)
      alert('Error al eliminar el curso')
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    const badges = {
      basico: 'bg-green-100 text-green-700',
      intermedio: 'bg-yellow-100 text-yellow-700',
      avanzado: 'bg-red-100 text-red-700'
    }
    return badges[difficulty as keyof typeof badges] || badges.basico
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
            <p className="text-white/90">Gestión completa de cursos</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Actions */}
          <div className="mb-8 flex items-center justify-end">
            <Link
              href="/administrator/cursos/nuevo"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all flex items-center shadow-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Crear Nuevo Curso
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Total Cursos</p>
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
              <p className="text-sm text-gray-500 mt-1">{stats.publishedCourses} publicados</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Ventas Totales</p>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
              <p className="text-sm text-gray-500 mt-1">En la plataforma</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Ingresos</p>
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRevenue.toFixed(2)}€</p>
              <p className="text-sm text-gray-500 mt-1">
                {stats.totalSales > 0 ? `Promedio: ${(stats.totalRevenue / stats.totalSales).toFixed(2)}€` : 'Sin ventas aún'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600">Lecciones</p>
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {courses.reduce((sum, course) => sum + course.total_lessons, 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">En todos los cursos</p>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Cursos Creados ({courses.length})
              </h2>
            </div>
            
            {courses.length === 0 ? (
              <div className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay cursos creados
                </h3>
                <p className="text-gray-600 mb-6">
                  Crea tu primer curso para empezar a vender
                </p>
                <Link
                  href="/administrator/cursos/nuevo"
                  className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Primer Curso
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Curso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lecciones
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duración
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{course.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{course.title}</p>
                              <p className="text-xs text-gray-500">{course.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{course.total_lessons}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{course.duration_minutes} min</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {course.is_free ? 'Gratis' : `${course.price}€`}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              course.is_published 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {course.is_published ? 'Publicado' : 'Borrador'}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getDifficultyBadge(course.difficulty)
                            }`}>
                              {course.difficulty}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/cursos/mi-escuela/${course.id}`}
                              className="text-blue-600 hover:text-blue-800 p-2 transition"
                              title="Ver curso"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/administrator/cursos/editar/${course.id}`}
                              className="text-gray-600 hover:text-gray-800 p-2 transition"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(course.id, course.title)}
                              className="text-red-600 hover:text-red-800 p-2 transition"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
