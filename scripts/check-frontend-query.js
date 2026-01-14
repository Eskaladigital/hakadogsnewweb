/**
 * Script para ver exactamente qué datos está devolviendo la consulta del frontend
 */

const { createClient } = require('@supabase/supabase-js')

async function checkFrontendQuery() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Error: Faltan variables de entorno')
    process.exit(1)
  }
  
  // Usar el mismo cliente que usa el frontend (anon key)
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  console.log('🔍 Consultando como lo hace el FRONTEND (anon key)...\n')
  
  // Hacer la MISMA consulta que hace getPublishedBlogPosts
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(5)
  
  if (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
  
  console.log(`Primeros 5 posts que ve el frontend:\n`)
  console.log('='.repeat(100))
  
  posts.forEach((post, i) => {
    console.log(`\n${i + 1}. ${post.title}`)
    console.log(`   published_at: ${post.published_at}`)
    console.log(`   created_at: ${post.created_at}`)
    console.log(`   updated_at: ${post.updated_at}`)
    
    // Formatear como lo hace el frontend
    const dateToShow = post.published_at || post.created_at
    const formattedDate = new Date(dateToShow).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    console.log(`   👉 FRONTEND MUESTRA: ${formattedDate}`)
  })
  
  console.log('\n' + '='.repeat(100))
  console.log('\n💡 Si ves "14 de enero de 2026" arriba, el problema está en la BD.')
  console.log('💡 Si las fechas son correctas, el problema está en el caché del navegador.\n')
}

checkFrontendQuery().catch(console.error)
