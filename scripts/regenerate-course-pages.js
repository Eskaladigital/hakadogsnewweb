// Script para forzar la regeneración de páginas de cursos
// Ejecutar con: node scripts/regenerate-course-pages.js

const { createClient } = require('@supabase/supabase-js')
const https = require('https')
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
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Función para hacer petición HTTP
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ status: res.statusCode, data }))
    }).on('error', reject)
  })
}

async function regenerateCoursePages() {
  console.log('🔄 Regenerando páginas de cursos publicados...\n')

  try {
    // Obtener solo cursos PUBLICADOS
    const { data: courses, error } = await supabase
      .from('courses')
      .select('slug, title')
      .eq('is_published', true)
      .order('title')

    if (error) {
      console.error('❌ Error:', error)
      return
    }

    if (!courses || courses.length === 0) {
      console.log('⚠️ No hay cursos publicados')
      return
    }

    console.log(`📚 Cursos publicados: ${courses.length}\n`)
    console.log('─'.repeat(80))

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i]
      const url = `https://www.hakadogs.com/cursos/${course.slug}`
      
      console.log(`\n${i + 1}/${courses.length}. ${course.title}`)
      console.log(`   🔗 ${url}`)
      console.log(`   ⏳ Regenerando...`)

      try {
        const result = await fetchPage(url)
        
        if (result.status === 200) {
          console.log(`   ✅ OK (${result.status})`)
        } else if (result.status === 404) {
          console.log(`   ⚠️ 404 - Página no encontrada (se generará en próxima visita)`)
        } else {
          console.log(`   ⚠️ Status: ${result.status}`)
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`)
      }

      // Pequeña pausa entre peticiones
      if (i < courses.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    console.log('\n' + '─'.repeat(80))
    console.log('\n✅ Proceso completado')
    console.log('\n💡 Las páginas ahora deberían estar generadas y accesibles.')
    console.log('   Si aún ves 404, espera 1-2 minutos y recarga la página.')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

regenerateCoursePages()
