/**
 * Script para importar artículos del blog desde CSV a Supabase
 * 
 * Uso:
 *   node scripts/import-blog-posts.js
 * 
 * Variables de entorno necesarias:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (NO la anon key, debe ser service_role)
 */

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// ============================================
// CONFIGURACIÓN
// ============================================

const CSV_FILE_PATH = path.join(__dirname, '..', 'Table 1-Grid view (1).csv')
const BATCH_SIZE = 50 // Insertar en lotes de 50 artículos
const DRY_RUN = false // Cambiar a true para ver qué se insertaría sin hacerlo

// ============================================
// UTILIDADES
// ============================================

/**
 * Genera un slug a partir de un texto
 */
function generateSlug(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 255)
}

/**
 * Calcula el tiempo de lectura basado en el contenido
 * (aprox 200 palabras por minuto)
 */
function calculateReadingTime(content) {
  if (!content) return 5
  const words = content.replace(/<[^>]+>/g, '').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

/**
 * Extrae un excerpt del contenido (primeros 200 caracteres)
 */
function extractExcerpt(content) {
  if (!content) return ''
  const plainText = content.replace(/<[^>]+>/g, '').trim()
  return plainText.length > 200 
    ? plainText.substring(0, 197) + '...'
    : plainText
}

/**
 * Parsea una fecha del CSV (formato: "12/1/2026 10:03pm")
 */
function parseCSVDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null
  
  try {
    // Formato esperado: "12/1/2026 10:03pm" o "12/1/2026 10:00pm"
    const [datePart, timePart] = dateStr.trim().split(' ')
    const [month, day, year] = datePart.split('/')
    
    // Extraer hora y minutos
    const isPM = timePart.toLowerCase().includes('pm')
    const isAM = timePart.toLowerCase().includes('am')
    const timeClean = timePart.replace(/[apm]/gi, '')
    const [hours, minutes] = timeClean.split(':')
    
    let hour = parseInt(hours, 10)
    if (isPM && hour !== 12) hour += 12
    if (isAM && hour === 12) hour = 0
    
    const date = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1, // Mes en JS es 0-indexed
      parseInt(day, 10),
      hour,
      parseInt(minutes || '0', 10)
    )
    
    return date.toISOString()
  } catch (error) {
    console.warn(`⚠️  No se pudo parsear fecha: "${dateStr}"`)
    return null
  }
}

/**
 * Determina el estado del post basado en las columnas del CSV
 */
function determineStatus(row) {
  // Si está marcado como "Publicado", status = published
  if (row.Publicado && row.Publicado.trim().toLowerCase() === 'checked') {
    return 'published'
  }
  // Si está escrito pero no publicado, draft
  if (row.Escrito && row.Escrito.trim().toLowerCase() === 'checked') {
    return 'draft'
  }
  // Por defecto: draft
  return 'draft'
}

/**
 * Lee y parsea el CSV
 */
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.split('\n')
  
  if (lines.length < 2) {
    throw new Error('El CSV está vacío o no tiene datos')
  }
  
  // Parsear header
  const header = lines[0].split(',').map(h => h.trim())
  console.log('📋 Columnas del CSV:', header)
  
  const posts = []
  let currentRow = {}
  let inMultilineField = false
  let currentField = ''
  let fieldIndex = 0
  
  // Parsear líneas (considerando campos multilínea)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    
    if (!inMultilineField) {
      // Comenzar nueva fila
      const fields = []
      let field = ''
      let inQuotes = false
      
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          fields.push(field.trim())
          field = ''
        } else {
          field += char
        }
      }
      fields.push(field.trim()) // Último campo
      
      // Si tenemos todas las columnas, es una fila completa
      if (fields.length === header.length) {
        const row = {}
        header.forEach((h, idx) => {
          row[h] = fields[idx] || ''
        })
        
        // Solo agregar si tiene título
        if (row.Titulo && row.Titulo.trim() !== '') {
          posts.push(row)
        }
      } else if (fields.length < header.length && fields[0]) {
        // Posible inicio de campo multilínea
        currentRow = {}
        header.forEach((h, idx) => {
          currentRow[h] = fields[idx] || ''
        })
        inMultilineField = true
        currentField = currentRow.Articulo || ''
        fieldIndex = 1 // Asumiendo que "Articulo" es el segundo campo
      }
    } else {
      // Continuar campo multilínea
      currentField += '\n' + line
      
      // Verificar si la línea termina el campo multilínea
      // (buscar un patrón que indique fin: fecha al final)
      if (line.includes('checked') || /\d{1,2}\/\d{1,2}\/\d{4}/.test(line)) {
        currentRow.Articulo = currentField
        inMultilineField = false
        
        if (currentRow.Titulo && currentRow.Titulo.trim() !== '') {
          posts.push(currentRow)
        }
      }
    }
  }
  
  console.log(`✅ Parseados ${posts.length} artículos del CSV`)
  return posts
}

/**
 * Mapea una fila del CSV a un objeto para blog_posts
 */
