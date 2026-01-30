import { supabase } from './client'

// =====================================================
// TIPOS DE DATOS
// =====================================================

export interface DashboardStats {
  users: {
    total: number
    today: number
    this_week: number
    this_month: number
    admins: number
  }
  courses: {
    total: number
    published: number
    draft: number
    free: number
    paid: number
  }
  sales: {
    total: number
    today: number
    this_week: number
    this_month: number
    revenue_total: number
    revenue_today: number
    revenue_month: number
  }
  contacts: {
    total: number
    pending: number
    in_progress: number
    responded: number
    today: number
    this_week: number
  }
  progress: {
    completed_courses: number
    in_progress: number
    avg_completion: number
  }
  blog: {
    total_posts: number
    published_posts: number
    draft_posts: number
    categories: number
    total_views: number
  }
  tests: {
    total_tests: number
    published_tests: number
    total_attempts: number
    unique_users_attempting: number
    overall_pass_rate: number
    overall_avg_score: number
  }
  reviews: {
    total_reviews: number
    avg_overall_rating: number
    courses_with_reviews: number
    high_engagement_reviews: number
    low_engagement_reviews: number
  }
}

export interface RecentUser {
  id: string
  email: string
  name: string | null
  role: string
  created_at: string
  last_sign_in: string | null
}

export interface RecentSale {
  id: string
  user_email: string
  user_name: string | null
  course_title: string
  price_paid: number
  purchase_date: string
}

export interface RecentContact {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  created_at: string
  hours_since_created: number
}

export interface SalesChartData {
  month: string
  sales_count: number
  revenue: number
}

export interface TopCourse {
  course_id: string
  title: string
  sales_count: number
  revenue: number
  avg_progress: number
}

export interface ConversionMetrics {
  total_users: number
  users_with_purchases: number
  conversion_rate: number
  avg_purchases_per_user: number
}

// =====================================================
// FUNCIONES DEL DASHBOARD
// =====================================================

/**
 * Obtiene todas las estadísticas principales del dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { data, error } = await (supabase as any).rpc('get_dashboard_stats')
  
  // Obtener estadísticas del blog por separado
  const [blogPostsResult, blogCategoriesResult] = await Promise.allSettled([
    supabase.from('blog_posts').select('id, status, views_count', { count: 'exact' }),
    supabase.from('blog_categories').select('id', { count: 'exact' })
  ])
  
  const blogStats = {
    total_posts: 0,
    published_posts: 0,
    draft_posts: 0,
    categories: 0,
    total_views: 0
  }
  
  if (blogPostsResult.status === 'fulfilled' && blogPostsResult.value.data) {
    const posts = blogPostsResult.value.data
    blogStats.total_posts = posts.length
    blogStats.published_posts = posts.filter((p: any) => p.status === 'published').length
    blogStats.draft_posts = posts.filter((p: any) => p.status === 'draft').length
    blogStats.total_views = posts.reduce((sum: number, p: any) => sum + (p.views_count || 0), 0)
  }
  
  if (blogCategoriesResult.status === 'fulfilled' && blogCategoriesResult.value.count !== null) {
    blogStats.categories = blogCategoriesResult.value.count
  }
  
  if (error) {
    console.warn('⚠️ Error getting dashboard stats:', error.message || error)
    // Devolver estadísticas por defecto en lugar de lanzar error
    return {
      users: { total: 0, today: 0, this_week: 0, this_month: 0, admins: 0 },
      courses: { total: 0, published: 0, draft: 0, free: 0, paid: 0 },
      sales: { total: 0, today: 0, this_week: 0, this_month: 0, revenue_total: 0, revenue_today: 0, revenue_month: 0 },
      contacts: { total: 0, pending: 0, in_progress: 0, responded: 0, today: 0, this_week: 0 },
      progress: { completed_courses: 0, in_progress: 0, avg_completion: 0 },
      tests: {
        total_tests: 0,
        published_tests: 0,
        total_attempts: 0,
        unique_users_attempting: 0,
        overall_pass_rate: 0,
        overall_avg_score: 0
      },
      reviews: {
        total_reviews: 0,
        avg_overall_rating: 0,
        courses_with_reviews: 0,
        high_engagement_reviews: 0,
        low_engagement_reviews: 0
      },
      blog: blogStats
    }
  }
  
  // Obtener estadísticas de tests y reviews
  const [testsStats, reviewsStats] = await Promise.all([
    getTestsStats(),
    getReviewsStats()
  ])
  
  return {
    ...data,
    blog: blogStats,
    tests: testsStats,
    reviews: reviewsStats
  } as DashboardStats
}

/**
 * Obtiene estadísticas de los tests de módulos usando la función RPC de Supabase
 */
