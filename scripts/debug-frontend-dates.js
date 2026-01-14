/**
 * Script para verificar exactamente qué fechas tienen los posts publicados
 */

const { createClient } = require('@supabase/supabase-js')

async function checkPublishedDates() {
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
  
  console.log('🔍 Verificando posts PUBLICADOS (como los ve el frontend)...\n')
  
  // Hacer la misma consulta que hace el frontend
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      category:blog_categories(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
  
  console.log(`Mostrando los 10 posts MÁS RECIENTES (como aparecen en el blog):\n`)
  console.log('='.repeat(100))
  
  posts.forEach((post, i) => {
    console.log(`\n${i + 1}. ${post.title}`)
    console.log(`   Status: ${post.status}`)
    console.log(`   Published At: ${post.published_at}`)
    console.log(`   Created At: ${post.created_at}`)
    console.log(`   Updated At: ${post.updated_at}`)
    
    // Formatear como lo hace el frontend
    const publishedDate = new Date(post.published_at || post.created_at)
    const formattedDate = publishedDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    console.log(`   👉 FRONTEND MUESTRA: ${formattedDate}`)
  })
  
  console.log('\n' + '='.repeat(100))
}

checkPublishedDates().catch(console.error)
