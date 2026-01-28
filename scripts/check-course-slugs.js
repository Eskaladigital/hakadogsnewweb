// Script para verificar los slugs de todos los cursos
// Ejecutar con: node scripts/check-course-slugs.js

const { createClient } = require('@supabase/supabase-js')

// Lee las variables desde el archivo .env.local manualmente
const fs = require('fs')
const path = require('path')

function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    const env = {}
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length) {
        env[key.trim()] = valueParts.join('=').trim()
      }
    })
    
    return env
  } catch (error) {
    console.error('❌ Error leyendo .env.local:', error.message)
    return {}
  }
}

const env = loadEnv()
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno SUPABASE')
  console.log('Buscando en:', path.join(__dirname, '..', '.env.local'))
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCourseSlugs() {
  console.log('🔍 Verificando slugs de cursos...\n')

  try {
    // Obtener TODOS los cursos (publicados y borradores)
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title, slug, is_published')
      .order('title', { ascending: true })

    if (error) {
      console.error('❌ Error al obtener cursos:', error)
      return
    }

    if (!courses || courses.length === 0) {
      console.log('⚠️ No hay cursos en la base de datos')
      return
    }

    console.log(`📚 Total de cursos: ${courses.length}\n`)
    console.log('─'.repeat(100))

    let publishedCount = 0
    let draftCount = 0

    courses.forEach((course, index) => {
      const status = course.is_published ? '✅ PUBLICADO' : '📝 BORRADOR'
      const url = `https://www.hakadogs.com/cursos/${course.slug}`
      
      if (course.is_published) {
        publishedCount++
      } else {
        draftCount++
      }

      console.log(`\n${index + 1}. ${course.title}`)
      console.log(`   Estado: ${status}`)
      console.log(`   Slug: ${course.slug}`)
      console.log(`   URL: ${url}`)
      
      // Verificar si el slug tiene caracteres problemáticos
      const hasSpaces = course.slug.includes(' ')
      const hasUppercase = course.slug !== course.slug.toLowerCase()
      const hasSpecialChars = /[^a-z0-9-]/.test(course.slug)
      
      if (hasSpaces || hasUppercase || hasSpecialChars) {
        console.log(`   ⚠️ PROBLEMA DETECTADO:`)
        if (hasSpaces) console.log(`      - Contiene espacios`)
        if (hasUppercase) console.log(`      - Contiene mayúsculas`)
        if (hasSpecialChars) console.log(`      - Contiene caracteres especiales`)
      }
    })

    console.log('\n' + '─'.repeat(100))
    console.log(`\n📊 RESUMEN:`)
    console.log(`   ✅ Publicados: ${publishedCount}`)
    console.log(`   📝 Borradores: ${draftCount}`)
    console.log(`   📚 Total: ${courses.length}`)

    // Buscar el curso específico que mencionó el usuario
    console.log('\n🔍 CURSO ESPECÍFICO: "Cómo Enseñar a tu Perro a No Mendigar Comida"')
    const targetCourse = courses.find(c => 
      c.title.toLowerCase().includes('mendigar') || 
      c.slug.includes('mendigar')
    )

    if (targetCourse) {
      console.log(`   ✅ ENCONTRADO:`)
      console.log(`   - Título: ${targetCourse.title}`)
      console.log(`   - Slug: ${targetCourse.slug}`)
      console.log(`   - Estado: ${targetCourse.is_published ? '✅ PUBLICADO' : '❌ BORRADOR (NO VISIBLE)'}`)
      console.log(`   - URL: https://www.hakadogs.com/cursos/${targetCourse.slug}`)
    } else {
      console.log(`   ❌ NO ENCONTRADO en la base de datos`)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkCourseSlugs()
