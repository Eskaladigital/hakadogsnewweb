# Documentación de Seguridad - HakaDogs App

## Introducción

Este documento detalla las mejoras de seguridad implementadas en la aplicación HakaDogs en respuesta a la auditoría de seguridad web realizada. Todas las implementaciones siguen las mejores prácticas de OWASP y los estándares de la industria.

## Resumen de Mejoras Implementadas

### ✅ 1. Headers de Seguridad HTTP (COMPLETADO)

**Ubicación:** `next.config.js`

Se han configurado los siguientes headers de seguridad en todas las respuestas HTTP:

#### Content-Security-Policy (CSP)
Protege contra ataques XSS definiendo fuentes permitidas de contenido:
- `default-src 'self'`: Solo permite recursos del mismo origen por defecto
- `script-src`: Scripts permitidos (Google Analytics, TinyMCE)
- `img-src https:`: Permite imágenes de cualquier fuente HTTPS
- `object-src 'none'`: Bloquea plugins como Flash
- `upgrade-insecure-requests`: Fuerza actualización HTTP a HTTPS
- `block-all-mixed-content`: Previene contenido mixto HTTP/HTTPS

#### Strict-Transport-Security (HSTS)
```
max-age=63072000; includeSubDomains; preload
```
- Fuerza HTTPS durante 2 años
- Aplica a todos los subdominios
- Incluido en la lista de precarga HSTS de navegadores

#### X-Frame-Options
```
SAMEORIGIN
```
Previene clickjacking permitiendo solo iframes del mismo origen.

#### X-Content-Type-Options
```
nosniff
```
Previene MIME sniffing, forzando el Content-Type declarado.

#### Referrer-Policy
```
strict-origin-when-cross-origin
```
Controla la información del referer enviada a sitios externos.

#### Permissions-Policy
```
camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=()...
```
Deshabilita APIs del navegador no utilizadas, reduciendo superficie de ataque.

---

### ✅ 2. Gestión Segura de Cookies (COMPLETADO)

**Ubicación:** `lib/security/cookies.ts`

#### Flags Implementados

Todas las cookies sensibles incluyen:
- **HttpOnly**: Previene acceso vía JavaScript (protección XSS)
- **Secure**: Solo se envían por HTTPS
- **SameSite=Lax/Strict**: Protección contra CSRF

#### Tipos de Cookies

**Cookies de Sesión:**
```typescript
{
  httpOnly: true,
  secure: true (en producción),
  sameSite: 'lax',
  maxAge: 1800, // 30 minutos
}
```

**Cookies de Preferencias:**
```typescript
{
  httpOnly: false, // Pueden leerse desde JS
  secure: true (en producción),
  sameSite: 'lax',
  maxAge: 31536000, // 1 año
}
```

#### Uso

```typescript
import { setSecureCookie, SESSION_COOKIE_OPTIONS } from '@/lib/security'

// Establecer cookie de sesión
setSecureCookie(response, {
  name: 'session_id',
  value: sessionToken,
  ...SESSION_COOKIE_OPTIONS
})
```

---

### ✅ 3. Protección CSRF (COMPLETADO)

**Ubicación:** `lib/security/csrf.ts`

#### Implementación

Sistema de tokens CSRF únicos por sesión que previene ataques Cross-Site Request Forgery.

**Características:**
- Tokens aleatorios de 64 caracteres (hex)
- Validación en todas las peticiones POST/PUT/DELETE/PATCH
- Comparación resistente a timing attacks
- Token accesible desde cliente (cookie no HttpOnly)

#### Endpoint de API

**GET `/api/csrf`**
Devuelve el token CSRF actual o genera uno nuevo.

```typescript
const response = await fetch('/api/csrf')
const { token } = await response.json()
```

#### Uso en API Routes

```typescript
import { validateCSRFToken } from '@/lib/security/csrf'

export async function POST(request: Request) {
  // Validar CSRF
  const csrfValidation = await validateCSRFToken(request)
  if (!csrfValidation.valid) {
    return new Response(JSON.stringify({ error: 'CSRF validation failed' }), {
      status: 403
    })
  }
  
  // Procesar request...
}
```

#### Uso en Cliente

**Opción 1: Header HTTP**
```typescript
fetch('/api/endpoint', {
  method: 'POST',
  headers: {
    'x-csrf-token': csrfToken,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
```

