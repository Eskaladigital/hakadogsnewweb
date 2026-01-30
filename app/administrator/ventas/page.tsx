'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, TrendingUp, DollarSign, ShoppingCart, Users,
  Calendar, Award, ChevronDown, CreditCard
} from 'lucide-react'
import { getDashboardStats, type DashboardStats } from '@/lib/supabase/dashboard'
import { supabase } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface Purchase {
  id: string
  course_id: string
  price_paid: number
  purchase_date: string
  payment_method: string
  course_title?: string
}

interface MonthlyStat {
  month: string
  count: number
  revenue: number
}

interface CourseStats {
  course_id: string
  title: string
  count: number
  revenue: number
}

export default function VentasPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [courses, setCourses] = useState<{[key: string]: string}>({})
  const [showAllSales, setShowAllSales] = useState(false)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      
      // Cargar stats generales
      const statsData = await getDashboardStats()
      setStats(statsData)

      // Cargar TODAS las compras directamente
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('course_purchases')
        .select('id, course_id, price_paid, purchase_date, payment_method')
        .order('purchase_date', { ascending: false })

      if (purchasesError) {
        console.error('Error cargando compras:', purchasesError)
      } else {
        console.log('✅ Compras cargadas:', purchasesData?.length || 0)
        const typedPurchases = (purchasesData || []) as Purchase[]
        setPurchases(typedPurchases)
        
        // Obtener IDs de cursos únicos
        const courseIds = [...new Set(typedPurchases.map(p => p.course_id))]
        
        if (courseIds.length > 0) {
          // Cargar títulos de cursos
          const { data: coursesData } = await supabase
            .from('courses')
            .select('id, title')
            .in('id', courseIds)
          
          const courseMap: {[key: string]: string} = {}
          ;(coursesData as any[])?.forEach((c: any) => { courseMap[c.id] = c.title })
          setCourses(courseMap)
          console.log('✅ Cursos cargados:', Object.keys(courseMap).length)
        }
      }
    } catch (error) {
      console.error('Error general:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular estadísticas mensuales desde purchases
  const monthlyStats: MonthlyStat[] = (() => {
    const grouped: { [key: string]: { count: number; revenue: number } } = {}
    
    // Inicializar últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      grouped[key] = { count: 0, revenue: 0 }
    }
    
    // Sumar compras
    purchases.forEach(p => {
      if (p.purchase_date) {
        const d = new Date(p.purchase_date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (grouped[key]) {
          grouped[key].count++
          grouped[key].revenue += p.price_paid || 0
        }
      }
    })
    
    return Object.entries(grouped).map(([month, data]) => ({
      month,
      count: data.count,
      revenue: data.revenue
    }))
  })()

  // Calcular ventas diarias (últimos 30 días)
  const dailyStats = (() => {
    const grouped: { [key: string]: { count: number; revenue: number } } = {}
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      grouped[key] = { count: 0, revenue: 0 }
    }
    
    purchases.forEach(p => {
      if (p.purchase_date) {
        // Manejar ambos formatos: "2026-01-30 08:07:38" y "2026-01-30T08:07:38"
        const key = p.purchase_date.split('T')[0].split(' ')[0]
        if (grouped[key]) {
          grouped[key].count++
          grouped[key].revenue += p.price_paid || 0
        }
      }
    })
    
    return Object.entries(grouped).map(([date, data]) => ({
      date,
      count: data.count,
      revenue: data.revenue
    }))
  })()

  // Calcular cursos más vendidos
  const topCourses: CourseStats[] = (() => {
    const grouped: { [key: string]: { count: number; revenue: number } } = {}
    
    purchases.forEach(p => {
      if (!grouped[p.course_id]) {
        grouped[p.course_id] = { count: 0, revenue: 0 }
      }
      grouped[p.course_id].count++
      grouped[p.course_id].revenue += p.price_paid || 0
    })
    
    return Object.entries(grouped)
      .map(([course_id, data]) => ({
        course_id,
        title: courses[course_id] || 'Curso',
        count: data.count,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
  })()

  // Totales
  const totalRevenue = purchases.reduce((sum, p) => sum + (p.price_paid || 0), 0)
  const totalSales = purchases.length
  const ticketPromedio = totalSales > 0 ? totalRevenue / totalSales : 0
  const maxMonthlyRevenue = Math.max(...monthlyStats.map(m => m.revenue), 1)
  const maxDailySales = Math.max(...dailyStats.map(d => d.count), 1)
  const maxCourseRevenue = Math.max(...topCourses.map(c => c.revenue), 1)

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/administrator" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis de Ventas</h1>
          <p className="text-gray-600">
            {totalSales} ventas · {totalRevenue.toFixed(2)}€ ingresos totales
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-600">Ingresos Totales</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalRevenue.toFixed(2)}€</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Ventas Totales</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalSales}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-100 w-10 h-10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm text-gray-600">Ticket Promedio</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{ticketPromedio.toFixed(2)}€</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Cursos Vendidos</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{topCourses.length}</p>
        </div>
      </div>

      {/* Gráfico de Evolución Mensual (ÚNICO) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Evolución de Ingresos (Últimos 12 meses)</h3>
        
        {monthlyStats.every(m => m.revenue === 0) ? (
          <p className="text-gray-500 text-center py-8">No hay ventas en los últimos 12 meses</p>
        ) : (
          <div className="space-y-3">
            {monthlyStats.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-16 flex-shrink-0">{formatMonth(item.month)}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-forest to-sage rounded-lg transition-all duration-500"
                    style={{ width: `${(item.revenue / maxMonthlyRevenue) * 100}%` }}
                  />
                  {item.revenue > 0 && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700">
                      {item.revenue.toFixed(0)}€ ({item.count})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ventas Diarias y Cursos Más Vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ventas Diarias */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Ventas Diarias (30 días)</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          {dailyStats.every(d => d.count === 0) ? (
            <p className="text-gray-500 text-center py-8">No hay ventas en los últimos 30 días</p>
          ) : (
            <div className="flex items-end gap-1 h-32">
              {dailyStats.map((day, index) => (
                <div 
                  key={index}
                  className="flex-1 flex flex-col items-center group relative"
                >
                  {/* Tooltip */}
                  {day.count > 0 && (
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                      <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {new Date(day.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}: {day.count} ({day.revenue.toFixed(0)}€)
                      </div>
                    </div>
                  )}
                  <div 
                    className={`w-full rounded-t transition-all ${day.count > 0 ? 'bg-forest hover:bg-forest-dark' : 'bg-gray-200'}`}
                    style={{ 
                      height: day.count > 0 ? `${Math.max((day.count / maxDailySales) * 100, 10)}%` : '4px'
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cursos Más Vendidos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Cursos Más Vendidos</h3>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          
          {topCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay cursos vendidos</p>
          ) : (
            <div className="space-y-4">
              {topCourses.slice(0, 5).map((course, index) => (
                <div key={course.course_id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${index === 0 ? 'bg-amber-100 text-amber-700' : 
                          index === 1 ? 'bg-gray-200 text-gray-700' : 
                          index === 2 ? 'bg-orange-100 text-orange-700' : 
                          'bg-gray-100 text-gray-600'}`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                        {course.title}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {course.revenue.toFixed(2)}€ <span className="text-gray-400 font-normal">({course.count})</span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        index === 0 ? 'bg-amber-400' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-400' : 'bg-forest/50'}`}
                      style={{ width: `${(course.revenue / maxCourseRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Historial de Ventas</h3>
          {purchases.length > 10 && (
            <button
              onClick={() => setShowAllSales(!showAllSales)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5 rounded-lg transition"
            >
              {showAllSales ? 'Ver menos' : `Ver todas (${purchases.length})`}
              <ChevronDown className={`w-4 h-4 transition-transform ${showAllSales ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase pb-3">Curso</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase pb-3">Método</th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase pb-3">Precio</th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase pb-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                (showAllSales ? purchases : purchases.slice(0, 10)).map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-3">
                      <span className="text-sm font-medium text-gray-900">
                        {courses[sale.course_id] || 'Curso'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        <CreditCard className="w-3 h-3" />
                        {sale.payment_method || 'stripe'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm font-bold text-green-600">{sale.price_paid?.toFixed(2)}€</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-sm text-gray-500">{formatDate(sale.purchase_date)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {purchases.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {showAllSales ? purchases.length : Math.min(10, purchases.length)} de {purchases.length} ventas
            </span>
            <span className="text-lg font-bold text-green-600">
              Total: {totalRevenue.toFixed(2)}€
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