function mapCSVRowToPost(row, authorId) {
  const title = row.Titulo || ''
  const content = row.Articulo || ''
  const slug = generateSlug(title)
  const status = determineStatus(row)
  const publishedAt = status === 'published' ? parseCSVDate(row.Publicado || row.Modificado) : null
  const createdAt = parseCSVDate(row.Creacion) || new Date().toISOString()
  const updatedAt = parseCSVDate(row.Modificado) || createdAt
  
  return {
    title: title.substring(0, 255),
    slug,
    excerpt: extractExcerpt(content),
    content,
    featured_image_url: row['Imagen creada'] || null,
    status,
    reading_time_minutes: calculateReadingTime(content),
    seo_title: title.substring(0, 255),
    seo_description: extractExcerpt(content),
    published_at: publishedAt,
    created_at: createdAt,
    updated_at: updatedAt,
    author_id: authorId,
    category_id: null, // Se puede asignar manualmente después
    is_featured: false,
    views_count: 0
  }
}

// ============================================
// SCRIPT PRINCIPAL
// ============================================

async function main() {
  console.log('🚀 Iniciando importación de artículos del blog...\n')
  
  // 1. Verificar variables de entorno
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Faltan variables de entorno')
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
    process.exit(1)
  }
  
  // 2. Crear cliente de Supabase con service_role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  console.log('✅ Cliente de Supabase creado\n')
  
  // 3. Obtener ID del primer admin para asignarlo como autor
  console.log('🔍 Buscando usuario admin...')
  const { data: adminUsers, error: adminError } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'admin')
    .limit(1)
  
  let authorId = null
  
  if (adminError || !adminUsers || adminUsers.length === 0) {
    console.warn('⚠️  No se encontró usuario admin - los posts se insertarán con author_id = null')
    console.warn('   Puedes asignar el autor manualmente después desde el panel de administración\n')
  } else {
    authorId = adminUsers[0].user_id
    console.log(`✅ Usando admin como autor: ${authorId}\n`)
  }
  
  // 4. Leer y parsear CSV
  console.log('📖 Leyendo archivo CSV...')
  if (!fs.existsSync(CSV_FILE_PATH)) {
    console.error(`❌ No se encontró el archivo: ${CSV_FILE_PATH}`)
    process.exit(1)
  }
  
  const csvRows = parseCSV(CSV_FILE_PATH)
  console.log(`✅ Se encontraron ${csvRows.length} artículos\n`)
  
  // 5. Mapear filas a objetos de blog_posts
  console.log('🔄 Mapeando artículos...')
  const posts = csvRows.map(row => mapCSVRowToPost(row, authorId))
  console.log(`✅ ${posts.length} artículos mapeados\n`)
  
  // Mostrar preview de los primeros 3
  console.log('📝 Preview de los primeros artículos:')
  posts.slice(0, 3).forEach((post, idx) => {
    console.log(`\n  ${idx + 1}. ${post.title}`)
    console.log(`     Slug: ${post.slug}`)
    console.log(`     Estado: ${post.status}`)
    console.log(`     Tiempo lectura: ${post.reading_time_minutes} min`)
    console.log(`     Publicado: ${post.published_at ? new Date(post.published_at).toLocaleString() : 'No'}`)
  })
  console.log('\n')
  
  if (DRY_RUN) {
    console.log('🧪 DRY RUN activado - No se insertará nada')
    console.log(`   Se insertarían ${posts.length} artículos`)
    return
  }
  
  // 6. Insertar en lotes (upsert para evitar duplicados por slug)
  console.log(`📤 Insertando ${posts.length} artículos en lotes de ${BATCH_SIZE}...\n`)
  
  let inserted = 0
  let updated = 0
  let errors = 0
  
  for (let i = 0; i < posts.length; i += BATCH_SIZE) {
    const batch = posts.slice(i, i + BATCH_SIZE)
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(posts.length / BATCH_SIZE)
    
    console.log(`   Lote ${batchNumber}/${totalBatches} (${batch.length} artículos)...`)
    
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert(batch, {
        onConflict: 'slug',
        ignoreDuplicates: false // Actualizar si existe
      })
      .select()
    
    if (error) {
      console.error(`   ❌ Error en lote ${batchNumber}:`, error.message)
      errors += batch.length
    } else {
      // Contar si son nuevos o actualizados
      const newInserts = data ? data.length : batch.length
      inserted += newInserts
      console.log(`   ✅ Lote ${batchNumber} completado (${newInserts} procesados)`)
    }
    
    // Pequeña pausa para no saturar
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // 7. Resumen final
  console.log('\n' + '='.repeat(60))
  console.log('🎉 IMPORTACIÓN COMPLETADA')
  console.log('='.repeat(60))
  console.log(`✅ Artículos procesados: ${inserted}`)
  if (errors > 0) {
    console.log(`❌ Errores: ${errors}`)
  }
  console.log('\n💡 Recomendaciones:')
  console.log('   1. Revisa los artículos en el panel de administración')
  console.log('   2. Asigna categorías a los posts si es necesario')
  console.log('   3. Verifica que las imágenes destacadas estén correctas')
  console.log('   4. Ajusta los SEO titles y descriptions si lo necesitas')
  console.log('\n')
}

// Ejecutar
main().catch(error => {
  console.error('❌ Error fatal:', error)
  process.exit(1)
})
