const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno desde .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      process.env[key.trim()] = value
    }
  })
  console.log('✅ Variables de entorno cargadas desde .env.local\n')
}

// Inicializar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Faltan variables de entorno')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Genera un número aleatorio entre min y max (días)
 */
function getRandomDays(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Formatea fecha para mostrar
 */
function formatDate(date) {
  return date.toISOString().split('T')[0]
}

async function backdateBlogPosts() {
  console.log('🕐 Iniciando redistribución de fechas de publicación...\n')

  try {
    // 1. Obtener todos los artículos publicados ordenados por título
    const { data: posts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, title, created_at')
      .eq('status', 'published')
      .order('title', { ascending: true })

    if (fetchError) {
      throw new Error(`Error al obtener artículos: ${fetchError.message}`)
    }

    if (!posts || posts.length === 0) {
      console.log('⚠️  No se encontraron artículos publicados')
      return
    }

    console.log(`📚 Encontrados ${posts.length} artículos a redistribuir\n`)

    // 2. Empezar desde hoy y retroceder con intervalos aleatorios
    let currentDate = new Date() // Hoy, 28 de enero de 2026
    let updatedCount = 0
    let errors = []

    console.log(`📅 Fecha de inicio: ${formatDate(currentDate)}\n`)
    console.log('🔄 Actualizando fechas...\n')

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i]
      
      // Retroceder entre 5 y 10 días aleatoriamente
      const daysBack = getRandomDays(5, 10)
      currentDate.setDate(currentDate.getDate() - daysBack)

      // Crear fecha con hora aleatoria entre 8:00 y 20:00
      const randomHour = getRandomDays(8, 20)
      const randomMinute = getRandomDays(0, 59)
      const randomSecond = getRandomDays(0, 59)
      
      const publishDate = new Date(currentDate)
      publishDate.setHours(randomHour, randomMinute, randomSecond, 0)

      // Actualizar el artículo
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({
          created_at: publishDate.toISOString(),
          published_at: publishDate.toISOString(),
          updated_at: publishDate.toISOString()
        })
        .eq('id', post.id)

      if (updateError) {
        errors.push(`❌ Error en "${post.title}": ${updateError.message}`)
      } else {
        updatedCount++
        console.log(`  ${updatedCount}/${posts.length} - ${formatDate(publishDate)} (${daysBack} días atrás) - ${post.title.substring(0, 50)}...`)
      }
    }

    // 3. Resumen final
    console.log('\n' + '='.repeat(80))
    console.log('\n🎉 REDISTRIBUCIÓN COMPLETADA\n')
    console.log(`✅ Artículos actualizados: ${updatedCount}/${posts.length}`)
    console.log(`📅 Fecha más antigua: ${formatDate(currentDate)}`)
    console.log(`📅 Fecha más reciente: ${formatDate(new Date())}`)
    
    // Calcular período total cubierto
    const daysCovered = Math.floor((new Date() - currentDate) / (1000 * 60 * 60 * 24))
    const monthsCovered = (daysCovered / 30).toFixed(1)
    console.log(`⏰ Período cubierto: ~${daysCovered} días (~${monthsCovered} meses)`)

    if (errors.length > 0) {
      console.log(`\n⚠️  Errores (${errors.length}):`)
      errors.forEach(err => console.log(`   ${err}`))
    }

    console.log('\n✨ Las fechas ahora parecen una publicación natural y regular')
    console.log('🌐 Verifica en: https://www.hakadogs.com/administrator/blog')
    console.log('\n' + '='.repeat(80))

  } catch (error) {
    console.error('\n❌ ERROR FATAL:', error.message)
    process.exit(1)
  }
}

// Confirmar antes de ejecutar
console.log('⚠️  REDISTRIBUCIÓN DE FECHAS DE PUBLICACIÓN\n')
console.log('Este script actualizará las fechas de TODOS los artículos publicados')
console.log('distribuyéndolos hacia el pasado con intervalos aleatorios de 5-10 días.\n')
console.log('Presiona Ctrl+C para cancelar...\n')

// Ejecutar después de 3 segundos
setTimeout(() => {
  backdateBlogPosts()
}, 3000)
