'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, BookOpen, Mail, TrendingUp, DollarSign, 
  CheckCircle, Clock, AlertCircle, Eye, ArrowRight, FileText,
  ClipboardCheck, Trophy, Star
} from 'lucide-react'
import { getDashboardStats, getRecentUsers, getRecentSales, getRecentContacts, type DashboardStats } from '@/lib/supabase/dashboard'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [recentSales, setRecentSales] = useState<any[]>([])
  const [recentContacts, setRecentContacts] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Ejecutar todas las llamadas en paralelo pero manejar errores individualmente
      const results = await Promise.allSettled([
        getDashboardStats(),
        getRecentUsers(5),
        getRecentSales(5),
        getRecentContacts(5)
      ])
      
      // Procesar resultados individualmente
      if (results[0].status === 'fulfilled') {
        setStats(results[0].value)
      } else {
        console.warn('⚠️ Error cargando estadísticas del dashboard:', results[0].reason)
      }
      
      if (results[1].status === 'fulfilled') {
        setRecentUsers(results[1].value)
      } else {
        console.warn('⚠️ Error cargando usuarios recientes:', results[1].reason)
      }
      
      if (results[2].status === 'fulfilled') {
        setRecentSales(results[2].value)
      } else {
        console.warn('⚠️ Error cargando ventas recientes:', results[2].reason)
      }
      
      if (results[3].status === 'fulfilled') {
        setRecentContacts(results[3].value)
      } else {
        console.warn('⚠️ Error cargando contactos recientes:', results[3].reason)
      }
      
      // Si al menos las estadísticas principales se cargaron, mostrar el dashboard
      if (results[0].status === 'fulfilled') {
        // Dashboard funcionando
      } else {
        console.error('❌ No se pudieron cargar las estadísticas principales del dashboard')
      }
    } catch (error) {
      console.error('Error crítico cargando dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Usuarios Totales',
      value: stats.users.total,
      change: `+${stats.users.today} hoy`,
      icon: Users,
      color: 'bg-blue-500',
      href: '/administrator/usuarios'
    },
    {
      title: 'Cursos Publicados',
      value: stats.courses.published,
      change: `${stats.courses.total} total`,
      icon: BookOpen,
      color: 'bg-green-500',
      href: '/administrator/cursos'
    },
    {
      title: 'Artículos del Blog',
      value: stats.blog.published_posts,
      change: `${stats.blog.total_posts} total`,
      icon: FileText,
      color: 'bg-indigo-500',
      href: '/administrator/blog'
    },
    {
      title: 'Ventas del Mes',
      value: stats.sales.this_month,
      change: `+${stats.sales.today} hoy`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      href: '/administrator/ventas'
    },
    {
      title: 'Ingresos del Mes',
      value: `${stats.sales.revenue_month.toFixed(2)}€`,
      change: `${stats.sales.revenue_total.toFixed(2)}€ total`,
      icon: DollarSign,
      color: 'bg-amber-500',
      href: '/administrator/ventas'
    },
    {
      title: 'Contactos Pendientes',
      value: stats.contacts.pending,
      change: `${stats.contacts.total} total`,
      icon: Mail,
      color: 'bg-red-500',
      href: '/administrator/contactos'
    },
    {
      title: 'Tests de Módulos',
      value: stats.tests?.total_tests || 0,
      change: `${stats.tests?.published_tests || 0} publicados`,
      icon: ClipboardCheck,
      color: 'bg-orange-500',
      href: '/administrator/tests'
    },
    {
      title: 'Intentos de Tests',
      value: stats.tests?.total_attempts || 0,
      change: `${stats.tests?.overall_pass_rate?.toFixed(1) || 0}% aprobados`,
      icon: Trophy,
      color: 'bg-teal-500',
      href: '/administrator/tests'
    },
    {
      title: 'Valoraciones',
      value: stats.reviews?.total_reviews || 0,
      change: `${stats.reviews?.avg_overall_rating?.toFixed(1) || 0} ⭐ promedio`,
      icon: Star,
      color: 'bg-gold',
      href: '/administrator/valoraciones'
    }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getContactStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-red-600 bg-red-50'
      case 'in_progress': return 'text-amber-600 bg-amber-50'
      case 'responded': return 'text-green-600 bg-green-50'
      case 'closed': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getContactStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'in_progress': return 'En Progreso'
      case 'responded': return 'Respondido'
      case 'closed': return 'Cerrado'
      default: return status
    }
  }

  return (
    <div className="space-y-8">
      {/* Tarjetas de Estadísticas */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas Generales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Link
                key={index}
                href={card.href}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                    <p className="text-sm text-gray-500">{card.change}</p>
                  </div>
                  <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-forest group-hover:text-forest-dark">
                  Ver detalles
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Sección de actividad reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usuarios Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Usuarios Recientes</h3>
            <Link href="/administrator/usuarios" className="text-sm text-forest hover:text-forest-dark font-semibold">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-4">
            {recentUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay usuarios recientes</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <span className={`
                      inline-block px-2 py-1 text-xs font-semibold rounded-full
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}
                    `}>
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(user.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Ventas Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Ventas Recientes</h3>
            <Link href="/administrator/ventas" className="text-sm text-forest hover:text-forest-dark font-semibold">
              Ver todos →
            </Link>
          </div>
          <div className="space-y-4">
            {recentSales.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay ventas recientes</p>
            ) : (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{sale.course_title}</p>
                    <p className="text-xs text-gray-500 truncate">{sale.user_name || sale.user_email}</p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-bold text-green-600">{sale.price_paid.toFixed(2)}€</p>
                    <p className="text-xs text-gray-500">{formatDate(sale.purchase_date)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Contactos Recientes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Contactos Recientes</h3>
          <Link href="/administrator/contactos" className="text-sm text-forest hover:text-forest-dark font-semibold">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">Nombre</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">Email</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">Asunto</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">Estado</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No hay contactos recientes
                  </td>
                </tr>
              ) : (
                recentContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-4 text-sm font-medium text-gray-900">{contact.name}</td>
                    <td className="py-4 text-sm text-gray-600 truncate max-w-xs">{contact.email}</td>
                    <td className="py-4 text-sm text-gray-600 truncate max-w-xs">
                      {contact.subject || 'Sin asunto'}
                    </td>
                    <td className="py-4">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getContactStatusColor(contact.status)}`}>
                        {getContactStatusLabel(contact.status)}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-500">{formatDate(contact.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