async function getTestsStats() {
  const defaultStats = {
    total_tests: 0,
    published_tests: 0,
    total_attempts: 0,
    unique_users_attempting: 0,
    overall_pass_rate: 0,
    overall_avg_score: 0
  }

  try {
    const { data, error } = await (supabase as any).rpc('get_overall_test_stats')
    
    if (error) {
      console.warn('⚠️ Error obteniendo estadísticas de tests:', error)
      return defaultStats
    }

    // La función RPC devuelve un array con un solo objeto
    const stats = data?.[0]
    
    if (!stats) {
      return defaultStats
    }

    return {
      total_tests: stats.total_tests || 0,
      published_tests: stats.published_tests || 0,
      total_attempts: stats.total_attempts || 0,
      unique_users_attempting: stats.unique_users_attempting || 0,
      overall_pass_rate: parseFloat(stats.overall_pass_rate) || 0,
      overall_avg_score: parseFloat(stats.overall_avg_score) || 0
    }

  } catch (error) {
    console.error('Error obteniendo estadísticas de tests:', error)
    return defaultStats
  }
}

/**
 * Obtiene estadísticas de las valoraciones de cursos usando la función RPC de Supabase
 */
async function getReviewsStats() {
  const defaultStats = {
    total_reviews: 0,
    avg_overall_rating: 0,
    courses_with_reviews: 0,
    high_engagement_reviews: 0,
    low_engagement_reviews: 0
  }

  try {
    const { data, error } = await (supabase as any).rpc('get_overall_review_stats')
    
    if (error) {
      console.warn('⚠️ Error obteniendo estadísticas de reviews:', error)
      return defaultStats
    }

    // La función RPC devuelve un array con un solo objeto
    const stats = data?.[0]
    
    if (!stats) {
      return defaultStats
    }

    return {
      total_reviews: stats.total_reviews || 0,
      avg_overall_rating: parseFloat(stats.avg_overall_rating) || 0,
      courses_with_reviews: stats.courses_with_reviews || 0,
      high_engagement_reviews: stats.high_engagement_reviews || 0,
      low_engagement_reviews: stats.low_engagement_reviews || 0
    }

  } catch (error) {
    console.error('Error obteniendo estadísticas de reviews:', error)
    return defaultStats
  }
}

/**
 * Obtiene los usuarios más recientes
 */
export async function getRecentUsers(limit: number = 10): Promise<RecentUser[]> {
  const { data, error } = await (supabase as any).rpc('get_recent_users', {
    limit_count: limit
  })
  
  if (error) {
    console.warn('⚠️ Error getting recent users:', error.message || error)
    return [] // Devolver array vacío en lugar de lanzar error
  }
  
  return (data || []) as RecentUser[]
}

/**
 * Obtiene las ventas más recientes
 */
export async function getRecentSales(limit: number = 10): Promise<RecentSale[]> {
  try {
    // Consulta directa a course_purchases con join a courses y users
    const { data: purchases, error: purchasesError } = await supabase
      .from('course_purchases')
      .select(`
        id,
        user_id,
        course_id,
        price_paid,
        purchase_date,
        courses (
          title
        )
      `)
      .eq('payment_status', 'completed')
      .order('purchase_date', { ascending: false })
      .limit(limit)

    if (purchasesError) {
      console.warn('⚠️ Error getting purchases:', purchasesError.message)
      return []
    }

    if (!purchases || purchases.length === 0) {
      return []
    }

    // Obtener los user_ids únicos
    const userIds = [...new Set(purchases.map((p: any) => p.user_id))]
    
    // Obtener información de usuarios desde user_roles
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('user_id, email, name')
      .in('user_id', userIds)

    // Crear mapa de usuarios
    const userMap: { [key: string]: { email: string; name: string | null } } = {}
    userRoles?.forEach((ur: any) => {
      userMap[ur.user_id] = { email: ur.email || '', name: ur.name }
    })

    // Formatear resultados
    const recentSales: RecentSale[] = purchases.map((purchase: any) => {
      const user = userMap[purchase.user_id] || { email: 'Usuario desconocido', name: null }
      return {
        id: purchase.id,
        user_email: user.email,
        user_name: user.name,
        course_title: purchase.courses?.title || 'Curso desconocido',
        price_paid: purchase.price_paid || 0,
        purchase_date: purchase.purchase_date
      }
    })

    return recentSales
  } catch (error) {
    console.error('❌ Error en getRecentSales:', error)
    return []
  }
}

/**
 * Obtiene los contactos más recientes
 */
