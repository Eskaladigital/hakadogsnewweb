const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputImage = path.join(__dirname, '..', 'public', 'images', 'hakadogs_logo_cuadrado_transparente.png');
const outputDir = path.join(__dirname, '..', 'public');

// Verificar que el archivo de entrada existe
if (!fs.existsSync(inputImage)) {
  console.error('❌ Error: No se encontró el logo de entrada');
  console.error('   Buscando en:', inputImage);
  process.exit(1);
}

console.log('🎨 Generando iconos PWA desde:', inputImage);
console.log('📁 Guardando en:', outputDir);
console.log('');

// Generar iconos en todos los tamaños
Promise.all(
  sizes.map(async (size) => {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(inputImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generado: icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error generando icon-${size}x${size}.png:`, error.message);
    }
  })
).then(() => {
  console.log('');
  console.log('🎉 ¡Todos los iconos PWA generados correctamente!');
  console.log('');
  console.log('Iconos creados:');
  sizes.forEach(size => {
    console.log(`  - icon-${size}x${size}.png`);
  });
}).catch(error => {
  console.error('❌ Error general:', error);
  process.exit(1);
});
