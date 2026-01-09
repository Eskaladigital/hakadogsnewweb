import { supabase } from './client'

export interface Course {
  id: string
  title: string
  slug: string
  short_description: string | null
  description: string | null
  icon: string
  price: number
  duration_minutes: number
  difficulty: 'basico' | 'intermedio' | 'avanzado'
  thumbnail_url: string | null
  what_you_learn: string[]
  is_free: boolean
  is_published: boolean
  total_lessons: number
  order_index: number
  created_at: string
  updated_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  slug: string
  content: string | null
  order_index: number
  duration_minutes: number
  video_url: string | null
  video_provider: 'youtube' | 'vimeo' | 'self-hosted' | null
  is_free_preview: boolean
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  lesson_id: string
  title: string
  description: string | null
  file_type: string
  file_url: string
  file_size: number | null
  order_index: number
  created_at: string
}

export interface UserCourseProgress {
  id: string
  user_id: string
  course_id: string
  progress_percentage: number
  completed_lessons: number
  total_lessons: number
  completed: boolean
  completed_at: string | null
  last_accessed: string
  created_at: string
  updated_at: string
}

export interface CoursePurchase {
  id: string
  user_id: string
  course_id: string
  purchase_date: string
  price_paid: number
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string | null
  payment_id: string | null
}

// ===== COURSES =====

export async function getAllCourses(includeUnpublished = false) {
  let query = supabase
    .from('courses')
    .select('*')
    .order('order_index', { ascending: true })
  
  if (!includeUnpublished) {
    query = query.eq('is_published', true)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Course[]
}

export async function getCourseBySlug(slug: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as Course
}

export async function createCourse(courseData: Partial<Course>) {
  const { data, error } = await supabase
    .from('courses')
    // @ts-ignore
    .insert([courseData])
    .select()
    .single()

  if (error) throw error
  return data as Course
}

export async function updateCourse(id: string, courseData: Partial<Course>) {
  const { data, error } = await supabase
    .from('courses')
    // @ts-ignore
    .update({ ...courseData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Course
}

export async function deleteCourse(id: string) {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ===== LESSONS =====

export async function getCourseLessons(courseId: string) {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data as Lesson[]
}

export async function getLessonBySlug(courseId: string, lessonSlug: string) {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('slug', lessonSlug)
    .single()

  if (error) throw error
  return data as Lesson
}

export async function createLesson(lessonData: Partial<Lesson>) {
  const { data, error } = await supabase
    .from('course_lessons')
    // @ts-ignore
    .insert([lessonData])
    .select()
    .single()

  if (error) throw error
  return data as Lesson
}

export async function updateLesson(id: string, lessonData: Partial<Lesson>) {
  const { data, error } = await supabase
    .from('course_lessons')
    // @ts-ignore
    .update({ ...lessonData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Lesson
}

export async function deleteLesson(id: string) {
  const { error } = await supabase
    .from('course_lessons')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function bulkCreateLessons(lessons: Partial<Lesson>[]) {
  const { data, error } = await supabase
    .from('course_lessons')
    // @ts-ignore
    .insert(lessons)
    .select()

  if (error) throw error
  return data as Lesson[]
}

// ===== RESOURCES =====

export async function getLessonResources(lessonId: string) {
  const { data, error } = await supabase
    .from('course_resources')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data as Resource[]
}

export async function createResource(resourceData: Partial<Resource>) {
  const { data, error } = await supabase
    .from('course_resources')
    // @ts-ignore
    .insert([resourceData])
    .select()
    .single()

  if (error) throw error
  return data as Resource
}

export async function bulkCreateResources(resources: Partial<Resource>[]) {
  const { data, error } = await supabase
    .from('course_resources')
    // @ts-ignore
    .insert(resources)
    .select()

  if (error) throw error
  return data as Resource[]
}

// ===== USER PROGRESS =====

export async function getUserCourseProgress(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from('user_course_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No encontrado
    throw error
  }
  return data as UserCourseProgress
}

export async function getUserLessonProgress(userId: string, lessonId: string) {
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return data
}

export async function markLessonComplete(userId: string, lessonId: string) {
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateLessonPosition(userId: string, lessonId: string, positionSeconds: number) {
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      last_position_seconds: positionSeconds,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// ===== PURCHASES =====

export async function getUserPurchases(userId: string) {
  const { data, error } = await supabase
    .from('course_purchases')
    .select('*, courses(*)')
    .eq('user_id', userId)
    .order('purchase_date', { ascending: false })

  if (error) throw error
  return data
}

export async function hasPurchasedCourse(userId: string, courseId: string) {
  const { data, error } = await supabase
    .from('course_purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('payment_status', 'completed')
    .single()

  if (error) {
    if (error.code === 'PGRST116') return false
    throw error
  }
  return true
}

export async function createPurchase(purchaseData: Partial<CoursePurchase>) {
  const { data, error } = await supabase
    .from('course_purchases')
    // @ts-ignore
    .insert([purchaseData])
    .select()
    .single()

  if (error) throw error
  return data as CoursePurchase
}

// ===== ADMIN STATS =====

export async function getAdminStats() {
  const { data: courses } = await supabase
    .from('courses')
    .select('id, is_published')

  const { data: purchases } = await supabase
    .from('course_purchases')
    .select('price_paid, purchase_date')
    .eq('payment_status', 'completed')

  const totalCourses = courses?.length || 0
  const publishedCourses = courses?.filter(c => c.is_published).length || 0
  const totalSales = purchases?.length || 0
  const totalRevenue = purchases?.reduce((sum, p) => sum + p.price_paid, 0) || 0

  return {
    totalCourses,
    publishedCourses,
    totalSales,
    totalRevenue
  }
}
