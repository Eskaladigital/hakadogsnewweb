# 🤖 Guía de Automatización de Contenido para Localidades

> **Última actualización:** 17 Enero 2026  
> **Estado:** Documentación para implementación futura  
> **Objetivo:** Generar contenido único y real para 43+ páginas de localidades usando OpenAI + Search APIs

---

## 📋 Índice

1. [Contexto y Problema](#contexto-y-problema)
2. [Solución Propuesta](#solución-propuesta)
3. [Arquitectura Técnica](#arquitectura-técnica)
4. [APIs Necesarias](#apis-necesarias)
5. [Costes Estimados](#costes-estimados)
6. [Implementación Paso a Paso](#implementación-paso-a-paso)
7. [Script de Ejemplo](#script-de-ejemplo)
8. [Prompts de OpenAI](#prompts-de-openai)
9. [Control de Calidad](#control-de-calidad)
10. [Mantenimiento](#mantenimiento)

---

## 🎯 Contexto y Problema

### Situación actual (Enero 2026)

- ✅ 43 páginas de localidades remotas generadas con contenido IA básico
- ⚠️ Contenido generado sin datos reales de cada ciudad
- ⚠️ Riesgo de penalización SEO por "thin content"
- ⚠️ Información genérica sin valor único por ciudad

### Objetivo

Generar contenido **único, útil y basado en datos reales** para cada localidad que:
- Incluya pipicanes y zonas caninas reales
- Contenga normativas municipales específicas
- Mencione espacios dog-friendly verificados
- Aporte valor real aunque no contraten
- Sea actualizable automáticamente

---

## 💡 Solución Propuesta

### Flujo de automatización

```
1. Search API → Busca datos reales de la ciudad
2. Data Processing → Estructura y limpia información
3. OpenAI GPT-4 → Genera contenido único basado en datos
4. Human Review → Revisión manual (20% del tiempo)
5. Supabase → Actualiza city_content_cache
6. Deploy → Contenido nuevo en producción
```

### Ventajas

✅ **Escalable:** Una vez configurado, generar 43 ciudades en ~2 horas  
✅ **Real:** Basado en búsquedas actuales de Google  
✅ **Actualizable:** Re-ejecutar script cada 3-6 meses  
✅ **SEO-friendly:** Contenido único por ciudad  
✅ **Ahorro tiempo:** 80% automatizado vs 100% manual  

---

## 🏗️ Arquitectura Técnica

### Componentes

```
┌─────────────────┐
│  Search APIs    │  → Brave/Serper/Perplexity
│  (Datos reales) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OpenAI GPT-4   │  → Generación de contenido
│  (Redacción)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase       │  → city_content_cache
│  (Almacenamiento│
└─────────────────┘
```

### Flujo por ciudad

```javascript
async function generateCityContent(city) {
  // 1. BÚSQUEDA DE DATOS REALES
  const pipicanes = await searchPipicanes(city)
  const normativas = await searchNormativas(city)
  const dogFriendly = await searchDogFriendly(city)
  const playas = await searchPlayasPerros(city) // si es costa
  
  // 2. GENERACIÓN CON IA
  const content = await generateWithOpenAI({
    city,
    realData: { pipicanes, normativas, dogFriendly, playas }
  })
  
  // 3. VALIDACIÓN
  const validated = await validateContent(content)
  
  // 4. GUARDADO
  await saveToSupabase(city.slug, validated)
  
  return validated
}
```

---

## 🔌 APIs Necesarias

### Opción A: Brave Search API (RECOMENDADA - Gratis)

**Características:**
- ✅ **Gratis:** 2,000 búsquedas/mes
- ✅ **Resultados reales de Google**
- ✅ **Sin límite de rate**
- 📝 Registro: https://brave.com/search/api/

```javascript
// Ejemplo de uso
const BRAVE_API_KEY = process.env.BRAVE_API_KEY

async function searchBrave(query) {
  const response = await fetch(
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
    {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY
      }
    }
  )
  return await response.json()
}

// Buscar pipicanes
const results = await searchBrave('pipicanes Alicante')
```

**Coste:** $0 (hasta 2000 queries/mes)

---

### Opción B: Serper API (Alternativa de pago)

**Características:**
- 💰 **Pago:** $50/mes (5,000 búsquedas)
- ✅ **Resultados estructurados mejor**
- ✅ **Más rápida**
- 📝 Registro: https://serper.dev

```javascript
const SERPER_API_KEY = process.env.SERPER_API_KEY

async function searchSerper(query) {
  const response = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: query, num: 10 })
  })
  return await response.json()
}
```

**Coste:** $50/mes

---

### Opción C: Perplexity API (Todo-en-uno)

**Características:**
- 💰 **Pago:** $0.005/request (~$20 para 43 ciudades)
- ✅ **Búsqueda + IA integrados**
- ✅ **Más simple de implementar**
- ⚠️ **Menos control sobre el output**
- 📝 Registro: https://www.perplexity.ai/api

```javascript
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY

async function generateWithPerplexity(city) {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'sonar-pro',
      messages: [{
        role: 'user',
        content: `Busca información actualizada sobre:
        - Pipicanes y zonas caninas en ${city}
        - Normativas municipales sobre perros
        - Espacios dog-friendly
        
        Genera contenido útil para dueños de perros en ${city}.`
      }]
    })
  })
  return await response.json()
}
```

**Coste:** ~$20 para 43 ciudades

---

### OpenAI API (Obligatoria)

**Características:**
- ✅ **GPT-4 Turbo:** $0.01/1K tokens input, $0.03/1K tokens output
- ✅ **Calidad superior**
- 📝 Ya tienes cuenta configurada

```javascript
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

import OpenAI from 'openai'
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

async function generateContent(city, realData) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "Eres un experto en educación canina que crea contenido útil y único por ciudad."
      },
      {
        role: "user",
        content: `Genera contenido para ${city} basado en estos datos reales:\n${JSON.stringify(realData, null, 2)}`
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  })
  
  return completion.choices[0].message.content
}
```

**Coste estimado:** $15-25 para generar 43 ciudades

---

### Google Places API (Opcional)

**Características:**
- ✅ **Gratis:** 28,500 requests/mes
- ✅ **Datos estructurados de parques**
- 📝 Requiere Google Cloud account

```javascript
async function findDogParks(city, lat, lng) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&keyword=dog+park&key=${GOOGLE_PLACES_KEY}`
  )
  return await response.json()
}
```

**Coste:** $0 (dentro del límite gratuito)

---

## 💰 Costes Estimados

### Setup inicial (43 ciudades)

| Servicio | Coste | Uso |
|----------|-------|-----|
| **Brave Search** | $0 | 172 búsquedas (4 por ciudad) |
| **OpenAI GPT-4** | $20-30 | Generación de contenido |
| **Google Places** | $0 | Opcional, datos estructurados |
| **Total setup** | **$20-30** | Una vez |

### Mantenimiento (cada 3-6 meses)

| Tarea | Coste | Frecuencia |
|-------|-------|------------|
| Re-generación contenido | $20-30 | Trimestral |
| Actualización datos | $0 | Automático |
| **Total anual** | **$80-120** | 4 veces/año |

---

## 🚀 Implementación Paso a Paso

### Fase 1: Preparación (1-2 horas)

**1.1. Crear cuentas necesarias**

```bash
# Brave Search API (GRATIS)
# https://brave.com/search/api/
# → Copiar API key

# OpenAI (ya tienes)
# https://platform.openai.com/api-keys
# → Verificar créditos

# (Opcional) Google Places
# https://console.cloud.google.com/
# → Habilitar Places API
```

**1.2. Configurar variables de entorno**

Añadir a `.env.local`:

```bash
# OpenAI (ya existe)
OPENAI_API_KEY=sk-...

# Brave Search API
BRAVE_API_KEY=BSA...

# (Opcional) Google Places
GOOGLE_PLACES_KEY=AIza...
```

**1.3. Instalar dependencias**

```bash
npm install openai dotenv
# Ya tienes @supabase/supabase-js
```

---

### Fase 2: Desarrollo del Script (2-3 horas)

**2.1. Crear archivo base**

```bash
touch scripts/generate-enhanced-city-content.js
```

**2.2. Estructura del script**

Ver [Script de Ejemplo](#script-de-ejemplo) completo más abajo.

**2.3. Probar con 1 ciudad**

```bash
node scripts/generate-enhanced-city-content.js --city alicante --dry-run
```

---

### Fase 3: Iteración y Ajuste (2-4 horas)

**3.1. Generar 5 ciudades piloto**

```bash
node scripts/generate-enhanced-city-content.js --cities alicante,valencia,benidorm,torrevieja,cartagena
```

**3.2. Revisar calidad del output**

- ✅ ¿Datos reales verificables?
- ✅ ¿Contenido único por ciudad?
- ✅ ¿Tono profesional y útil?
- ✅ ¿Sin errores o inventos?

**3.3. Ajustar prompts si es necesario**

Ver sección [Prompts de OpenAI](#prompts-de-openai).

---

### Fase 4: Producción (4-6 horas)

**4.1. Generar las 43 ciudades**

```bash
node scripts/generate-enhanced-city-content.js --all
```

**4.2. Revisión humana (importante)**

- Revisar cada ciudad en local
- Verificar enlaces externos funcionan
- Comprobar que datos son reales

**4.3. Deploy a producción**

```bash
git add .
git commit -m "feat: Actualizar contenido ciudades con datos reales"
git push origin main
```

---

## 📝 Script de Ejemplo

### `scripts/generate-enhanced-city-content.js`

```javascript
#!/usr/bin/env node

/**
 * Script de automatización de contenido para localidades
 * 
 * Uso:
 *   node scripts/generate-enhanced-city-content.js --city alicante
 *   node scripts/generate-enhanced-city-content.js --all
 * 
 * APIs usadas:
 *   - Brave Search API (búsquedas reales)
 *   - OpenAI GPT-4 (generación de contenido)
 *   - Supabase (almacenamiento)
 */

const { createClient } = require('@supabase/supabase-js')
const OpenAI = require('openai')
const fs = require('fs')
const path = require('path')

// ============================================
// CONFIGURACIÓN
// ============================================

// Leer .env.local
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf-8')

let SUPABASE_URL = ''
let SUPABASE_SERVICE_KEY = ''
let OPENAI_API_KEY = ''
let BRAVE_API_KEY = ''

envContent.split('\n').forEach(line => {
  line = line.trim()
  if (!line || line.startsWith('#')) return
  
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    const key = match[1].trim()
    const value = match[2].trim().replace(/^["']|["']$/g, '')
    
    if (key === 'NEXT_PUBLIC_SUPABASE_URL') SUPABASE_URL = value
    if (key === 'SUPABASE_SERVICE_ROLE_KEY') SUPABASE_SERVICE_KEY = value
    if (key === 'OPENAI_API_KEY') OPENAI_API_KEY = value
    if (key === 'BRAVE_API_KEY') BRAVE_API_KEY = value
  }
})

// Clientes
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const openai = new OpenAI({ apiKey: OPENAI_API_KEY })

// Lista de ciudades remotas (isRemoteMarket: true)
const REMOTE_CITIES = [
  { slug: 'alicante', name: 'Alicante', province: 'Alicante', hasBeach: true },
  { slug: 'valencia', name: 'Valencia', province: 'Valencia', hasBeach: true },
  { slug: 'cartagena', name: 'Cartagena', province: 'Murcia', hasBeach: true },
  { slug: 'benidorm', name: 'Benidorm', province: 'Alicante', hasBeach: true },
  { slug: 'torrevieja', name: 'Torrevieja', province: 'Alicante', hasBeach: true },
  // ... añadir las 43 ciudades completas
]

// ============================================
// FUNCIONES DE BÚSQUEDA
// ============================================

/**
 * Buscar en Brave Search API
 */
async function searchBrave(query) {
  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': BRAVE_API_KEY
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`Brave API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data.web?.results || []
  } catch (error) {
    console.error(`❌ Error buscando "${query}":`, error.message)
    return []
  }
}

/**
 * Buscar pipicanes y zonas caninas
 */
async function searchPipicanes(cityName) {
  console.log(`   🔍 Buscando pipicanes en ${cityName}...`)
  
  const results = await searchBrave(`pipicanes ${cityName} zonas caninas`)
  
  return results.slice(0, 5).map(r => ({
    title: r.title,
    description: r.description,
    url: r.url
  }))
}

/**
 * Buscar normativas municipales
 */
async function searchNormativas(cityName) {
  console.log(`   🔍 Buscando normativas en ${cityName}...`)
  
  const results = await searchBrave(`ordenanza perros ${cityName} ayuntamiento normativa`)
  
  return results.slice(0, 3).map(r => ({
    title: r.title,
    description: r.description,
    url: r.url
  }))
}

/**
 * Buscar lugares dog-friendly
 */
async function searchDogFriendly(cityName) {
  console.log(`   🔍 Buscando lugares dog-friendly en ${cityName}...`)
  
  const results = await searchBrave(`${cityName} restaurantes terrazas perros pet friendly`)
  
  return results.slice(0, 5).map(r => ({
    title: r.title,
    description: r.description,
    url: r.url
  }))
}

/**
 * Buscar playas para perros (solo ciudades costeras)
 */
async function searchPlayasPerros(cityName) {
  console.log(`   🔍 Buscando playas para perros en ${cityName}...`)
  
  const results = await searchBrave(`playas perros ${cityName} dog beach`)
  
  return results.slice(0, 3).map(r => ({
    title: r.title,
    description: r.description,
    url: r.url
  }))
}

// ============================================
// GENERACIÓN CON OPENAI
// ============================================

/**
 * Generar contenido con OpenAI GPT-4
 */
async function generateContentWithAI(city, realData) {
  console.log(`   🤖 Generando contenido con OpenAI...`)
  
  const systemPrompt = `Eres un experto en educación canina profesional que crea contenido útil, único y basado en datos reales para páginas web de localidades.

REGLAS IMPORTANTES:
- Usa SOLO la información real proporcionada
- NO inventes datos, nombres de lugares o detalles
- Si no hay información suficiente, sé general pero honesto
- Tono profesional, cercano y útil
- Evita repeticiones de otros textos
- Enfócate en aportar valor real al lector`

  const userPrompt = `Genera contenido único para la página de educación canina online de ${city.name}, ${city.province}.

DATOS REALES DE ${city.name.toUpperCase()}:

📍 PIPICANES Y ZONAS CANINAS:
${JSON.stringify(realData.pipicanes, null, 2)}

📜 NORMATIVAS MUNICIPALES:
${JSON.stringify(realData.normativas, null, 2)}

🏖️ LUGARES DOG-FRIENDLY:
${JSON.stringify(realData.dogFriendly, null, 2)}

${city.hasBeach ? `🌊 PLAYAS PARA PERROS:\n${JSON.stringify(realData.playas, null, 2)}` : ''}

CONTEXTO:
- Hakadogs está en Archena (Murcia)
- No ofrecemos servicios presenciales en ${city.name}
- Ofrecemos cursos online profesionales
- Metodología BE HAKA: binomio perro-guía, juego estructurado

CONTENIDO A GENERAR:

1. **introText** (150-200 palabras):
   - Por qué los cursos online son ideales para ${city.name}
   - Menciona características locales si son relevantes (clima, urbanización, etc.)
   - Tono: Empático, profesional

2. **localBenefits** (array de 4 strings):
   - Beneficios específicos de formación online para habitantes de ${city.name}
   - Cada beneficio: 1-2 frases cortas

3. **localInfo** (objeto con 4 propiedades):
   - pipicanes: Información útil sobre zonas caninas (basada en datos reales)
   - playas: ${city.hasBeach ? 'Info sobre playas dog-friendly' : 'Menciona parques urbanos si no hay playa'}
   - normativas: Resumen de normativas municipales (si hay datos)
   - clima: Cómo afecta el clima local al adiestramiento

4. **testimonial** (objeto):
   - author: Nombre ficticio pero creíble de ${city.name}
   - text: Testimonio realista (120-150 palabras)
   - dogName: Nombre de perro
   - dogBreed: Raza común
   - Que suene auténtico y específico

5. **faqs** (array de 5 objetos {question, answer}):
   - Preguntas específicas que tendría alguien de ${city.name}
   - Respuestas detalladas y útiles
   - Al menos 2 FAQs deben ser específicas de la localidad

FORMATO DE SALIDA (JSON válido):
{
  "introText": "...",
  "localBenefits": ["...", "...", "...", "..."],
  "localInfo": {
    "pipicanes": "...",
    "playas": "...",
    "normativas": "...",
    "clima": "..."
  },
  "testimonial": {
    "author": "...",
    "text": "...",
    "dogName": "...",
    "dogBreed": "..."
  },
  "faqs": [
    {"question": "...", "answer": "..."},
    ...
  ]
}

IMPORTANTE: Responde SOLO con el JSON, sin explicaciones adicionales.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: "json_object" }
    })
    
    const content = completion.choices[0].message.content
    return JSON.parse(content)
    
  } catch (error) {
    console.error(`❌ Error generando contenido con OpenAI:`, error.message)
    throw error
  }
}

// ============================================
// PROCESO PRINCIPAL
// ============================================

/**
 * Generar contenido mejorado para una ciudad
 */
async function generateEnhancedCityContent(city) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🏙️  Generando contenido para: ${city.name}`)
  console.log(`${'='.repeat(60)}`)
  
  try {
    // 1. RECOPILAR DATOS REALES
    console.log(`\n📊 Fase 1: Recopilando datos reales...`)
    
    const [pipicanes, normativas, dogFriendly, playas] = await Promise.all([
      searchPipicanes(city.name),
      searchNormativas(city.name),
      searchDogFriendly(city.name),
      city.hasBeach ? searchPlayasPerros(city.name) : Promise.resolve([])
    ])
    
    const realData = {
      pipicanes,
      normativas,
      dogFriendly,
      playas
    }
    
    console.log(`   ✅ Datos recopilados:`)
    console.log(`      - Pipicanes: ${pipicanes.length} resultados`)
    console.log(`      - Normativas: ${normativas.length} resultados`)
    console.log(`      - Dog-friendly: ${dogFriendly.length} resultados`)
    if (city.hasBeach) {
      console.log(`      - Playas: ${playas.length} resultados`)
    }
    
    // 2. GENERAR CONTENIDO CON IA
    console.log(`\n🤖 Fase 2: Generando contenido con IA...`)
    
    const generatedContent = await generateContentWithAI(city, realData)
    
    console.log(`   ✅ Contenido generado`)
    
    // 3. PREPARAR DATOS PARA SUPABASE
    const contentData = {
      city_slug: city.slug,
      city_name: city.name,
      intro_text: generatedContent.introText,
      local_benefits: generatedContent.localBenefits,
      local_info: generatedContent.localInfo,
      testimonial: generatedContent.testimonial,
      faqs: generatedContent.faqs,
      updated_at: new Date().toISOString()
    }
    
    // 4. GUARDAR EN SUPABASE
    console.log(`\n💾 Fase 3: Guardando en Supabase...`)
    
    const { data, error } = await supabase
      .from('city_content_cache')
      .upsert(contentData, {
        onConflict: 'city_slug'
      })
    
    if (error) {
      throw error
    }
    
    console.log(`   ✅ Guardado exitoso en city_content_cache`)
    
    // 5. RESUMEN
    console.log(`\n✨ COMPLETADO: ${city.name}`)
    console.log(`   - Intro: ${generatedContent.introText.length} caracteres`)
    console.log(`   - Beneficios: ${generatedContent.localBenefits.length} items`)
    console.log(`   - FAQs: ${generatedContent.faqs.length} preguntas`)
    
    return {
      success: true,
      city: city.name,
      data: contentData
    }
    
  } catch (error) {
    console.error(`\n❌ ERROR en ${city.name}:`, error.message)
    return {
      success: false,
      city: city.name,
      error: error.message
    }
  }
}

/**
 * Generar todas las ciudades
 */
async function generateAllCities() {
  console.log(`\n🚀 Iniciando generación para ${REMOTE_CITIES.length} ciudades...\n`)
  
  const results = []
  
  for (const city of REMOTE_CITIES) {
    const result = await generateEnhancedCityContent(city)
    results.push(result)
    
    // Pausa de 2 segundos entre ciudades (rate limiting)
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  // RESUMEN FINAL
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📊 RESUMEN FINAL`)
  console.log(`${'='.repeat(60)}`)
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`✅ Exitosas: ${successful.length}`)
  console.log(`❌ Fallidas: ${failed.length}`)
  
  if (failed.length > 0) {
    console.log(`\nCiudades con errores:`)
    failed.forEach(f => console.log(`  - ${f.city}: ${f.error}`))
  }
  
  console.log(`\n✨ Proceso completado\n`)
}

// ============================================
// CLI
// ============================================

const args = process.argv.slice(2)

if (args.includes('--all')) {
  generateAllCities()
} else if (args.includes('--city')) {
  const citySlug = args[args.indexOf('--city') + 1]
  const city = REMOTE_CITIES.find(c => c.slug === citySlug)
  
  if (!city) {
    console.error(`❌ Ciudad no encontrada: ${citySlug}`)
    process.exit(1)
  }
  
  generateEnhancedCityContent(city)
} else {
  console.log(`
🤖 Script de Generación de Contenido para Localidades

Uso:
  node scripts/generate-enhanced-city-content.js --all
  node scripts/generate-enhanced-city-content.js --city alicante

Opciones:
  --all           Generar todas las ciudades remotas
  --city [slug]   Generar una ciudad específica
  --help          Mostrar esta ayuda
  `)
}
```

---

## 💬 Prompts de OpenAI

### Sistema (System Prompt)

```
Eres un experto en educación canina profesional que crea contenido útil, único y basado en datos reales para páginas web de localidades.

REGLAS IMPORTANTES:
- Usa SOLO la información real proporcionada
- NO inventes datos, nombres de lugares o detalles
- Si no hay información suficiente, sé general pero honesto
- Tono profesional, cercano y útil
- Evita repeticiones de otros textos
- Enfócate en aportar valor real al lector
```

### Usuario (User Prompt Template)

```
Genera contenido único para la página de educación canina online de {CIUDAD}, {PROVINCIA}.

DATOS REALES DE {CIUDAD}:

📍 PIPICANES Y ZONAS CANINAS:
{datos_pipicanes}

📜 NORMATIVAS MUNICIPALES:
{datos_normativas}

🏖️ LUGARES DOG-FRIENDLY:
{datos_dog_friendly}

🌊 PLAYAS PARA PERROS:
{datos_playas}

CONTEXTO:
- Hakadogs está en Archena (Murcia)
- No ofrecemos servicios presenciales en {CIUDAD}
- Ofrecemos cursos online profesionales
- Metodología BE HAKA: binomio perro-guía, juego estructurado

CONTENIDO A GENERAR:

1. **introText** (150-200 palabras):
   - Por qué los cursos online son ideales para {CIUDAD}
   - Menciona características locales si son relevantes
   - Tono: Empático, profesional

2. **localBenefits** (array de 4 strings):
   - Beneficios específicos de formación online
   - Cada beneficio: 1-2 frases cortas

3. **localInfo** (objeto con 4 propiedades):
   - pipicanes: Información útil sobre zonas caninas
   - playas: Info sobre playas dog-friendly
   - normativas: Resumen de normativas municipales
   - clima: Cómo afecta el clima al adiestramiento

4. **testimonial** (objeto):
   - author: Nombre ficticio creíble
   - text: Testimonio realista (120-150 palabras)
   - dogName: Nombre de perro
   - dogBreed: Raza común

5. **faqs** (array de 5 objetos {question, answer}):
   - Preguntas específicas de {CIUDAD}
   - Respuestas detalladas y útiles

FORMATO DE SALIDA (JSON válido):
{
  "introText": "...",
  "localBenefits": ["...", ...],
  "localInfo": {...},
  "testimonial": {...},
  "faqs": [...]
}
```

### Ajustes de temperatura

```javascript
{
  temperature: 0.7,  // Balance creatividad/consistencia
  max_tokens: 2500,  // Suficiente para todo el contenido
  response_format: { type: "json_object" }  // Garantizar JSON válido
}
```

---

## ✅ Control de Calidad

### Checklist de revisión por ciudad

```
Ciudad: _________________

□ Datos verificables
  □ Pipicanes mencionados existen en Google Maps
  □ Normativas enlazadas son correctas
  □ Playas/parques son reales

□ Contenido único
  □ Intro no se repite con otras ciudades
  □ Beneficios locales son específicos
  □ FAQs tienen contexto local

□ Calidad redacción
  □ Sin errores ortográficos
  □ Tono profesional y cercano
  □ No suena robótico

□ SEO
  □ Nombre ciudad mencionado naturalmente
  □ Keywords relevantes incluidas
  □ Longitud adecuada (>800 palabras total)

□ Enlaces
  □ URLs externas funcionan
  □ No hay enlaces rotos
```

### Señales de alerta

❌ **Eliminar o corregir si:**
- Menciona lugares que no existen
- Datos contradictorios con realidad
- Tono demasiado vendedor o spam
- Repetición exacta de otras ciudades
- Enlaces rotos o irrelevantes

---

## 🔄 Mantenimiento

### Frecuencia recomendada

```
Cada 3-6 meses:
1. Re-ejecutar script de búsqueda
2. Actualizar datos desactualizados
3. Añadir nuevas normativas/lugares
4. Regenerar contenido obsoleto
```

### Comando de actualización

```bash
# Actualizar todas las ciudades
node scripts/generate-enhanced-city-content.js --all

# Actualizar solo ciudades específicas
node scripts/generate-enhanced-city-content.js --city alicante
node scripts/generate-enhanced-city-content.js --city valencia
```

### Monitoreo de calidad

**Métricas a vigilar en Google Analytics:**

```
Por cada ciudad:
- Bounce rate (objetivo: <60%)
- Tiempo en página (objetivo: >2 min)
- Conversión a cursos (objetivo: >0.5%)
- Ranking SEO (objetivo: top 20)
```

**Si una ciudad no funciona (3 meses):**
1. Revisar contenido
2. Mejorar datos locales
3. Si sigue mal: considerar eliminar

---

## 📚 Recursos Adicionales

### Documentación APIs

- [Brave Search API Docs](https://brave.com/search/api/)
- [OpenAI API Docs](https://platform.openai.com/docs/api-reference)
- [Supabase Docs](https://supabase.com/docs)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)

### Herramientas útiles

- [JSON Formatter](https://jsonformatter.org/) - Validar JSON
- [Hemingway Editor](https://hemingwayapp.com/) - Mejorar legibilidad
- [Google PageSpeed Insights](https://pagespeed.web.dev/) - Performance

---

## 🆘 Troubleshooting

### Error: "Brave API rate limit"

```javascript
// Añadir delay entre búsquedas
await new Promise(resolve => setTimeout(resolve, 1000))
```

### Error: "OpenAI token limit"

```javascript
// Reducir max_tokens o dividir en chunks
max_tokens: 2000  // En vez de 2500
```

### Error: "Supabase conflict"

```javascript
// Cambiar a upsert en vez de insert
.upsert(data, { onConflict: 'city_slug' })
```

### Contenido de baja calidad

```javascript
// Ajustar temperature más bajo = más conservador
temperature: 0.5  // En vez de 0.7
```

---

## 📅 Próximos Pasos

Cuando decidas implementar:

**Semana 1:**
- [ ] Crear cuenta Brave Search API
- [ ] Verificar créditos OpenAI
- [ ] Configurar .env.local
- [ ] Probar script con 1 ciudad

**Semana 2:**
- [ ] Generar 5 ciudades piloto
- [ ] Revisar calidad manualmente
- [ ] Ajustar prompts si necesario
- [ ] Documentar mejoras

**Semana 3:**
- [ ] Generar las 43 ciudades completas
- [ ] Revisión humana de todas
- [ ] Deploy a producción
- [ ] Configurar monitoreo Analytics

**Mantenimiento:**
- [ ] Revisar métricas cada mes
- [ ] Actualizar contenido cada 3-6 meses
- [ ] Iterar basándose en resultados

---

**📧 Contacto:** Si necesitas ayuda implementando, consulta esta guía primero.

**🔄 Última actualización:** 17 Enero 2026  
**✅ Estado:** Listo para implementar cuando decidas
