'use client'

import { useEffect, useState } from 'react'
import { getLocalSession } from '@/lib/auth/mockAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Dog, Calendar, MessageCircle, Dumbbell, TrendingUp, FileText, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = () => {
      const { data } = getLocalSession()

      if (!data?.session) {
        router.push('/auth/login')
        return
      }

      const userRole = data.session.user.user_metadata?.role
      if (userRole !== 'admin') {
        router.push('/apps')
        return
      }

      setUser(data.session.user)
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-forest rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  // Datos mock para el dashboard
  const stats = {
    totalUsers: 45,
    totalDogs: 52,
    totalEvents: 8,
    totalMessages: 23,
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-dark to-forest text-white -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-white/90 mt-2">Bienvenido, {user?.user_metadata?.name || 'Admin'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Usuarios</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4">↑ +3 este mes</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Perros</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDogs}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Dog className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-4">↑ +5 este mes</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Eventos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalEvents}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">2 próximos</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Mensajes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMessages}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-red-600 mt-4">5 sin leer</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/usuarios"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Gestión de Usuarios</h3>
            <p className="text-gray-600 text-sm mt-2">
              Ver, editar y gestionar usuarios del sistema
            </p>
          </Link>

          <Link
            href="/admin/ejercicios"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-orange-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Ejercicios</h3>
            <p className="text-gray-600 text-sm mt-2">
              Crear y editar ejercicios de adiestramiento
            </p>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-md opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Próximamente</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Eventos</h3>
            <p className="text-gray-600 text-sm mt-2">
              Gestionar eventos y quedadas caninas
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Próximamente</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Mensajes</h3>
            <p className="text-gray-600 text-sm mt-2">
              Ver y responder mensajes de clientes
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Próximamente</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Estadísticas</h3>
            <p className="text-gray-600 text-sm mt-2">
              Análisis y reportes del negocio
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Próximamente</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Contenido</h3>
            <p className="text-gray-600 text-sm mt-2">
              Gestionar blog y recursos educativos
            </p>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-2">👋 Panel de Administración</h3>
          <p className="text-blue-800">
            Este es el panel de administración de Hakadogs. Desde aquí puedes gestionar usuarios, 
            ejercicios y todo el contenido del sistema. Las secciones marcadas como &quot;Próximamente&quot; 
            estarán disponibles en futuras actualizaciones.
          </p>
        </div>
      </div>
    </div>
  )
}
