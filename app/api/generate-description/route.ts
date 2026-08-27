import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    // 🔒 PASO 1: VERIFICAR AUTENTICACIÓN
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autorizado - Token requerido' },
        { status: 401 }
      )
    }

    // Crear cliente de Supabase con el token del usuario
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const token = authHeader.replace('Bearer ', '')

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })

    // Verificar sesión
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado - Sesión inválida' },
        { status: 401 }
      )
    }

    // 🔒 PASO 2: VERIFICAR ROL DE ADMIN
    const userRole = user.user_metadata?.role
    if (userRole !== 'admin') {
      console.warn(`⚠️ Usuario ${user.email} intentó usar API de OpenAI sin ser admin`)
      return NextResponse.json(
        { error: 'Prohibido - Solo administradores pueden generar descripciones' },
        { status: 403 }
      )
    }

    // 🔒 PASO 3: VALIDAR DATOS DE ENTRADA
    const { title, whatYouLearn } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'El título del curso es requerido' },
        { status: 400 }
      )
    }

    // Limitar longitud del título para evitar abusos
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'El título es demasiado largo (máximo 200 caracteres)' },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error('❌ OpenAI API key no configurada')
      return NextResponse.json(
        { error: 'Servicio no disponible' },
        { status: 500 }
      )
    }

    // Construir el prompt para OpenAI
    const learnPoints = whatYouLearn && whatYouLearn.length > 0 
      ? whatYouLearn.filter((point: string) => point.trim() !== '').join(', ')
      : 'conceptos fundamentales de educación canina'

    const prompt = `Escribe una descripción corta y atractiva (máximo 150 palabras) para un curso de educación canina titulado "${title}". 
    
${learnPoints ? `El curso enseña: ${learnPoints}.` : ''}

La descripción debe ser:
- Convincente y profesional
- Enfocada en los beneficios para el dueño del perro
- Escrita en español
- Máximo 150 palabras
- Sin usar emojis
- Directa y clara`

    // Log para auditoría
    console.log(`✅ Admin ${user.email} generando descripción para curso: "${title}"`)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-5.6-terra',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en marketing de cursos online de educación canina. Escribes descripciones convincentes y profesionales.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 1500,
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API Error:', errorData)
      return NextResponse.json(
        { error: 'Error al generar la descripción con OpenAI' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const description = data.choices?.[0]?.message?.content?.trim()

    if (!description) {
      return NextResponse.json(
        { error: 'No se pudo generar la descripción' },
        { status: 500 }
      )
    }

    return NextResponse.json({ description })
  } catch (error) {
    console.error('❌ Error generando descripción:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
