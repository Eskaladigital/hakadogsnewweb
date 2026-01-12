/**
 * Script para contar ciudades en caché de Supabase
 */

const SUPABASE_URL = 'https://jshqrsnzxzbizgjyfsde.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzaHFyc256eHpiaXpnanlmc2RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMDcxMTEsImV4cCI6MjA1MTU4MzExMX0.GCFo3-xH1wGGRMR7M4CYnrXP0VTzp6kQcjOXWs07OKw';

async function countCachedCities() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('📊 CONTEO DE CIUDADES EN CACHÉ DE SUPABASE');
  console.log('═══════════════════════════════════════════════════\n');

  try {
    // Obtener count de ciudades
    const countResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/city_content_cache?select=city_slug,city_name,province,generated_at&order=city_name.asc`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!countResponse.ok) {
      throw new Error(`Error HTTP: ${countResponse.status}`);
    }

    const cities = await countResponse.json();

    console.log(`✅ Total de ciudades en caché: ${cities.length}/42\n`);
    
    console.log('📋 CIUDADES GENERADAS:\n');
    cities.forEach((city, index) => {
      const date = new Date(city.generated_at).toLocaleString('es-ES');
      console.log(`   ${index + 1}. ${city.city_name} (${city.province}) - ${date}`);
    });

    console.log('\n───────────────────────────────────────────────────');
    
    // Calcular ciudades faltantes
    const remoteCities = require('./remote-cities.json');
    const cachedSlugs = new Set(cities.map(c => c.city_slug));
    const missingCities = remoteCities.filter(c => !cachedSlugs.has(c.slug));

    if (missingCities.length > 0) {
      console.log(`\n⚠️  CIUDADES FALTANTES (${missingCities.length}):\n`);
      missingCities.forEach((city, index) => {
        console.log(`   ${index + 1}. ${city.name} (${city.province}) - ${city.slug}`);
      });
    } else {
      console.log('\n🎉 ¡TODAS LAS 42 CIUDADES GENERADAS!');
    }

    console.log('\n═══════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

countCachedCities();
