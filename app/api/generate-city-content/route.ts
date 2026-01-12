import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

// Inicializar OpenAI (solo si existe la API key)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

// Inicializar Supabase (service role para writes)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Función para buscar info real con SerpApi
async function searchWithSerpApi(query: string): Promise<any> {
  const apiKey = process.env.SERPAPI_API_KEY
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${apiKey}&gl=es&hl=es&num=5`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    return data.organic_results || []
  } catch (error) {
    console.error('Error en SerpApi:', error)
    return []
  }
}

// Función para extraer info relevante de resultados de Google
function extractRelevantInfo(results: any[]): string {
  return results
    .slice(0, 3)
    .map((r: any) => `${r.title}\n${r.snippet}`)
    .join('\n\n')
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que tenemos las API keys necesarias
    if (!openai || !process.env.SERPAPI_API_KEY) {
      return NextResponse.json(
        { error: 'APIs no configuradas. Configura OPENAI_API_KEY y SERPAPI_API_KEY' },
        { status: 503 }
      )
    }

    const { citySlug, cityName, province, population, distanceFromArchena, region, forceRegenerate } = await request.json()

    if (!citySlug || !cityName) {
      return NextResponse.json(
        { error: 'citySlug y cityName son requeridos' },
        { status: 400 }
      )
    }

    // 1. Intentar obtener desde caché
    if (!forceRegenerate) {
      const { data: cachedContent, error: cacheError } = await supabase
        .from('city_content_cache')
        .select('*')
        .eq('city_slug', citySlug)
        .single()

      if (cachedContent && !cacheError) {
        console.log(`✅ Contenido de ${cityName} desde caché`)
        return NextResponse.json({
          success: true,
          cached: true,
          content: {
            introText: cachedContent.intro_text,
            localBenefits: cachedContent.local_benefits,
            localInfo: cachedContent.local_info,
            challenges: cachedContent.challenges,
            testimonial: cachedContent.testimonial,
            faqs: cachedContent.faqs,
          },
          cityName,
          generatedAt: cachedContent.generated_at,
        })
      }
    }

    console.log(`🔍 Buscando info real de ${cityName} con SerpApi...`)

    // 2. Buscar información REAL con SerpApi
    const [
      pipicansResults,
      normativasResults,
      climaResults,
      playasResults
    ] = await Promise.all([
      searchWithSerpApi(`pipicanes zonas caninas perros ${cityName}`),
      searchWithSerpApi(`normativa municipal perros ${cityName} ordenanza`),
      searchWithSerpApi(`clima ${cityName} ${province} temperatura`),
      searchWithSerpApi(`playas dog friendly perros ${cityName}`)
    ])

    const realData = {
      pipicanes: extractRelevantInfo(pipicansResults),
      normativas: extractRelevantInfo(normativasResults),
      clima: extractRelevantInfo(climaResults),
      playas: extractRelevantInfo(playasResults)
    }

    console.log(`🤖 Generando contenido con OpenAI usando datos reales...`)

    // 3. Generar contenido único con OpenAI usando datos REALES
    const prompt = `Eres un experto en educación canina y redactor SEO. 

Necesito contenido ÚNICO y ESPECÍFICO para una página de cursos online de educación canina en ${cityName}, ${province}.

DATOS DE LA CIUDAD:
- Nombre: ${cityName}
- Provincia: ${province}
- Población: ${population.toLocaleString()} habitantes
- Región: ${region}
- Distancia desde Archena: ${distanceFromArchena}km

INFORMACIÓN REAL OBTENIDA DE GOOGLE:

PIPICANES Y ZONAS CANINAS:
${realData.pipicanes || 'No hay información específica disponible'}

NORMATIVAS MUNICIPALES:
${realData.normativas || 'No hay información específica disponible'}

CLIMA:
${realData.clima || 'No hay información específica disponible'}

PLAYAS/NATURALEZA:
${realData.playas || 'No hay información específica disponible'}

GENERA CONTENIDO EN JSON con esta estructura (IMPORTANTE: menciona SIEMPRE "${cityName}" para SEO):

{
  "introText": "Párrafo único 80-100 palabras explicando por qué cursos online son ideales para ${cityName}. USA los datos reales de arriba.",
  
  "localBenefits": [
    "4 beneficios específicos mencionando ${cityName}, distancia (${distanceFromArchena}km), y datos reales"
  ],
  
  "localInfo": {
    "pipicanes": "Resumen específico basado en datos reales de pipicanes en ${cityName}",
    "normativas": "Resumen específico basado en datos reales de normativas de ${cityName}",
    "clima": "Cómo afecta el clima real de ${cityName} al adiestramiento",
    "playas": "Info real sobre playas/naturaleza en ${cityName} o cercanías"
  },
  
  "challenges": [
    "3 desafíos reales de tener perro en ${cityName} basados en los datos de arriba"
  ],
  
  "testimonial": {
    "text": "Testimonio realista 120-150 palabras de residente de ${cityName} mencionando características locales reales",
    "author": "Nombre español realista",
    "neighborhood": "Barrio real de ${cityName}"
  },
  
  "faqs": [
    {
      "question": "¿Los cursos online funcionan desde ${cityName}?",
      "answer": "Respuesta mencionando ${cityName} y ventajas online"
    },
    {
      "question": "¿Qué pasa con la distancia desde ${cityName} (${distanceFromArchena}km)?",
      "answer": "Respuesta sobre ventajas online vs desplazamiento"
    },
    {
      "question": "Pregunta sobre característica local real de ${cityName}",
      "answer": "Respuesta usando datos reales obtenidos"
    }
  ]
}

REGLAS IMPORTANTES:
- USA los datos REALES de Google (pipicanes, normativas, clima, playas)
- Menciona "${cityName}" en CADA sección para SEO
- Si no hay datos reales, sé genérico pero lógico
- Contenido profesional, cercano y útil
- NO inventes datos, usa solo lo proporcionado

Responde SOLO con el JSON, sin texto adicional.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Eres un experto redactor SEO de educación canina. Generas contenido único basado en datos reales de Google.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500,
    })

    const responseText = completion.choices[0].message.content?.trim()
    
    if (!responseText) {
      throw new Error('No se recibió respuesta de OpenAI')
    }

    // Parsear JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No se pudo extraer JSON de la respuesta')
    }

    const generatedContent = JSON.parse(jsonMatch[0])

    // 4. Guardar en Supabase
    const { error: insertError } = await supabase
      .from('city_content_cache')
      .upsert({
        city_slug: citySlug,
        city_name: cityName,
        province: province,
        intro_text: generatedContent.introText,
        local_benefits: generatedContent.localBenefits,
        local_info: generatedContent.localInfo,
        challenges: generatedContent.challenges,
        testimonial: generatedContent.testimonial,
        faqs: generatedContent.faqs,
      }, {
        onConflict: 'city_slug'
      })

    if (insertError) {
      console.error('⚠️ Error guardando en caché:', insertError)
    } else {
      console.log(`✅ Contenido de ${cityName} guardado en caché`)
    }

    return NextResponse.json({
      success: true,
      cached: false,
      generated: true,
      usedRealData: true,
      content: generatedContent,
      cityName,
    })

  } catch (error: any) {
    console.error('Error generando contenido:', error)
    return NextResponse.json(
      { 
        error: 'Error al generar contenido',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
