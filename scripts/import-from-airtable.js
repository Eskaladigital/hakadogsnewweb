/**
 * Script para IMPORTAR artículos del blog desde Airtable CSV
 * ============================================================
 * Uso:
 * 1. Exporta tu tabla de Airtable como CSV
 * 2. Guarda el archivo como: blog_articles_backup.csv en la raíz del proyecto
 * 3. Ejecuta: node scripts/import-from-airtable.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const csv = require('csv-parser')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Función para generar slug a partir del título
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
    .replace(/\s+/g, '-') // Espacios a guiones
    .replace(/-+/g, '-') // Múltiples guiones a uno
    .replace(/^-+|-+$/g, '') // Eliminar guiones inicio/fin
    .substring(0, 100)
}

// Función para calcular tiempo de lectura
function calculateReadingTime(content) {
  const text = content.replace(/<[^>]*>/g, '')
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(wordCount / 200))
}

async function importArticles() {
  console.log('📂 Leyendo archivo CSV...\n')
  
  const articles = []
  
  // Leer CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream('blog_articles_backup.csv')
      .pipe(csv())
      .on('data', (row) => {
        articles.push(row)
      })
      .on('end', resolve)
      .on('error', reject)
  })
  
  console.log(`✅ Encontrados ${articles.length} artículos en CSV\n`)
  console.log('📝 Importando a Supabase...\n')
  
  let imported = 0
  let errors = 0
  
  for (const article of articles) {
    try {
      // Mapeo de campos (AJUSTA SEGÚN TUS COLUMNAS DE AIRTABLE)
      const title = article['Title'] || article['Título'] || article['title']
      const content = article['Content'] || article['Contenido'] || article['content']
      const excerpt = article['Excerpt'] || article['Extracto'] || article['excerpt']
      const status = article['Status'] || article['Estado'] || article['status'] || 'published'
      const categoryName = article['Category'] || article['Categoría'] || article['category']
      const featuredImage = article['Featured Image'] || article['Imagen Destacada'] || article['featured_image']
      
      if (!title || !content) {
        console.log(`   ⚠️  Saltando artículo sin título o contenido`)
        continue
      }
      
      // Buscar o crear categoría
      let categoryId = null
      if (categoryName) {
        const { data: existingCategory } = await supabase
          .from('blog_categories')
          .select('id')
          .eq('name', categoryName)
          .single()
        
        if (existingCategory) {
          categoryId = existingCategory.id
        } else {
          // Crear categoría
          const { data: newCategory, error: catError } = await supabase
            .from('blog_categories')
            .insert({
              name: categoryName,
              slug: generateSlug(categoryName),
              color: '#10b981',
              is_active: true
            })
            .select()
            .single()
          
          if (!catError && newCategory) {
            categoryId = newCategory.id
          }
        }
      }
      
      // Generar slug único
      let slug = generateSlug(title)
      
      // Verificar si el slug ya existe
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .single()
      
      if (existingPost) {
        slug = `${slug}-${Date.now()}`
      }
      
      // Insertar artículo
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title,
          slug,
          content,
          excerpt: excerpt || content.substring(0, 200),
          featured_image_url: featuredImage || null,
          category_id: categoryId,
          status: status.toLowerCase(),
          is_featured: false,
          seo_title: title.substring(0, 60),
          seo_description: excerpt?.substring(0, 160) || content.substring(0, 160),
          reading_time_minutes: calculateReadingTime(content),
          views_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (insertError) {
        console.error(`   ❌ Error: ${title}`)
        console.error(`      ${insertError.message}`)
        errors++
      } else {
        imported++
        console.log(`   ✅ ${imported}/${articles.length} - ${title.substring(0, 60)}...`)
      }
      
    } catch (error) {
      console.error(`   ❌ Error procesando artículo:`, error.message)
      errors++
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('🎉 IMPORTACIÓN COMPLETADA')
  console.log('='.repeat(80))
  console.log(`✅ Importados: ${imported}`)
  console.log(`❌ Errores: ${errors}`)
  console.log(`📊 Total procesados: ${articles.length}`)
  console.log('\n💡 Verifica los artículos en: /administrator/blog\n')
}

// Ejecutar
importArticles().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
