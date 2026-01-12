# 🔐 Módulo de Seguridad HakaDogs

Conjunto completo de utilidades de seguridad implementadas según las mejores prácticas de OWASP para proteger la aplicación HakaDogs.

## 📦 Estructura

```
lib/security/
├── index.ts           # Exportaciones centralizadas
├── cookies.ts         # Gestión segura de cookies
├── csrf.ts            # Protección CSRF
├── rate-limit.ts      # Rate limiting
├── validation.ts      # Validación y sanitización
└── hooks.ts           # Hooks de React para componentes cliente
```

## 🚀 Inicio Rápido

### Importación

```typescript
// Importar todo
import * as Security from '@/lib/security'

// O importar específico
import { 
  validateCSRFToken,
  applyRateLimit,
  validateEmail,
  useSecureForm
} from '@/lib/security'
```

### Ejemplo: API Route Protegida

```typescript
import { validateCSRFToken, applyRateLimit, RATE_LIMIT_PRESETS } from '@/lib/security'

export async function POST(request: Request) {
  // Validar CSRF
  const csrf = await validateCSRFToken(request)
  if (!csrf.valid) return new Response('Forbidden', { status: 403 })

  // Rate limiting
  const rate = applyRateLimit(request, RATE_LIMIT_PRESETS.API_GENERAL)
  if (!rate.allowed) return new Response('Too Many Requests', { status: 429 })

  // Tu lógica aquí...
}
```

### Ejemplo: Formulario Seguro

```typescript
'use client'
import { useSecureForm } from '@/lib/security'
import { useEffect } from 'react'

export default function MyForm() {
  const { handleSubmit, handleChange, errors, fetchCSRFToken } = useSecureForm({
    onSubmit: async (data) => {
      await fetch('/api/endpoint', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
  })

  useEffect(() => { fetchCSRFToken() }, [])

  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

## 📚 Módulos

### 🍪 Cookies (`cookies.ts`)

Gestión de cookies con flags de seguridad.

**Funciones:**
- `setSecureCookie(response, options)` - Establecer cookie segura
- `deleteSecureCookie(response, name)` - Eliminar cookie
- `SESSION_COOKIE_OPTIONS` - Preset para cookies de sesión
- `PREFERENCE_COOKIE_OPTIONS` - Preset para preferencias

**Ejemplo:**
```typescript
import { setSecureCookie, SESSION_COOKIE_OPTIONS } from '@/lib/security'

setSecureCookie(response, {
  name: 'session',
  value: token,
  ...SESSION_COOKIE_OPTIONS
})
```

### 🛡️ CSRF (`csrf.ts`)

Protección contra Cross-Site Request Forgery.

**Funciones:**
- `getCSRFToken()` - Obtener/generar token CSRF
- `validateCSRFToken(request)` - Validar token en request
- `withCSRFProtection(handler, request)` - Wrapper para handlers
- `generateCSRFToken()` - Generar token manualmente

**Endpoint API:**
- `GET /api/csrf` - Obtener token para el cliente

**Ejemplo:**
```typescript
// En API route
const validation = await validateCSRFToken(request)
if (!validation.valid) {
  return new Response('CSRF validation failed', { status: 403 })
}

// En cliente
const { token } = await fetch('/api/csrf').then(r => r.json())
fetch('/api/action', {
  headers: { 'x-csrf-token': token }
})
```

### ⏱️ Rate Limiting (`rate-limit.ts`)

Limita frecuencia de requests para prevenir abuso.

**Funciones:**
- `checkRateLimit(config)` - Verificar límite
- `applyRateLimit(request, preset, customId?)` - Aplicar en API route
- `resetRateLimit(identifier, resource)` - Resetear contador
- `RATE_LIMIT_PRESETS` - Presets configurados

**Presets disponibles:**
- `LOGIN` - 5 intentos / 15 min
- `SIGNUP` - 3 intentos / 1 hora
- `PASSWORD_RESET` - 3 intentos / 1 hora
- `CONTACT_FORM` - 5 intentos / 1 hora
- `API_GENERAL` - 100 intentos / 1 min

**Ejemplo:**
```typescript
const rateLimit = applyRateLimit(request, RATE_LIMIT_PRESETS.LOGIN, userEmail)

if (!rateLimit.allowed) {
  return new Response('Too many attempts', {
    status: 429,
    headers: { 'Retry-After': rateLimit.retryAfter.toString() }
  })
}
```

### ✅ Validación (`validation.ts`)

Validación y sanitización de inputs.

**Funciones:**
- `validateEmail(email)` - Validar y sanitizar email
- `validatePhone(phone)` - Validar teléfono
- `validatePassword(password)` - Validar contraseña + fortaleza
- `validateUsername(username)` - Validar nombre de usuario
- `validateTextInput(text, options)` - Validar texto general
- `validateURL(url)` - Validar URL
- `sanitizeHTML(html)` - Escapar HTML (prevención XSS)
- `sanitizeSQL(input)` - Sanitizar para SQL
- `isCommonPassword(password)` - Verificar contraseñas comunes
- `ValidationSchemas` - Schemas Zod predefinidos
- `validateForm(data, schema)` - Validar formulario completo

**Ejemplo:**
```typescript
// Validación individual
const email = validateEmail(userInput.email)
if (!email.valid) {
  return { error: email.error }
}

// Con Zod schema
import { ValidationSchemas } from '@/lib/security'

const schema = z.object({
  email: ValidationSchemas.email,
  password: ValidationSchemas.password,
  phone: ValidationSchemas.phone
})

