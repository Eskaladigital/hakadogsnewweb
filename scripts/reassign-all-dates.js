/**
 * Script para RE-ASIGNAR correctamente todas las fechas de publicación
 * Distribuyendo desde enero 2023 hasta hoy, 3 posts por mes
 */

const { createClient } = require('@supabase/supabase-js')

function generatePublicationDates(totalPosts) {
  const dates = []
  const startDate = new Date('2023-01-01T00:00:00Z')
  const endDate = new Date() // Hoy
  
  // Calcular cuántos posts por mes
  const postsPerMonth = 3
  
  let currentDate = new Date(startDate)
  let postsInMonth = 0
  
  for (let i = 0; i < totalPosts; i++) {
    // Generar hora aleatoria en el día
    const randomHour = Math.floor(Math.random() * 14) + 8 // Entre 8 AM y 10 PM
    const randomMinute = Math.floor(Math.random() * 60)
    
    const publishDate = new Date(currentDate)
    publishDate.setHours(randomHour, randomMinute, 0, 0)
    
    dates.push(publishDate.toISOString())
    
    postsInMonth++
    
    // Si ya publicamos 3 posts este mes, avanzar al siguiente mes
    if (postsInMonth >= postsPerMonth) {
      currentDate.setMonth(currentDate.getMonth() + 1)
      currentDate.setDate(Math.floor(Math.random() * 28) + 1) // Día aleatorio del mes
      postsInMonth = 0
      
      // Si llegamos al futuro, parar
      if (currentDate > endDate) {
        currentDate = new Date(endDate)
      }
    } else {
      // Avanzar algunos días dentro del mismo mes
      currentDate.setDate(currentDate.getDate() + Math.floor(Math.random() * 8) + 3)
    }
  }
  
  return dates
}

async function main() {
  console.log('🚀 RE-ASIGNANDO fechas de publicación correctamente...\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Faltan variables de entorno')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  console.log('✅ Cliente de Supabase creado\n')
  
  // Obtener TODOS los posts ordenados por created_at (para mantener orden original)
  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, created_at')
    .order('created_at', { ascending: true })
  
  if (fetchError) {
    console.error('❌ Error obteniendo posts:', fetchError.message)
    process.exit(1)
  }
  
  console.log(`📝 Se encontraron ${posts.length} artículos\n`)
  
  // Generar fechas de publicación
  const publicationDates = generatePublicationDates(posts.length)
  
  console.log('📅 Rango de fechas generadas:')
  console.log(`   Primera: ${new Date(publicationDates[0]).toLocaleDateString('es-ES')}`)
  console.log(`   Última: ${new Date(publicationDates[publicationDates.length - 1]).toLocaleDateString('es-ES')}\n`)
  
  console.log('📤 Actualizando fechas de todos los posts...\n')
  
  let actualizados = 0
  let errores = 0
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const publishedAt = publicationDates[i]
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          status: 'published',
          published_at: publishedAt,
          created_at: publishedAt,
          updated_at: publishedAt, // Igualar para que no muestre fecha de hoy
        })
        .eq('id', post.id)
      
      if (error) {
        console.error(`   ❌ Error actualizando "${post.title}":`, error.message)
        errores++
      } else {
        actualizados++
        const formattedDate = new Date(publishedAt).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
        console.log(`   ✅ ${actualizados}/${posts.length} - ${formattedDate} - ${post.title.substring(0, 50)}...`)
      }
      
    } catch (error) {
      console.error(`   ❌ Error procesando "${post.title}":`, error.message)
      errores++
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('🎉 RE-ASIGNACIÓN COMPLETADA')
  console.log('='.repeat(80))
  console.log(`✅ Posts actualizados: ${actualizados}`)
  if (errores > 0) {
    console.log(`❌ Errores: ${errores}`)
  }
  
  console.log('\n💡 Fechas aplicadas:')
  console.log('   • Desde: Enero 2023')
  console.log('   • Hasta: Hoy')
  console.log('   • Distribución: ~3 posts por mes')
  console.log('   • Horas aleatorias: 8 AM - 10 PM')
  console.log('   • updated_at = published_at (sin fecha de modificación)\n')
}

main().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
