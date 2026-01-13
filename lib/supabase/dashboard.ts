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
      blog: blogStats
    }
  }
  
  // Obtener estadísticas de tests
  const testsStats = await getTestsStats()
  
  return {
    ...data,
    blog: blogStats,
    tests: testsStats
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
  const { data, error } = await (supabase as any).rpc('get_recent_sales', {
    limit_count: limit
  })
  
  if (error) {
    console.warn('⚠️ Error getting recent sales:', error.message || error)
    return [] // Devolver array vacío en lugar de lanzar error
  }
  
  return (data || []) as RecentSale[]
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
  const { data, error } = await (supabase as any).rpc('get_sales_chart_data')
  
  if (error) {
    console.warn('⚠️ Error getting sales chart data:', error.message || error)
    return [] // Devolver array vacío en lugar de lanzar error
  }
  
  return (data || []) as SalesChartData[]
}

/**
 * Obtiene los cursos más vendidos
 */
export async function getTopSellingCourses(limit: number = 5): Promise<TopCourse[]> {
  const { data, error } = await (supabase as any).rpc('get_top_selling_courses', {
    limit_count: limit
  })
  
  if (error) {
    console.warn('⚠️ Error getting top selling courses:', error.message || error)
    return [] // Devolver array vacío en lugar de lanzar error
  }
  
  return (data || []) as TopCourse[]
}

/**
 * Obtiene métricas de conversión
 */
export async function getConversionMetrics(): Promise<ConversionMetrics> {
  const { data, error } = await (supabase as any).rpc('get_conversion_metrics')
  
  if (error) {
    console.warn('⚠️ Error getting conversion metrics:', error.message || error)
    // Devolver métricas por defecto
    return {
      total_users: 0,
      users_with_purchases: 0,
      conversion_rate: 0,
      avg_purchases_per_user: 0
    }
  }
  
  return data as ConversionMetrics
}
