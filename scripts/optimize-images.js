/**
 * Script de Optimización de Imágenes para PageSpeed
 * Convierte automáticamente PNG a WebP/AVIF con Sharp
 * 
 * Uso: node scripts/optimize-images.js
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// Configuración
const CONFIG = {
  inputDir: path.join(__dirname, '..', 'public', 'images'),
  quality: {
    webp: 85,
    avif: 80,
    jpeg: 85
  },
  sizes: [320, 640, 768, 1024, 1920], // Tamaños responsive
  formats: ['webp', 'avif'], // Formatos modernos
  skipPatterns: ['logo_definitivo_hakadogs.webp'], // Ya optimizado
}

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Función para obtener todas las imágenes
function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getAllImages(filePath, fileList)
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      // Verificar si no está en skipPatterns
      if (!CONFIG.skipPatterns.some(pattern => file.includes(pattern))) {
        fileList.push(filePath)
      }
    }
  })

  return fileList
}

// Función para optimizar una imagen
async function optimizeImage(imagePath) {
  const fileName = path.basename(imagePath, path.extname(imagePath))
  const dirName = path.dirname(imagePath)
  const ext = path.extname(imagePath).toLowerCase()
  
  log(`\n📸 Procesando: ${path.relative(CONFIG.inputDir, imagePath)}`, 'blue')
  
  try {
    const image = sharp(imagePath)
    const metadata = await image.metadata()
    const originalSize = fs.statSync(imagePath).size
    
    log(`   Dimensiones originales: ${metadata.width}x${metadata.height}`, 'yellow')
    log(`   Tamaño original: ${(originalSize / 1024).toFixed(2)} KB`, 'yellow')
    
    let totalSaved = 0

    // Generar versiones responsive
    for (const width of CONFIG.sizes) {
      if (width >= metadata.width) continue // No agrandar imágenes
      
      for (const format of CONFIG.formats) {
        const outputPath = path.join(
          dirName,
          `${fileName}-${width}w.${format}`
        )
        
        await image
          .clone()
          .resize(width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          [format]({ quality: CONFIG.quality[format] })
          .toFile(outputPath)
        
        const newSize = fs.statSync(outputPath).size
        totalSaved += originalSize - newSize
        
        log(`   ✅ ${width}w.${format}: ${(newSize / 1024).toFixed(2)} KB`, 'green')
      }
    }
    
    // Generar versión optimizada full-size
    for (const format of CONFIG.formats) {
      const outputPath = path.join(dirName, `${fileName}.${format}`)
      
      await image
        .clone()
        [format]({ quality: CONFIG.quality[format] })
        .toFile(outputPath)
      
      const newSize = fs.statSync(outputPath).size
      totalSaved += originalSize - newSize
      
      log(`   ✅ Full-size ${format}: ${(newSize / 1024).toFixed(2)} KB`, 'green')
    }
    
    log(`   💾 Ahorro total: ${(totalSaved / 1024).toFixed(2)} KB`, 'green')
    
    return {
      original: imagePath,
      originalSize,
      saved: totalSaved
    }
    
  } catch (error) {
    log(`   ❌ Error: ${error.message}`, 'red')
    return null
  }
}

// Función principal
async function main() {
  log('\n🚀 Iniciando optimización de imágenes para PageSpeed\n', 'blue')
  log(`📁 Directorio: ${CONFIG.inputDir}`, 'yellow')
  log(`📐 Tamaños: ${CONFIG.sizes.join(', ')}px`, 'yellow')
  log(`🖼️  Formatos: ${CONFIG.formats.join(', ')}`, 'yellow')
  log(`🎯 Calidad: WebP ${CONFIG.quality.webp}%, AVIF ${CONFIG.quality.avif}%\n`, 'yellow')
  
  const images = getAllImages(CONFIG.inputDir)
  
  if (images.length === 0) {
    log('⚠️  No se encontraron imágenes para optimizar', 'yellow')
    return
  }
  
  log(`📋 Encontradas ${images.length} imágenes\n`, 'blue')
  
  const results = []
  
  for (const imagePath of images) {
    const result = await optimizeImage(imagePath)
    if (result) results.push(result)
  }
  
  // Resumen
  const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0)
  const totalSaved = results.reduce((sum, r) => sum + r.saved, 0)
  const percentSaved = ((totalSaved / totalOriginal) * 100).toFixed(1)
  
  log('\n' + '='.repeat(60), 'blue')
  log('📊 RESUMEN DE OPTIMIZACIÓN', 'blue')
  log('='.repeat(60), 'blue')
  log(`✅ Imágenes procesadas: ${results.length}`, 'green')
  log(`📦 Tamaño original total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`, 'yellow')
  log(`💾 Espacio ahorrado: ${(totalSaved / 1024 / 1024).toFixed(2)} MB (${percentSaved}%)`, 'green')
  log('='.repeat(60) + '\n', 'blue')
  
  // Generar reporte
  const report = {
    date: new Date().toISOString(),
    totalImages: results.length,
    totalOriginalSize: totalOriginal,
    totalSaved: totalSaved,
    percentSaved: percentSaved,
    images: results.map(r => ({
      path: path.relative(CONFIG.inputDir, r.original),
      originalSize: r.originalSize,
      saved: r.saved
    }))
  }
  
  const reportPath = path.join(__dirname, 'image-optimization-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  log(`📄 Reporte guardado en: ${reportPath}`, 'blue')
  
  log('\n💡 PRÓXIMOS PASOS:', 'yellow')
  log('1. Actualizar referencias de imágenes en componentes', 'yellow')
  log('2. Usar atributo sizes en Image components', 'yellow')
  log('3. Considerar eliminar originales PNG/JPG después de verificar', 'yellow')
  log('4. Agregar blur placeholders con plaiceholder', 'yellow')
  log('\n🎉 ¡Optimización completada!\n', 'green')
}

// Ejecutar
main().catch(error => {
  log(`\n❌ Error fatal: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
