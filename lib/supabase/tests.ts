import { supabase } from './client'

// ===== INTERFACES =====

export interface TestQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number  // Índice de la respuesta correcta (0-based)
  explanation?: string
}

export interface ModuleTest {
  id: string
  module_id: string
  title: string
  description: string | null
  passing_score: number  // Porcentaje mínimo para aprobar (ej: 70)
  time_limit_minutes: number | null
  questions: TestQuestion[]
  is_generated: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface UserTestAttempt {
  id: string
  user_id: string
  test_id: string
  score: number
  passed: boolean
  answers: number[]  // Array de índices de respuestas seleccionadas
  time_spent_seconds: number | null
  completed_at: string
  created_at: string
}

export interface ModuleTestStatus {
  module_id: string
  has_test: boolean
  test_id: string | null
  is_published: boolean
  questions_count: number
  user_passed: boolean
  best_score: number | null
  attempts_count: number
}

// ===== FUNCIONES DE TESTS =====

/**
 * Obtiene el test de un módulo específico
 */
export async function getModuleTest(moduleId: string): Promise<ModuleTest | null> {
  const { data, error } = await supabase
    .from('module_tests')
    .select('*')
    .eq('module_id', moduleId)
    .eq('is_published', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error obteniendo test del módulo:', error)
    return null
  }

  return data as ModuleTest
}

/**
 * Obtiene el test de un módulo para admin (incluye no publicados)
 */
export async function getModuleTestAdmin(moduleId: string): Promise<ModuleTest | null> {
  const { data, error } = await supabase
    .from('module_tests')
    .select('*')
    .eq('module_id', moduleId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error obteniendo test del módulo (admin):', error)
    return null
  }

  return data as ModuleTest
}

/**
 * Verifica si un usuario ha aprobado el test de un módulo
 */
export async function hasUserPassedModuleTest(userId: string, moduleId: string): Promise<boolean> {
  // Primero obtener el test_id del módulo
  const test = await getModuleTest(moduleId)
  if (!test) return false

  const { data, error } = await supabase
    .from('user_test_attempts')
    .select('passed')
    .eq('user_id', userId)
    .eq('test_id', test.id)
    .eq('passed', true)
    .limit(1)

  if (error) {
    console.error('Error verificando si usuario aprobó test:', error)
    return false
  }

  return (data?.length || 0) > 0
}

/**
 * Obtiene el estado del test de múltiples módulos para un usuario
 */
export async function getModulesTestStatus(
  moduleIds: string[], 
  userId: string
): Promise<Record<string, ModuleTestStatus>> {
  if (moduleIds.length === 0) return {}

  // Obtener todos los tests de los módulos
  const { data: tests, error: testsError } = await supabase
    .from('module_tests')
    .select('id, module_id, is_published, questions')
    .in('module_id', moduleIds)

  if (testsError) {
    console.error('Error obteniendo tests de módulos:', testsError)
    return {}
  }

  const testIds = (tests || []).map((t: any) => t.id)
  
  // Obtener intentos del usuario para estos tests
  let attempts: any[] = []
  if (testIds.length > 0) {
    const { data: attemptsData, error: attemptsError } = await supabase
      .from('user_test_attempts')
      .select('test_id, score, passed')
      .eq('user_id', userId)
      .in('test_id', testIds)

    if (!attemptsError && attemptsData) {
      attempts = attemptsData
    }
  }

  // Construir mapa de estado
  const statusMap: Record<string, ModuleTestStatus> = {}

  for (const moduleId of moduleIds) {
    const test: any = tests?.find((t: any) => t.module_id === moduleId)
    const moduleAttempts = test 
      ? attempts.filter((a: any) => a.test_id === test.id)
      : []
    
    const passed = moduleAttempts.some((a: any) => a.passed)
    const scores = moduleAttempts.map((a: any) => a.score)
    const bestScore = scores.length > 0 ? Math.max(...scores) : null

    statusMap[moduleId] = {
      module_id: moduleId,
      has_test: !!test,
      test_id: test?.id || null,
      is_published: test?.is_published || false,
      questions_count: Array.isArray(test?.questions) ? test.questions.length : 0,
      user_passed: passed,
      best_score: bestScore,
      attempts_count: moduleAttempts.length
    }
  }

  return statusMap
}

/**
 * Obtiene los intentos de un usuario para un test específico
 */
export async function getUserTestAttempts(
  userId: string, 
  testId: string
): Promise<UserTestAttempt[]> {
  const { data, error } = await supabase
    .from('user_test_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('test_id', testId)
    .order('completed_at', { ascending: false })

  if (error) {
    console.error('Error obteniendo intentos del usuario:', error)
    return []
  }

  return data as UserTestAttempt[]
}

/**
 * Envía un intento de test
 */
export async function submitTestAttempt(
  userId: string,
  testId: string,
  answers: number[],
  timeSpentSeconds: number
): Promise<{ success: boolean; score: number; passed: boolean; error?: string }> {
  try {
    // Obtener el test para calcular la puntuación
    const { data: test, error: testError } = await supabase
      .from('module_tests')
      .select('questions, passing_score, module_id')
      .eq('id', testId)
      .single()

    if (testError || !test) {
      return { success: false, score: 0, passed: false, error: 'Test no encontrado' }
    }

    const testData: any = test
    const questions = testData.questions as TestQuestion[]
    
    // Calcular puntuación
    let correctAnswers = 0
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correct_answer) {
        correctAnswers++
      }
    }

    const score = Math.round((correctAnswers / questions.length) * 100)
    const passed = score >= testData.passing_score

    // Guardar el intento
    const { error: insertError } = await (supabase as any)
      .from('user_test_attempts')
      .insert({
        user_id: userId,
        test_id: testId,
        score,
        passed,
        answers,
        time_spent_seconds: timeSpentSeconds,
        completed_at: new Date().toISOString()
      })

    if (insertError) {
      console.error('Error guardando intento:', insertError)
      return { success: false, score, passed, error: 'Error guardando resultado' }
    }

    // Si aprobó, marcar todas las lecciones del módulo como completadas
    if (passed) {
      // El trigger en la BD debería hacer esto automáticamente,
      // pero lo hacemos también desde el cliente por si acaso
      await markModuleLessonsComplete(userId, testData.module_id)
    }

    return { success: true, score, passed }
  } catch (error) {
    console.error('Error en submitTestAttempt:', error)
    return { success: false, score: 0, passed: false, error: 'Error inesperado' }
  }
}

