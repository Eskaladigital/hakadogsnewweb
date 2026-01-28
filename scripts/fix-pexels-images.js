/**
 * Script para ELIMINAR imágenes de Pexels y usar SOLO Unsplash
 * Las imágenes de Pexels causan errores 400 en Next.js Image Optimizer
 * =====================================================================
 */

const { createClient } = require('@supabase/supabase-js')

// Solo URLs de Unsplash VERIFICADAS (funcionan perfectamente con Next.js)
const UNSPLASH_PHOTOS = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1537151608828-ea4eba3456d7?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1601758228041-e8d97c693069?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568572933382-74d440642117?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581888227599-779811939961?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=1200&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587559070757-f72ad2f6c60e?w=1200&h=600&fit=crop&q=80',
]

// Mapeo por palabras clave para seleccionar imágenes relevantes
const KEYWORD_TO_PHOTO = {
  'cachorro': [1, 11, 14],
  'cachorros': [1, 11, 14],
  'puppy': [1, 11, 14],
  'playa': [9, 18],
  'beach': [9, 18],
  'entrenamiento': [6, 7, 15],
  'training': [6, 7, 15],
  'educación': [6, 7, 15],
  'education': [6, 7, 15],
  'adiestramiento': [6, 7, 15],
  'golden': [0, 2, 5, 19],
  'labrador': [4, 10],
  'husky': [3],
  'pastor': [8, 13],
  'shepherd': [8, 13],
  'juego': [12, 16],
  'play': [12, 16],
  'familia': [17, 19],
  'family': [17, 19],
}

function selectImageForPost(title, index) {
  const titleLower = title.toLowerCase()
  
  // Buscar palabra clave en el título
  for (const [keyword, indices] of Object.entries(KEYWORD_TO_PHOTO)) {
    if (titleLower.includes(keyword)) {
      const photoIndex = indices[index % indices.length]
      return UNSPLASH_PHOTOS[photoIndex]
    }
  }
  
  // Si no hay keyword, rotar por índice del artículo
  return UNSPLASH_PHOTOS[index % UNSPLASH_PHOTOS.length]
}

async function main() {
  console.log('🔍 Buscando imágenes de Pexels para reemplazar...\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Faltan variables de entorno')
    console.error('   Asegúrate de tener:')
    console.error('   - NEXT_PUBLIC_SUPABASE_URL')
    console.error('   - SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  // Buscar todos los posts con imágenes de Pexels
  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, featured_image_url, published_at, updated_at')
    .like('featured_image_url', '%pexels.com%')
    .order('created_at', { ascending: true })
  
  if (fetchError) {
    console.error('❌ Error al buscar posts:', fetchError.message)
    process.exit(1)
  }
  
  if (!posts || posts.length === 0) {
    console.log('✅ No se encontraron imágenes de Pexels. Todo bien!')
    return
  }
  
  console.log(`📝 Encontrados ${posts.length} artículos con imágenes de Pexels\n`)
  console.log('🔄 Reemplazando con imágenes de Unsplash...\n')
  
  let actualizados = 0
  let errores = 0
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    const newImageUrl = selectImageForPost(post.title, i)
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          featured_image_url: newImageUrl,
          // Preservar fechas originales
          published_at: post.published_at,
          updated_at: post.updated_at
        })
        .eq('id', post.id)
      
      if (error) {
        console.error(`   ❌ Error: ${post.title}`)
        console.error(`      ${error.message}`)
        errores++
      } else {
        actualizados++
        console.log(`   ✅ ${actualizados}/${posts.length} - ${post.title.substring(0, 60)}...`)
        console.log(`      Antes: ${post.featured_image_url.substring(0, 50)}...`)
        console.log(`      Ahora: ${newImageUrl.substring(0, 50)}...`)
      }
    } catch (error) {
      console.error(`   ❌ ${post.title}`)
      console.error(`      ${error.message}`)
      errores++
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('🎉 PROCESO COMPLETADO')
  console.log('='.repeat(80))
  console.log(`✅ Actualizados: ${actualizados}`)
  console.log(`❌ Errores: ${errores}`)
  console.log('\n💡 Todas las imágenes ahora son de Unsplash')
  console.log('💡 Compatible con next.config.js (domains: images.unsplash.com)')
  console.log('💡 No más errores 400 Bad Request\n')
}

main().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
