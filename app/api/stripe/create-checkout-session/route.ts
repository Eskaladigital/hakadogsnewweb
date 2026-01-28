import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getCourseById } from '@/lib/supabase/courses'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover'
})

export async function POST(req: NextRequest) {
  try {
    // Crear cliente de Supabase para el servidor con las cookies
    const cookieStore = cookies()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: false
        },
        global: {
          headers: {
            cookie: cookieStore.toString()
          }
        }
      }
    )
    
    // Verificar autenticación
    const { data: { session: userSession } } = await supabase.auth.getSession()
    
    if (!userSession) {
      console.error('❌ No hay sesión autenticada en el servidor')
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const userId = userSession.user.id
    const userEmail = userSession.user.email

    // Obtener datos del body
    const { courseId } = await req.json()

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId es requerido' },
        { status: 400 }
      )
    }

    // Obtener información del curso
    const course = await getCourseById(courseId)

    if (!course) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404 }
      )
    }

    if (course.is_free) {
      return NextResponse.json(
        { error: 'Este curso es gratuito' },
        { status: 400 }
      )
    }

    // Obtener el dominio base para las URLs de retorno
    const origin = req.headers.get('origin') || 'https://www.hakadogs.com'

    // Crear sesión de checkout de Stripe
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: course.title,
              description: course.short_description || course.description || undefined,
              images: course.cover_image_url ? [course.cover_image_url] : undefined,
            },
            unit_amount: Math.round(course.price * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/cursos/comprar/${course.slug}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cursos/comprar/${course.slug}?canceled=true`,
      metadata: {
        userId,
        courseId: course.id,
        courseSlug: course.slug,
        courseTitle: course.title,
        priceEuros: course.price.toString(),
      },
      // Configuración de facturación
      billing_address_collection: 'required',
      // Configuración de idioma
      locale: 'es',
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })

  } catch (error) {
    console.error('Error creando sesión de Stripe:', error)
    return NextResponse.json(
      { error: 'Error al crear la sesión de pago' },
      { status: 500 }
    )
  }
}
