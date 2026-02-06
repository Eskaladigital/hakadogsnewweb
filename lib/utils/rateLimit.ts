/**
 * Rate Limiter con almacenamiento en memoria
 * 
 * Limita el número de solicitudes por IP en un período de tiempo
 * Para producción, considera usar Redis o una base de datos
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Almacenamiento en memoria de intentos por IP
const ipAttempts = new Map<string, RateLimitEntry>()

// Limpieza periódica de IPs antiguas (cada 1 hora)
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of ipAttempts.entries()) {
    if (now > entry.resetTime) {
      ipAttempts.delete(ip)
    }
  }
}, 60 * 60 * 1000) // 1 hora

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
  error?: string
}

/**
 * Verifica si una IP ha excedido el límite de solicitudes
 * 
 * @param ip - Dirección IP del cliente
 * @param limit - Número máximo de solicitudes permitidas
 * @param windowMs - Ventana de tiempo en milisegundos
 * @returns Resultado del rate limiting
 */
export function checkRateLimit(
  ip: string,
  limit: number = 5, // 5 intentos por defecto
  windowMs: number = 15 * 60 * 1000 // 15 minutos por defecto
): RateLimitResult {
  const now = Date.now()
  const entry = ipAttempts.get(ip)

  // Si no hay entrada o la ventana expiró, crear nueva
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs
    ipAttempts.set(ip, { count: 1, resetTime })
    
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetTime,
    }
  }

  // Incrementar contador
  entry.count++

  // Si excede el límite
  if (entry.count > limit) {
    const minutesRemaining = Math.ceil((entry.resetTime - now) / 60000)
    
    return {
      success: false,
      limit,
      remaining: 0,
      resetTime: entry.resetTime,
      error: `Demasiados intentos. Por favor, espera ${minutesRemaining} minuto${minutesRemaining > 1 ? 's' : ''} antes de intentar de nuevo.`,
    }
  }

  // Aún dentro del límite
  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Extrae la IP del cliente desde la request de Next.js
 * Soporta proxies como Vercel, Cloudflare, etc.
 */
export function getClientIp(request: Request): string {
  // Intentar obtener la IP de headers comunes de proxies
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for puede contener múltiples IPs, tomar la primera
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  if (cfConnectingIp) {
    return cfConnectingIp
  }

  // Fallback (en desarrollo local)
  return 'unknown'
}

/**
 * Resetea el contador de una IP (útil para testing o después de login exitoso)
 */
export function resetRateLimit(ip: string): void {
  ipAttempts.delete(ip)
}

/**
 * Obtiene estadísticas actuales de rate limiting (para debugging)
 */
export function getRateLimitStats(): {
  totalIps: number
  blockedIps: number
  entries: Array<{ ip: string; count: number; resetTime: number }>
} {
  const now = Date.now()
  const entries: Array<{ ip: string; count: number; resetTime: number }> = []
  let blockedCount = 0

  for (const [ip, entry] of ipAttempts.entries()) {
    entries.push({ ip, count: entry.count, resetTime: entry.resetTime })
    if (entry.count > 5 && now < entry.resetTime) {
      blockedCount++
    }
  }

  return {
    totalIps: ipAttempts.size,
    blockedIps: blockedCount,
    entries: entries.sort((a, b) => b.count - a.count),
  }
}
