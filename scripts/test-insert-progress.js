/**
 * Script de Prueba de Inserción de Progreso
 * 
 * Este script simula la operación real de marcar una lección como completada
 * para verificar si las políticas RLS están correctamente configuradas.
 * 
 * USO: node scripts/test-insert-progress.js
 */

import { createClient } from '@supabase/supabase-js'
import readline from 'readline'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pfmqkioftagjnxqyrngk.supabase.co'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_ANON_KEY) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_ANON_KEY no encontrada')
  console.error('Ejecuta: Get-Content .env.local | Select-String "SUPABASE"')
  process.exit(1)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
}

async function testInsertProgress() {
  console.log(`\n${colors.bright}${colors.cyan}🧪 Test de Inserción de Progreso${colors.reset}\n`)
  
  // Paso 1: Crear cliente de Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  
  console.log(`${colors.blue}📝 Para probar la inserción, necesitas autenticarte${colors.reset}\n`)
  
  const email = await question('Ingresa tu email: ')
  const password = await question('Ingresa tu contraseña: ')
  
  console.log(`\n${colors.cyan}🔐 Autenticando...${colors.reset}`)
  
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password.trim()
  })
  
  if (authError) {
    console.log(`\n${colors.red}❌ Error de autenticación: ${authError.message}${colors.reset}`)
    rl.close()
    process.exit(1)
  }
  
  console.log(`${colors.green}✓ Autenticado como: ${authData.user.email}${colors.reset}`)
  const userId = authData.user.id
  
  // Paso 2: Obtener un curso
  console.log(`\n${colors.cyan}📚 Buscando cursos...${colors.reset}`)
  
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('id, title, slug')
    .eq('is_published', true)
    .limit(5)
  
  if (coursesError) {
    console.log(`\n${colors.red}❌ Error al obtener cursos: ${coursesError.message}${colors.reset}`)
    rl.close()
    process.exit(1)
  }
  
  if (!courses || courses.length === 0) {
    console.log(`\n${colors.yellow}⚠ No se encontraron cursos publicados${colors.reset}`)
    rl.close()
    process.exit(0)
  }
  
  console.log(`\n${colors.green}Cursos disponibles:${colors.reset}`)
  courses.forEach((course, idx) => {
    console.log(`  ${idx + 1}. ${course.title} (${course.slug})`)
  })
  
  const courseIdx = await question(`\nSelecciona un curso (1-${courses.length}): `)
  const selectedCourse = courses[parseInt(courseIdx) - 1]
  
  if (!selectedCourse) {
    console.log(`\n${colors.red}❌ Curso no válido${colors.reset}`)
    rl.close()
    process.exit(1)
  }
  
  console.log(`\n${colors.cyan}📖 Buscando lecciones del curso "${selectedCourse.title}"...${colors.reset}`)
  
  // Paso 3: Obtener lecciones del curso
  const { data: lessons, error: lessonsError } = await supabase
    .from('course_lessons')
    .select('id, title, slug')
    .eq('course_id', selectedCourse.id)
    .order('order_index', { ascending: true })
    .limit(10)
  
  if (lessonsError) {
    console.log(`\n${colors.red}❌ Error al obtener lecciones: ${lessonsError.message}${colors.reset}`)
    rl.close()
    process.exit(1)
  }
  
  if (!lessons || lessons.length === 0) {
    console.log(`\n${colors.yellow}⚠ El curso no tiene lecciones${colors.reset}`)
    rl.close()
    process.exit(0)
  }
  
  console.log(`\n${colors.green}Lecciones disponibles:${colors.reset}`)
  lessons.forEach((lesson, idx) => {
    console.log(`  ${idx + 1}. ${lesson.title} (${lesson.slug})`)
  })
  
  const lessonIdx = await question(`\nSelecciona una lección (1-${lessons.length}): `)
  const selectedLesson = lessons[parseInt(lessonIdx) - 1]
  
  if (!selectedLesson) {
    console.log(`\n${colors.red}❌ Lección no válida${colors.reset}`)
    rl.close()
    process.exit(1)
  }
  
  // Paso 4: Intentar marcar como completada
  console.log(`\n${colors.cyan}✅ Intentando marcar "${selectedLesson.title}" como completada...${colors.reset}`)
  
  const { data: progressData, error: progressError } = await supabase
    .from('user_lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: selectedLesson.id,
      completed: true,
      completed_at: new Date().toISOString()
    })
    .select()
    .single()
  
  if (progressError) {
    console.log(`\n${colors.red}${colors.bright}❌ ERROR: No se pudo marcar la lección como completada${colors.reset}`)
    console.log(`\n${colors.red}Código: ${progressError.code}${colors.reset}`)
    console.log(`${colors.red}Mensaje: ${progressError.message}${colors.reset}`)
    console.log(`${colors.red}Detalles: ${progressError.details}${colors.reset}`)
    
    if (progressError.code === '42501' || progressError.message.includes('permission')) {
      console.log(`\n${colors.yellow}${colors.bright}🔧 SOLUCIÓN NECESARIA:${colors.reset}`)
      console.log(`\n1. Ve a Supabase Dashboard → SQL Editor`)
      console.log(`2. Ejecuta el script: ${colors.cyan}supabase/fix_rls_policies.sql${colors.reset}`)
      console.log(`3. Vuelve a ejecutar este test\n`)
      console.log(`${colors.yellow}El problema es que las políticas RLS NO están configuradas correctamente.${colors.reset}`)
      console.log(`${colors.yellow}Las políticas permiten lectura pública pero NO permiten que usuarios autenticados${colors.reset}`)
      console.log(`${colors.yellow}inserten o actualicen su propio progreso.${colors.reset}\n`)
    }
    
    rl.close()
    process.exit(1)
  }
  
  // Paso 5: Verificar que se guardó
  console.log(`\n${colors.green}${colors.bright}✅ ¡ÉXITO! Lección marcada como completada${colors.reset}`)
  console.log(`\n${colors.green}Datos guardados:${colors.reset}`)
  console.log(`  ID: ${progressData.id}`)
  console.log(`  Usuario: ${progressData.user_id}`)
  console.log(`  Lección: ${progressData.lesson_id}`)
  console.log(`  Completada: ${progressData.completed}`)
  console.log(`  Fecha: ${progressData.completed_at}`)
  
  // Paso 6: Verificar que se puede leer
  console.log(`\n${colors.cyan}📖 Verificando que se puede leer el progreso...${colors.reset}`)
  
  const { data: readData, error: readError } = await supabase
    .from('user_lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', selectedLesson.id)
    .single()
  
  if (readError) {
    console.log(`\n${colors.red}❌ Error al leer el progreso: ${readError.message}${colors.reset}`)
  } else {
    console.log(`${colors.green}✓ Progreso leído correctamente${colors.reset}`)
  }
  
  // Resumen final
  console.log(`\n${colors.bright}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`)
  console.log(`${colors.green}${colors.bright}🎉 ¡Todo funciona correctamente!${colors.reset}\n`)
  console.log(`Las políticas RLS están correctamente configuradas.`)
  console.log(`Los usuarios pueden marcar lecciones como completadas sin problemas.\n`)
  
  rl.close()
  process.exit(0)
}

testInsertProgress().catch((error) => {
  console.error(`\n${colors.red}Error inesperado:${colors.reset}`, error.message)
  rl.close()
  process.exit(1)
})