**Opción 2: Body del request**
```typescript
fetch('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify({
    ...data,
    csrfToken
  })
})
```

---

### ✅ 4. Rate Limiting (COMPLETADO)

**Ubicación:** `lib/security/rate-limit.ts`

#### Presets Configurados

| Recurso | Intentos | Ventana | Bloqueo |
|---------|----------|---------|---------|
| Login | 5 | 15 min | 15 min |
| Registro | 3 | 1 hora | 1 hora |
| Reset Password | 3 | 1 hora | 1 hora |
| Contacto | 5 | 1 hora | 10 min |
| API General | 100 | 1 min | 1 min |

#### Implementación

Sistema de rate limiting basado en identificador (IP, email, userId) que previene:
- Ataques de fuerza bruta
- Credential stuffing
- Abuso de APIs
- Spam de formularios

#### Uso en API Routes

```typescript
import { applyRateLimit, RATE_LIMIT_PRESETS } from '@/lib/security/rate-limit'

export async function POST(request: Request) {
  // Aplicar rate limiting
  const rateLimit = applyRateLimit(request, RATE_LIMIT_PRESETS.LOGIN)
  
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ 
        error: 'Demasiados intentos',
        retryAfter: rateLimit.retryAfter 
      }),
      {
        status: 429,
        headers: {
          'Retry-After': rateLimit.retryAfter?.toString() || '60',
          'X-RateLimit-Remaining': '0'
        }
      }
    )
  }
  
  // Procesar request...
}
```

#### Personalización

```typescript
const customLimit = applyRateLimit(request, {
  maxAttempts: 10,
  windowSeconds: 300,
  blockDurationSeconds: 600,
  resource: 'custom-endpoint'
})
```

---

### ✅ 5. Validación y Sanitización (COMPLETADO)

**Ubicación:** `lib/security/validation.ts`

#### Funciones de Validación

##### Email
```typescript
const result = validateEmail(email)
// { valid: boolean, sanitized: string, error?: string }
```

##### Teléfono
```typescript
const result = validatePhone(phone)
// Acepta formatos internacionales, sanitiza caracteres no numéricos
```

##### Contraseña
```typescript
const result = validatePassword(password)
// {
//   valid: boolean,
//   strength: 'weak' | 'medium' | 'strong',
//   errors: string[]
// }
```

**Requisitos de contraseña:**
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Al menos un carácter especial

##### Detección de Contraseñas Comunes
```typescript
if (isCommonPassword(password)) {
  // Rechazar contraseña
}
```

#### Sanitización XSS

```typescript
import { sanitizeHTML } from '@/lib/security'

// Convierte caracteres especiales a entidades HTML
const safe = sanitizeHTML(userInput)
// <script> → &lt;script&gt;
```

#### Schemas Zod Predefinidos

```typescript
import { ValidationSchemas } from '@/lib/security'

const loginSchema = z.object({
  email: ValidationSchemas.email,
  password: ValidationSchemas.password
})

const result = validateForm(data, loginSchema)
```

---

### ✅ 6. Hooks de React para Seguridad (COMPLETADO)

**Ubicación:** `lib/security/hooks.ts`

#### useSecureForm

Hook para formularios con validación y CSRF automático:

```typescript
'use client'

import { useSecureForm } from '@/lib/security'

export default function ContactForm() {
  const { errors, isSubmitting, handleSubmit, handleChange, fetchCSRFToken } = useSecureForm({
    onSubmit: async (data) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    }
  })

  useEffect(() => {
    fetchCSRFToken()
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        onChange={(e) => handleChange('email', e.target.value, 'email')}
      />
      {errors.email && <span>{errors.email}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        Enviar
      </button>
    </form>
  )
}
```

#### useSecureFetch

Hook para peticiones con CSRF automático:

```typescript
const { secureFetch, fetchCSRFToken } = useSecureFetch()

useEffect(() => {
  fetchCSRFToken()
}, [])

const handleClick = async () => {
  const response = await secureFetch('/api/action', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
```

#### usePasswordStrength

Indicador visual de fortaleza de contraseña:

```typescript
const { strength, valid, errors, color, label, isCommon } = usePasswordStrength(password)

return (
  <div>
    <input type="password" value={password} onChange={...} />
    <div style={{ color }}>
      Fortaleza: {label}
    </div>
    {errors.map(error => <div key={error}>{error}</div>)}
    {isCommon && <div>Esta contraseña es muy común</div>}
  </div>
)
```

