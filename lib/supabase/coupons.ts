import { supabase } from './client'

export interface Coupon {
  id: string
  code: string
  discount_percentage: number
  partner_name: string | null
  description: string | null
  is_active: boolean
  usage_limit: number | null
  times_used: number
  valid_from: string
  valid_until: string | null
  created_at: string
  updated_at: string
}

export interface CouponUsage {
  id: string
  coupon_id: string
  purchase_id: string
  user_id: string
  course_id: string
  discount_applied: number
  original_price: number
  final_price: number
  created_at: string
}

export interface CouponValidation {
  valid: boolean
  coupon_id: string | null
  code: string | null
  discount_percentage: number | null
  partner_name: string | null
  error_message: string | null
}

export interface CouponStats {
  id: string
  code: string
  partner_name: string | null
  discount_percentage: number
  is_active: boolean
  usage_limit: number | null
  times_used: number
  valid_from: string
  valid_until: string | null
  total_discount_given: number
  total_revenue_with_coupon: number
  actual_uses: number
  created_at: string
  updated_at: string
}

// ===== VALIDACIÓN DE CUPONES =====

/**
 * Valida un cupón y devuelve si es válido o el error correspondiente
 */
export async function validateCoupon(code: string): Promise<CouponValidation> {
  try {
    const { data, error } = await (supabase as any)
      .rpc('validate_coupon', { 
        p_code: code.trim().toUpperCase()
      })
      .single()

    if (error) {
      console.error('Error validando cupón:', error)
      return {
        valid: false,
        coupon_id: null,
        code: null,
        discount_percentage: null,
        partner_name: null,
        error_message: 'Error al validar el cupón'
      }
    }

    return data as CouponValidation
  } catch (error) {
    console.error('Error validando cupón:', error)
    return {
      valid: false,
      coupon_id: null,
      code: null,
      discount_percentage: null,
      partner_name: null,
      error_message: 'Error al validar el cupón'
    }
  }
}

/**
 * Calcula el precio con descuento aplicado
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): { finalPrice: number; discountAmount: number } {
  const discountAmount = Math.round((originalPrice * discountPercentage / 100) * 100) / 100
  const finalPrice = Math.max(0, originalPrice - discountAmount)
  
  return {
    finalPrice: Math.round(finalPrice * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100
  }
}

// ===== GESTIÓN DE CUPONES (ADMIN) =====

/**
 * Obtener todos los cupones (para administradores)
 */
export async function getAllCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error obteniendo cupones:', error)
    throw error
  }

  return data as Coupon[]
}

/**
 * Obtener un cupón por ID
 */
export async function getCouponById(id: string): Promise<Coupon | null> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error obteniendo cupón:', error)
    return null
  }

  return data as Coupon
}

/**
 * Crear un nuevo cupón
 */
export async function createCoupon(couponData: {
  code: string
  discount_percentage: number
  partner_name?: string
  description?: string
  usage_limit?: number
  valid_from?: string
  valid_until?: string
}): Promise<Coupon | null> {
  try {
    const { data, error } = await (supabase as any)
      .from('coupons')
      .insert([{
        code: couponData.code.trim().toUpperCase(),
        discount_percentage: couponData.discount_percentage,
        partner_name: couponData.partner_name || null,
        description: couponData.description || null,
        usage_limit: couponData.usage_limit || null,
        valid_from: couponData.valid_from || new Date().toISOString(),
        valid_until: couponData.valid_until || null,
        is_active: true,
        times_used: 0
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creando cupón:', error)
      throw error
    }

    return data as Coupon
  } catch (error) {
    console.error('Error creando cupón:', error)
    return null
  }
}

/**
 * Actualizar un cupón existente
 */
export async function updateCoupon(
  id: string, 
  updates: Partial<Omit<Coupon, 'id' | 'times_used' | 'created_at' | 'updated_at'>>
): Promise<boolean> {
  try {
    // Si se actualiza el código, normalizarlo
    if (updates.code) {
      updates.code = updates.code.trim().toUpperCase()
    }

    const { error } = await (supabase as any)
      .from('coupons')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error actualizando cupón:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error actualizando cupón:', error)
    return false
  }
}

/**
 * Eliminar un cupón
 */
export async function deleteCoupon(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error eliminando cupón:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error eliminando cupón:', error)
    return false
  }
}

/**
 * Activar/Desactivar un cupón
 */
export async function toggleCouponStatus(id: string, isActive: boolean): Promise<boolean> {
  return updateCoupon(id, { is_active: isActive })
}

// ===== ESTADÍSTICAS DE CUPONES =====

/**
 * Obtener estadísticas de todos los cupones
 */
export async function getCouponStats(): Promise<CouponStats[]> {
  const { data, error } = await supabase
    .from('coupon_stats')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error obteniendo estadísticas de cupones:', error)
    throw error
  }

  return data as CouponStats[]
}

/**
 * Obtener estadísticas de un cupón específico
 */
export async function getCouponStatsById(id: string): Promise<CouponStats | null> {
  const { data, error } = await supabase
    .from('coupon_stats')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error obteniendo estadísticas del cupón:', error)
    return null
  }

  return data as CouponStats
}

/**
 * Obtener historial de usos de un cupón
 */
export async function getCouponUsageHistory(couponId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('coupon_usage')
    .select(`
      *,
      courses:course_id (
        title,
        slug
      )
    `)
    .eq('coupon_id', couponId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error obteniendo historial de uso del cupón:', error)
    return []
  }

  return data
}

/**
 * Obtener cupones más utilizados
 */
export async function getTopCoupons(limit: number = 10): Promise<CouponStats[]> {
  const { data, error } = await supabase
    .from('coupon_stats')
    .select('*')
    .order('actual_uses', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error obteniendo cupones más utilizados:', error)
    return []
  }

  return data as CouponStats[]
}

/**
 * Obtener cupones por colaborador
 */
export async function getCouponsByPartner(partnerName: string): Promise<Coupon[]> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .ilike('partner_name', `%${partnerName}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error obteniendo cupones por colaborador:', error)
    return []
  }

  return data as Coupon[]
}
