/**
 * Script para asignar imágenes de portada a los artículos del blog
 * 
 * Genera URLs de imágenes de Unsplash basadas en el título del artículo
 * 
 * Uso:
 *   node scripts/add-featured-images.js
 */

const { createClient } = require('@supabase/supabase-js')

// ============================================
// CONFIGURACIÓN
// ============================================

const UNSPLASH_BASE = 'https://images.unsplash.com/photo-'

// IDs de fotos de perros de alta calidad de Unsplash
const PERROS_PHOTOS = [
  '1587300003388-59208cc962cb?w=1200&h=600&fit=crop&q=80', // Cachorro dorado
  '1477884213360-7e9d7dcc1e48?w=1200&h=600&fit=crop&q=80', // Pastor alemán
  '1601758228041-e8d97c693069?w=1200&h=600&fit=crop&q=80', // Golden retriever
  '1558788353-f76d92427f16?w=1200&h=600&fit=crop&q=80', // Border collie
  '1583511655857-d19b40a7a54e?w=1200&h=600&fit=crop&q=80', // Beagle
  '1537151608828-ea4eba3456d7?w=1200&h=600&fit=crop&q=80', // Labrador
  '1552053831-71594a27632d?w=1200&h=600&fit=crop&q=80', // Husky
  '1541364983171-a8ba01e95cfc?w=1200&h=600&fit=crop&q=80', // Jack Russell
  '1561037404-61cd46aa615b?w=1200&h=600&fit=crop&q=80', // Yorkshire
  '1422565096762-bdb997a56a84?w=1200&h=600&fit=crop&q=80', // Bulldog
  '1518020382113-a7e8fc38eac2?w=1200&h=600&fit=crop&q=80', // Dálmata
  '1583337130417-3346a1be7dee?w=1200&h=600&fit=crop&q=80', // Pastor belga
  '1592194996308-7b43878e84a6?w=1200&h=600&fit=crop&q=80', // Perro mixto
  '1576201836106-db1758fd1c97?w=1200&h=600&fit=crop&q=80', // Cocker spaniel
  '1530281700549-e82e7bf110d6?w=1200&h=600&fit=crop&q=80', // Perro negro
  '1548199973-03cce0bbc87b?w=1200&h=600&fit=crop&q=80', // Golden jugando
  '1568572933382-74d440642117?w=1200&h=600&fit=crop&q=80', // Perro sonriendo
  '1535930891776-0c2dfb7fda1a?w=1200&h=600&fit=crop&q=80', // Schnauzer
  '1588943211346-0908a1e3732e?w=1200&h=600&fit=crop&q=80', // Perro en campo
  '1561848657-13bb0f0b57c5?w=1200&h=600&fit=crop&q=80', // Perro con pelota
]

// Mapeo de palabras clave a fotos específicas
const KEYWORD_TO_PHOTO = {
  'cachorro': 0,
  'ejercicio': 1,
  'golden': 2,
  'border': 3,
  'beagle': 4,
  'labrador': 5,
  'husky': 6,
  'jack russell': 7,
  'yorkshire': 8,
  'bulldog': 9,
  'entrenamiento': 10,
  'educación': 11,
  'adopta': 12,
  'cocker': 13,
  'playa': 14,
  'juego': 15,
  'feliz': 16,
  'schnauzer': 17,
  'paseo': 18,
  'pelota': 19,
}

/**
 * Selecciona una imagen basada en el título y el índice
 */
function selectImageForPost(title, index) {
  const titleLower = title.toLowerCase()
  
  // Buscar palabra clave en el título
  for (const [keyword, photoIndex] of Object.entries(KEYWORD_TO_PHOTO)) {
    if (titleLower.includes(keyword)) {
      return UNSPLASH_BASE + PERROS_PHOTOS[photoIndex]
    }
  }
  
  // Si no hay palabra clave específica, rotar por índice
  const photoIndex = index % PERROS_PHOTOS.length
  return UNSPLASH_BASE + PERROS_PHOTOS[photoIndex]
}

// ============================================
// SCRIPT PRINCIPAL
// ============================================

async function main() {
  console.log('🚀 Iniciando asignación de imágenes de portada...\n')
  
  // 1. Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Faltan variables de entorno')
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
  
  // 3. Obtener todos los posts sin imagen de portada
  console.log('📖 Obteniendo artículos...')
  
  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, slug, featured_image_url')
    .order('created_at', { ascending: true })
  
  if (fetchError) {
    console.error('❌ Error obteniendo posts:', fetchError.message)
    process.exit(1)
  }
  
  // Filtrar posts sin imagen o con imagen genérica
  const postsToUpdate = posts.filter(post => {
    return !post.featured_image_url || 
           post.featured_image_url.includes('placeholder') ||
           post.featured_image_url.includes('example')
  })
  
  console.log(`✅ Se encontraron ${posts.length} artículos totales`)
  console.log(`📝 ${postsToUpdate.length} necesitan imagen de portada\n`)
  
  if (postsToUpdate.length === 0) {
    console.log('✅ Todos los artículos ya tienen imagen de portada')
    return
  }
  
  // 4. Preview de las primeras asignaciones
  console.log('📝 Preview de imágenes asignadas:')
  console.log('='.repeat(80))
  
  postsToUpdate.slice(0, 5).forEach((post, idx) => {
    const imageUrl = selectImageForPost(post.title, idx)
    console.log(`\n${idx + 1}. ${post.title}`)
    console.log(`   URL: ${imageUrl.substring(0, 80)}...`)
  })
  console.log('\n' + '='.repeat(80) + '\n')
  
  // 5. Actualizar todos los posts
  console.log(`📤 Asignando imágenes a ${postsToUpdate.length} artículos...\n`)
  
  let actualizados = 0
  let errores = 0
  
  for (let i = 0; i < postsToUpdate.length; i++) {
    const post = postsToUpdate[i]
    
    try {
      const imageUrl = selectImageForPost(post.title, i)
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          featured_image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)
      
      if (error) {
        console.error(`   ❌ Error actualizando "${post.title}":`, error.message)
        errores++
      } else {
        actualizados++
        console.log(`   ✅ ${actualizados}/${postsToUpdate.length} - ${post.title.substring(0, 60)}...`)
      }
      
    } catch (error) {
      console.error(`   ❌ Error procesando "${post.title}":`, error.message)
      errores++
    }
    
    // Pequeña pausa para no saturar
    if (i % 10 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  // 6. Resumen final
  console.log('\n' + '='.repeat(80))
  console.log('🎉 ASIGNACIÓN DE IMÁGENES COMPLETADA')
  console.log('='.repeat(80))
  console.log(`✅ Artículos actualizados: ${actualizados}`)
  if (errores > 0) {
    console.log(`❌ Errores: ${errores}`)
  }
  
  console.log('\n💡 Características de las imágenes:')
  console.log('   • Fuente: Unsplash (alta calidad)')
  console.log('   • Tamaño: 1200x600px (optimizado para web)')
  console.log('   • Selección: Basada en palabras clave del título')
  console.log('   • Variedad: 20 fotos diferentes de perros')
  
  console.log('\n💡 Próximos pasos:')
  console.log('   1. Verifica las imágenes en /administrator/blog')
  console.log('   2. Las imágenes se verán en el listado y detalle de posts')
  console.log('   3. Puedes cambiar manualmente cualquier imagen si lo deseas\n')
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
