/**
 * Script para generar contenido de TODAS las ciudades remotas
 * Lee desde remote-cities.json generado automáticamente
 * 
 * Uso: 
 *   node scripts/generate-all-remote-cities.js
 */

const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

// Configuración
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hakadogs.com';
const DELAY_MS = 8000; // 8 segundos entre requests

// Leer ciudades desde el JSON generado
const remoteCitiesPath = path.join(__dirname, 'remote-cities.json');
const REMOTE_CITIES = JSON.parse(fs.readFileSync(remoteCitiesPath, 'utf8'));

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateCity(city, index, total) {
  const progress = `[${index + 1}/${total}]`;
  
  console.log(`\n${progress} 🏙️  ${city.name} (${city.province})`);
  console.log(`   📍 Distancia: ${city.distanceFromArchena}km | Población: ${city.population.toLocaleString()}`);

  try {
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
  console.log('🚀 GENERADOR DE CONTENIDO - TODAS LAS CIUDADES REMOTAS');
  console.log('═══════════════════════════════════════════════════');
  console.log('');

  // Límite opcional desde argumentos
  const limit = process.argv[2] ? parseInt(process.argv[2]) : REMOTE_CITIES.length;
  const cities = REMOTE_CITIES.slice(0, limit);

  console.log(`📊 Total de ciudades a procesar: ${cities.length}`);
  console.log(`⏱️  Tiempo estimado: ~${Math.ceil(cities.length * DELAY_MS / 1000 / 60)} minutos`);
  console.log(`💰 Costo estimado: ~$${(cities.length * 0.10).toFixed(2)} USD`);
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
  console.log(`━━ Total exitoso:     ${results.generated.length + results.cached.length}/${cities.length}`);

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
