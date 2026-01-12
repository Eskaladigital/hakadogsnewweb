/**
 * Script simplificado para generar contenido de ciudades
 * Lee ciudades desde el endpoint y genera contenido
 * 
 * Uso: 
 *   npm run generate-cities        (todas las ciudades remotas)
 *   npm run generate-cities -- 5   (solo las primeras 5)
 */

const fetch = require('node-fetch');

// Configuración
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const DELAY_MS = 8000; // 8 segundos entre requests (para APIs)

// Ciudades remotas que necesitan contenido
const REMOTE_CITIES = [
  { slug: 'cartagena', name: 'Cartagena', province: 'Murcia', population: 218000, distanceFromArchena: 70, region: 'Región de Murcia' },
  { slug: 'lorca', name: 'Lorca', province: 'Murcia', population: 95000, distanceFromArchena: 60, region: 'Región de Murcia' },
  { slug: 'torrevieja', name: 'Torrevieja', province: 'Alicante', population: 83000, distanceFromArchena: 70, region: 'Comunidad Valenciana' },
  { slug: 'elche', name: 'Elche', province: 'Alicante', population: 230000, distanceFromArchena: 90, region: 'Comunidad Valenciana' },
  { slug: 'alicante', name: 'Alicante', province: 'Alicante', population: 330000, distanceFromArchena: 100, region: 'Comunidad Valenciana' },
  { slug: 'orihuela', name: 'Orihuela', province: 'Alicante', population: 85000, distanceFromArchena: 60, region: 'Comunidad Valenciana' },
  { slug: 'san-javier', name: 'San Javier', province: 'Murcia', population: 33000, distanceFromArchena: 55, region: 'Región de Murcia' },
  { slug: 'mazarron', name: 'Mazarrón', province: 'Murcia', population: 34000, distanceFromArchena: 75, region: 'Región de Murcia' },
  { slug: 'aguilas', name: 'Águilas', province: 'Murcia', population: 35000, distanceFromArchena: 110, region: 'Región de Murcia' },
  { slug: 'almeria', name: 'Almería', province: 'Almería', population: 200000, distanceFromArchena: 200, region: 'Andalucía' },
  { slug: 'valencia', name: 'Valencia', province: 'Valencia', population: 800000, distanceFromArchena: 280, region: 'Comunidad Valenciana' },
  { slug: 'benidorm', name: 'Benidorm', province: 'Alicante', population: 70000, distanceFromArchena: 120, region: 'Comunidad Valenciana' },
  { slug: 'denia', name: 'Denia', province: 'Alicante', population: 42000, distanceFromArchena: 150, region: 'Comunidad Valenciana' },
  { slug: 'gandia', name: 'Gandía', province: 'Valencia', population: 75000, distanceFromArchena: 200, region: 'Comunidad Valenciana' },
  { slug: 'albacete', name: 'Albacete', province: 'Albacete', population: 173000, distanceFromArchena: 150, region: 'Castilla-La Mancha' },
  { slug: 'granada', name: 'Granada', province: 'Granada', population: 233000, distanceFromArchena: 320, region: 'Andalucía' },
  { slug: 'malaga', name: 'Málaga', province: 'Málaga', population: 580000, distanceFromArchena: 450, region: 'Andalucía' },
  { slug: 'sevilla', name: 'Sevilla', province: 'Sevilla', population: 690000, distanceFromArchena: 480, region: 'Andalucía' },
  { slug: 'madrid', name: 'Madrid', province: 'Madrid', population: 3300000, distanceFromArchena: 400, region: 'Comunidad de Madrid' },
  { slug: 'barcelona', name: 'Barcelona', province: 'Barcelona', population: 1600000, distanceFromArchena: 550, region: 'Cataluña' },
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateCity(city, index, total) {
  const progress = `[${index + 1}/${total}]`;
  
  console.log(`\n${progress} 🏙️  ${city.name} (${city.province})`);
  console.log(`   📍 Distancia: ${city.distanceFromArchena}km | Población: ${city.population.toLocaleString()}`);

  try {
    // Mapear el objeto al formato que espera la API
    const payload = {
      citySlug: city.slug,
      cityName: city.name,
      province: city.province,
      population: city.population,
      distanceFromArchena: city.distanceFromArchena,
      region: city.region,
    };

    const response = await fetch(`${API_URL}/api/generate-city-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();

    if (result.cached) {
      console.log(`   ✅ Ya existe en caché (generado: ${new Date(result.generatedAt).toLocaleDateString()})`);
      return { status: 'cached', city: city.name };
    } else {
      console.log(`   ✨ Contenido generado con SerpApi + OpenAI`);
      console.log(`   💾 Guardado en Supabase`);
      return { status: 'generated', city: city.name };
    }

  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { status: 'error', city: city.name, error: error.message };
  }
}

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('🚀 GENERADOR DE CONTENIDO ÚNICO - LOCALIDADES');
  console.log('═══════════════════════════════════════════════════');
  console.log('');

  // Límite opcional desde argumentos
  const limit = process.argv[2] ? parseInt(process.argv[2]) : REMOTE_CITIES.length;
  const cities = REMOTE_CITIES.slice(0, limit);

  console.log(`📊 Total de ciudades a procesar: ${cities.length}`);
  console.log(`⏱️  Tiempo estimado: ~${Math.ceil(cities.length * DELAY_MS / 1000 / 60)} minutos`);
  console.log(`💰 Costo estimado: ~$${(cities.length * 0.15).toFixed(2)} USD`);
  console.log('');
  console.log('───────────────────────────────────────────────────');

  const results = {
    generated: [],
    cached: [],
    errors: [],
  };

  for (let i = 0; i < cities.length; i++) {
    const result = await generateCity(cities[i], i, cities.length);

    if (result.status === 'generated') results.generated.push(result.city);
    else if (result.status === 'cached') results.cached.push(result.city);
    else if (result.status === 'error') results.errors.push({ city: result.city, error: result.error });

    // Delay entre requests
    if (i < cities.length - 1) {
      const seconds = DELAY_MS / 1000;
      process.stdout.write(`   ⏳ Esperando ${seconds}s... `);
      await sleep(DELAY_MS);
      console.log('✓');
    }
  }

  // Resumen
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('📊 RESUMEN FINAL');
  console.log('═══════════════════════════════════════════════════');
  console.log(`✨ Generadas nuevas:  ${results.generated.length}`);
  console.log(`✅ Ya en caché:       ${results.cached.length}`);
  console.log(`❌ Errores:           ${results.errors.length}`);
  console.log(`━━ Total:             ${results.generated.length + results.cached.length}/${cities.length}`);

  if (results.errors.length > 0) {
    console.log('');
    console.log('Errores:');
    results.errors.forEach(({ city, error }) => {
      console.log(`  • ${city}: ${error}`);
    });
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(results.errors.length === 0 ? '✅ Completado exitosamente' : '⚠️  Completado con errores');
  console.log('═══════════════════════════════════════════════════');
  console.log('');

  process.exit(results.errors.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('\n❌ Error fatal:', error);
  process.exit(1);
});
