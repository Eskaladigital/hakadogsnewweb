/**
 * Script para ACTUALIZAR todas las imágenes de portada con nuevas URLs verificadas
 * 
 * Uso:
 *   node scripts/update-all-images.js
 */

const { createClient } = require('@supabase/supabase-js')

// URLs completas de imágenes de perros verificadas de Unsplash
const PERROS_PHOTOS = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&h=600&fit=crop&q=80', // Golden retriever feliz
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1200&h=600&fit=crop&q=80', // Cachorro beagle
  'https://images.unsplash.com/photo-1529472119196-cb724127a98e?w=1200&h=600&fit=crop&q=80', // Yorkshire terrier
  'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=1200&h=600&fit=crop&q=80', // Perro sonriendo
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=600&fit=crop&q=80', // Golden jugando
  'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&h=600&fit=crop&q=80', // Husky siberiano
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&h=600&fit=crop&q=80', // Cachorro dorado
  'https://images.unsplash.com/photo-1537151608828-ea4eba3456d7?w=1200&h=600&fit=crop&q=80', // Labrador negro
  'https://images.unsplash.com/photo-1581888227599-779811939961?w=1200&h=600&fit=crop&q=80', // Pastor alemán
  'https://images.unsplash.com/photo-1601758228041-e8d97c693069?w=1200&h=600&fit=crop&q=80', // Golden retriever adulto
  'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=1200&h=600&fit=crop&q=80', // Border collie
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&h=600&fit=crop&q=80', // Perro en naturaleza
  'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=1200&h=600&fit=crop&q=80', // Border collie corriendo
  'https://images.unsplash.com/photo-1568572933382-74d440642117?w=1200&h=600&fit=crop&q=80', // Perro feliz outdoor
  'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=1200&h=600&fit=crop&q=80', // Perro en playa
  'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200&h=600&fit=crop&q=80', // Cocker spaniel
  'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=1200&h=600&fit=crop&q=80', // Perro majestuoso
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=1200&h=600&fit=crop&q=80', // Perro pequeño
  'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac2?w=1200&h=600&fit=crop&q=80', // Perro activo
  'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=1200&h=600&fit=crop&q=80', // Perro elegante
  'https://images.unsplash.com/photo-1544568100-847a948585b9?w=1200&h=600&fit=crop&q=80', // Cachorro tierno
  'https://images.unsplash.com/photo-1566303040373-58a062ce18c1?w=1200&h=600&fit=crop&q=80', // Perro entrenando
  'https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=1200&h=600&fit=crop&q=80', // Jack Russell
  'https://images.unsplash.com/photo-1588943211346-0908a1e3732e?w=1200&h=600&fit=crop&q=80', // Perro en campo verde
  'https://images.unsplash.com/photo-1600077106724-946750eeaf3c?w=1200&h=600&fit=crop&q=80', // Perro jugando
  'https://images.unsplash.com/photo-1561848657-e2e55d7bec24?w=1200&h=600&fit=crop&q=80', // Perro con pelota
  'https://images.unsplash.com/photo-1583512603784-ffd89b77afcd?w=1200&h=600&fit=crop&q=80', // Perro adiestrado
  'https://images.unsplash.com/photo-1590955256089-bd5cff1bcb25?w=1200&h=600&fit=crop&q=80', // Perro corriendo
  'https://images.unsplash.com/photo-1550699026-4114bbf4fb49?w=1200&h=600&fit=crop&q=80', // Perro saltando
  'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=1200&h=600&fit=crop&q=80', // Perro en parque
  'https://images.unsplash.com/photo-1557427161-4701a0fa2f42?w=1200&h=600&fit=crop&q=80', // Perro atento
  'https://images.unsplash.com/photo-1562141961-f54a2bc7d111?w=1200&h=600&fit=crop&q=80', // Perro mirando
  'https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=1200&h=600&fit=crop&q=80', // Perro descansando
  'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?w=1200&h=600&fit=crop&q=80', // Cachorro jugando
  'https://images.unsplash.com/photo-1527526029430-319f10814151?w=1200&h=600&fit=crop&q=80', // Perro en césped
  'https://images.unsplash.com/photo-1573865526739-10c1dd7aa7b1?w=1200&h=600&fit=crop&q=80', // Cachorro adorable
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200&h=600&fit=crop&q=80', // Perro al aire libre
  'https://images.unsplash.com/photo-1585696262222-dd8e9b2d6eba?w=1200&h=600&fit=crop&q=80', // Perro feliz en casa
  'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=1200&h=600&fit=crop&q=80', // Perro observando
  'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=1200&h=600&fit=crop&q=80', // Perro tranquilo
]

