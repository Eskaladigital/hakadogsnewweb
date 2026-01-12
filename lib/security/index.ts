/**
 * Módulo de seguridad centralizado
 * Exporta todas las utilidades de seguridad para uso en la aplicación
 */

// Protección CSRF
export {
  getCSRFToken,
  validateCSRFToken,
  withCSRFProtection,
  CSRF_HEADER,
  generateCSRFToken
} from './csrf'

// Gestión de cookies seguras
export {
  setSecureCookie,
  deleteSecureCookie,
  SESSION_COOKIE_OPTIONS,
  PREFERENCE_COOKIE_OPTIONS,
  type SecureCookieOptions
} from './cookies'

// Rate limiting
export {
  checkRateLimit,
  applyRateLimit,
  resetRateLimit,
  cleanupRateLimitStore,
  getClientIdentifier,
  RATE_LIMIT_PRESETS,
  type RateLimitConfig,
  type RateLimitResult
} from './rate-limit'

// Validación y sanitización
export {
  sanitizeHTML,
  sanitizeSQL,
  validateEmail,
  validatePhone,
  validatePassword,
  validateUsername,
  validateTextInput,
  validateURL,
  validateForm,
  isCommonPassword,
  ValidationSchemas
} from './validation'

// Hooks para componentes cliente
export {
  useSecureForm,
  useSecureFetch,
  usePasswordStrength
} from './hooks'
