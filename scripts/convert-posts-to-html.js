/**
 * Script para convertir el contenido de los artículos de texto plano a HTML
 * 
 * Convierte el formato Markdown del CSV a HTML enriquecido
 * 
 * Uso:
 *   node scripts/convert-posts-to-html.js
 */

const { createClient } = require('@supabase/supabase-js')
const { marked } = require('marked')

// Configurar marked para generar HTML más limpio
marked.setOptions({
  breaks: true, // Saltos de línea se convierten en <br>
  gfm: true, // GitHub Flavored Markdown
})

// ============================================
// SCRIPT PRINCIPAL
// ============================================

async function main() {
  console.log('🚀 Iniciando conversión de artículos a HTML...\n')
  
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
  
  // 3. Obtener todos los posts que NO tienen HTML (detectar por falta de etiquetas <)
  console.log('📖 Obteniendo artículos sin HTML...')
  
  const { data: posts, error: fetchError } = await supabase
    .from('blog_posts')
    .select('id, title, slug, content')
  
  if (fetchError) {
    console.error('❌ Error obteniendo posts:', fetchError.message)
    process.exit(1)
  }
  
  // Filtrar posts que no tienen HTML (no contienen etiquetas <)
  const postsToConvert = posts.filter(post => {
    if (!post.content) return false
    // Si no tiene etiquetas HTML, necesita conversión
    return !post.content.includes('<h') && !post.content.includes('<p')
  })
  
  console.log(`✅ Se encontraron ${posts.length} artículos totales`)
  console.log(`📝 ${postsToConvert.length} necesitan conversión a HTML\n`)
  
  if (postsToConvert.length === 0) {
    console.log('✅ Todos los artículos ya tienen HTML')
    return
  }
  
  // 4. Preview de conversión
  console.log('📝 Preview de conversión (primer artículo):')
  console.log('='.repeat(80))
  const firstPost = postsToConvert[0]
  console.log(`\nTítulo: ${firstPost.title}`)
  console.log(`\nContenido original (primeros 300 caracteres):`)
  console.log(firstPost.content.substring(0, 300))
  console.log('\n---\n')
  
  const htmlPreview = marked(firstPost.content)
  console.log(`Contenido convertido a HTML (primeros 300 caracteres):`)
  console.log(htmlPreview.substring(0, 300))
  console.log('\n' + '='.repeat(80) + '\n')
  
  // 5. Convertir y actualizar
  console.log(`📤 Convirtiendo y actualizando ${postsToConvert.length} artículos...\n`)
  
  let actualizados = 0
  let errores = 0
  
  for (const post of postsToConvert) {
    try {
      // Convertir Markdown a HTML
      let htmlContent = marked(post.content)
      
      // Mejoras adicionales al HTML generado
      htmlContent = htmlContent
        // Envolver en párrafos si no están envueltos
        .replace(/^([^<\n][^\n]+)$/gm, '<p>$1</p>')
        // Limpiar párrafos duplicados
        .replace(/<p><p>/g, '<p>')
        .replace(/<\/p><\/p>/g, '</p>')
        // Asegurar que las listas tengan espaciado
        .replace(/<\/ul>/g, '</ul>\n')
        .replace(/<\/ol>/g, '</ol>\n')
      
      // Actualizar en Supabase
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          content: htmlContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', post.id)
      
      if (error) {
        console.error(`   ❌ Error actualizando "${post.title}":`, error.message)
        errores++
      } else {
        actualizados++
        console.log(`   ✅ ${actualizados}/${postsToConvert.length} - ${post.title.substring(0, 60)}...`)
      }
      
    } catch (error) {
      console.error(`   ❌ Error procesando "${post.title}":`, error.message)
      errores++
    }
  }
  
  // 6. Resumen final
  console.log('\n' + '='.repeat(80))
  console.log('🎉 CONVERSIÓN COMPLETADA')
  console.log('='.repeat(80))
  console.log(`✅ Artículos convertidos: ${actualizados}`)
  if (errores > 0) {
    console.log(`❌ Errores: ${errores}`)
  }
  
  console.log('\n💡 Próximos pasos:')
  console.log('   1. Verifica los artículos en /administrator/blog')
  console.log('   2. El contenido ahora tiene formato HTML enriquecido')
  console.log('   3. Los artículos se verán correctamente en el frontend\n')
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
