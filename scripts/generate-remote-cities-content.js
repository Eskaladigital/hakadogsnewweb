/**
 * Script para generar contenido único para todas las ciudades remotas (isRemoteMarket: true)
 * 
 * Este script:
 * 1. Lee todas las ciudades de lib/cities.ts
 * 2. Filtra las que tienen isRemoteMarket: true
 * 3. Genera contenido único usando las funciones de uniqueCityContent.ts
 * 4. Inserta el contenido en la tabla city_content_cache de Supabase
 * 
 * Uso:
 * node scripts/generate-remote-cities-content.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Leer variables de entorno desde .env.local manualmente (sin dotenv)
const envPath = path.join(__dirname, '..', '.env.local')
let SUPABASE_URL = ''
let SUPABASE_SERVICE_ROLE_KEY = ''

try {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  
  envContent.split('\n').forEach(line => {
    line = line.trim()
    if (!line || line.startsWith('#')) return
    
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim().replace(/^["']|["']$/g, '')
      
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
        SUPABASE_URL = value
      } else if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
        SUPABASE_SERVICE_ROLE_KEY = value
      }
    }
  })
} catch (error) {
  console.error('❌ Error: No se pudo leer .env.local')
  console.error('   Asegúrate de que el archivo existe en la raíz del proyecto')
  console.error('   Ruta esperada:', envPath)
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Variables de entorno no encontradas en .env.local')
  console.error('   Se encontró:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅' : '❌')
  console.error('')
  console.error('   Asegúrate de que .env.local contiene:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=https://...')
  console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJ...')
  process.exit(1)
}

console.log('✅ Credenciales de Supabase cargadas correctamente')
console.log('   URL:', SUPABASE_URL.substring(0, 30) + '...')
console.log('   Service Key:', SUPABASE_SERVICE_ROLE_KEY.substring(0, 30) + '...')
console.log('')

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Definir las ciudades remotas directamente (copiadas de cities.ts con isRemoteMarket: true)
// Esto es más seguro que hacer eval() del código TypeScript
const cities = [
  { slug: 'cartagena', name: 'Cartagena', province: 'Murcia', region: 'Región de Murcia', population: 218000, distanceFromArchena: 70, isRemoteMarket: true, nearbyParks: ['Parque Torres', 'Cala Cortina', 'Batería de Castillitos'] },
  { slug: 'lorca', name: 'Lorca', province: 'Murcia', region: 'Región de Murcia', population: 95000, distanceFromArchena: 60, isRemoteMarket: true, nearbyParks: ['Castillo de Lorca', 'Parque Almenara'] },
  { slug: 'yecla', name: 'Yecla', province: 'Murcia', region: 'Región de Murcia', population: 35000, distanceFromArchena: 75, isRemoteMarket: true, nearbyParks: ['Monte Arabí', 'Parque de la Constitución'] },
  { slug: 'jumilla', name: 'Jumilla', province: 'Murcia', region: 'Región de Murcia', population: 26000, distanceFromArchena: 65, isRemoteMarket: true, nearbyParks: ['Castillo de Jumilla', 'Sierra del Carche'] },
  { slug: 'totana', name: 'Totana', province: 'Murcia', region: 'Región de Murcia', population: 32000, distanceFromArchena: 52, isRemoteMarket: true, nearbyParks: ['Sierra Espuña', 'Parque Municipal'] },
  { slug: 'aguilas', name: 'Águilas', province: 'Murcia', region: 'Región de Murcia', population: 35000, distanceFromArchena: 100, isRemoteMarket: true, nearbyParks: ['Playa de Levante', 'Isla del Fraile'] },
  { slug: 'mazarron', name: 'Mazarrón', province: 'Murcia', region: 'Región de Murcia', population: 33000, distanceFromArchena: 80, isRemoteMarket: true, nearbyParks: ['Bahía de Mazarrón', 'Sierra de las Moreras'] },
  { slug: 'san-javier', name: 'San Javier', province: 'Murcia', region: 'Región de Murcia', population: 33000, distanceFromArchena: 75, isRemoteMarket: true, nearbyParks: ['Parque Almansa', 'Mar Menor'] },
  { slug: 'san-pedro-del-pinatar', name: 'San Pedro del Pinatar', province: 'Murcia', region: 'Región de Murcia', population: 26000, distanceFromArchena: 80, isRemoteMarket: true, nearbyParks: ['Salinas y Arenales', 'Playa de la Torre Derribada'] },
  { slug: 'alhama-de-murcia', name: 'Alhama de Murcia', province: 'Murcia', region: 'Región de Murcia', population: 22000, distanceFromArchena: 48, isRemoteMarket: true, nearbyParks: ['Sierra Espuña', 'Gebas'] },
  { slug: 'caravaca-de-la-cruz', name: 'Caravaca de la Cruz', province: 'Murcia', region: 'Región de Murcia', population: 26000, distanceFromArchena: 72, isRemoteMarket: true, nearbyParks: ['Santuario de Caravaca', 'Fuentes del Marqués'] },
  { slug: 'ceheguin', name: 'Cehegín', province: 'Murcia', region: 'Región de Murcia', population: 16000, distanceFromArchena: 60, isRemoteMarket: true, nearbyParks: ['Casco Antiguo', 'Parque Municipal'] },
  { slug: 'bullas', name: 'Bullas', province: 'Murcia', region: 'Región de Murcia', population: 12000, distanceFromArchena: 45, isRemoteMarket: true, nearbyParks: ['Casco Histórico', 'Salto del Usero'] },
  { slug: 'alicante', name: 'Alicante', province: 'Alicante', region: 'Comunidad Valenciana', population: 337000, isRemoteMarket: true, nearbyParks: ['Monte Benacantil', 'Parque Canalejas', 'Playa del Postiguet'] },
  { slug: 'valencia', name: 'Valencia', province: 'Valencia', region: 'Comunidad Valenciana', population: 800000, isRemoteMarket: true, nearbyParks: ['Jardín del Turia', 'Parque de Cabecera', 'La Albufera'] },
  { slug: 'elche', name: 'Elche', province: 'Alicante', region: 'Comunidad Valenciana', population: 234000, isRemoteMarket: true, nearbyParks: ['Palmeral de Elche', 'Parque Municipal'] },
  { slug: 'torrevieja', name: 'Torrevieja', province: 'Alicante', region: 'Comunidad Valenciana', population: 83000, isRemoteMarket: true, nearbyParks: ['Lagunas de Torrevieja', 'Paseo Marítimo'] },
  { slug: 'orihuela', name: 'Orihuela', province: 'Alicante', region: 'Comunidad Valenciana', population: 86000, isRemoteMarket: true, nearbyParks: ['Palmeral de Orihuela', 'Sierra de Orihuela'] },
  { slug: 'benidorm', name: 'Benidorm', province: 'Alicante', region: 'Comunidad Valenciana', population: 70000, isRemoteMarket: true, nearbyParks: ['Parque de L\'Aigüera', 'Sierra Helada'] },
  { slug: 'alcoy', name: 'Alcoy', province: 'Alicante', region: 'Comunidad Valenciana', population: 60000, isRemoteMarket: true, nearbyParks: ['Parque de Cantagallet', 'Font Roja'] },
  { slug: 'albacete', name: 'Albacete', province: 'Albacete', region: 'Castilla-La Mancha', population: 174000, isRemoteMarket: true, nearbyParks: ['Parque de Abelardo Sánchez', 'Parque Lineal'] },
  { slug: 'hellin', name: 'Hellín', province: 'Albacete', region: 'Castilla-La Mancha', population: 31000, isRemoteMarket: true, nearbyParks: ['Minateda', 'Parque del Rosario'] },
  { slug: 'villarrobledo', name: 'Villarrobledo', province: 'Albacete', region: 'Castilla-La Mancha', population: 26000, isRemoteMarket: true, nearbyParks: ['Parque de la Constitución'] },
  { slug: 'almeria', name: 'Almería', province: 'Almería', region: 'Andalucía', population: 201000, isRemoteMarket: true, nearbyParks: ['Parque del Andarax', 'Cabo de Gata'] },
  { slug: 'roquetas-de-mar', name: 'Roquetas de Mar', province: 'Almería', region: 'Andalucía', population: 95000, isRemoteMarket: true, nearbyParks: ['Parque Natural Punta Entinas', 'Playa Serena'] },
  { slug: 'el-ejido', name: 'El Ejido', province: 'Almería', region: 'Andalucía', population: 85000, isRemoteMarket: true, nearbyParks: ['Parque Municipal', 'Playas de El Ejido'] },
  { slug: 'granada', name: 'Granada', province: 'Granada', region: 'Andalucía', population: 232000, isRemoteMarket: true, nearbyParks: ['Parque Federico García Lorca', 'Sierra Nevada'] },
  { slug: 'jaen', name: 'Jaén', province: 'Jaén', region: 'Andalucía', population: 114000, isRemoteMarket: true, nearbyParks: ['Parque del Seminario', 'Cerro de Santa Catalina'] },
  { slug: 'madrid', name: 'Madrid', province: 'Madrid', region: 'Comunidad de Madrid', population: 3300000, isRemoteMarket: true, nearbyParks: ['Parque del Retiro', 'Casa de Campo', 'Madrid Río'] },
  { slug: 'barcelona', name: 'Barcelona', province: 'Barcelona', region: 'Cataluña', population: 1620000, isRemoteMarket: true, nearbyParks: ['Parc de la Ciutadella', 'Parc del Guinardó', 'Montjuïc'] },
  { slug: 'hospitalet-de-llobregat', name: "L'Hospitalet de Llobregat", province: 'Barcelona', region: 'Cataluña', population: 260000, nearbyParks: ['Parc de Can Buxeres', 'Parc de la Torrassa'], isRemoteMarket: true },
  { slug: 'sevilla', name: 'Sevilla', province: 'Sevilla', region: 'Andalucía', population: 688000, isRemoteMarket: true, nearbyParks: ['Parque de María Luisa', 'Alamillo', 'Parque del Guadalquivir'] },
  { slug: 'malaga', name: 'Málaga', province: 'Málaga', region: 'Andalucía', population: 578000, isRemoteMarket: true, nearbyParks: ['Parque de Málaga', 'Montes de Málaga', 'Playas de Málaga'] },
  { slug: 'cordoba', name: 'Córdoba', province: 'Córdoba', region: 'Andalucía', population: 326000, isRemoteMarket: true, nearbyParks: ['Jardines de la Victoria', 'Sotos de la Albolafia'] },
  { slug: 'zaragoza', name: 'Zaragoza', province: 'Zaragoza', region: 'Aragón', population: 675000, isRemoteMarket: true, nearbyParks: ['Parque Grande', 'Parque del Agua', 'Ribera del Ebro'] },
  { slug: 'palma-de-mallorca', name: 'Palma de Mallorca', province: 'Baleares', region: 'Islas Baleares', population: 416000, isRemoteMarket: true, nearbyParks: ['Parc de la Mar', 'Bellver', 'Son Quint'] },
  { slug: 'las-palmas-de-gran-canaria', name: 'Las Palmas de Gran Canaria', province: 'Las Palmas', region: 'Islas Canarias', population: 379000, isRemoteMarket: true, nearbyParks: ['Parque Doramas', 'Parque Santa Catalina', 'Las Canteras'] },
  { slug: 'bilbao', name: 'Bilbao', province: 'Vizcaya', region: 'País Vasco', population: 347000, isRemoteMarket: true, nearbyParks: ['Doña Casilda Iturrizar', 'Etxebarria', 'Artxanda'] },
  { slug: 'vitoria-gasteiz', name: 'Vitoria-Gasteiz', province: 'Álava', region: 'País Vasco', population: 253000, isRemoteMarket: true, nearbyParks: ['Anillo Verde', 'Parque de la Florida', 'Armentia'] },
  { slug: 'valladolid', name: 'Valladolid', province: 'Valladolid', region: 'Castilla y León', population: 298000, isRemoteMarket: true, nearbyParks: ['Campo Grande', 'Parque Ribera de Castilla', 'Pisuerga'] },
  { slug: 'vigo', name: 'Vigo', province: 'Pontevedra', region: 'Galicia', population: 296000, isRemoteMarket: true, nearbyParks: ['Parque de Castrelos', 'Monte del Castro', 'Samil'] },
  { slug: 'a-coruna', name: 'A Coruña', province: 'A Coruña', region: 'Galicia', population: 246000, isRemoteMarket: true, nearbyParks: ['Parque de Santa Margarita', 'Monte de San Pedro', 'Paseo Marítimo'] },
  { slug: 'gijon', name: 'Gijón', province: 'Asturias', region: 'Principado de Asturias', population: 273000, isRemoteMarket: true, nearbyParks: ['Parque de Isabel la Católica', 'Cerro de Santa Catalina', 'Playa de San Lorenzo'] },
]

// Filtrar solo ciudades remotas (ya todas lo son en este array)
const remoteCities = cities

console.log(`📊 Total de ciudades en el script: ${cities.length}`)
console.log(`🌐 Ciudades remotas (isRemoteMarket: true): ${remoteCities.length}`)
console.log('')

// Funciones de generación de contenido (adaptadas de uniqueCityContent.ts)

function generateOnlineIntroText(city) {
  const isLarge = city.population > 200000
  const isFar = city.distanceFromArchena && city.distanceFromArchena > 80
  const isRemote = city.isRemoteMarket === true
  
  if (isLarge && isFar) {
    return `Sabemos que en ${city.name} tu tiempo es valioso. Por eso hemos diseñado cursos online que te permiten acceder a la misma calidad de educación canina profesional sin los ${city.distanceFromArchena}km de desplazamiento. Aprende a tu ritmo, desde tu hogar en ${city.name}.`
  } else if (isFar && isRemote) {
    return `Aunque ${city.name} está a ${city.distanceFromArchena}km de nuestro centro, no significa que debas renunciar a educación canina de calidad. Nuestros cursos online te ofrecen formación profesional con la flexibilidad que necesitas en ${city.province}.`
  } else if (isLarge) {
    return `${city.name} es una ciudad activa donde el tiempo es oro. Nuestros cursos online están diseñados para familias urbanitas que quieren resultados profesionales sin comprometer su agenda. Aprende cuando mejor te convenga.`
  } else {
    return `Desde ${city.name}, accede a formación canina profesional que antes solo estaba disponible en grandes centros especializados. Cursos completos, a tu ritmo, con el respaldo de +8 años de experiencia en educación canina.`
  }
}

function generateOnlineCourseBenefits(city) {
  const benefits = []
  
  // Basado en distancia
  if (city.distanceFromArchena && city.distanceFromArchena > 80) {
    benefits.push(`Evita desplazamientos de más de ${city.distanceFromArchena}km - Aprende desde ${city.name}`)
  } else if (city.distanceFromArchena && city.distanceFromArchena > 50) {
    benefits.push(`Ahorra tiempo de viaje - ${city.distanceFromArchena}km de distancia superados con formación online`)
  }
  
  // Basado en población
  if (city.population > 200000) {
    benefits.push(`Ideal para el ritmo de vida urbano de ${city.name} - Aprende a tu horario`)
  } else if (city.population > 50000) {
    benefits.push(`Perfecto para familias de ${city.name} - Flexibilidad total`)
  } else {
    benefits.push(`Acceso a educación profesional desde ${city.name} - Sin necesidad de viajar a grandes ciudades`)
  }
  
  // Basado en región
  if (city.region !== 'Región de Murcia') {
    benefits.push(`Misma calidad que nuestras sesiones presenciales en Murcia, desde ${city.region}`)
  }
  
  // Basado en si es costa o interior
  if (city.name.toLowerCase().includes('costa') || city.name.includes('Mar')) {
    benefits.push(`Educa a tu perro en entornos costeros - Técnicas para playas y paseos marítimos`)
  }
  
  // Específico por provincia
  if (city.province === 'Alicante' || city.province === 'Valencia') {
    benefits.push(`Adaptado al clima mediterráneo de ${city.province} - Consejos para el calor`)
  } else if (city.province === 'Almería' || city.province === 'Granada') {
    benefits.push(`Métodos probados en el clima de ${city.province} - Educación adaptada a tu entorno`)
  }
  
  // Siempre incluir beneficio general
  benefits.push(`Acceso inmediato 24/7 desde ${city.name} - Aprende cuando mejor te convenga`)
  
  return benefits.slice(0, 4) // Máximo 4 beneficios únicos
}

function generateLocalChallenges(city) {
  const challenges = []
  
  // Desafíos por tamaño de población
  if (city.population > 300000) {
    challenges.push(`Ruido y estímulos urbanos constantes en ${city.name}`)
    challenges.push(`Socialización en espacios concurridos`)
    challenges.push(`Convivencia en pisos y comunidades de vecinos`)
  } else if (city.population > 100000) {
    challenges.push(`Equilibrio entre ciudad y naturaleza en ${city.name}`)
    challenges.push(`Gestión de comportamiento en zonas urbanas`)
  } else {
    challenges.push(`Acceso limitado a servicios presenciales en ${city.name}`)
    challenges.push(`Necesidad de formación de calidad sin desplazamientos`)
  }
  
  // Desafíos por distancia
  if (city.distanceFromArchena && city.distanceFromArchena > 100) {
    challenges.push(`Distancia a centros especializados (${city.distanceFromArchena}km)`)
  }
  
  // Específicos por clima/región
  if (city.province === 'Almería' || city.region.includes('Andalucía')) {
    challenges.push(`Altas temperaturas en verano - Necesidad de ejercicio adaptado`)
  }
  
  return challenges.slice(0, 3)
}

function generateContextualTestimonial(city) {
  const isLarge = city.population > 150000
  const isFar = city.distanceFromArchena && city.distanceFromArchena > 60
  
  if (isLarge && isFar) {
    return {
      author: 'María L.',
      location: `${city.name}`,
      text: `Viviendo en ${city.name}, era imposible desplazarme ${city.distanceFromArchena}km regularmente para clases presenciales. Los cursos online de Hakadogs me han permitido educar a mi perro con la misma efectividad, pero desde casa. ¡Resultados increíbles!`,
      neighborhood: city.name
    }
  } else if (isLarge) {
    return {
      author: 'Carlos M.',
      location: `${city.name}`,
      text: `Con el ritmo de vida de ${city.name}, encontrar tiempo para clases presenciales era un desafío. El formato online me ha dado la flexibilidad que necesitaba. Mi perra ha mejorado muchísimo y yo he aprendido a mi propio ritmo.`,
      neighborhood: city.name
    }
  } else {
    return {
      author: 'Ana R.',
      location: `${city.name}`,
      text: `Desde ${city.name}, no teníamos acceso a educadores caninos especializados. Hakadogs nos ha traído formación profesional directamente a casa. La calidad es excepcional y los resultados hablan por sí mismos.`,
      neighborhood: city.name
    }
  }
}

function generateLocalFAQs(city) {
  const faqs = []
  
  // FAQ sobre distancia
  if (city.distanceFromArchena && city.distanceFromArchena > 50) {
    faqs.push({
      question: `¿Ofrecen servicios presenciales en ${city.name}?`,
      answer: `Actualmente nuestros servicios presenciales se centran en Archena y un radio de ~40km. Sin embargo, para ${city.name} (${city.distanceFromArchena}km), ofrecemos cursos online con la misma calidad y metodología profesional, sin necesidad de desplazamientos.`
    })
  }
  
  // FAQ sobre efectividad online
  faqs.push({
    question: `¿Los cursos online funcionan igual de bien desde ${city.name}?`,
    answer: `¡Absolutamente! Nuestros cursos online están diseñados con la misma metodología BE HAKA que usamos en sesiones presenciales. Miles de alumnos en toda España, incluido ${city.name}, han transformado la relación con sus perros desde casa con resultados excelentes.`
  })
  
  // FAQ sobre inicio inmediato
  faqs.push({
    question: `¿Cuándo puedo empezar desde ${city.name}?`,
    answer: `¡Ahora mismo! El acceso a los cursos es inmediato tras la inscripción. No importa si es día o noche, fin de semana o festivo - desde ${city.name} puedes comenzar tu formación en cualquier momento.`
  })
  
  return faqs
}

function generateLocalInfo(city) {
  const climaTexto = 
    city.province === 'Asturias' || city.province === 'A Coruña' || city.province === 'Pontevedra'
      ? `El clima atlántico de ${city.name} presenta temperaturas suaves y lluvia frecuente. Esto requiere adaptar los horarios de paseo y entrenamiento. En nuestros cursos online aprenderás técnicas específicas para educar a tu perro en condiciones húmedas y cómo mantener la motivación en días lluviosos.`
      : city.region.includes('Andalucía') || city.province === 'Almería' || city.province === 'Murcia'
      ? `El clima cálido de ${city.name} requiere especial atención en verano. Las altas temperaturas obligan a ajustar horarios de paseo y ejercicio. Nuestros cursos online incluyen módulos específicos sobre cómo entrenar a tu perro en climas cálidos, evitando golpes de calor y manteniendo su bienestar.`
      : city.region.includes('Madrid') || city.region.includes('Castilla')
      ? `El clima continental de ${city.name}, con inviernos fríos y veranos calurosos, requiere adaptación en el entrenamiento canino. Aprende en nuestros cursos cómo ajustar las sesiones según la estación, protegiendo la salud de tu perro todo el año.`
      : `El clima de ${city.name} influye en cómo debes educar a tu perro. En nuestros cursos online aprenderás a adaptar las sesiones de entrenamiento a las condiciones meteorológicas locales, optimizando el aprendizaje y el bienestar de tu mascota.`

  return {
    pipicanes: `En ${city.name} existen varias zonas designadas para perros. Te recomendamos consultar con el ayuntamiento local para conocer las normativas específicas y áreas disponibles en tu barrio.`,
    playas: city.nearbyParks?.join(', ') 
      ? `Cerca de ${city.name} puedes disfrutar de espacios como: ${city.nearbyParks.slice(0, 3).join(', ')}. Estos lugares son ideales para practicar ejercicios de educación canina en entornos naturales.`
      : `${city.name} cuenta con diversos espacios naturales donde puedes pasear y educar a tu perro. Consulta las regulaciones locales para aprovechar al máximo estos recursos.`,
    normativas: `La normativa municipal de ${city.name} regula la tenencia responsable de mascotas. Es importante conocer las ordenanzas locales sobre paseos, zonas permitidas y recogida de excrementos. Nuestros cursos online te enseñan a cumplir estas normas mientras educas a tu perro correctamente.`,
    clima: climaTexto
  }
}

// Función principal
async function generateContent() {
  console.log('🚀 Iniciando generación de contenido para ciudades remotas...\n')
  
  let processed = 0
  let inserted = 0
  let updated = 0
  let skipped = 0
  let errors = 0

  for (const city of remoteCities) {
    processed++
    
    try {
      console.log(`[${processed}/${remoteCities.length}] Procesando: ${city.name} (${city.province})`)
      
      // Verificar si ya existe contenido
      const { data: existing, error: checkError } = await supabase
        .from('city_content_cache')
        .select('city_slug')
        .eq('city_slug', city.slug)
        .single()
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      // Generar contenido
      const testimonial = generateContextualTestimonial(city)
      const contentData = {
        city_slug: city.slug,
        city_name: city.name,
        intro_text: generateOnlineIntroText(city),
        local_benefits: generateOnlineCourseBenefits(city),
        challenges: generateLocalChallenges(city),
        testimonial: {
          text: testimonial.text,
          author: testimonial.author,
          neighborhood: testimonial.neighborhood
        },
        faqs: generateLocalFAQs(city),
        local_info: generateLocalInfo(city),
        updated_at: new Date().toISOString()
      }

      if (existing) {
        // Actualizar
        const { error: updateError } = await supabase
          .from('city_content_cache')
          .update(contentData)
          .eq('city_slug', city.slug)
        
        if (updateError) throw updateError
        
        console.log(`   ✅ Actualizado`)
        updated++
      } else {
        // Insertar
        const { error: insertError } = await supabase
          .from('city_content_cache')
          .insert(contentData)
        
        if (insertError) throw insertError
        
        console.log(`   ✅ Insertado`)
        inserted++
      }
      
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`)
      errors++
    }
    
    console.log('')
  }

  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMEN FINAL')
  console.log('='.repeat(60))
  console.log(`✅ Ciudades procesadas: ${processed}`)
  console.log(`➕ Contenidos nuevos insertados: ${inserted}`)
  console.log(`🔄 Contenidos actualizados: ${updated}`)
  console.log(`⏭️  Omitidos: ${skipped}`)
  console.log(`❌ Errores: ${errors}`)
  console.log('='.repeat(60))
  
  if (errors === 0) {
    console.log('\n✅ ¡Proceso completado exitosamente!')
    console.log(`\n🌐 Todas las ${remoteCities.length} ciudades remotas ahora tienen contenido único`)
    console.log('   Puedes verificar las páginas en:')
    remoteCities.slice(0, 5).forEach(city => {
      console.log(`   - https://www.hakadogs.com/adiestramiento-canino/${city.slug}`)
    })
    if (remoteCities.length > 5) {
      console.log(`   ... y ${remoteCities.length - 5} más`)
    }
  } else {
    console.log(`\n⚠️  Proceso completado con ${errors} errores`)
    console.log('   Revisa los mensajes de error arriba para más detalles')
  }
}

// Ejecutar
generateContent()
  .then(() => {
    console.log('\n✅ Script finalizado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error)
    process.exit(1)
  })
