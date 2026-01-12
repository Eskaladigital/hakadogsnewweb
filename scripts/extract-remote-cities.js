/**
 * Script para identificar y generar contenido para TODAS las ciudades remotas
 * Extrae automáticamente las ciudades con isRemoteMarket: true
 */

const fs = require('fs');
const path = require('path');

// Leer el archivo cities.ts y extraer ciudades remotas
const citiesPath = path.join(__dirname, '..', 'lib', 'cities.ts');
const citiesContent = fs.readFileSync(citiesPath, 'utf8');

// Extraer todas las ciudades remotas del archivo
const remoteCities = [];
const cityBlocks = citiesContent.split('},');

cityBlocks.forEach(block => {
  if (block.includes('isRemoteMarket: true')) {
    const slugMatch = block.match(/slug: '([^']+)'/);
    const nameMatch = block.match(/name: '([^']+)'/);
    const provinceMatch = block.match(/province: '([^']+)'/);
    const regionMatch = block.match(/region: '([^']+)'/);
    const populationMatch = block.match(/population: (\d+)/);
    const distanceMatch = block.match(/distanceFromArchena: (\d+)/);
    
    if (slugMatch && nameMatch && provinceMatch) {
      remoteCities.push({
        slug: slugMatch[1],
        name: nameMatch[1],
        province: provinceMatch[1],
        region: regionMatch ? regionMatch[1] : 'España',
        population: populationMatch ? parseInt(populationMatch[1]) : 100000,
        distanceFromArchena: distanceMatch ? parseInt(distanceMatch[1]) : 100
      });
    }
  }
});

console.log('');
console.log('═══════════════════════════════════════════════════');
console.log('📊 ANÁLISIS DE CIUDADES REMOTAS');
console.log('═══════════════════════════════════════════════════');
console.log('');
console.log(`✅ Total ciudades remotas encontradas: ${remoteCities.length}`);
console.log('');
console.log('Ciudades:');
remoteCities.forEach((city, i) => {
  console.log(`${i + 1}. ${city.name} (${city.province}) - ${city.distanceFromArchena}km`);
});
console.log('');
console.log('═══════════════════════════════════════════════════');
console.log('');

// Guardar en un archivo JSON para uso del script de generación
const outputPath = path.join(__dirname, 'remote-cities.json');
fs.writeFileSync(outputPath, JSON.stringify(remoteCities, null, 2));
console.log(`✅ Lista guardada en: ${outputPath}`);
console.log('');
console.log('📝 Próximo paso: Ejecutar generate-cities-from-list.js');
console.log('');
