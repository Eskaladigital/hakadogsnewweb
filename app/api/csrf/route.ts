/**
 * API endpoint para obtener un token CSRF
 * Los componentes cliente pueden llamar a este endpoint antes de hacer peticiones protegidas
 */

import { getCSRFToken } from '@/lib/security/csrf'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const token = await getCSRFToken()
    
    return NextResponse.json(
      { token },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    )
  } catch (error) {
    console.error('Error generating CSRF token:', error)
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    )
  }
}
