import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, whatYouLearn } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: 'El título del curso es requerido' },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key no configurada' },
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
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
        max_tokens: 200,
        temperature: 0.7
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
    console.error('Error generando descripción:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
