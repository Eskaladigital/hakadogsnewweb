import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    // Obtener el token de autorización
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }
    
    const token = authHeader.replace('Bearer ', '')
    
    // Crear cliente de Supabase con el token del usuario
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
    
    // Verificar usuario
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Token inválido o sesión expirada' },
        { status: 401 }
      )
    }

    // Obtener código del cupón del body
    const { code } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Código de cupón requerido' },
        { status: 400 }
      )
    }

    // Validar el cupón usando la función RPC
    const { data, error } = await supabase
      .rpc('validate_coupon', { 
        p_code: code.trim().toUpperCase(),
        p_user_id: user.id
      })
      .single()

    if (error) {
      console.error('Error validando cupón:', error)
      return NextResponse.json(
        { error: 'Error al validar el cupón' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Error en /api/coupons/validate:', error)
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    )
  }
}
