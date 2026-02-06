# 🛡️ Sistema de Protección Anti-Bots Multicapa

## ✅ Implementación Completada

Este documento describe el sistema de protección multicapa contra bots implementado en el formulario de registro de Hakadogs.

---

## 📋 Características

### 🔐 Capa 1: Google reCAPTCHA v3
- Sistema invisible que analiza el comportamiento del usuario
- Score-based filtering (bloquea scores < 0.5)
- Sin fricción para usuarios legítimos

### 🍯 Capa 2: Honeypot Field
- Campo oculto que solo los bots llenan
- Bloqueo instantáneo si se detecta valor
- Invisible para usuarios humanos

### 🚦 Capa 3: Rate Limiting por IP
- Máximo 5 intentos cada 15 minutos por IP
- Protege contra ataques automatizados
- Reseteo automático después del período

### 📝 Capa 4: Validación Backend
- Verificación de tokens en servidor
- No se confía en validaciones del cliente
- Logging completo para análisis

---

## 🔧 Componentes Implementados

### 1. Variables de Entorno (`.env.local`)

```env
# Google reCAPTCHA v3
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LfW9WIsAAAAAA2Zcmg8uFiNXvrO_2-56d6mLmYr
RECAPTCHA_SECRET_KEY=6LfW9WIsAAAAAAVM3yrgZP2Vge7QWm4FRelIi0Um
```

### 2. Utilidad de Rate Limiting (`/lib/utils/rateLimit.ts`)

**Función**: Controlar intentos por IP

**Características**:
- Almacenamiento en memoria (Map)
- Limpieza automática de IPs antiguas
- Extracción de IP desde múltiples headers (Vercel, Cloudflare, etc.)
- Funciones de estadísticas y reseteo

**Configuración**:
```typescript
checkRateLimit(
  ip,
  5,              // Máximo 5 intentos
  15 * 60 * 1000  // Cada 15 minutos
)
```

### 3. API Endpoint (`/app/api/verify-recaptcha/route.ts`)

**Función**: Verificar tokens de reCAPTCHA en el servidor

**Protecciones en orden**:
1. ✅ **Rate Limiting** - Verifica límite de intentos por IP
2. ✅ **Token Validation** - Envía el token a Google para verificación
3. ✅ **Score Validation** - Valida score ≥ 0.5
4. ✅ **Action Validation** - Valida que la acción sea 'registro'

**Headers de respuesta**:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1675789200000
```

### 4. Formulario de Registro (`/app/cursos/auth/registro/page.tsx`)

**Protecciones integradas**:

#### 🍯 Honeypot Field
```tsx
<div className="hidden" aria-hidden="true">
  <input
    type="text"
    id="website"
    name="website"
    value={honeypot}
    onChange={(e) => setHoneypot(e.target.value)}
    tabIndex={-1}
    autoComplete="off"
  />
</div>
```

**Validación en submit**:
```typescript
if (honeypot) {
  console.warn('🤖 Bot detectado: honeypot field llenado')
  setError('Registro no permitido.')
  return
}
```

#### 🔐 reCAPTCHA v3
- Carga del script de Google
- Ejecución antes de enviar formulario
- Verificación del token en servidor
- Solo permite registro si todas las verificaciones pasan

---

## 🚀 Cómo Funciona

### Flujo Completo de Registro con Protección Multicapa

```
Usuario completa formulario
         ↓
Click en "Crear Cuenta"
         ↓
[CAPA 1: Honeypot Check]
¿Campo oculto tiene valor?
    ↓        ↓
   SÍ       NO
    ↓        ↓
BLOQUEADO   Continuar
    ↓        ↓
         [CAPA 2: reCAPTCHA v3]
         Token generado en background
         ↓
         Token enviado al servidor
         ↓
         [CAPA 3: Rate Limiting]
         ¿IP ha excedido 5 intentos?
             ↓        ↓
            SÍ       NO
             ↓        ↓
         BLOQUEADO  Continuar
         (esperar)    ↓
                [CAPA 4: Verificación Google]
                ¿Score ≥ 0.5?
                  ↓        ↓
                 NO       SÍ
                  ↓        ↓
              BLOQUEADO  Permitir registro
                  ↓        ↓
                Error   Cuenta creada ✅
