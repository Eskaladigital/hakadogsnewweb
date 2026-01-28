import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getCourseById } from '@/lib/supabase/courses'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover'
})

export async function POST(req: NextRequest) {
  try {
    console.log('🔍 === STRIPE CHECKOUT DEBUG ===')
    
    // Crear cliente de Supabase para el servidor
    const cookieStore = await cookies()
    
    // Log todas las cookies disponibles
    const allCookies = cookieStore.getAll()
    console.log('🍪 Todas las cookies recibidas:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length })))
    
    // Buscar cookies de Supabase específicamente
    const supabaseCookies = allCookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'))
    console.log('🔐 Cookies de Supabase encontradas:', supabaseCookies.map(c => c.name))
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            const value = cookieStore.get(name)?.value
            console.log(`  📖 Cookie get("${name}"): ${value ? `${value.substring(0, 20)}...` : 'undefined'}`)
            return value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (e) {
              console.log(`  ⚠️ No se pudo setear cookie "${name}"`)
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (e) {
              console.log(`  ⚠️ No se pudo eliminar cookie "${name}"`)
            }
          },
        },
      }
    )
    
    // Verificar autenticación
    console.log('🔑 Verificando sesión de Supabase...')
    const { data: { session: userSession }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Error al obtener sesión:', sessionError)
    }
    
    console.log('📋 Resultado getSession:', {
      hasSession: !!userSession,
      userId: userSession?.user?.id,
      userEmail: userSession?.user?.email,
      expiresAt: userSession?.expires_at
    })
    
    if (!userSession) {
      console.error('❌ No hay sesión autenticada en el servidor')
      console.error('❌ Cookies presentes:', allCookies.map(c => c.name).join(', '))
      return NextResponse.json(
        { error: 'No autenticado', debug: { cookiesPresent: allCookies.map(c => c.name) } },
        { status: 401 }
      )
    }

    console.log('✅ Usuario autenticado:', userSession.user.email)

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
