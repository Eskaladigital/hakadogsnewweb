// Script para verificar qué cursos tienen imagen de portada
// Ejecutar con: node scripts/check-course-images.js

const { createClient } = require('@supabase/supabase-js')
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

async function checkCourseImages() {
  console.log('🖼️  Verificando imágenes de portada de cursos...\n')

  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title, slug, is_published, cover_image_url')
      .order('title', { ascending: true })

    if (error) {
      console.error('❌ Error:', error)
      return
    }

    if (!courses || courses.length === 0) {
      console.log('⚠️ No hay cursos en la base de datos')
      return
    }

    console.log(`📚 Total de cursos: ${courses.length}\n`)
    console.log('─'.repeat(100))

    let withImage = 0
    let withoutImage = 0
    let publishedWithoutImage = 0

    courses.forEach((course, index) => {
      const hasImage = course.cover_image_url ? '✅ CON IMAGEN' : '❌ SIN IMAGEN'
      const status = course.is_published ? '🟢 PUBLICADO' : '🟡 BORRADOR'
      
      if (course.cover_image_url) {
        withImage++
      } else {
        withoutImage++
        if (course.is_published) {
          publishedWithoutImage++
        }
      }

      console.log(`\n${index + 1}. ${course.title}`)
      console.log(`   Estado: ${status}`)
      console.log(`   Imagen: ${hasImage}`)
      
      if (course.cover_image_url) {
        console.log(`   URL: ${course.cover_image_url}`)
      }
      
      // Resaltar cursos publicados sin imagen
      if (course.is_published && !course.cover_image_url) {
        console.log(`   ⚠️ PUBLICADO SIN IMAGEN - Los usuarios no verán imagen en la página`)
      }
    })

    console.log('\n' + '─'.repeat(100))
    console.log(`\n📊 RESUMEN:`)
    console.log(`   ✅ Con imagen: ${withImage}`)
    console.log(`   ❌ Sin imagen: ${withoutImage}`)
    console.log(`   ⚠️ Publicados sin imagen: ${publishedWithoutImage}`)
    console.log(`   📚 Total: ${courses.length}`)

    if (publishedWithoutImage > 0) {
      console.log(`\n⚠️ ACCIÓN REQUERIDA:`)
      console.log(`   ${publishedWithoutImage} curso(s) publicado(s) no tienen imagen de portada.`)
      console.log(`   Para agregar imágenes:`)
      console.log(`   1. Ve a https://www.hakadogs.com/administrator/cursos`)
      console.log(`   2. Haz clic en "Editar" en cada curso`)
      console.log(`   3. Sube una imagen en "Imagen de Portada"`)
      console.log(`   4. Guarda los cambios`)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkCourseImages()
