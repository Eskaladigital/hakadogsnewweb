/**
 * Utilidades de validación y sanitización para prevenir XSS y otras inyecciones
 * Implementa validaciones robustas según OWASP
 */

import { z } from 'zod'

/**
 * Sanitiza una cadena HTML eliminando scripts y tags peligrosos
 * Prevención de XSS - convierte caracteres especiales a entidades HTML
 */
export function sanitizeHTML(input: string): string {
  if (!input) return ''
  
  // Escapar caracteres especiales HTML
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitiza input para prevenir inyecciones SQL (complemento a queries parametrizadas)
 */
export function sanitizeSQL(input: string): string {
  if (!input) return ''
  
  // Eliminar caracteres peligrosos para SQL
  return input
    .replace(/['";\\]/g, '') // Comillas y backslashes
    .replace(/--/g, '') // Comentarios SQL
    .replace(/\/\*/g, '') // Comentarios multilínea
    .replace(/\*\//g, '')
    .trim()
}

/**
 * Valida y sanitiza un email
 */
export function validateEmail(email: string): { valid: boolean; sanitized: string; error?: string } {
  const emailSchema = z.string().email().max(255)
  
  const sanitized = email.trim().toLowerCase()
  const result = emailSchema.safeParse(sanitized)
  
  if (!result.success) {
    return {
      valid: false,
      sanitized,
      error: 'Formato de email inválido'
    }
  }
  
  return { valid: true, sanitized }
}

/**
 * Valida un número de teléfono (formato flexible para España y otros países)
 */
export function validatePhone(phone: string): { valid: boolean; sanitized: string; error?: string } {
  // Eliminar todo excepto números y el símbolo +
  const sanitized = phone.replace(/[^\d+]/g, '')
  
  // Validar longitud (entre 9 y 15 dígitos es razonable para la mayoría de países)
  if (sanitized.length < 9 || sanitized.length > 15) {
    return {
      valid: false,
      sanitized,
      error: 'Número de teléfono inválido'
    }
  }
  
  return { valid: true, sanitized }
}

/**
 * Valida una contraseña según políticas de seguridad OWASP
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 */
export function validatePassword(password: string): { 
  valid: boolean
  strength: 'weak' | 'medium' | 'strong'
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Debe incluir al menos una letra mayúscula')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Debe incluir al menos una letra minúscula')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Debe incluir al menos un número')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Debe incluir al menos un carácter especial')
  }
  
  // Calcular fortaleza
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (errors.length === 0) {
    if (password.length >= 12) {
      strength = 'strong'
    } else {
      strength = 'medium'
    }
  }
  
  return {
    valid: errors.length === 0,
    strength,
    errors
  }
}

/**
 * Lista de contraseñas comunes que no deben permitirse
 * En producción, usar una lista más completa o API como HaveIBeenPwned
 */
const COMMON_PASSWORDS = [
  'password', '123456', '12345678', 'qwerty', 'abc123',
  'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
  'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
  'bailey', 'shadow', '123123', '654321', 'superman',
  'password1', 'password123', 'admin', 'root'
]

/**
 * Verifica si una contraseña está en la lista de contraseñas comunes
 */
export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.includes(password.toLowerCase())
}

/**
 * Valida un nombre de usuario
 * Solo permite alfanuméricos, guiones y guiones bajos
 */
export function validateUsername(username: string): { 
  valid: boolean
  sanitized: string
  error?: string 
} {
  const usernameSchema = z
    .string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(30, 'El nombre de usuario no puede exceder 30 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Solo se permiten letras, números, guiones y guiones bajos')
  
  const sanitized = username.trim()
  const result = usernameSchema.safeParse(sanitized)
  
  if (!result.success) {
    return {
      valid: false,
      sanitized,
      error: result.error.errors[0].message
    }
  }
  
  return { valid: true, sanitized }
}

/**
 * Valida input genérico de texto
 * Previene inyecciones pero mantiene caracteres especiales seguros
 */
export function validateTextInput(
  input: string,
  options: {
    minLength?: number
    maxLength?: number
    allowHTML?: boolean
  } = {}
): { valid: boolean; sanitized: string; error?: string } {
  const {
    minLength = 0,
    maxLength = 10000,
    allowHTML = false
  } = options
  
  if (!input) {
    return {
      valid: minLength === 0,
      sanitized: '',
      error: minLength > 0 ? 'Este campo es requerido' : undefined
    }
  }
  
  const trimmed = input.trim()
  
  if (trimmed.length < minLength) {
    return {
      valid: false,
      sanitized: trimmed,
      error: `Debe tener al menos ${minLength} caracteres`
    }
  }
  
  if (trimmed.length > maxLength) {
    return {
      valid: false,
      sanitized: trimmed,
      error: `No puede exceder ${maxLength} caracteres`
    }
  }
  
  const sanitized = allowHTML ? trimmed : sanitizeHTML(trimmed)
  
  return { valid: true, sanitized }
}

/**
 * Valida una URL
 */
export function validateURL(url: string): { valid: boolean; sanitized: string; error?: string } {
  const urlSchema = z.string().url()
  
  const sanitized = url.trim()
  const result = urlSchema.safeParse(sanitized)
  
  if (!result.success) {
    return {
      valid: false,
      sanitized,
      error: 'URL inválida'
    }
  }
  
  // Validar que sea HTTP o HTTPS (no javascript:, data:, etc.)
  if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
    return {
      valid: false,
      sanitized,
      error: 'Solo se permiten URLs HTTP o HTTPS'
    }
  }
  
  return { valid: true, sanitized }
}

/**
 * Esquemas Zod reutilizables para validación de formularios
 */
export const ValidationSchemas = {
  email: z.string().email('Email inválido').max(255),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe incluir al menos una mayúscula')
    .regex(/[a-z]/, 'Debe incluir al menos una minúscula')
    .regex(/\d/, 'Debe incluir al menos un número')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Debe incluir al menos un carácter especial'),
  
  username: z.string()
    .min(3, 'Mínimo 3 caracteres')
    .max(30, 'Máximo 30 caracteres')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Solo letras, números, guiones y guiones bajos'),
  
  phone: z.string()
    .regex(/^[+]?[\d\s\-()]+$/, 'Formato de teléfono inválido')
    .min(9, 'Número demasiado corto')
    .max(15, 'Número demasiado largo'),
  
  name: z.string()
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/, 'Solo se permiten letras, espacios y guiones'),
  
  message: z.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(5000, 'El mensaje no puede exceder 5000 caracteres'),
}

/**
 * Función helper para validar múltiples campos a la vez
 */
export function validateForm<T extends Record<string, any>>(
  data: T,
  schema: z.ZodSchema<T>
): { valid: boolean; errors?: Record<string, string>; data?: T } {
  const result = schema.safeParse(data)
  
  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.errors.forEach((err) => {
      if (err.path.length > 0) {
        errors[err.path[0].toString()] = err.message
      }
    })
    
    return { valid: false, errors }
  }
  
  return { valid: true, data: result.data }
}
