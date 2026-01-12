/**
 * Utilidades de seguridad para manejo de cookies
 * Implementa las mejores prácticas OWASP para protección de sesiones
 */

import { NextResponse } from 'next/server'

export interface SecureCookieOptions {
  name: string
  value: string
  maxAge?: number // en segundos
  path?: string
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

/**
 * Configura una cookie segura con todos los flags de seguridad necesarios
 * - HttpOnly: previene acceso vía JavaScript (protección contra XSS)
 * - Secure: solo se envía por HTTPS
 * - SameSite: protección contra CSRF
 */
export function setSecureCookie(
  response: NextResponse,
  options: SecureCookieOptions
): NextResponse {
  const {
    name,
    value,
    maxAge = 3600, // 1 hora por defecto
    path = '/',
    httpOnly = true,
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'lax'
  } = options

  // Construir el valor de Set-Cookie con todos los flags de seguridad
  const cookieValue = [
    `${name}=${value}`,
    `Max-Age=${maxAge}`,
    `Path=${path}`,
    httpOnly ? 'HttpOnly' : '',
    secure ? 'Secure' : '',
    `SameSite=${sameSite.charAt(0).toUpperCase() + sameSite.slice(1)}`,
  ]
    .filter(Boolean)
    .join('; ')

  response.headers.append('Set-Cookie', cookieValue)
  return response
}

/**
 * Elimina una cookie de forma segura
 */
export function deleteSecureCookie(
  response: NextResponse,
  name: string,
  path: string = '/'
): NextResponse {
  const cookieValue = `${name}=; Path=${path}; Max-Age=0; HttpOnly; Secure; SameSite=Lax`
  response.headers.append('Set-Cookie', cookieValue)
  return response
}

/**
 * Opciones predeterminadas para cookies de sesión
 * Implementa timeout de 30 minutos de inactividad
 */
export const SESSION_COOKIE_OPTIONS: Partial<SecureCookieOptions> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 1800, // 30 minutos
  path: '/',
}

/**
 * Opciones para cookies de preferencias (menos sensibles)
 */
export const PREFERENCE_COOKIE_OPTIONS: Partial<SecureCookieOptions> = {
  httpOnly: false, // Las preferencias pueden leerse desde JS
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 31536000, // 1 año
  path: '/',
}
