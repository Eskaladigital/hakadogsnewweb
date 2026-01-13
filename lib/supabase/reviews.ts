import { supabase } from './client'

export interface CourseReview {
  id: string
  user_id: string
  course_id: string
  rating_difficulty: number
  rating_comprehension: number
  rating_duration: number
  rating_test_difficulty: number
  overall_rating: number
  comment: string | null
  user_engagement_score: number
  created_at: string
  updated_at: string
}

export interface CourseReviewStats {
  total_reviews: number
  avg_overall_rating: number
  avg_difficulty: number
  avg_comprehension: number
  avg_duration: number
  avg_test_difficulty: number
  rating_distribution: {
    '5': number
    '4': number
    '3': number
    '2': number
    '1': number
  }
}

export interface AdminReviewData {
  review_id: string
  course_id: string
  course_title: string
  user_id: string
  user_email: string
  overall_rating: number
  rating_difficulty: number
  rating_comprehension: number
  rating_duration: number
  rating_test_difficulty: number
  comment: string | null
  user_engagement_score: number
  completed_lessons: number
  total_lessons: number
  tests_attempted: number
  tests_passed: number
  created_at: string
}

// Obtener valoración del usuario para un curso
export async function getUserReview(userId: string, courseId: string): Promise<CourseReview | null> {
  const { data, error } = await supabase
    .from('course_reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No existe
    throw error
  }

  return data as CourseReview
}

// Crear o actualizar valoración
export async function upsertReview(review: {
  user_id: string
  course_id: string
  rating_difficulty: number
  rating_comprehension: number
  rating_duration: number
  rating_test_difficulty: number
  comment?: string
}): Promise<CourseReview> {
  const { data, error } = await (supabase as any)
    .from('course_reviews')
    .upsert({
      ...review,
      updated_at: new Date().toISOString()
    } as any)
    .select()
    .single()

  if (error) throw error
  return data as CourseReview
}

// Obtener estadísticas de un curso
export async function getCourseReviewStats(courseId: string): Promise<CourseReviewStats> {
  const { data, error } = await (supabase as any).rpc('get_course_review_stats', {
    p_course_id: courseId
  })

  if (error) {
    console.warn('Error getting course review stats:', error)
    return {
      total_reviews: 0,
      avg_overall_rating: 0,
      avg_difficulty: 0,
      avg_comprehension: 0,
      avg_duration: 0,
      avg_test_difficulty: 0,
      rating_distribution: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 }
    }
  }

  return data[0] as CourseReviewStats
}

// ADMIN: Obtener todas las valoraciones
export async function getAllReviewsAdmin(): Promise<AdminReviewData[]> {
  const { data, error } = await (supabase as any).rpc('get_all_reviews_admin')

  if (error) throw error
  return data as AdminReviewData[]
}

// ADMIN: Obtener estadísticas globales
export async function getOverallReviewStats() {
  const { data, error } = await (supabase as any).rpc('get_overall_review_stats')

  if (error) {
    console.warn('Error getting overall review stats:', error)
    return {
      total_reviews: 0,
      avg_overall_rating: 0,
      courses_with_reviews: 0,
      high_engagement_reviews: 0,
      low_engagement_reviews: 0
    }
  }

  return data[0]
}
