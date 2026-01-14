/**
 * Script para verificar las fechas de publicación de los posts
 */

const { createClient } = require('@supabase/supabase-js')

async function checkDates() {
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
  
  console.log('📊 Verificando fechas de publicación...\n')
  
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, published_at, created_at, updated_at, status')
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
  
  console.log(`Mostrando los 10 posts más recientes:\n`)
  console.log('='.repeat(100))
  
  posts.forEach((post, i) => {
    console.log(`\n${i + 1}. ${post.title.substring(0, 60)}...`)
    console.log(`   Status: ${post.status}`)
    console.log(`   Published At: ${post.published_at || 'NULL'}`)
    console.log(`   Created At: ${post.created_at}`)
    console.log(`   Updated At: ${post.updated_at}`)
  })
  
  console.log('\n' + '='.repeat(100))
  
  // Verificar si hay posts sin published_at
  const { data: withoutDate } = await supabase
    .from('blog_posts')
    .select('id, title, status')
    .eq('status', 'published')
    .is('published_at', null)
  
  if (withoutDate && withoutDate.length > 0) {
    console.log(`\n⚠️  Hay ${withoutDate.length} posts publicados SIN fecha de publicación`)
    console.log('   Estos posts necesitan una fecha assigned\n')
  } else {
    console.log('\n✅ Todos los posts publicados tienen fecha de publicación\n')
  }
}

checkDates().catch(console.error)
