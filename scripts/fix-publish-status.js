/**
 * Script para publicar todos los posts y arreglar las fechas updated_at
 */

const { createClient } = require('@supabase/supabase-js')

async function main() {
  console.log('🚀 Publicando todos los posts y corrigiendo fechas...\n')
  
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
  
  // Obtener todos los posts
  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, status, published_at, created_at')
    .order('published_at', { ascending: true })
  
  if (fetchError) {
    console.error('❌ Error obteniendo posts:', fetchError.message)
    process.exit(1)
  }
  
  console.log(`📝 Se encontraron ${posts.length} artículos\n`)
  
  const drafts = posts.filter(p => p.status === 'draft')
  console.log(`   ${drafts.length} están en draft (se publicarán)`)
  console.log(`   ${posts.filter(p => p.status === 'published').length} ya están publicados\n`)
  
  console.log('📤 Actualizando todos los posts...\n')
  
  let actualizados = 0
  let errores = 0
  
  for (const post of posts) {
    try {
      // Usar published_at como updated_at para que coincidan
      // Status a published si es draft
      const updates = {
        status: 'published',
        updated_at: post.published_at || post.created_at, // Mantener fecha de publicación
      }
      
      // Asegurarse de que tenga published_at
      if (!post.published_at) {
        updates.published_at = post.created_at
      }
      
      const { error } = await supabase
        .from('blog_posts')
        .update(updates)
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
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('🎉 ACTUALIZACIÓN COMPLETADA')
  console.log('='.repeat(80))
  console.log(`✅ Posts actualizados: ${actualizados}`)
  if (errores > 0) {
    console.log(`❌ Errores: ${errores}`)
  }
  
  console.log('\n💡 Cambios aplicados:')
  console.log('   • Todos los posts ahora tienen status "published"')
  console.log('   • updated_at igualado a published_at (fecha correcta)')
  console.log('   • Los artículos ahora se verán en el blog público\n')
}

main().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
