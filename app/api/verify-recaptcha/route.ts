import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp } from '@/lib/utils/rateLimit'

/**
 * API Route para verificar tokens de Google reCAPTCHA v3
 * 
 * Protecciones implementadas:
 * 1. Rate Limiting por IP (5 intentos cada 15 minutos)
 * 2. Validación del token con Google
 * 3. Verificación de score (≥ 0.5)
 * 4. Validación de acción ('registro')
 */
export async function POST(request: NextRequest) {
  try {
    // 🚦 RATE LIMITING - Verificar límite de intentos por IP
    const clientIp = getClientIp(request)
    const rateLimitResult = checkRateLimit(
      clientIp,
      5,              // Máximo 5 intentos
      15 * 60 * 1000  // Cada 15 minutos
    )

    if (!rateLimitResult.success) {
      console.warn(`🚫 Rate limit excedido para IP: ${clientIp}`)
      return NextResponse.json(
        { 
          success: false, 
          error: rateLimitResult.error,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      )
    }

    console.log(`✅ Rate limit OK para IP ${clientIp}: ${rateLimitResult.remaining} intentos restantes`)

    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token de reCAPTCHA requerido' },
        { status: 400 }
      )
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error('❌ RECAPTCHA_SECRET_KEY no configurada')
      return NextResponse.json(
        { success: false, error: 'Configuración de reCAPTCHA incompleta' },
        { status: 500 }
      )
    }

    // Verificar el token con Google
    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
    const verifyResponse = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const verifyData = await verifyResponse.json()

    console.log('🔐 Verificación reCAPTCHA:', {
      success: verifyData.success,
      score: verifyData.score,
      action: verifyData.action,
      hostname: verifyData.hostname,
    })

    // Verificar que el token sea válido
    if (!verifyData.success) {
      console.warn('⚠️ Token de reCAPTCHA inválido:', verifyData['error-codes'])
      return NextResponse.json(
        { 
          success: false, 
          error: 'Verificación de seguridad fallida',
          details: verifyData['error-codes']
        },
        { status: 400 }
      )
    }

    // Verificar la puntuación (score)
    // reCAPTCHA v3 da puntuaciones de 0.0 a 1.0
    // 0.0 = muy probablemente un bot
    // 1.0 = muy probablemente un humano
    const minScore = 0.5 // Umbral configurable
    
    if (verifyData.score < minScore) {
      console.warn(`⚠️ Puntuación de reCAPTCHA muy baja: ${verifyData.score} (mínimo: ${minScore})`)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Parece que eres un robot. Si eres humano, intenta de nuevo.',
          score: verifyData.score 
        },
        { status: 403 }
      )
    }

    // Verificar que la acción sea la correcta
    if (verifyData.action !== 'registro') {
      console.warn('⚠️ Acción de reCAPTCHA incorrecta:', verifyData.action)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token de reCAPTCHA inválido para esta acción' 
        },
        { status: 400 }
      )
    }

    // Todo OK
    console.log(`✅ reCAPTCHA verificado exitosamente (score: ${verifyData.score})`)
    return NextResponse.json(
      { 
        success: true, 
        score: verifyData.score,
        message: 'Verificación exitosa'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('❌ Error verificando reCAPTCHA:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