---

## Guía de Implementación por Área

### 🔐 Autenticación (Login/Registro)

#### Checklist de Seguridad

**En el componente de login:**
```typescript
'use client'

import { useSecureForm, useSecureFetch } from '@/lib/security'
import { useEffect } from 'react'

export default function LoginForm() {
  const { secureFetch, fetchCSRFToken } = useSecureFetch()
  const { errors, isSubmitting, handleSubmit, handleChange } = useSecureForm({
    onSubmit: async (data) => {
      const response = await secureFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message)
      }
    }
  })

  useEffect(() => {
    fetchCSRFToken()
  }, [fetchCSRFToken])

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulario */}
    </form>
  )
}
```

**En la API route (`/api/auth/login/route.ts`):**
```typescript
import { 
  validateCSRFToken,
  applyRateLimit,
  RATE_LIMIT_PRESETS,
  validateEmail,
  resetRateLimit
} from '@/lib/security'

export async function POST(request: Request) {
  // 1. Validar CSRF
  const csrfValidation = await validateCSRFToken(request)
  if (!csrfValidation.valid) {
    return new Response(JSON.stringify({ error: 'CSRF validation failed' }), {
      status: 403
    })
  }

  // 2. Aplicar rate limiting
  const body = await request.json()
  const emailValidation = validateEmail(body.email)
  const rateLimit = applyRateLimit(
    request, 
    RATE_LIMIT_PRESETS.LOGIN,
    emailValidation.sanitized // Rate limit por email
  )
  
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ 
      error: 'Demasiados intentos. Intente más tarde.',
      retryAfter: rateLimit.retryAfter 
    }), {
      status: 429,
      headers: { 'Retry-After': rateLimit.retryAfter?.toString() || '900' }
    })
  }

  // 3. Validar credenciales
  const user = await validateCredentials(emailValidation.sanitized, body.password)
  
  if (!user) {
    // Mensaje genérico para prevenir enumeración de usuarios
    return new Response(JSON.stringify({ 
      error: 'Credenciales inválidas' 
    }), { status: 401 })
  }

  // 4. Login exitoso - resetear rate limit
  resetRateLimit(emailValidation.sanitized, 'login')

  // 5. Crear sesión con cookies seguras
  const sessionToken = await createSession(user.id)
  const response = new Response(JSON.stringify({ success: true }))
  
  setSecureCookie(response, {
    name: 'session_token',
    value: sessionToken,
    ...SESSION_COOKIE_OPTIONS
  })

  return response
}
```

---

### 📝 Formularios de Contacto

**Componente:**
```typescript
'use client'

import { useSecureForm } from '@/lib/security'
import { useEffect } from 'react'

export default function ContactForm() {
  const { 
    errors, 
    isSubmitting, 
    handleSubmit, 
    handleChange,
    fetchCSRFToken,
    validateField
  } = useSecureForm({
    onSubmit: async (data) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        alert('Mensaje enviado correctamente')
      }
    },
    validateOnChange: true
  })

  useEffect(() => {
    fetchCSRFToken()
  }, [fetchCSRFToken])

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Nombre"
        onChange={(e) => handleChange('name', e.target.value, 'text')}
      />
      {errors.name && <span className="error">{errors.name}</span>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={(e) => handleChange('email', e.target.value, 'email')}
      />
      {errors.email && <span className="error">{errors.email}</span>}

      <input
        type="tel"
        name="phone"
        placeholder="Teléfono"
        onChange={(e) => handleChange('phone', e.target.value, 'phone')}
      />
      {errors.phone && <span className="error">{errors.phone}</span>}

      <textarea
        name="message"
        placeholder="Mensaje"
        onChange={(e) => handleChange('message', e.target.value, 'text')}
      />
      {errors.message && <span className="error">{errors.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}
```

