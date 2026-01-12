# Guía Rápida de Implementación de Seguridad

## 🚀 Inicio Rápido

Esta guía muestra cómo implementar las medidas de seguridad en los casos más comunes.

## 📋 Tabla de Contenidos

1. [Proteger un API Route](#proteger-un-api-route)
2. [Crear un Formulario Seguro](#crear-un-formulario-seguro)
3. [Implementar Login Seguro](#implementar-login-seguro)
4. [Validar Inputs de Usuario](#validar-inputs-de-usuario)
5. [Configurar Cookies de Sesión](#configurar-cookies-de-sesión)

---

## 1. Proteger un API Route

### ✅ Template Básico

```typescript
// app/api/ejemplo/route.ts
import { 
  validateCSRFToken,
  applyRateLimit,
  RATE_LIMIT_PRESETS,
  validateTextInput
} from '@/lib/security'

export async function POST(request: Request) {
  // Paso 1: Validar CSRF
  const csrfValidation = await validateCSRFToken(request)
  if (!csrfValidation.valid) {
    return new Response(
      JSON.stringify({ error: 'CSRF validation failed' }), 
      { status: 403 }
    )
  }

  // Paso 2: Rate limiting
  const rateLimit = applyRateLimit(request, RATE_LIMIT_PRESETS.API_GENERAL)
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: 'Too many requests' }), 
      { 
        status: 429,
        headers: { 'Retry-After': rateLimit.retryAfter?.toString() || '60' }
      }
    )
  }

  // Paso 3: Validar y sanitizar input
  const body = await request.json()
  const validation = validateTextInput(body.message, {
    minLength: 1,
    maxLength: 1000
  })

  if (!validation.valid) {
    return new Response(
      JSON.stringify({ error: validation.error }), 
      { status: 400 }
    )
  }

  // Paso 4: Procesar request con datos sanitizados
  const result = await processData(validation.sanitized)

  return new Response(JSON.stringify({ success: true, data: result }))
}
```

### 🔐 Con Rate Limit Personalizado

```typescript
// Rate limit específico para este endpoint
const rateLimit = applyRateLimit(request, {
  maxAttempts: 20,
  windowSeconds: 60,
  blockDurationSeconds: 120,
  resource: 'my-endpoint'
})
```

---

## 2. Crear un Formulario Seguro

### ✅ Componente Cliente

```typescript
// components/MiFormulario.tsx
'use client'

import { useSecureForm } from '@/lib/security'
import { useEffect } from 'react'

export default function MiFormulario() {
  const { 
    errors, 
    isSubmitting, 
    handleSubmit, 
    handleChange,
    fetchCSRFToken 
  } = useSecureForm({
    onSubmit: async (data) => {
      // El hook ya incluye el token CSRF automáticamente
      const response = await fetch('/api/mi-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Error al enviar')
      }

      alert('¡Enviado correctamente!')
    },
    validateOnChange: true // Validación en tiempo real
  })

  // Obtener token CSRF al montar
  useEffect(() => {
    fetchCSRFToken()
  }, [fetchCSRFToken])

  return (
    <form onSubmit={handleSubmit}>
      {/* Campo de email */}
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={(e) => handleChange('email', e.target.value, 'email')}
          required
        />
        {errors.email && (
          <span className="text-red-500">{errors.email}</span>
        )}
      </div>

      {/* Campo de teléfono */}
      <div>
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono"
          onChange={(e) => handleChange('phone', e.target.value, 'phone')}
        />
        {errors.phone && (
          <span className="text-red-500">{errors.phone}</span>
        )}
      </div>

      {/* Mensaje */}
      <div>
        <textarea
          name="message"
          placeholder="Mensaje"
          onChange={(e) => handleChange('message', e.target.value, 'text')}
          required
        />
        {errors.message && (
          <span className="text-red-500">{errors.message}</span>
        )}
      </div>

      {/* Botón de envío */}
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="btn-primary"
      >
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>

      {/* Error general */}
      {errors.submit && (
        <div className="text-red-500 mt-2">{errors.submit}</div>
      )}
    </form>
  )
}
```

---

## 3. Implementar Login Seguro

### ✅ Componente de Login

```typescript
// app/login/page.tsx
'use client'

import { useSecureForm, usePasswordStrength } from '@/lib/security'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  
  const { 
    errors, 
    isSubmitting, 
    handleSubmit, 
    handleChange,
    fetchCSRFToken 
  } = useSecureForm({
    onSubmit: async (data) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al iniciar sesión')
      }

      router.push('/dashboard')
    }
  })

  useEffect(() => {
    fetchCSRFToken()
  }, [fetchCSRFToken])

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            onChange={(e) => handleChange('email', e.target.value, 'email')}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block mb-2">Contraseña</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              handleChange('password', e.target.value, 'password')
            }}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        {errors.submit && (
          <p className="text-red-500 text-sm">{errors.submit}</p>
        )}
      </form>
    </div>
  )
}
```

### ✅ API Route de Login

```typescript
// app/api/auth/login/route.ts
import { 
  validateCSRFToken,
  applyRateLimit,
  RATE_LIMIT_PRESETS,
  validateEmail,
  resetRateLimit,
  setSecureCookie,
  SESSION_COOKIE_OPTIONS
} from '@/lib/security'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // 1. CSRF
    const csrfValidation = await validateCSRFToken(request)
    if (!csrfValidation.valid) {
      return NextResponse.json(
        { error: 'Validación CSRF fallida' },
        { status: 403 }
      )
    }

    // 2. Parsear body
    const body = await request.json()
    const { email, password } = body

    // 3. Validar email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // 4. Rate limiting por email
    const rateLimit = applyRateLimit(
      request, 
      RATE_LIMIT_PRESETS.LOGIN,
      emailValidation.sanitized
    )
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Demasiados intentos. Intente más tarde.',
          retryAfter: rateLimit.retryAfter 
        },
        { 
          status: 429,
          headers: { 'Retry-After': rateLimit.retryAfter?.toString() || '900' }
        }
      )
    }

    // 5. Verificar credenciales con Supabase
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailValidation.sanitized,
      password
    })

    if (error || !data.session) {
      // Mensaje genérico para prevenir enumeración
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // 6. Login exitoso - resetear rate limit
    resetRateLimit(emailValidation.sanitized, 'login')

    // 7. Configurar cookie de sesión segura
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    })

    // Supabase ya maneja sus propias cookies, pero podemos añadir las nuestras
    setSecureCookie(response, {
      name: 'authenticated',
      value: 'true',
      ...SESSION_COOKIE_OPTIONS
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
```

---

## 4. Validar Inputs de Usuario

### ✅ Validación Manual

```typescript
import { 
  validateEmail, 
  validatePhone, 
  validatePassword,
  validateTextInput 
} from '@/lib/security'

// Email
const emailResult = validateEmail(userEmail)
if (!emailResult.valid) {
  console.error(emailResult.error)
  return
}
const safeEmail = emailResult.sanitized

// Teléfono
const phoneResult = validatePhone(userPhone)
if (!phoneResult.valid) {
  console.error(phoneResult.error)
  return
}
const safePhone = phoneResult.sanitized

// Contraseña
const passwordResult = validatePassword(userPassword)
if (!passwordResult.valid) {
  console.error('Errores:', passwordResult.errors)
  console.log('Fortaleza:', passwordResult.strength)
  return
}

// Texto general
const textResult = validateTextInput(userInput, {
  minLength: 10,
  maxLength: 500,
  allowHTML: false // Sanitizar HTML
})
if (!textResult.valid) {
  console.error(textResult.error)
  return
}
const safeText = textResult.sanitized
```

### ✅ Validación con Zod Schemas

```typescript
import { ValidationSchemas, validateForm } from '@/lib/security'
import { z } from 'zod'

// Definir schema del formulario
const contactSchema = z.object({
  name: ValidationSchemas.name,
  email: ValidationSchemas.email,
  phone: ValidationSchemas.phone,
  message: ValidationSchemas.message
})

// Validar datos
const result = validateForm(formData, contactSchema)

if (!result.valid) {
  console.error('Errores de validación:', result.errors)
  // result.errors = { email: 'Email inválido', phone: '...' }
  return
}

// Usar datos validados
const safeData = result.data
```

---

## 5. Configurar Cookies de Sesión

### ✅ Establecer Cookie Segura

```typescript
import { setSecureCookie, SESSION_COOKIE_OPTIONS } from '@/lib/security'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // ... autenticación exitosa ...

  const response = NextResponse.json({ success: true })

  // Establecer cookie de sesión
  setSecureCookie(response, {
    name: 'session_token',
    value: sessionToken,
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 3600 // 1 hora
  })

  return response
}
```

### ✅ Cookie Personalizada

```typescript
setSecureCookie(response, {
  name: 'my_cookie',
  value: 'valor',
  maxAge: 86400, // 24 horas
  path: '/',
  httpOnly: true, // No accesible desde JS
  secure: true, // Solo HTTPS
  sameSite: 'strict' // Protección CSRF máxima
})
```

### ✅ Eliminar Cookie

```typescript
import { deleteSecureCookie } from '@/lib/security'

const response = NextResponse.json({ success: true })
deleteSecureCookie(response, 'session_token')
return response
```

---

## 🎯 Checklist de Seguridad

Antes de desplegar a producción, verifica:

### API Routes
- [ ] ✅ Validación CSRF implementada
- [ ] ✅ Rate limiting configurado
- [ ] ✅ Inputs validados y sanitizados
- [ ] ✅ Mensajes de error genéricos (no revelan info)
- [ ] ✅ Cookies con flags seguros

### Formularios Cliente
- [ ] ✅ Hook `useSecureForm` implementado
- [ ] ✅ Token CSRF obtenido
- [ ] ✅ Validación en tiempo real
- [ ] ✅ Mensajes de error mostrados
- [ ] ✅ Estado de carga (disabled) durante envío

### Autenticación
- [ ] ✅ Rate limiting en login
- [ ] ✅ Contraseñas validadas (fortaleza)
- [ ] ✅ Cookies de sesión seguras
- [ ] ✅ Timeout de sesión configurado
- [ ] ✅ Mensajes genéricos en errores

### Headers HTTP
- [ ] ✅ CSP configurado
- [ ] ✅ HSTS habilitado
- [ ] ✅ X-Frame-Options establecido
- [ ] ✅ Permissions-Policy configurado

---

## 🆘 Resolución de Problemas

### Error: "CSRF validation failed"

**Causa:** Token CSRF no presente o inválido.

**Solución:**
```typescript
// Asegúrate de llamar fetchCSRFToken
useEffect(() => {
  fetchCSRFToken()
}, [fetchCSRFToken])

// Y que el token se envíe en el request
const response = await fetch('/api/endpoint', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'x-csrf-token': csrfToken // ← Importante
  },
  body: JSON.stringify(data)
})
```

### Error 429: "Too many requests"

**Causa:** Rate limit excedido.

**Solución:**
- Esperar el tiempo indicado en el header `Retry-After`
- Si es desarrollo, considera aumentar los límites
- Si es producción, verificar que no hay bucles infinitos

### Cookies no se establecen

**Causa:** Flags `Secure` requieren HTTPS.

**Solución:**
```typescript
// En desarrollo local (solo para testing)
setSecureCookie(response, {
  name: 'test',
  value: 'value',
  secure: process.env.NODE_ENV === 'production' // ← Solo secure en prod
})
```

---

## 📚 Recursos Adicionales

- [Documentación Completa](./SEGURIDAD.md)
- [OWASP Top 10](https://owasp.org/Top10/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

---

**¿Preguntas?** Consulta la documentación completa en `docs/SEGURIDAD.md`