```

### Escenarios de Protección

#### 🤖 Bot Simple (sin JavaScript)
- **Bloqueado por**: Honeypot + reCAPTCHA faltante
- **Tiempo de detección**: Inmediato

#### 🤖 Bot Automatizado (Selenium/Puppeteer)
- **Bloqueado por**: reCAPTCHA score bajo (< 0.5)
- **Tiempo de detección**: < 1 segundo

#### 🤖 Ataque Masivo (mismo IP)
- **Bloqueado por**: Rate Limiting después de 5 intentos
- **Tiempo de bloqueo**: 15 minutos

#### 👤 Usuario Legítimo
- **Resultado**: Registro exitoso
- **Experiencia**: Sin fricción, sin captchas visibles

---

## 📊 Logs y Debugging

### En el Frontend (Consola del navegador)

```javascript
✅ reCAPTCHA script cargado
🔐 Ejecutando reCAPTCHA...
🔐 Token obtenido, verificando en servidor...
✅ Verificación exitosa, procediendo con registro...
```

### En el Backend (Logs del servidor)

**Registro exitoso**:
```
✅ Rate limit OK para IP 192.168.1.1: 4 intentos restantes
🔐 Verificación reCAPTCHA: {
  success: true,
  score: 0.9,
  action: 'registro',
  hostname: 'hakadogs.com'
}
✅ reCAPTCHA verificado exitosamente (score: 0.9)
```

**Bot detectado por Honeypot**:
```
🤖 Bot detectado: honeypot field llenado
```

**Bot detectado por reCAPTCHA**:
```
⚠️ Puntuación de reCAPTCHA muy baja: 0.3 (mínimo: 0.5)
```

**Rate Limit excedido**:
```
🚫 Rate limit excedido para IP: 192.168.1.1
Response: 429 Too Many Requests
Headers:
  X-RateLimit-Limit: 5
  X-RateLimit-Remaining: 0
  X-RateLimit-Reset: 1675789200000
```

---

## 🔒 Seguridad

### ✅ Implementado

- Token de reCAPTCHA verificado en servidor (no se confía en el cliente)
- Secret Key guardada en variables de entorno (no expuesta)
- Validación de acción ('registro' específicamente)
- Score threshold configurable

### 🚫 NO Confiar en

- Validaciones solo del lado del cliente
- Tokens sin verificar
- Claves expuestas en el código

---

## 📈 Monitoreo y Ajustes

### Ajustar el Score Mínimo de reCAPTCHA

Edita `/app/api/verify-recaptcha/route.ts` línea 106:

```typescript
const minScore = 0.5 // Cambiar según necesidad
```

**Recomendaciones**:
- **0.3-0.4**: Más permisivo (permite más usuarios legítimos, pero también algunos bots)
- **0.5**: Balance recomendado ⭐
- **0.6-0.7**: Más restrictivo (puede bloquear algunos usuarios legítimos)

### Ajustar Rate Limiting

Edita `/app/api/verify-recaptcha/route.ts` líneas 16-19:

```typescript
const rateLimitResult = checkRateLimit(
  clientIp,
  5,              // Máximo de intentos (aumentar a 10 si hay false positives)
  15 * 60 * 1000  // Ventana de tiempo (reducir a 5 min para más seguridad)
)
```

**Configuraciones sugeridas**:
- **Desarrollo**: `10 intentos / 5 minutos`
- **Producción Normal**: `5 intentos / 15 minutos` ⭐
- **Bajo Ataque**: `3 intentos / 30 minutos`

### Ver Estadísticas en Google

1. Ve a: https://www.google.com/recaptcha/admin
2. Selecciona tu sitio "Hakadogs - Registro Cursos"
3. Revisa las métricas:
   - Solicitudes totales
   - Distribución de scores
   - Tasa de bloqueo

### Monitorear Rate Limiting

Añade un endpoint de estadísticas (solo para admins):

```typescript
// /app/api/admin/rate-limit-stats/route.ts
import { getRateLimitStats } from '@/lib/utils/rateLimit'

