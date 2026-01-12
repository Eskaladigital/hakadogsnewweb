/**
 * Rate Limiting para protección contra fuerza bruta y ataques automatizados
 * Implementa límites de tasa basados en IP y/o identificador de usuario
 */

interface RateLimitEntry {
  count: number
  resetTime: number
  blockedUntil?: number
}

// Almacenamiento en memoria (en producción considerar Redis para escalabilidad)
const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  /**
   * Número máximo de intentos permitidos en la ventana de tiempo
   */
  maxAttempts: number
  
  /**
   * Ventana de tiempo en segundos
   */
  windowSeconds: number
  
  /**
   * Tiempo de bloqueo en segundos después de exceder el límite
   */
  blockDurationSeconds?: number
  
  /**
   * Identificador único (IP, email, userId, etc.)
   */
  identifier: string
  
  /**
   * Nombre del recurso protegido (para logs)
   */
  resource?: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  blocked?: boolean
  retryAfter?: number
}

/**
 * Verifica si una acción está permitida según los límites de tasa
 */
export function checkRateLimit(config: RateLimitConfig): RateLimitResult {
  const {
    maxAttempts,
    windowSeconds,
    blockDurationSeconds = 300, // 5 minutos por defecto
    identifier,
    resource = 'unknown'
  } = config

  const now = Date.now()
  const key = `ratelimit:${resource}:${identifier}`
  
  let entry = rateLimitStore.get(key)

  // Si el usuario está bloqueado
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      blocked: true,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000)
    }
  }

  // Si pasó la ventana de tiempo, reiniciar
  if (!entry || entry.resetTime <= now) {
    entry = {
      count: 0,
      resetTime: now + windowSeconds * 1000
    }
  }

  // Incrementar contador
  entry.count++

  // Si se excedió el límite, bloquear
  if (entry.count > maxAttempts) {
    entry.blockedUntil = now + blockDurationSeconds * 1000
    rateLimitStore.set(key, entry)
    
    console.warn(`[Rate Limit] Blocked ${identifier} for ${resource} - exceeded ${maxAttempts} attempts`)
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      blocked: true,
      retryAfter: blockDurationSeconds
    }
  }

  rateLimitStore.set(key, entry)

  return {
    allowed: true,
    remaining: maxAttempts - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Limpia entradas expiradas del almacenamiento (llamar periódicamente)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= now && (!entry.blockedUntil || entry.blockedUntil <= now)) {
      rateLimitStore.delete(key)
    }
  }
}

// Limpieza automática cada 10 minutos
if (typeof global !== 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000)
}

/**
 * Configuraciones predefinidas para casos comunes
 */
export const RATE_LIMIT_PRESETS = {
  // Login: 5 intentos por 15 minutos
  LOGIN: {
    maxAttempts: 5,
    windowSeconds: 900,
    blockDurationSeconds: 900, // 15 minutos de bloqueo
    resource: 'login'
  },
  
  // Registro: 3 intentos por hora
  SIGNUP: {
    maxAttempts: 3,
    windowSeconds: 3600,
    blockDurationSeconds: 3600,
    resource: 'signup'
  },
  
  // Recuperación de contraseña: 3 intentos por hora
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowSeconds: 3600,
    blockDurationSeconds: 3600,
    resource: 'password-reset'
  },
  
  // Formulario de contacto: 5 intentos por hora
  CONTACT_FORM: {
    maxAttempts: 5,
    windowSeconds: 3600,
    blockDurationSeconds: 600,
    resource: 'contact-form'
  },
  
  // API general: 100 peticiones por minuto
  API_GENERAL: {
    maxAttempts: 100,
    windowSeconds: 60,
    blockDurationSeconds: 60,
    resource: 'api'
  }
} as const

/**
 * Helper para obtener el identificador del cliente (IP)
 */
export function getClientIdentifier(request: Request): string {
  // Intentar obtener la IP real detrás de proxies
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  
  if (forwarded) {
    // x-forwarded-for puede contener múltiples IPs, tomar la primera
    return forwarded.split(',')[0].trim()
  }
  
  if (realIp) {
    return realIp
  }
  
  // Fallback a una IP genérica (no ideal pero mejor que nada)
  return 'unknown'
}

/**
 * Middleware helper para aplicar rate limiting en API routes
 * 
 * Uso:
 * export async function POST(request: Request) {
 *   const rateLimit = applyRateLimit(request, RATE_LIMIT_PRESETS.LOGIN)
 *   if (!rateLimit.allowed) {
 *     return new Response(JSON.stringify({ error: 'Too many attempts' }), {
 *       status: 429,
 *       headers: {
 *         'Retry-After': rateLimit.retryAfter?.toString() || '60',
 *         'X-RateLimit-Remaining': '0',
 *       }
 *     })
 *   }
 *   // ... resto del código
 * }
 */
export function applyRateLimit(
  request: Request,
  preset: Omit<RateLimitConfig, 'identifier'>,
  customIdentifier?: string
): RateLimitResult {
  const identifier = customIdentifier || getClientIdentifier(request)
  
  return checkRateLimit({
    ...preset,
    identifier
  })
}

/**
 * Resetea el rate limit para un identificador específico
 * Útil después de un login exitoso para limpiar intentos fallidos previos
 */
export function resetRateLimit(identifier: string, resource: string): void {
  const key = `ratelimit:${resource}:${identifier}`
  rateLimitStore.delete(key)
}
