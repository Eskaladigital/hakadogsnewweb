import { createClient } from '@/lib/supabase/client'

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
 */
export async function getCityContent(citySlug: string): Promise<CityContent | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('city_content_cache')
    .select('*')
    .eq('city_slug', citySlug)
    .single()

  if (error || !data) {
    return null
  }

  return {
    introText: (data as any).intro_text,
    localBenefits: (data as any).local_benefits,
    localInfo: (data as any).local_info,
    challenges: (data as any).challenges,
    testimonial: (data as any).testimonial,
    faqs: (data as any).faqs,
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
