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
  
  if (error) {
    console.error('Error getting dashboard stats:', error)
    throw error
  }
  
  return data as DashboardStats
}

/**
 * Obtiene los usuarios más recientes
 */
export async function getRecentUsers(limit: number = 10): Promise<RecentUser[]> {
  const { data, error } = await (supabase as any).rpc('get_recent_users', {
    limit_count: limit
  })
  
  if (error) {
    console.error('Error getting recent users:', error)
    throw error
  }
  
  return data as RecentUser[]
}

/**
 * Obtiene las ventas más recientes
 */
export async function getRecentSales(limit: number = 10): Promise<RecentSale[]> {
  const { data, error } = await (supabase as any).rpc('get_recent_sales', {
    limit_count: limit
  })
  
  if (error) {
    console.error('Error getting recent sales:', error)
    throw error
  }
  
  return data as RecentSale[]
}

/**
 * Obtiene los contactos más recientes
 */
export async function getRecentContacts(limit: number = 10): Promise<RecentContact[]> {
  const { data, error } = await (supabase as any).rpc('get_recent_contacts', {
    limit_count: limit
  })
  
  if (error) {
    console.error('Error getting recent contacts:', error)
    throw error
  }
  
  return data as RecentContact[]
}

/**
 * Obtiene datos para la gráfica de ventas por mes
 */
export async function getSalesChartData(): Promise<SalesChartData[]> {
  const { data, error } = await (supabase as any).rpc('get_sales_chart_data')
  
  if (error) {
    console.error('Error getting sales chart data:', error)
    throw error
  }
  
  return data as SalesChartData[]
}

/**
 * Obtiene los cursos más vendidos
 */
export async function getTopSellingCourses(limit: number = 5): Promise<TopCourse[]> {
  const { data, error } = await (supabase as any).rpc('get_top_selling_courses', {
    limit_count: limit
  })
  
  if (error) {
    console.error('Error getting top selling courses:', error)
    throw error
  }
  
  return data as TopCourse[]
}

/**
 * Obtiene métricas de conversión
 */
export async function getConversionMetrics(): Promise<ConversionMetrics> {
  const { data, error } = await (supabase as any).rpc('get_conversion_metrics')
  
  if (error) {
    console.error('Error getting conversion metrics:', error)
    throw error
  }
  
  return data as ConversionMetrics
}
