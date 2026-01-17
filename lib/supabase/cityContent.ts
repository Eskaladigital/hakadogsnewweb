import { createClient } from '@supabase/supabase-js'

export interface CityContent {
  introText: string
  localBenefits: string[]
  localInfo: {
    pipicanes: string
    normativas: string
    clima: string
    playas: string
  }
  challenges: string[]
  testimonial: {
    text: string
    author: string
    neighborhood: string
  }
  faqs: Array<{
    question: string
    answer: string
  }>
}

/**
 * Obtiene contenido único de ciudad desde Supabase (si existe)
 * NOTA: Esta función se ejecuta en el servidor (Server Component)
 */
export async function getCityContent(citySlug: string): Promise<CityContent | null> {
  try {
    // Crear cliente de Supabase para servidor con credenciales de env
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data, error } = await supabase
      .from('city_content_cache')
      .select('*')
      .eq('city_slug', citySlug)
      .maybeSingle() // Usar maybeSingle en lugar de single para evitar error si no existe

    if (error) {
      console.error(`Error obteniendo contenido para ${citySlug}:`, error)
      return null
    }

    if (!data) {
      console.log(`No hay contenido en caché para: ${citySlug}`)
      return null
    }

    // Mapear los campos de snake_case a camelCase
    return {
      introText: data.intro_text || '',
      localBenefits: data.local_benefits || [],
      localInfo: data.local_info || { pipicanes: '', normativas: '', clima: '', playas: '' },
      challenges: data.challenges || [],
      testimonial: data.testimonial || { text: '', author: '', neighborhood: '' },
      faqs: data.faqs || [],
    }
  } catch (error) {
    console.error(`Error fatal obteniendo contenido para ${citySlug}:`, error)
    return null
  }
}

/**
 * Genera contenido para una ciudad llamando a la API
 */
export async function generateCityContent(
  citySlug: string,
  cityName: string,
  province: string,
  population: number,
  distanceFromArchena: number,
  region: string
): Promise<CityContent> {
  const response = await fetch('/api/generate-city-content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      citySlug,
      cityName,
      province,
      population,
      distanceFromArchena,
      region,
    }),
  })

  if (!response.ok) {
    throw new Error('Error generando contenido de ciudad')
  }

  const data = await response.json()
  return data.content
}

/**
 * Obtiene o genera contenido de ciudad (con caché automático)
 */
export async function getOrGenerateCityContent(
  citySlug: string,
  cityName: string,
  province: string,
  population: number,
  distanceFromArchena: number,
  region: string
): Promise<CityContent | null> {
  // 1. Intentar obtener desde caché
  const cached = await getCityContent(citySlug)
  if (cached) {
    return cached
  }

  // 2. Si no existe, generar (solo en cliente, no en build)
  // En build, retornamos null y se usa fallback
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return await generateCityContent(
      citySlug,
      cityName,
      province,
      population,
      distanceFromArchena,
      region
    )
  } catch (error) {
    console.error('Error generando contenido:', error)
    return null
  }
}