const result = validateForm(formData, schema)
if (!result.valid) {
  console.log(result.errors) // { email: '...', password: '...' }
}
```

### ⚛️ Hooks (`hooks.ts`)

Hooks de React para componentes cliente.

**Hooks disponibles:**
- `useSecureForm(options)` - Formulario con validación y CSRF
- `useSecureFetch()` - Fetch con CSRF automático
- `usePasswordStrength(password)` - Indicador de fortaleza

**useSecureForm:**
```typescript
const {
  errors,              // Errores de validación
  isSubmitting,        // Estado de envío
  handleSubmit,        // Handler para <form>
  handleChange,        // Handler para inputs
  validateField,       // Validar campo individual
  fetchCSRFToken,      // Obtener token CSRF
  csrfToken           // Token actual
} = useSecureForm({
  onSubmit: async (data) => { /* ... */ },
  validateOnChange: true  // Validar en tiempo real
})
```

**useSecureFetch:**
```typescript
const {
  secureFetch,      // Fetch con CSRF incluido
  fetchCSRFToken,   // Obtener token manualmente
  csrfToken        // Token actual
} = useSecureFetch()

// Uso
await secureFetch('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify(data)
})
```

**usePasswordStrength:**
```typescript
const {
  strength,    // 'weak' | 'medium' | 'strong'
  valid,       // boolean
  errors,      // string[] de requisitos no cumplidos
  color,       // 'red' | 'orange' | 'green'
  label,       // 'Débil' | 'Media' | 'Fuerte'
  isCommon    // boolean - contraseña común
} = usePasswordStrength(password)
```

## 🎯 Casos de Uso

### 1. Proteger Login

```typescript
// app/api/auth/login/route.ts
import { 
  validateCSRFToken, 
  applyRateLimit, 
  RATE_LIMIT_PRESETS,
  validateEmail 
} from '@/lib/security'

export async function POST(request: Request) {
  // CSRF
  const csrf = await validateCSRFToken(request)
  if (!csrf.valid) return Response.json({ error: 'CSRF' }, { status: 403 })

  // Rate limiting por email
  const body = await request.json()
  const email = validateEmail(body.email)
  const rate = applyRateLimit(request, RATE_LIMIT_PRESETS.LOGIN, email.sanitized)
  
  if (!rate.allowed) {
    return Response.json(
      { error: 'Too many attempts', retryAfter: rate.retryAfter },
      { status: 429 }
    )
  }

  // Verificar credenciales...
}
```

### 2. Formulario de Contacto

```typescript
// components/ContactForm.tsx
'use client'
import { useSecureForm } from '@/lib/security'
import { useEffect } from 'react'

export default function ContactForm() {
  const { handleSubmit, handleChange, errors, isSubmitting, fetchCSRFToken } = 
    useSecureForm({
      onSubmit: async (data) => {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
      }
    })

  useEffect(() => { fetchCSRFToken() }, [])

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

### 3. API con Validación Completa

```typescript
// app/api/example/route.ts
import { 
  validateCSRFToken,
  applyRateLimit,
  RATE_LIMIT_PRESETS,
  ValidationSchemas,
  validateForm
} from '@/lib/security'
import { z } from 'zod'

export async function POST(request: Request) {
  // 1. CSRF
  const csrf = await validateCSRFToken(request)
  if (!csrf.valid) return Response.json({ error: 'CSRF' }, { status: 403 })

  // 2. Rate limit
  const rate = applyRateLimit(request, RATE_LIMIT_PRESETS.API_GENERAL)
  if (!rate.allowed) return Response.json({ error: 'Rate limit' }, { status: 429 })

  // 3. Validar datos
  const body = await request.json()
  const schema = z.object({
    email: ValidationSchemas.email,
    message: ValidationSchemas.message
  })

  const validation = validateForm(body, schema)
  if (!validation.valid) {
    return Response.json({ errors: validation.errors }, { status: 400 })
  }

  // 4. Procesar con datos sanitizados
  await processData(validation.data)

  return Response.json({ success: true })
}
```

## 🔧 Configuración

### Variables de Entorno

```env
NODE_ENV=production  # Habilita flags Secure en cookies
```

### Next.js Config

Los headers de seguridad ya están configurados en `next.config.js`:
- Content-Security-Policy
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## 📋 Checklist de Implementación

- [ ] Headers de seguridad configurados
- [ ] CSRF implementado en formularios
- [ ] Rate limiting en endpoints sensibles
- [ ] Validación en todos los inputs
- [ ] Cookies con flags seguros
- [ ] Mensajes de error genéricos
- [ ] Logging de eventos de seguridad
- [ ] Tests de seguridad

## 🛠️ Testing

### Test Manual de CSRF

```bash
# 1. Obtener token
curl http://localhost:3000/api/csrf

# 2. Hacer request sin token (debe fallar)
curl -X POST http://localhost:3000/api/endpoint

# 3. Hacer request con token (debe funcionar)
curl -X POST http://localhost:3000/api/endpoint \
  -H "x-csrf-token: TOKEN_AQUI"
```

### Test de Rate Limiting

```bash
# Hacer múltiples requests rápidos
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
done
# Después de 5 intentos, debería devolver 429
```

## 📚 Documentación Adicional

- [Documentación Completa](../../docs/SEGURIDAD.md) - Guía detallada
- [Guía Rápida](../../docs/SEGURIDAD_GUIA_RAPIDA.md) - Ejemplos prácticos
- [Política de Seguridad](../../SECURITY.md) - Divulgación responsable

## 🔗 Referencias

- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2026
