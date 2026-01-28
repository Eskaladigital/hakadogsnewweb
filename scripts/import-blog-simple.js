/**
 * Script para IMPORTAR artículos del blog desde Airtable CSV
 * SIN dependencias externas - Solo Node.js nativo
 * ============================================================
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Cargar variables de entorno desde .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      process.env[key.trim()] = value
    }
  })
  console.log('✅ Variables de entorno cargadas desde .env.local\n')
}

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

// Parser CSV simple
function parseCSV(content) {
  const lines = content.split('\n')
  const headers = lines[0].split(',').map(h => h.trim())
  const rows = []
  
  let currentRow = []
  let currentField = ''
  let insideQuotes = false
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j]
      const nextChar = line[j + 1]
      
      if (char === '"') {
        if (insideQuotes && nextChar === '"') {
          // Comillas escapadas
          currentField += '"'
          j++ // Saltar la siguiente comilla
        } else {
          // Inicio o fin de campo entrecomillado
          insideQuotes = !insideQuotes
        }
      } else if (char === ',' && !insideQuotes) {
        // Fin de campo
        currentRow.push(currentField)
        currentField = ''
      } else {
        currentField += char
      }
    }
    
    // Al final de la línea
    if (!insideQuotes) {
      currentRow.push(currentField)
      
      if (currentRow.length === headers.length) {
        const row = {}
        headers.forEach((header, index) => {
          row[header] = currentRow[index]
        })
        rows.push(row)
      }
      
      currentRow = []
      currentField = ''
    } else {
      // La línea continúa en la siguiente
      currentField += '\n'
    }
  }
  
  return rows
}

// Función para generar slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100)
}

// Función para calcular tiempo de lectura
function calculateReadingTime(content) {
  if (!content) return 5
  const text = content.replace(/<[^>]*>/g, '')
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(wordCount / 200))
}

// Función para extraer excerpt
function extractExcerpt(content) {
  if (!content) return ''
  let text = content.replace(/<[^>]*>/g, '')
  text = text.replace(/\n\n+/g, ' ')
  const paragraphs = text.split('\n').filter(p => p.trim().length > 50)
  if (paragraphs.length > 0) {
    return paragraphs[0].substring(0, 200).trim() + '...'
  }
  return text.substring(0, 200).trim() + '...'
}

// Función para convertir a HTML
function convertToHTML(content) {
  if (!content) return ''
  if (content.includes('<p>') || content.includes('<h1>')) {
    return content
  }
  
  const lines = content.split('\n').filter(line => line.trim())
  let html = ''
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.match(/^[0-9]+\)/)) {
      html += `<h2>${trimmed}</h2>\n`
    } else if (trimmed.match(/^[-*]/)) {
      html += `<li>${trimmed.substring(1).trim()}</li>\n`
    } else if (trimmed === '---') {
      html += '<hr />\n'
    } else if (trimmed.length > 0) {
      html += `<p>${trimmed}</p>\n`
    }
  }
  
  return html
}

// Función para detectar categoría
function detectCategory(title) {
  const titleLower = title.toLowerCase()
  if (titleLower.includes('cachorro') || titleLower.includes('cachorros')) return 'Cachorros'
  if (titleLower.includes('adiestramiento') || titleLower.includes('adiestrador')) return 'Adiestramiento'
  if (titleLower.includes('educación') || titleLower.includes('educacion')) return 'Educación Canina'
  if (titleLower.includes('comportamiento') || titleLower.includes('conducta')) return 'Comportamiento'
  if (titleLower.includes('salud') || titleLower.includes('veterinario')) return 'Salud'
  if (titleLower.includes('playa') || titleLower.includes('normativa') || titleLower.includes('ley')) return 'Legislación'
  if (titleLower.includes('archena') || titleLower.includes('murcia') || titleLower.includes('región')) return 'Local - Murcia'
  return 'General'
}

// Función para obtener o crear categoría
async function getOrCreateCategory(categoryName) {
  try {
    const { data: existing } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('name', categoryName)
      .maybeSingle()
    
    if (existing) return existing.id
    
    const colors = {
      'Cachorros': '#f59e0b', 'Adiestramiento': '#3b82f6', 'Educación Canina': '#10b981',
      'Comportamiento': '#8b5cf6', 'Salud': '#ef4444', 'Legislación': '#6b7280',
      'Local - Murcia': '#ec4899', 'General': '#14b8a6'
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
  
  const content = fs.readFileSync('blog articulos copia.csv', 'utf-8')
  const articles = parseCSV(content)
  
  console.log(`✅ Encontrados ${articles.length} registros en CSV\n`)
  console.log('🔍 Filtrando artículos válidos (con título y contenido)...\n')
  
  const validArticles = articles.filter(a => a.Titulo && a.Articulo && a.Articulo.trim().length > 100)
  
  console.log(`✅ ${validArticles.length} artículos válidos para importar\n`)
  console.log('📝 Importando a Supabase...\n')
  
  let imported = 0
  let errors = 0
  
  for (const article of validArticles) {
    try {
      const title = article.Titulo.trim()
      const content = article.Articulo.trim()
      
      const categoryName = detectCategory(title)
      const categoryId = await getOrCreateCategory(categoryName)
      
      let slug = generateSlug(title)
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      
      if (existingPost) {
        slug = `${slug}-${Date.now()}`
      }
      
      const htmlContent = convertToHTML(content)
      const excerpt = extractExcerpt(content)
      const readingTime = calculateReadingTime(content)
      
      const { error: insertError } = await supabase
        .from('blog_posts')
        .insert({
          title,
          slug,
          content: htmlContent,
          excerpt,
          featured_image_url: null,
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
        console.log(`   ✅ ${imported}/${validArticles.length} - ${title.substring(0, 70)}...`)
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
  console.log(`❌ Errores: ${errors}`)
  console.log(`📊 Total procesados: ${validArticles.length}`)
  console.log('\n💡 Verifica: https://www.hakadogs.com/administrator/blog\n')
}

importArticles().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
