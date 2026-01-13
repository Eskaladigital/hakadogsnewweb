import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

interface TestQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
  explanation: string
}

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
      console.warn(`⚠️ Usuario ${user.email} intentó generar test sin ser admin`)
      return NextResponse.json(
        { error: 'Prohibido - Solo administradores pueden generar tests' },
        { status: 403 }
      )
    }

    // 🔒 PASO 3: VALIDAR DATOS DE ENTRADA
    const { moduleId, regenerate = false } = await request.json()

    if (!moduleId) {
      return NextResponse.json(
        { error: 'El ID del módulo es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el módulo existe
    const { data: moduleData, error: moduleError } = await supabase
      .from('course_modules')
      .select('id, title, description, course_id')
      .eq('id', moduleId)
      .single()

    if (moduleError || !moduleData) {
      return NextResponse.json(
        { error: 'Módulo no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si ya existe un test (si no es regeneración)
    if (!regenerate) {
      const { data: existingTest } = await supabase
        .from('module_tests')
        .select('id')
        .eq('module_id', moduleId)
        .single()

      if (existingTest) {
        return NextResponse.json(
          { error: 'Este módulo ya tiene un test. Usa regenerate=true para regenerarlo.' },
          { status: 400 }
        )
      }
    }

    // Obtener las lecciones del módulo
    const { data: lessons, error: lessonsError } = await supabase
      .from('course_lessons')
      .select('id, title, content, duration_minutes')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true })

    if (lessonsError || !lessons || lessons.length === 0) {
      return NextResponse.json(
        { error: 'El módulo no tiene lecciones. Agrega lecciones antes de generar el test.' },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error('❌ OpenAI API key no configurada')
      return NextResponse.json(
        { error: 'Servicio de IA no disponible' },
        { status: 500 }
      )
    }

    // Preparar contenido de las lecciones para el prompt
    const lessonsContent = lessons.map((l, index) => {
      // Limpiar HTML del contenido
      const cleanContent = l.content 
        ? l.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 1500)
        : ''
      
      return `
### Lección ${index + 1}: ${l.title}
${cleanContent || 'Sin contenido detallado disponible.'}
`
    }).join('\n')

    // Construir el prompt para OpenAI
    const prompt = `Eres un experto en educación canina y diseño instruccional. Genera un test de evaluación de 20 preguntas de opción múltiple basado en el siguiente contenido de un módulo de curso.

## Módulo: ${moduleData.title}
${moduleData.description ? `Descripción: ${moduleData.description}` : ''}

## Contenido de las lecciones:
${lessonsContent}

## Instrucciones para las preguntas:

1. Genera EXACTAMENTE 20 preguntas de opción múltiple
2. Cada pregunta debe tener 4 opciones (A, B, C, D)
3. Solo UNA opción es correcta por pregunta
4. Las preguntas deben cubrir TODO el contenido del módulo de forma equilibrada
5. Incluye preguntas de diferentes niveles:
   - 6 preguntas fáciles (comprensión básica)
   - 8 preguntas de dificultad media (aplicación de conceptos)
   - 6 preguntas difíciles (análisis y síntesis)
6. Cada pregunta debe ser clara y sin ambigüedades
7. Las opciones incorrectas deben ser plausibles pero claramente erróneas
8. Incluye una breve explicación de por qué la respuesta correcta es la correcta

## Formato de respuesta (JSON estricto):

Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "questions": [
    {
      "id": "q1",
      "question": "¿Cuál es el texto de la pregunta?",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correct_answer": 0,
      "explanation": "Breve explicación de por qué es correcta"
    }
  ]
}

IMPORTANTE: 
- correct_answer es el ÍNDICE (0-3) de la opción correcta
- No incluyas ningún texto fuera del JSON
- Asegúrate de que el JSON sea válido`

    console.log(`✅ Admin ${user.email} generando test para módulo: "${moduleData.title}"`)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en educación canina y diseño de evaluaciones. Siempre respondes con JSON válido y bien formateado.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API Error:', errorData)
      return NextResponse.json(
        { error: 'Error al generar el test con IA' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return NextResponse.json(
        { error: 'No se pudo generar el contenido del test' },
        { status: 500 }
      )
    }

    // Parsear el JSON de respuesta
    let testData: { questions: TestQuestion[] }
    try {
      testData = JSON.parse(content)
    } catch (parseError) {
      console.error('Error parseando respuesta de OpenAI:', content)
      return NextResponse.json(
        { error: 'Error al procesar la respuesta de IA' },
        { status: 500 }
      )
    }

    // Validar estructura
    if (!testData.questions || !Array.isArray(testData.questions) || testData.questions.length === 0) {
      return NextResponse.json(
        { error: 'El test generado no tiene preguntas válidas' },
        { status: 500 }
      )
    }

    // Validar cada pregunta
    for (let i = 0; i < testData.questions.length; i++) {
      const q = testData.questions[i]
      if (!q.question || !q.options || q.options.length !== 4 || 
          typeof q.correct_answer !== 'number' || q.correct_answer < 0 || q.correct_answer > 3) {
        return NextResponse.json(
          { error: `Pregunta ${i + 1} tiene formato inválido` },
          { status: 500 }
        )
      }
      // Asegurar que tiene ID
      if (!q.id) {
        q.id = `q${i + 1}`
      }
    }

    // Guardar o actualizar el test en la base de datos
    const testPayload = {
      module_id: moduleId,
      title: `Test: ${moduleData.title}`,
      description: `Evaluación de conocimientos del módulo "${moduleData.title}". Aprueba con un 80% para completar el módulo.`,
      passing_score: 80,
      questions: testData.questions,
      is_generated: true,
      is_published: false, // Por defecto no publicado para revisión
      updated_at: new Date().toISOString()
    }

    let savedTest
    if (regenerate) {
      // Actualizar test existente
      const { data: updated, error: updateError } = await supabase
        .from('module_tests')
        .update(testPayload)
        .eq('module_id', moduleId)
        .select()
        .single()

      if (updateError) {
        console.error('Error actualizando test:', updateError)
        return NextResponse.json(
          { error: 'Error al guardar el test regenerado' },
          { status: 500 }
        )
      }
      savedTest = updated
    } else {
      // Crear nuevo test
      const { data: created, error: createError } = await supabase
        .from('module_tests')
        .insert(testPayload)
        .select()
        .single()

      if (createError) {
        console.error('Error creando test:', createError)
        return NextResponse.json(
          { error: 'Error al guardar el test' },
          { status: 500 }
        )
      }
      savedTest = created
    }

    console.log(`✅ Test ${regenerate ? 'regenerado' : 'creado'} para módulo "${moduleData.title}" con ${testData.questions.length} preguntas`)

    return NextResponse.json({
      success: true,
      test: {
        id: savedTest.id,
        title: savedTest.title,
        questions_count: testData.questions.length,
        is_published: savedTest.is_published
      },
      message: `Test ${regenerate ? 'regenerado' : 'generado'} exitosamente con ${testData.questions.length} preguntas. Revísalo y publícalo cuando esté listo.`
    })

  } catch (error) {
    console.error('❌ Error generando test:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
