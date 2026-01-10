// Script para convertir imágenes JPG/PNG a WebP
// Uso: node scripts/optimize-images.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = IMAGES_DIR; // Guardar en la misma carpeta

// Configuración de optimización
const WEBP_QUALITY = 85;
const RESIZE_MAX_WIDTH = 2000; // Redimensionar si es más grande

async function convertToWebP(inputPath, outputPath) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    console.log(`\n📸 Procesando: ${path.basename(inputPath)}`);
    console.log(`   Tamaño original: ${metadata.width}x${metadata.height} - ${metadata.format.toUpperCase()}`);
    
    // Construir pipeline de optimización
    let pipeline = image;
    
    // Redimensionar si es muy grande
    if (metadata.width > RESIZE_MAX_WIDTH) {
      console.log(`   ⚠️  Redimensionando a ${RESIZE_MAX_WIDTH}px de ancho`);
      pipeline = pipeline.resize(RESIZE_MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Convertir a WebP
    await pipeline
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
    
    // Comparar tamaños
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    
    console.log(`   ✅ WebP creado: ${(webpSize / 1024).toFixed(1)}KB (ahorro: ${savings}%)`);
    
    return { success: true, originalSize, webpSize, savings };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Iniciando optimización de imágenes...\n');
  console.log(`📁 Directorio: ${IMAGES_DIR}\n`);
  
  // Leer todos los archivos del directorio
  const files = fs.readdirSync(IMAGES_DIR);
  
  // Filtrar solo JPG y PNG (excluir WebP ya existentes)
  const imagesToConvert = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return (ext === '.jpg' || ext === '.jpeg' || ext === '.png') && 
           !file.endsWith('_optimized.webp'); // Evitar reconvertir
  });
  
  if (imagesToConvert.length === 0) {
    console.log('ℹ️  No se encontraron imágenes JPG/PNG para convertir.');
    return;
  }
  
  console.log(`📊 Encontradas ${imagesToConvert.length} imágenes para convertir\n`);
  
  // Estadísticas
  let totalOriginalSize = 0;
  let totalWebpSize = 0;
  let successCount = 0;
  let errorCount = 0;
  
  // Convertir cada imagen
  for (const file of imagesToConvert) {
    const inputPath = path.join(IMAGES_DIR, file);
    const outputPath = path.join(
      OUTPUT_DIR, 
      path.basename(file, path.extname(file)) + '.webp'
    );
    
    // No sobrescribir si ya existe WebP (opcional: comentar para forzar)
    if (fs.existsSync(outputPath)) {
      console.log(`\n⏭️  Saltando: ${file} (WebP ya existe)`);
      continue;
    }
    
    const result = await convertToWebP(inputPath, outputPath);
    
    if (result.success) {
      totalOriginalSize += result.originalSize;
      totalWebpSize += result.webpSize;
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  // Resumen final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE OPTIMIZACIÓN');
  console.log('='.repeat(60));
  console.log(`✅ Imágenes convertidas: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`💾 Tamaño original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`🚀 Tamaño WebP total: ${(totalWebpSize / 1024 / 1024).toFixed(2)}MB`);
  
  if (totalOriginalSize > 0) {
    const totalSavings = ((totalOriginalSize - totalWebpSize) / totalOriginalSize * 100).toFixed(1);
    console.log(`📉 Reducción total: ${totalSavings}%`);
  }
  
  console.log('='.repeat(60));
  console.log('\n✨ Optimización completada!\n');
  
  // Recomendaciones
  console.log('💡 PRÓXIMOS PASOS:');
  console.log('   1. Verificar las imágenes WebP en public/images/');
  console.log('   2. Actualizar referencias en el código si es necesario');
  console.log('   3. Considerar eliminar JPG/PNG originales si no se usan directamente');
  console.log('   4. Commit y push de las imágenes optimizadas\n');
}

// Ejecutar
main().catch(console.error);
