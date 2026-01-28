import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createPurchase } from '@/lib/supabase/courses'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('❌ No se encontró firma de Stripe')
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      )
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('❌ Error verificando firma del webhook:', err)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err}` },
        { status: 400 }
      )
    }

    // Procesar el evento
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        console.log('✅ Pago completado:', {
          sessionId: session.id,
          paymentStatus: session.payment_status,
          metadata: session.metadata
        })

        // Verificar que el pago se completó
        if (session.payment_status === 'paid') {
          const { userId, courseId, priceEuros } = session.metadata || {}

          if (!userId || !courseId || !priceEuros) {
            console.error('❌ Metadata incompleta en sesión:', session.metadata)
            return NextResponse.json(
              { error: 'Metadata incompleta' },
              { status: 400 }
            )
          }

          // Registrar la compra en la base de datos
          try {
            await createPurchase({
              user_id: userId,
              course_id: courseId,
              price_paid: parseFloat(priceEuros),
              payment_status: 'completed',
              payment_method: 'stripe',
              payment_id: session.payment_intent as string || session.id,
              purchase_date: new Date().toISOString()
            })

            console.log('✅ Compra registrada exitosamente en BD:', {
              userId,
              courseId,
              price: priceEuros
            })
          } catch (dbError) {
            console.error('❌ Error registrando compra en BD:', dbError)
            // Importante: retornar 500 para que Stripe reintente
            return NextResponse.json(
              { error: 'Error registrando compra' },
              { status: 500 }
            )
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('❌ Pago fallido:', paymentIntent.id)
        break
      }

      default:
        console.log(`ℹ️ Evento no manejado: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Error en webhook de Stripe:', error)
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    )
  }
}