/**
 * Marca todas las lecciones de un módulo como completadas
 */
async function markModuleLessonsComplete(userId: string, moduleId: string): Promise<void> {
  try {
    // Obtener todas las lecciones del módulo
    const { data: lessons, error: lessonsError } = await supabase
      .from('course_lessons')
      .select('id')
      .eq('module_id', moduleId)

    if (lessonsError || !lessons) {
      console.error('Error obteniendo lecciones del módulo:', lessonsError)
      return
    }

    // Marcar cada lección como completada
    const upsertData = lessons.map((lesson: any) => ({
      user_id: userId,
      lesson_id: lesson.id,
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { error: upsertError } = await (supabase as any)
      .from('user_lesson_progress')
      .upsert(upsertData, { onConflict: 'user_id,lesson_id' })

    if (upsertError) {
      console.error('Error marcando lecciones como completadas:', upsertError)
    }
  } catch (error) {
    console.error('Error en markModuleLessonsComplete:', error)
  }
}

// ===== FUNCIONES ADMIN =====

/**
 * Crear o actualizar un test de módulo
 */
export async function upsertModuleTest(
  moduleId: string,
  testData: {
    title: string
    description?: string
    passing_score?: number
    time_limit_minutes?: number
    questions: TestQuestion[]
    is_generated?: boolean
    is_published?: boolean
  }
): Promise<ModuleTest | null> {
  const { data, error } = await (supabase as any)
    .from('module_tests')
    .upsert({
      module_id: moduleId,
      title: testData.title,
      description: testData.description || null,
      passing_score: testData.passing_score || 70,
      time_limit_minutes: testData.time_limit_minutes || null,
      questions: testData.questions,
      is_generated: testData.is_generated || false,
      is_published: testData.is_published ?? true,
      updated_at: new Date().toISOString()
    }, { onConflict: 'module_id' })
    .select()
    .single()

  if (error) {
    console.error('Error creando/actualizando test:', error)
    return null
  }

  return data as ModuleTest
}

/**
 * Publicar/despublicar un test
 */
export async function toggleTestPublished(testId: string, isPublished: boolean): Promise<boolean> {
  const { error } = await (supabase as any)
    .from('module_tests')
    .update({ is_published: isPublished, updated_at: new Date().toISOString() })
    .eq('id', testId)

  if (error) {
    console.error('Error cambiando estado de publicación:', error)
    return false
  }

  return true
}

/**
 * Eliminar un test de módulo
 */
export async function deleteModuleTest(testId: string): Promise<boolean> {
  const { error } = await (supabase as any)
    .from('module_tests')
    .delete()
    .eq('id', testId)

  if (error) {
    console.error('Error eliminando test:', error)
    return false
  }

  return true
}

/**
 * Obtener estadísticas de un test (para admin)
 */
export async function getTestStats(testId: string): Promise<{
  total_attempts: number
  unique_users: number
  pass_rate: number
  average_score: number
} | null> {
  const { data, error } = await supabase
    .from('user_test_attempts')
    .select('user_id, score, passed')
    .eq('test_id', testId)

  if (error) {
    console.error('Error obteniendo estadísticas del test:', error)
    return null
  }

  if (!data || data.length === 0) {
    return {
      total_attempts: 0,
      unique_users: 0,
      pass_rate: 0,
      average_score: 0
    }
  }

  const uniqueUsers = new Set(data.map((d: any) => d.user_id)).size
  const passedAttempts = data.filter((d: any) => d.passed).length
  const totalScore = data.reduce((sum: number, d: any) => sum + d.score, 0)

  return {
    total_attempts: data.length,
    unique_users: uniqueUsers,
    pass_rate: Math.round((passedAttempts / data.length) * 100),
    average_score: Math.round(totalScore / data.length)
  }
}