export async function getRecentContacts(limit: number = 10): Promise<RecentContact[]> {
  const { data, error } = await (supabase as any).rpc('get_recent_contacts', {
    limit_count: limit
  })
  
  if (error) {
    console.warn('⚠️ Error getting recent contacts:', error.message || error)
    return [] // Devolver array vacío en lugar de lanzar error
  }
  
  return (data || []) as RecentContact[]
}

/**
 * Obtiene datos para la gráfica de ventas por mes
 */
export async function getSalesChartData(): Promise<SalesChartData[]> {
  try {
    // Obtener todas las compras completadas de los últimos 12 meses
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
    
    const { data: purchases, error } = await supabase
      .from('course_purchases')
      .select('price_paid, purchase_date')
      .eq('payment_status', 'completed')
      .gte('purchase_date', twelveMonthsAgo.toISOString())
      .order('purchase_date', { ascending: true })

    if (error) {
      console.warn('⚠️ Error getting sales chart data:', error.message)
      return []
    }

    // Agrupar por mes
    const monthlyData: { [key: string]: { count: number; revenue: number } } = {}
    
    // Inicializar los últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthlyData[key] = { count: 0, revenue: 0 }
    }

    // Sumar ventas por mes
    purchases?.forEach((purchase: any) => {
      const date = new Date(purchase.purchase_date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (monthlyData[key]) {
        monthlyData[key].count++
        monthlyData[key].revenue += purchase.price_paid || 0
      }
    })

    // Convertir a array
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      sales_count: data.count,
      revenue: data.revenue
    }))
  } catch (error) {
    console.error('❌ Error en getSalesChartData:', error)
    return []
  }
}

/**
 * Obtiene los cursos más vendidos
 */
export async function getTopSellingCourses(limit: number = 5): Promise<TopCourse[]> {
  try {
    // Obtener todas las compras completadas agrupadas por curso
    const { data: purchases, error } = await supabase
      .from('course_purchases')
      .select(`
        course_id,
        price_paid,
        courses (
          id,
          title
        )
      `)
      .eq('payment_status', 'completed')

    if (error) {
      console.warn('⚠️ Error getting top selling courses:', error.message)
      return []
    }

    // Agrupar por curso
    const courseStats: { [key: string]: { title: string; sales_count: number; revenue: number } } = {}
    
    purchases?.forEach((purchase: any) => {
      const courseId = purchase.course_id
      const courseTitle = purchase.courses?.title || 'Curso desconocido'
      
      if (!courseStats[courseId]) {
        courseStats[courseId] = {
          title: courseTitle,
          sales_count: 0,
          revenue: 0
        }
      }
      courseStats[courseId].sales_count++
      courseStats[courseId].revenue += purchase.price_paid || 0
    })

    // Convertir a array y ordenar por ingresos
    const topCourses: TopCourse[] = Object.entries(courseStats)
      .map(([courseId, stats]) => ({
        course_id: courseId,
        title: stats.title,
        sales_count: stats.sales_count,
        revenue: stats.revenue,
        avg_progress: 0 // No tenemos esta info sin consulta adicional
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit)

    return topCourses
  } catch (error) {
    console.error('❌ Error en getTopSellingCourses:', error)
    return []
  }
}

/**
 * Obtiene métricas de conversión
 */
export async function getConversionMetrics(): Promise<ConversionMetrics> {
  try {
    // Obtener total de usuarios
    const { count: totalUsers, error: usersError } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })

    if (usersError) {
      console.warn('⚠️ Error getting users count:', usersError.message)
    }

    // Obtener compras completadas
    const { data: purchases, error: purchasesError } = await supabase
      .from('course_purchases')
      .select('user_id')
      .eq('payment_status', 'completed')

    if (purchasesError) {
      console.warn('⚠️ Error getting purchases:', purchasesError.message)
    }

    const total = totalUsers || 0
    const totalPurchases = purchases?.length || 0
    const uniqueBuyers = new Set(purchases?.map((p: any) => p.user_id)).size
    
    const conversionRate = total > 0 ? (uniqueBuyers / total) * 100 : 0
    const avgPurchases = uniqueBuyers > 0 ? totalPurchases / uniqueBuyers : 0

    return {
      total_users: total,
      users_with_purchases: uniqueBuyers,
      conversion_rate: conversionRate,
      avg_purchases_per_user: avgPurchases
    }
  } catch (error) {
    console.error('❌ Error en getConversionMetrics:', error)
    return {
      total_users: 0,
      users_with_purchases: 0,
      conversion_rate: 0,
      avg_purchases_per_user: 0
    }
  }
}
