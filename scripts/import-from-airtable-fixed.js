/**
 * Script para IMPORTAR artículos del blog desde Airtable CSV
 * ============================================================
 * ADAPTADO A TU ESTRUCTURA DE DATOS
 * 
 * Columnas del CSV:
 * - Titulo
 * - Articulo
 * - Prompt Sora, Escrito, Publicado, Imagen creada, Modificado, Creación
 * 
 * Uso:
 * 1. Renombra tu CSV como: blog_articles_backup.csv
 * 2. Ejecuta: node scripts/import-from-airtable-fixed.js
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
  if (!content) return 5 // Default
  const text = content.replace(/<[^>]*>/g, '')
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(wordCount / 200))
}

// Función para extraer excerpt del contenido
function extractExcerpt(content) {
  if (!content) return ''
  
  // Quitar HTML
  let text = content.replace(/<[^>]*>/g, '')
  
  // Limpiar saltos de línea múltiples
  text = text.replace(/\n\n+/g, ' ')
  
  // Buscar el primer párrafo significativo (más de 50 caracteres)
  const paragraphs = text.split('\n').filter(p => p.trim().length > 50)
  
  if (paragraphs.length > 0) {
    return paragraphs[0].substring(0, 200).trim() + '...'
  }
  
  // Si no hay párrafos, tomar los primeros 200 caracteres
  return text.substring(0, 200).trim() + '...'
}

// Función para convertir texto plano a HTML básico
function convertToHTML(content) {
  if (!content) return ''
  
  // Si ya tiene HTML, devolverlo tal cual
  if (content.includes('<p>') || content.includes('<h1>')) {
    return content
  }
  
  // Convertir saltos de línea a párrafos
  const lines = content.split('\n').filter(line => line.trim())
  let html = ''
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Detectar títulos (líneas que terminan con : o que están en mayúsculas)
    if (trimmed.match(/^[0-9]+\)/) || trimmed.match(/^[-*]/) || trimmed.endsWith(':')) {
      // Es un título o lista
      if (trimmed.match(/^[0-9]+\)/)) {
        // Título numerado
        html += `<h2>${trimmed}</h2>\n`
      } else if (trimmed.match(/^[-*]/)) {
        // Item de lista
        html += `<li>${trimmed.substring(1).trim()}</li>\n`
      } else {
        // Título normal
        html += `<h3>${trimmed}</h3>\n`
      }
    } else if (trimmed === '---') {
      // Separador
      html += '<hr />\n'
    } else if (trimmed.length > 0) {
      // Párrafo normal
      html += `<p>${trimmed}</p>\n`
    }
  }
  
  return html
}

// Función para detectar categoría desde el título
function detectCategory(title) {
  const titleLower = title.toLowerCase()
  
  if (titleLower.includes('cachorro') || titleLower.includes('cachorros')) {
    return 'Cachorros'
  }
  if (titleLower.includes('adiestramiento') || titleLower.includes('adiestrador')) {
    return 'Adiestramiento'
  }
  if (titleLower.includes('educación') || titleLower.includes('educacion')) {
    return 'Educación Canina'
  }
  if (titleLower.includes('comportamiento') || titleLower.includes('conducta')) {
    return 'Comportamiento'
  }
  if (titleLower.includes('salud') || titleLower.includes('veterinario')) {
    return 'Salud'
  }
  if (titleLower.includes('playa') || titleLower.includes('normativa') || titleLower.includes('ley')) {
    return 'Legislación'
  }
  if (titleLower.includes('archena') || titleLower.includes('murcia') || titleLower.includes('región')) {
    return 'Local - Murcia'
  }
  
  return 'General' // Categoría por defecto
}

// Función para obtener o crear categoría
async function getOrCreateCategory(categoryName) {
  try {
    // Buscar categoría existente
    const { data: existing } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('name', categoryName)
      .maybeSingle()
    
    if (existing) {
      return existing.id
    }
    
    // Crear nueva categoría
    const colors = {
      'Cachorros': '#f59e0b',
      'Adiestramiento': '#3b82f6',
      'Educación Canina': '#10b981',
      'Comportamiento': '#8b5cf6',
      'Salud': '#ef4444',
      'Legislación': '#6b7280',
      'Local - Murcia': '#ec4899',
      'General': '#14b8a6'
    }
    
    const { data: newCategory, error } = await supabase
      .from('blog_categories')
      .insert({
        name: categoryName,
        slug: generateSlug(categoryName),
        color: colors[categoryName] || '#10b981',
        is_active: true,
        order_index: 0
      })
      .select()
      .single()
    
    if (error) {
      console.error(`   ⚠️  Error creando categoría ${categoryName}:`, error.message)
      return null
    }
    
    return newCategory.id
  } catch (error) {
    console.error(`   ⚠️  Error con categoría ${categoryName}:`, error.message)
    return null
  }
}

async function importArticles() {
  console.log('📂 Leyendo archivo CSV...\n')
  
  const articles = []
  
  // Leer CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream('blog_articles_backup.csv')
      .pipe(csv())
      .on('data', (row) => {
        // Solo agregar artículos que tengan título Y contenido
        if (row.Titulo && row.Articulo && row.Articulo.trim().length > 100) {
          articles.push(row)
        }
      })
      .on('end', resolve)
      .on('error', reject)
  })
  
  console.log(`✅ Encontrados ${articles.length} artículos válidos en CSV\n`)
  console.log('📝 Importando a Supabase...\n')
  
  let imported = 0
  let skipped = 0
  let errors = 0
  
  for (const article of articles) {
    try {
      const title = article.Titulo.trim()
      const content = article.Articulo.trim()
      
      if (!title || !content) {
        console.log(`   ⚠️  Saltando artículo sin título o contenido`)
        skipped++
        continue
      }
      
      // Detectar categoría
      const categoryName = detectCategory(title)
      const categoryId = await getOrCreateCategory(categoryName)
      
      // Generar slug único
      let slug = generateSlug(title)
      
      // Verificar si el slug ya existe
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      
      if (existingPost) {
        slug = `${slug}-${Date.now()}`
      }
      
      // Convertir contenido a HTML
      const htmlContent = convertToHTML(content)
      
      // Extraer excerpt
      const excerpt = extractExcerpt(content)
      
      // Calcular tiempo de lectura
      const readingTime = calculateReadingTime(content)
      
      // Insertar artículo
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title,
          slug,
          content: htmlContent,
          excerpt,
          featured_image_url: null, // Sin imágenes por ahora
          category_id: categoryId,
          status: 'published',
          is_featured: false,
          seo_title: title.substring(0, 60),
          seo_description: excerpt.substring(0, 160),
          reading_time_minutes: readingTime,
          views_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          published_at: new Date().toISOString()
        })
      
      if (insertError) {
        console.error(`   ❌ Error: ${title}`)
        console.error(`      ${insertError.message}`)
        errors++
      } else {
        imported++
        console.log(`   ✅ ${imported}/${articles.length} - ${title.substring(0, 70)}...`)
        console.log(`      Categoría: ${categoryName} | Tiempo: ${readingTime} min`)
      }
      
    } catch (error) {
      console.error(`   ❌ Error procesando artículo:`, error.message)
      errors++
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('🎉 IMPORTACIÓN COMPLETADA')
  console.log('='.repeat(80))
  console.log(`✅ Importados exitosamente: ${imported}`)
  console.log(`⚠️  Saltados (sin contenido): ${skipped}`)
  console.log(`❌ Errores: ${errors}`)
  console.log(`📊 Total procesados: ${articles.length}`)
  console.log('\n💡 Verifica los artículos en: https://www.hakadogs.com/administrator/blog')
  console.log('💡 Todos los artículos están publicados y sin imagen\n')
}

// Ejecutar
importArticles().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