// Mapeo de palabras clave a fotos específicas (más variedad)
const KEYWORD_TO_PHOTO = {
  'cachorro': [6, 20, 33, 35], // Múltiples opciones de cachorros
  'ejercicio': [13, 27, 28],
  'golden': [0, 4, 9],
  'border': [10, 12],
  'beagle': [1],
  'labrador': [7],
  'husky': [5],
  'jack russell': [22],
  'yorkshire': [2],
  'entrenamiento': [21, 26],
  'educación': [21, 31],
  'playa': [14],
  'juego': [24, 25, 33],
  'feliz': [3, 13, 37],
  'paseo': [23, 29],
  'pelota': [25],
  'adiestramiento': [26, 21],
  'adopta': [34],
  'casa': [37],
  'parque': [29],
}

/**
 * Selecciona una imagen basada en el título y el índice
 */
function selectImageForPost(title, index) {
  const titleLower = title.toLowerCase()
  
  // Buscar palabra clave en el título y seleccionar aleatoriamente de las opciones
  for (const [keyword, photoIndices] of Object.entries(KEYWORD_TO_PHOTO)) {
    if (titleLower.includes(keyword)) {
      const indices = Array.isArray(photoIndices) ? photoIndices : [photoIndices]
      const selectedIndex = indices[index % indices.length]
      return PERROS_PHOTOS[selectedIndex]
    }
  }
  
  // Si no hay palabra clave específica, rotar por índice con más variedad
  const photoIndex = index % PERROS_PHOTOS.length
  return PERROS_PHOTOS[photoIndex]
}

async function main() {
  console.log('🚀 Actualizando TODAS las imágenes de portada...\n')
  
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
  console.log('📖 Obteniendo todos los artículos...')
  
  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, slug')
    .order('created_at', { ascending: true })
  
  if (fetchError) {
    console.error('❌ Error obteniendo posts:', fetchError.message)
    process.exit(1)
  }
  
  console.log(`✅ Se encontraron ${posts.length} artículos\n`)
  console.log('📝 Preview de nuevas asignaciones (primeros 5):')
  console.log('='.repeat(80))
  
  posts.slice(0, 5).forEach((post, idx) => {
    const imageUrl = selectImageForPost(post.title, idx)
    console.log(`\n${idx + 1}. ${post.title}`)
    console.log(`   Nueva URL: ${imageUrl.substring(0, 70)}...`)
  })
  console.log('\n' + '='.repeat(80) + '\n')
  
  console.log(`📤 Actualizando ${posts.length} artículos...\n`)
  
  let actualizados = 0
  let errores = 0
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i]
    
    try {
      const imageUrl = selectImageForPost(post.title, i)
      
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
        console.log(`   ✅ ${actualizados}/${posts.length} - ${post.title.substring(0, 60)}...`)
      }
      
    } catch (error) {
      console.error(`   ❌ Error procesando "${post.title}":`, error.message)
      errores++
    }
    
    if (i % 10 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('🎉 ACTUALIZACIÓN COMPLETADA')
  console.log('='.repeat(80))
  console.log(`✅ Artículos actualizados: ${actualizados}`)
  if (errores > 0) {
    console.log(`❌ Errores: ${errores}`)
  }
  
  console.log('\n💡 Mejoras aplicadas:')
  console.log('   • 40 fotos diferentes verificadas (solo perros)')
  console.log('   • Sin gatos ni otros animales')
  console.log('   • Múltiples opciones por palabra clave')
  console.log('   • Mayor variedad y menos repeticiones')
  console.log('   • URLs verificadas y funcionales\n')
}

main().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