**API Route:**
```typescript
import { 
  validateCSRFToken,
  applyRateLimit,
  RATE_LIMIT_PRESETS,
  validateEmail,
  validatePhone,
  validateTextInput,
  getClientIdentifier
} from '@/lib/security'

export async function POST(request: Request) {
  // 1. CSRF
  const csrfValidation = await validateCSRFToken(request)
  if (!csrfValidation.valid) {
    return new Response(JSON.stringify({ error: 'Validación CSRF fallida' }), {
      status: 403
    })
  }

  // 2. Rate limiting por IP
  const rateLimit = applyRateLimit(request, RATE_LIMIT_PRESETS.CONTACT_FORM)
  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ 
      error: 'Demasiados envíos. Por favor espere.' 
    }), { status: 429 })
  }

  // 3. Validar y sanitizar datos
  const body = await request.json()
  
  const emailValidation = validateEmail(body.email)
  if (!emailValidation.valid) {
    return new Response(JSON.stringify({ error: emailValidation.error }), {
      status: 400
    })
  }

  const phoneValidation = validatePhone(body.phone)
  if (!phoneValidation.valid) {
    return new Response(JSON.stringify({ error: phoneValidation.error }), {
      status: 400
    })
  }

  const nameValidation = validateTextInput(body.name, {
    minLength: 2,
    maxLength: 100
  })
  if (!nameValidation.valid) {
    return new Response(JSON.stringify({ error: nameValidation.error }), {
      status: 400
    })
  }

  const messageValidation = validateTextInput(body.message, {
    minLength: 10,
    maxLength: 5000
  })
  if (!messageValidation.valid) {
    return new Response(JSON.stringify({ error: messageValidation.error }), {
      status: 400
    })
  }

  // 4. Procesar mensaje (guardar en BD, enviar email, etc.)
  await saveContactMessage({
    name: nameValidation.sanitized,
    email: emailValidation.sanitized,
    phone: phoneValidation.sanitized,
    message: messageValidation.sanitized
  })

  return new Response(JSON.stringify({ success: true }))
}
```

---

## Mejoras Adicionales Recomendadas

### 🔄 Próximos Pasos

#### 1. Autenticación Multifactor (2FA)
- [ ] Implementar TOTP (Google Authenticator)
- [ ] Códigos de backup
- [ ] Opción de 2FA por email

#### 2. Monitoreo y Logging
- [ ] Implementar sistema de logs de seguridad
- [ ] Alertas de intentos de ataque
- [ ] Dashboard de métricas de seguridad

#### 3. Escaneo de Vulnerabilidades
- [ ] Integrar escaneo automático (Snyk, Dependabot)
- [ ] Auditorías periódicas de seguridad
- [ ] Pruebas de penetración

#### 4. Mejoras de Rate Limiting
- [ ] Migrar a Redis para escalabilidad
- [ ] Rate limiting distribuido
- [ ] Configuración dinámica de límites

#### 5. Protección de Datos
- [ ] Cifrado de datos sensibles en BD
- [ ] Política de retención de datos
- [ ] Anonimización de logs

---

## Referencias y Recursos

### OWASP
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/)
- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

### MDN Web Docs
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

### CWE (Common Weakness Enumeration)
- [CWE-79: XSS](https://cwe.mitre.org/data/definitions/79.html)
- [CWE-89: SQL Injection](https://cwe.mitre.org/data/definitions/89.html)
- [CWE-352: CSRF](https://cwe.mitre.org/data/definitions/352.html)
- [CWE-1004: Sensitive Cookie Without HttpOnly](https://cwe.mitre.org/data/definitions/1004.html)

---

## Contacto y Soporte

Para reportar vulnerabilidades de seguridad o hacer consultas sobre la implementación:

**Email de Seguridad:** security@hakadogs.com  
**Política de Divulgación Responsable:** Ver `SECURITY.md`

---

## Changelog de Seguridad

### Versión 1.0.0 (Enero 2026)

#### Implementado
- ✅ Headers de seguridad HTTP completos
- ✅ Gestión segura de cookies con flags apropiados
- ✅ Protección CSRF con tokens únicos
- ✅ Rate limiting para prevenir fuerza bruta
- ✅ Validación y sanitización robusta de inputs
- ✅ Hooks de React para uso seguro en componentes
- ✅ API endpoint para tokens CSRF
- ✅ Módulo de seguridad centralizado

#### Protecciones Contra
- ✅ XSS (Cross-Site Scripting)
- ✅ CSRF (Cross-Site Request Forgery)
- ✅ SQL Injection
- ✅ Clickjacking
- ✅ MIME Sniffing
- ✅ Man-in-the-Middle (MITM)
- ✅ Ataques de fuerza bruta
- ✅ Credential stuffing
- ✅ Enumeración de usuarios
- ✅ Session hijacking

---

**Última actualización:** Enero 2026  
**Versión del documento:** 1.0.0