export async function GET() {
  const stats = getRateLimitStats()
  return Response.json(stats)
}
```

---

## 🧪 Cómo Probar

### Prueba 1: Registro Normal (Usuario Humano)

1. Ir a: https://hakadogs.com/cursos/auth/registro
2. Llenar el formulario normalmente
3. NO llenar el campo oculto (honeypot)
4. Click en "Crear Cuenta"
5. **Resultado esperado**: ✅ Registro exitoso

### Prueba 2: Detectar Bot con Honeypot

1. Abrir DevTools (F12)
2. En la consola, ejecutar:
   ```javascript
   document.querySelector('#website').value = 'bot'
   ```
3. Intentar registrarse
4. **Resultado esperado**: ❌ "Registro no permitido"

### Prueba 3: Rate Limiting

1. Intentar registrarse 6 veces rápidamente
2. **Resultado esperado**: 
   - Primeros 5 intentos: Procesados normalmente
   - Intento 6: ❌ "Demasiados intentos. Espera X minutos"

### Prueba 4: Verificar Logs de reCAPTCHA

```bash
# En consola del navegador
# Debería ver:
✅ reCAPTCHA script cargado
🔐 Ejecutando reCAPTCHA...
✅ reCAPTCHA verificado (score: 0.9)
```

### Prueba 5: Simular Bot (para testing)

Para testing avanzado con herramientas de automatización:

```javascript
// Script de Puppeteer
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('https://hakadogs.com/cursos/auth/registro');
  
  // Llenar formulario rápidamente (comportamiento de bot)
  await page.type('input[type="text"]', 'Bot Name');
  await page.type('input[type="email"]', 'bot@test.com');
  await page.type('input[type="password"]', 'password123');
  
  // Resultado esperado: Bloqueado por reCAPTCHA (score bajo)
  
  await browser.close();
})();
```

---

## ❓ Solución de Problemas

### Error: "Sistema de seguridad no disponible"

**Causa**: El script de reCAPTCHA no se cargó

**Solución**:
1. Verificar conexión a internet
2. Verificar que Google reCAPTCHA no esté bloqueado (extensiones, firewall)
3. Verificar la Site Key en `.env.local`
4. Revisar la consola del navegador para errores

### Error: "Verificación de seguridad fallida"

**Causa**: Token inválido o score muy bajo

**Solución**:
1. Revisar logs del servidor para ver el score exacto
2. Si es un usuario legítimo con score bajo, considerar reducir el threshold
3. Verificar que la Secret Key sea correcta
4. Verificar que los dominios en Google reCAPTCHA Admin incluyan tu dominio

### Error: "Demasiados intentos"

**Causa**: Rate limit excedido (>5 intentos en 15 minutos)

**Solución**:
1. Esperar el tiempo indicado (mostrado en el mensaje)
2. Si es en desarrollo, aumentar el límite temporalmente
3. Si es un usuario legítimo, resetear manualmente la IP (ver función `resetRateLimit`)

### Error: "Registro no permitido"

**Causa**: Honeypot field detectó valor (bot)

**Solución**:
1. Si eres un usuario legítimo, NO llenes el campo oculto
2. Si estás testeando, desactiva autofill/autollenado
3. Verificar que no haya extensiones del navegador llenando campos automáticamente

### Bots Siguen Registrándose

**Posibles causas**:
1. Score threshold muy bajo → aumentar a 0.6-0.7
2. Rate limit muy permisivo → reducir a 3 intentos / 30 minutos
3. Bots sofisticados con scores altos → implementar verificación de email obligatoria
4. Bots usando la API directamente → implementar autenticación en API

**Soluciones adicionales**:
- ✅ Ya implementado: reCAPTCHA v3, Honeypot, Rate Limiting
- 🔜 Considerar implementar:
  - Verificación de email obligatoria en Supabase
  - Validación de dominios de email (bloquear .info, .xyz sospechosos)
  - CAPTCHA v2 visible como fallback para scores 0.3-0.5
  - Cloudflare Bot Management
  - Análisis de patrones de nombres (detectar códigos aleatorios)

---

## 📝 Mantenimiento

### Renovar Claves

Si necesitas renovar las claves de reCAPTCHA:

1. Ve a: https://www.google.com/recaptcha/admin
2. Crea un nuevo sitio o regenera claves
3. Actualiza `.env.local`
4. Reinicia el servidor de desarrollo

### Actualizar Dominios

Si cambias de dominio:

1. Ve a Google reCAPTCHA Admin
2. Añade el nuevo dominio a la lista
3. No necesitas cambiar código

---

## 📞 Soporte

Si encuentras problemas con el sistema de protección:

1. Revisa los logs del servidor y navegador
2. Verifica las métricas en Google reCAPTCHA Admin
3. Ajusta el score threshold según necesidad
4. Considera implementar capas adicionales de protección si los bots persisten

---

**✅ Sistema Implementado y Listo para Producción**

Fecha: 6 de febrero de 2026
Versión: reCAPTCHA v3
