/**
 * Protección CSRF (Cross-Site Request Forgery)
 * Implementa tokens únicos por sesión para prevenir ataques CSRF
 */

import { randomBytes } from 'crypto'
import { cookies } from 'next/headers'

const CSRF_TOKEN_NAME = 'csrf_token'
const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * Genera un token CSRF único y aleatorio
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex')
}

/**
 * Obtiene o crea un token CSRF para la sesión actual
 * Este token debe ser incluido en formularios y peticiones de cambio de estado
 */
export async function getCSRFToken(): Promise<string> {
  const cookieStore = cookies()
  let token = cookieStore.get(CSRF_TOKEN_NAME)?.value

  if (!token) {
    token = generateCSRFToken()
    // El token CSRF NO debe ser HttpOnly para que el JS pueda leerlo
    cookieStore.set(CSRF_TOKEN_NAME, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hora
      path: '/',
    })
  }

  return token
}

/**
 * Valida que el token CSRF recibido coincida con el almacenado
 * Debe llamarse en todas las peticiones POST/PUT/DELETE/PATCH protegidas
 */
export async function validateCSRFToken(
  request: Request
): Promise<{ valid: boolean; error?: string }> {
  const cookieStore = cookies()
  const expectedToken = cookieStore.get(CSRF_TOKEN_NAME)?.value

  if (!expectedToken) {
    return { valid: false, error: 'No CSRF token found in session' }
  }

  // El token puede venir en un header o en el body
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  
  let bodyToken: string | undefined
  try {
    const contentType = request.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      const body = await request.json()
      bodyToken = body.csrfToken
      // Reconstruir el request ya que consumimos el body
      ;(request as any).json = () => Promise.resolve(body)
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      bodyToken = formData.get('csrfToken')?.toString()
      // Reconstruir el request
      ;(request as any).formData = () => Promise.resolve(formData)
    }
  } catch (error) {
    // Si no se puede parsear el body, solo validamos el header
  }

  const receivedToken = headerToken || bodyToken

  if (!receivedToken) {
    return { valid: false, error: 'CSRF token not provided in request' }
  }

  // Comparación segura contra timing attacks
  if (!timingSafeEqual(expectedToken, receivedToken)) {
    return { valid: false, error: 'CSRF token mismatch' }
  }

  return { valid: true }
}

/**
 * Comparación de strings resistente a timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false
  }
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  
  return result === 0
}

/**
 * Middleware helper para proteger rutas API con CSRF
 * Uso en API routes:
 * 
 * export async function POST(request: Request) {
 *   const csrfValidation = await validateCSRFToken(request)
 *   if (!csrfValidation.valid) {
 *     return new Response(JSON.stringify({ error: 'CSRF validation failed' }), {
 *       status: 403,
 *       headers: { 'Content-Type': 'application/json' },
 *     })
 *   }
 *   // ... resto del código
 * }
 */
export async function withCSRFProtection(
  handler: (request: Request) => Promise<Response>,
  request: Request
): Promise<Response> {
  // Solo validar en métodos que modifican estado
  const method = request.method.toUpperCase()
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const validation = await validateCSRFToken(request)
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ 
          error: 'CSRF validation failed', 
          message: validation.error 
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  }

  return handler(request)
}

/**
 * Hook para usar en componentes cliente
 * Ejemplo de uso en un formulario:
 * 
 * const csrfToken = await fetch('/api/csrf').then(r => r.json()).then(d => d.token)
 * 
 * fetch('/api/endpoint', {
 *   method: 'POST',
 *   headers: { 'x-csrf-token': csrfToken },
 *   body: JSON.stringify(data)
 * })
 */
export const CSRF_HEADER = CSRF_HEADER_NAME
