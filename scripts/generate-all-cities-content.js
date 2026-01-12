/**
 * Script para generar contenido único de TODAS las ciudades
 * Usa SerpApi + OpenAI y lo guarda en Supabase
 * 
 * Uso: node scripts/generate-all-cities-content.js
 */

const fs = require('fs');
const path = require('path');

// Configuración
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const DELAY_BETWEEN_REQUESTS = 5000; // 5 segundos entre cada ciudad (para no saturar APIs)

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Función para hacer delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para generar contenido de una ciudad
async function generateCityContent(city) {
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
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error desconocido');
  }

  return await response.json();
}

// Función principal
async function main() {
  console.log(`${colors.cyan}════════════════════════════════════════════════════════`);
  console.log(`🚀 GENERADOR DE CONTENIDO ÚNICO PARA LOCALIDADES`);
  console.log(`════════════════════════════════════════════════════════${colors.reset}\n`);

  // Leer archivo de ciudades
  const citiesPath = path.join(__dirname, '../lib/cities.ts');
  let citiesContent;
  
  try {
    citiesContent = fs.readFileSync(citiesPath, 'utf-8');
  } catch (error) {
    console.error(`${colors.red}❌ Error leyendo archivo de ciudades${colors.reset}`);
    process.exit(1);
  }

  // Extraer array de ciudades del archivo TypeScript
  const citiesMatch = citiesContent.match(/export const cities: CityData\[\] = (\[[\s\S]*?\n\])/);
  if (!citiesMatch) {
    console.error(`${colors.red}❌ No se pudo extraer array de ciudades${colors.reset}`);
    process.exit(1);
  }

  // Parsear ciudades (evaluamos el array de forma segura)
  let cities;
  try {
    // Reemplazar comillas simples por dobles para JSON válido
    const citiesStr = citiesMatch[1]
      .replace(/'/g, '"')
      .replace(/,(\s*[}\]])/g, '$1'); // Quitar comas finales
    
    cities = eval(citiesStr); // Solo para desarrollo - en producción usar un parser real
  } catch (error) {
    console.error(`${colors.red}❌ Error parseando ciudades:${colors.reset}`, error.message);
    process.exit(1);
  }

  console.log(`${colors.blue}📍 Ciudades encontradas: ${cities.length}${colors.reset}\n`);

  // Filtrar solo ciudades remotas (que necesitan contenido)
  const remoteCities = cities.filter(city => city.isRemoteMarket === true);
  console.log(`${colors.yellow}🌐 Ciudades remotas (a generar): ${remoteCities.length}${colors.reset}\n`);

  // Confirmar antes de continuar
  console.log(`${colors.cyan}════════════════════════════════════════════════════════`);
  console.log(`⚠️  IMPORTANTE:`);
  console.log(`   - Se generará contenido para ${remoteCities.length} ciudades`);
  console.log(`   - Costo aproximado: ~$3 USD (SerpApi + OpenAI)`);
  console.log(`   - Tiempo estimado: ~${Math.ceil(remoteCities.length * 10 / 60)} minutos`);
  console.log(`════════════════════════════════════════════════════════${colors.reset}\n`);

  // Estadísticas
  const stats = {
    total: remoteCities.length,
    success: 0,
    cached: 0,
    errors: 0,
    errorCities: [],
  };

  console.log(`${colors.green}🚀 Iniciando generación...${colors.reset}\n`);

  // Generar contenido para cada ciudad
  for (let i = 0; i < remoteCities.length; i++) {
    const city = remoteCities[i];
    const progress = `[${i + 1}/${remoteCities.length}]`;

    try {
      console.log(`${colors.cyan}${progress} Procesando ${city.name} (${city.province})...${colors.reset}`);

      const result = await generateCityContent(city);

      if (result.cached) {
        stats.cached++;
        console.log(`${colors.yellow}   ✓ Ya existe en caché (${result.generatedAt})${colors.reset}`);
      } else {
        stats.success++;
        console.log(`${colors.green}   ✓ Contenido generado exitosamente${colors.reset}`);
      }

    } catch (error) {
      stats.errors++;
      stats.errorCities.push({ name: city.name, error: error.message });
      console.log(`${colors.red}   ✗ Error: ${error.message}${colors.reset}`);
    }

    // Delay entre requests (excepto en el último)
    if (i < remoteCities.length - 1) {
      console.log(`${colors.blue}   ⏳ Esperando ${DELAY_BETWEEN_REQUESTS / 1000}s antes de la siguiente...${colors.reset}\n`);
      await sleep(DELAY_BETWEEN_REQUESTS);
    }
  }

  // Resumen final
  console.log(`\n${colors.cyan}════════════════════════════════════════════════════════`);
  console.log(`📊 RESUMEN FINAL`);
  console.log(`════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}✓ Generadas nuevas: ${stats.success}${colors.reset}`);
  console.log(`${colors.yellow}✓ Ya en caché: ${stats.cached}${colors.reset}`);
  console.log(`${colors.red}✗ Errores: ${stats.errors}${colors.reset}`);
  console.log(`${colors.blue}━ Total procesadas: ${stats.success + stats.cached} / ${stats.total}${colors.reset}`);

  // Mostrar errores si los hay
  if (stats.errors > 0) {
    console.log(`\n${colors.red}Ciudades con error:${colors.reset}`);
    stats.errorCities.forEach(({ name, error }) => {
      console.log(`  - ${name}: ${error}`);
    });
  }

  console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}✅ Proceso completado${colors.reset}\n`);

  // Código de salida
  process.exit(stats.errors > 0 ? 1 : 0);
}

// Ejecutar
main().catch(error => {
  console.error(`${colors.red}\n❌ Error fatal:${colors.reset}`, error);
  process.exit(1);
});
