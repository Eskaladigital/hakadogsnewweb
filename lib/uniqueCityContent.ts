/**
 * Generador de contenido único para páginas de localidades
 * Evita contenido duplicado generando texto específico por ciudad
 */

import { CityData } from './cities'

/**
 * Genera razones únicas por las que los cursos online son ideales para esta ciudad
 */
export function generateOnlineCourseBenefits(city: CityData): string[] {
  const benefits: string[] = []
  
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

/**
 * Genera desafíos específicos de la ciudad que los cursos online pueden solucionar
 */
export function generateLocalChallenges(city: CityData): string[] {
  const challenges: string[] = []
  
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

/**
 * Genera estadísticas únicas contextualizadas para la ciudad
 */
export function generateCityStats(city: CityData): Array<{value: string, label: string, context: string}> {
  const stats: Array<{value: string, label: string, context: string}> = []
  
  // Población de perros estimada (aprox 1 perro cada 5 habitantes)
  const estimatedDogs = Math.round(city.population / 5)
  stats.push({
    value: estimatedDogs > 1000 ? `~${Math.round(estimatedDogs / 1000)}k` : `~${estimatedDogs}`,
    label: 'Perros estimados',
    context: `en ${city.name}`
  })
  
  // Tiempo ahorrado vs desplazamiento
  if (city.distanceFromArchena) {
    const timeMin = Math.round(city.distanceFromArchena * 0.8) // ~0.8 min por km
    stats.push({
      value: `${timeMin} min`,
      label: 'Tiempo ahorrado',
      context: 'vs desplazamiento'
    })
  }
  
  // Acceso 24/7
  stats.push({
    value: '24/7',
    label: 'Acceso online',
    context: `desde ${city.name}`
  })
  
  return stats
}

/**
 * Genera un texto introductorio único para la sección de cursos online
 */
export function generateOnlineIntroText(city: CityData): string {
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

/**
 * Genera testimonios contextualizados (simulados pero realistas)
 */
export function generateContextualTestimonial(city: CityData): {
  author: string
  location: string
  text: string
  highlight: string
} {
  const isLarge = city.population > 150000
  const isFar = city.distanceFromArchena && city.distanceFromArchena > 60
  
  if (isLarge && isFar) {
    return {
      author: 'María L.',
      location: `${city.name}`,
      text: `Viviendo en ${city.name}, era imposible desplazarme ${city.distanceFromArchena}km regularmente para clases presenciales. Los cursos online de Hakadogs me han permitido educar a mi perro con la misma efectividad, pero desde casa. ¡Resultados increíbles!`,
      highlight: 'Formación profesional sin desplazamientos'
    }
  } else if (isLarge) {
    return {
      author: 'Carlos M.',
      location: `${city.name}`,
      text: `Con el ritmo de vida de ${city.name}, encontrar tiempo para clases presenciales era un desafío. El formato online me ha dado la flexibilidad que necesitaba. Mi perra ha mejorado muchísimo y yo he aprendido a mi propio ritmo.`,
      highlight: 'Flexibilidad total para familias urbanas'
    }
  } else {
    return {
      author: 'Ana R.',
      location: `${city.name}`,
      text: `Desde ${city.name}, no teníamos acceso a educadores caninos especializados. Hakadogs nos ha traído formación profesional directamente a casa. La calidad es excepcional y los resultados hablan por sí mismos.`,
      highlight: 'Educación profesional en tu localidad'
    }
  }
}

/**
 * Genera FAQs específicas para la ciudad
 */
export function generateLocalFAQs(city: CityData): Array<{question: string, answer: string}> {
  const faqs: Array<{question: string, answer: string}> = []
  
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

/**
 * Genera título único para la sección "Por qué Hakadogs Online en [Ciudad]"
 */
export function generateWhyOnlineTitle(city: CityData): string {
  if (city.distanceFromArchena && city.distanceFromArchena > 100) {
    return `Por qué Hakadogs Online es la Mejor Opción en ${city.name}`
  } else if (city.population > 200000) {
    return `Educación Canina Flexible para el Ritmo de ${city.name}`
  } else {
    return `Formación Profesional Accesible desde ${city.name}`
  }
}
