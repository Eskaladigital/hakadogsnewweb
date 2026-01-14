/**
 * Script para publicar artículos y asignar fechas de publicación
 * 
 * Asigna fechas desde enero 2023, distribuyendo 3 artículos por mes
 * 
 * Uso:
 *   node scripts/publish-and-date-posts.js
 */

const { createClient } = require('@supabase/supabase-js')

// ============================================
// CONFIGURACIÓN
// ============================================

const FECHA_INICIO = new Date('2023-01-01') // Enero 2023
const POSTS_POR_MES = 3
const DRY_RUN = false // Cambiar a true para ver qué se actualizaría sin hacerlo

// ============================================
// UTILIDADES
// ============================================

/**
 * Genera fechas de publicación espaciadas uniformemente
 */
function generarFechasPublicacion(totalPosts, fechaInicio, postsPorMes) {
  const fechas = []
  let fecha = new Date(fechaInicio)
  let postEnMes = 0
  
  for (let i = 0; i < totalPosts; i++) {
    // Distribuir los posts uniformemente en el mes
    const dia = Math.floor(postEnMes * (28 / postsPorMes)) + 1
    fecha.setDate(dia)
    
    // Hora aleatoria entre 9am y 6pm
    const hora = 9 + Math.floor(Math.random() * 9)
    fecha.setHours(hora, Math.floor(Math.random() * 60), 0, 0)
    
    fechas.push(new Date(fecha))
    
    postEnMes++
    
    // Si completamos el mes, pasar al siguiente
    if (postEnMes >= postsPorMes) {
      postEnMes = 0
      fecha = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1)
    }
  }
  
  return fechas
}

/**
 * Formatea una fecha para mostrar
 */
function formatearFecha(fecha) {
  return fecha.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// ============================================
// SCRIPT PRINCIPAL
// ============================================

async function main() {
  console.log('🚀 Iniciando publicación y asignación de fechas...\n')
  
  // 1. Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Faltan variables de entorno')
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
    process.exit(1)
  }
  
  // 2. Crear cliente de Supabase
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  console.log('✅ Cliente de Supabase creado\n')
  
  // 3. Obtener todos los posts (ordenados por created_at para mantener orden lógico)
  console.log('📖 Obteniendo artículos de la base de datos...')
  
  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, slug, status, published_at, created_at')
    .order('created_at', { ascending: true })
  
  if (fetchError) {
    console.error('❌ Error obteniendo posts:', fetchError.message)
    process.exit(1)
  }
  
  if (!posts || posts.length === 0) {
    console.log('⚠️  No se encontraron artículos en la base de datos')
    process.exit(0)
  }
  
  console.log(`✅ Se encontraron ${posts.length} artículos\n`)
  
  // 4. Generar fechas de publicación
  console.log(`📅 Generando fechas de publicación (${POSTS_POR_MES} posts/mes desde ${FECHA_INICIO.toLocaleDateString('es-ES')})...\n`)
  
  const fechas = generarFechasPublicacion(posts.length, FECHA_INICIO, POSTS_POR_MES)
  
  // 5. Preparar actualizaciones
  const actualizaciones = posts.map((post, index) => {
    const fechaPublicacion = fechas[index]
    
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      status: 'published',
      published_at: fechaPublicacion.toISOString(),
      created_at: fechaPublicacion.toISOString(), // Usar misma fecha para coherencia
      updated_at: fechaPublicacion.toISOString()
    }
  })
  
  // 6. Mostrar preview
  console.log('📝 Preview de las primeras actualizaciones:')
  console.log('='.repeat(80))
  
  actualizaciones.slice(0, 5).forEach((update, idx) => {
    const mesActual = new Date(update.published_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
    console.log(`\n${idx + 1}. ${update.title.substring(0, 60)}${update.title.length > 60 ? '...' : ''}`)
    console.log(`   Slug: ${update.slug}`)
    console.log(`   Mes: ${mesActual}`)
    console.log(`   Fecha: ${formatearFecha(new Date(update.published_at))}`)
    console.log(`   Estado: ${update.status}`)
  })
  
  if (actualizaciones.length > 5) {
    console.log(`\n... y ${actualizaciones.length - 5} artículos más\n`)
  }
  
  // Calcular distribución por mes
  const postsPorMesReal = {}
  actualizaciones.forEach(update => {
    const mesKey = new Date(update.published_at).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
    postsPorMesReal[mesKey] = (postsPorMesReal[mesKey] || 0) + 1
  })
  
  console.log('\n📊 Distribución por mes:')
  console.log('='.repeat(80))
  Object.keys(postsPorMesReal).forEach(mes => {
    console.log(`   ${mes}: ${postsPorMesReal[mes]} artículos`)
  })
  console.log('')
  
  if (DRY_RUN) {
    console.log('🧪 DRY RUN activado - No se actualizará nada')
    console.log(`   Se actualizarían ${actualizaciones.length} artículos`)
    return
  }
  
  // 7. Confirmar antes de proceder
  console.log('⚠️  ATENCIÓN: Esto actualizará TODOS los artículos')
  console.log(`   - Total artículos: ${actualizaciones.length}`)
  console.log(`   - Se publicarán: ${posts.filter(p => p.status !== 'published').length}`)
  console.log(`   - Fechas desde: ${formatearFecha(fechas[0])}`)
  console.log(`   - Fechas hasta: ${formatearFecha(fechas[fechas.length - 1])}\n`)
  
  // 8. Actualizar en lotes de 20
  const BATCH_SIZE = 20
  let actualizados = 0
  let errores = 0
  
  console.log(`📤 Actualizando ${actualizaciones.length} artículos en lotes de ${BATCH_SIZE}...\n`)
  
  for (let i = 0; i < actualizaciones.length; i += BATCH_SIZE) {
    const batch = actualizaciones.slice(i, i + BATCH_SIZE)
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(actualizaciones.length / BATCH_SIZE)
    
    console.log(`   Lote ${batchNumber}/${totalBatches} (${batch.length} artículos)...`)
    
    // Actualizar uno por uno para tener control
    for (const update of batch) {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          status: update.status,
          published_at: update.published_at,
          created_at: update.created_at,
          updated_at: update.updated_at
        })
        .eq('id', update.id)
      
      if (error) {
        console.error(`      ❌ Error actualizando "${update.title}":`, error.message)
        errores++
      } else {
        actualizados++
      }
    }
    
    console.log(`   ✅ Lote ${batchNumber} completado`)
    
    // Pequeña pausa
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // 9. Resumen final
  console.log('\n' + '='.repeat(80))
  console.log('🎉 ACTUALIZACIÓN COMPLETADA')
  console.log('='.repeat(80))
  console.log(`✅ Artículos actualizados: ${actualizados}`)
  if (errores > 0) {
    console.log(`❌ Errores: ${errores}`)
  }
  console.log(`📅 Rango de fechas: ${formatearFecha(fechas[0])} → ${formatearFecha(fechas[fechas.length - 1])}`)
  console.log(`📊 Posts por mes: ${POSTS_POR_MES}`)
  
  console.log('\n💡 Próximos pasos:')
  console.log('   1. Verifica los artículos en /administrator/blog')
  console.log('   2. Los artículos ahora están publicados')
  console.log('   3. Las fechas están distribuidas desde enero 2023')
  console.log('   4. Puedes ajustar fechas manualmente si es necesario\n')
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
