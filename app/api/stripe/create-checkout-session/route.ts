import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getCourseById } from '@/lib/supabase/courses'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover'
})

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 === STRIPE CHECKOUT ===')
    
    // Obtener el token de autorización del header
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No se recibió token de autorización')
      return NextResponse.json(
        { error: 'No autenticado - Token requerido' },
        { status: 401 }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    console.log('🔑 Token recibido:', token.substring(0, 20) + '...')
    
    // Crear cliente de Supabase y verificar el token
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    )
    
    // Obtener el usuario desde el token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      console.error('❌ Token inválido o expirado:', userError?.message)
      return NextResponse.json(
        { error: 'Token inválido o sesión expirada' },
        { status: 401 }
      )
    }

    console.log('✅ Usuario autenticado:', user.email)
    
    const userId = user.id
    const userEmail = user.email

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
