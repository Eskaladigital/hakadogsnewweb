'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, TrendingUp, DollarSign, ShoppingCart, Users,
  Calendar, BarChart3, Award, Download, Filter, ChevronDown,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { 
  getDashboardStats, 
  getRecentSales, 
  getSalesChartData, 
  getTopSellingCourses, 
  getConversionMetrics,
  type DashboardStats,
  type RecentSale,
  type SalesChartData,
  type TopCourse,
  type ConversionMetrics
} from '@/lib/supabase/dashboard'
import { supabase } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface DailySale {
  date: string
  count: number
  revenue: number
}

export default function VentasPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [salesData, setSalesData] = useState<SalesChartData[]>([])
  const [topCourses, setTopCourses] = useState<TopCourse[]>([])
  const [recentSales, setRecentSales] = useState<RecentSale[]>([])
  const [allSales, setAllSales] = useState<RecentSale[]>([])
  const [conversionMetrics, setConversionMetrics] = useState<ConversionMetrics | null>(null)
  const [dailySales, setDailySales] = useState<DailySale[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [showAllSales, setShowAllSales] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const results = await Promise.allSettled([
        getDashboardStats(),
        getSalesChartData(),
        getTopSellingCourses(10),
        getRecentSales(100), // Obtener más ventas para la tabla completa
        getConversionMetrics(),
        getDailySalesData()
      ])

      if (results[0].status === 'fulfilled') setStats(results[0].value)
      if (results[1].status === 'fulfilled') setSalesData(results[1].value)
      if (results[2].status === 'fulfilled') setTopCourses(results[2].value)
      if (results[3].status === 'fulfilled') {
        setAllSales(results[3].value)
        setRecentSales(results[3].value.slice(0, 10))
      }
      if (results[4].status === 'fulfilled') setConversionMetrics(results[4].value)
      if (results[5].status === 'fulfilled') setDailySales(results[5].value)

    } catch (error) {
      console.error('Error cargando datos de ventas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Obtener ventas diarias del último mes
  const getDailySalesData = async (): Promise<DailySale[]> => {
    try {
      // Obtener TODAS las compras sin filtrar por fecha
      const { data, error } = await supabase
        .from('course_purchases')
        .select('purchase_date, price_paid')
        .order('purchase_date', { ascending: true })

      if (error) {
        console.error('❌ Error ventas diarias:', error)
        return []
      }

      console.log('📊 Ventas para gráfico diario:', data?.length || 0, data)

      // Agrupar por día
      const grouped: { [key: string]: { count: number; revenue: number } } = {}
      
      // Inicializar todos los días del último mes
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const key = date.toISOString().split('T')[0]
        grouped[key] = { count: 0, revenue: 0 }
      }

      // Sumar ventas
      data?.forEach((sale: any) => {
        if (sale.purchase_date) {
          const key = sale.purchase_date.split('T')[0]
          if (grouped[key]) {
            grouped[key].count++
            grouped[key].revenue += sale.price_paid || 0
          }
        }
      })

      return Object.entries(grouped).map(([date, data]) => ({
        date,
        count: data.count,
        revenue: data.revenue
      }))
    } catch (error) {
      console.error('Error obteniendo ventas diarias:', error)
      return []
    }
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

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    })
  }

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
  }

  // Calcular estadísticas de tendencia
  const trendStats = useMemo(() => {
    if (salesData.length < 2) return { salesTrend: 0, revenueTrend: 0 }
    
    const lastMonth = salesData[salesData.length - 1]
    const prevMonth = salesData[salesData.length - 2]
    
    const salesTrend = prevMonth?.sales_count 
      ? ((lastMonth?.sales_count - prevMonth.sales_count) / prevMonth.sales_count) * 100 
      : 0
    const revenueTrend = prevMonth?.revenue 
      ? ((lastMonth?.revenue - prevMonth.revenue) / prevMonth.revenue) * 100 
      : 0

    return { salesTrend, revenueTrend }
  }, [salesData])

  // Calcular máximos para las barras
  const maxMonthlySales = Math.max(...salesData.map(d => d.sales_count), 1)
  const maxMonthlyRevenue = Math.max(...salesData.map(d => d.revenue), 1)
  const maxDailySales = Math.max(...dailySales.map(d => d.count), 1)
  const maxCourseRevenue = Math.max(...topCourses.map(c => c.revenue), 1)

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/administrator" 
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Análisis de Ventas</h1>
            <p className="text-gray-600">Estadísticas detalladas de ingresos y ventas</p>
          </div>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            {trendStats.revenueTrend !== 0 && (
              <div className={`flex items-center gap-1 text-sm font-semibold ${trendStats.revenueTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trendStats.revenueTrend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(trendStats.revenueTrend).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.sales.revenue_total.toFixed(2)}€</p>
          <p className="text-sm text-gray-500 mt-1">{stats?.sales.revenue_month.toFixed(2)}€ este mes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            {trendStats.salesTrend !== 0 && (
              <div className={`flex items-center gap-1 text-sm font-semibold ${trendStats.salesTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trendStats.salesTrend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(trendStats.salesTrend).toFixed(1)}%
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-1">Ventas Totales</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.sales.total}</p>
          <p className="text-sm text-gray-500 mt-1">{stats?.sales.this_month} este mes</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Tasa de Conversión</p>
          <p className="text-3xl font-bold text-gray-900">{conversionMetrics?.conversion_rate.toFixed(1)}%</p>
          <p className="text-sm text-gray-500 mt-1">{conversionMetrics?.users_with_purchases} de {conversionMetrics?.total_users} usuarios</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">Ticket Promedio</p>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.sales.total ? (stats.sales.revenue_total / stats.sales.total).toFixed(2) : '0.00'}€
          </p>
          <p className="text-sm text-gray-500 mt-1">{conversionMetrics?.avg_purchases_per_user.toFixed(1)} compras/usuario</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evolución Mensual de Ingresos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Ingresos por Mes</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          {salesData.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No hay datos de ventas disponibles</p>
          ) : (
            <div className="space-y-3">
              {salesData.slice(-12).map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-20 flex-shrink-0">{formatMonth(item.month)}</span>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg transition-all duration-500"
                      style={{ width: `${(item.revenue / maxMonthlyRevenue) * 100}%` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700">
                      {item.revenue.toFixed(0)}€
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Evolución Mensual de Ventas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Ventas por Mes</h3>
            <ShoppingCart className="w-5 h-5 text-gray-400" />
          </div>
          
          {salesData.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No hay datos de ventas disponibles</p>
          ) : (
            <div className="space-y-3">
              {salesData.slice(-12).map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-20 flex-shrink-0">{formatMonth(item.month)}</span>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-violet-400 rounded-lg transition-all duration-500"
                      style={{ width: `${(item.sales_count / maxMonthlySales) * 100}%` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700">
                      {item.sales_count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ventas Diarias - Últimos 30 días */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Ventas Diarias (Últimos 30 días)</h3>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        
        {dailySales.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No hay datos de ventas diarias disponibles</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex items-end gap-1 min-w-max h-40 px-2">
              {dailySales.map((day, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center group relative"
                  style={{ width: '28px' }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                      <p className="font-semibold">{formatShortDate(day.date)}</p>
                      <p>{day.count} ventas</p>
                      <p>{day.revenue.toFixed(2)}€</p>
                    </div>
                  </div>
                  
                  {/* Barra */}
                  <div 
                    className={`w-5 rounded-t transition-all duration-300 ${
                      day.count > 0 
                        ? 'bg-gradient-to-t from-forest to-sage hover:from-forest-dark hover:to-forest' 
                        : 'bg-gray-200'
                    }`}
                    style={{ 
                      height: day.count > 0 
                        ? `${Math.max((day.count / maxDailySales) * 120, 8)}px` 
                        : '4px'
                    }}
                  />
                  
                  {/* Día */}
                  {index % 5 === 0 && (
                    <span className="text-xs text-gray-400 mt-2 transform -rotate-45">
                      {new Date(day.date).getDate()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cursos más vendidos y métricas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cursos Más Vendidos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Cursos Más Vendidos</h3>
            <Award className="w-5 h-5 text-gray-400" />
          </div>
          
          {topCourses.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No hay datos de cursos vendidos</p>
          ) : (
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={course.course_id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${index === 0 ? 'bg-amber-100 text-amber-700' : 
                          index === 1 ? 'bg-gray-200 text-gray-700' : 
                          index === 2 ? 'bg-orange-100 text-orange-700' : 
                          'bg-gray-100 text-gray-600'}
                      `}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                        {course.title}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600">{course.revenue.toFixed(2)}€</span>
                      <span className="text-xs text-gray-500 ml-2">({course.sales_count} ventas)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        index === 0 ? 'bg-amber-400' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-orange-400' : 
                        'bg-forest/50'
                      }`}
                      style={{ width: `${(course.revenue / maxCourseRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen de Métricas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Resumen de Métricas</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-6">
            {/* Ingresos por periodo */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{stats?.sales.revenue_today.toFixed(2)}€</p>
                <p className="text-xs text-green-600 font-medium">Hoy</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{stats?.sales.revenue_month.toFixed(2)}€</p>
                <p className="text-xs text-blue-600 font-medium">Este Mes</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-700">{stats?.sales.revenue_total.toFixed(2)}€</p>
                <p className="text-xs text-purple-600 font-medium">Total</p>
              </div>
            </div>

            {/* Ventas por periodo */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Ventas por Periodo</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hoy</span>
                  <span className="font-semibold">{stats?.sales.today}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Esta semana</span>
                  <span className="font-semibold">{stats?.sales.this_week}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Este mes</span>
                  <span className="font-semibold">{stats?.sales.this_month}</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="font-bold text-lg">{stats?.sales.total}</span>
                </div>
              </div>
            </div>

            {/* Info de cursos */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Catálogo de Cursos</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Cursos de pago</span>
                  <span className="font-semibold">{stats?.courses.paid}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Cursos gratuitos</span>
                  <span className="font-semibold">{stats?.courses.free}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Todas las Ventas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Historial de Ventas</h3>
          <button
            onClick={() => setShowAllSales(!showAllSales)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-forest hover:bg-forest/5 rounded-lg transition"
          >
            {showAllSales ? 'Ver menos' : `Ver todas (${allSales.length})`}
            <ChevronDown className={`w-4 h-4 transition-transform ${showAllSales ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3 pl-2">Curso</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">Cliente</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">Email</th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3">Precio</th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider pb-3 pr-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {(showAllSales ? allSales : recentSales).length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-500">
                    No hay ventas registradas
                  </td>
                </tr>
              ) : (
                (showAllSales ? allSales : recentSales).map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="py-4 pl-2">
                      <span className="text-sm font-medium text-gray-900">{sale.course_title}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-gray-700">{sale.user_name || '-'}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-gray-600">{sale.user_email}</span>
                    </td>
                    <td className="py-4 text-right">
                      <span className="text-sm font-bold text-green-600">{sale.price_paid.toFixed(2)}€</span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <span className="text-sm text-gray-500">{formatDate(sale.purchase_date)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        {allSales.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Mostrando {showAllSales ? allSales.length : recentSales.length} de {allSales.length} ventas
            </span>
            <div className="text-right">
              <span className="text-sm text-gray-600 mr-2">Total ingresos:</span>
              <span className="text-xl font-bold text-green-600">
                {allSales.reduce((sum, sale) => sum + sale.price_paid, 0).toFixed(2)}€
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
