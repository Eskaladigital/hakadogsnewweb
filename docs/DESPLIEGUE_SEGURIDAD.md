# 🚀 Guía de Despliegue - Medidas de Seguridad

Esta guía explica cómo verificar y desplegar las mejoras de seguridad implementadas en la aplicación HakaDogs.

---

## 📋 Pre-requisitos

Antes de desplegar, asegúrate de tener:

- [x] Node.js 18+ instalado
- [x] Acceso al repositorio
- [x] Variables de entorno configuradas
- [x] Acceso a Vercel/servidor de producción

---

## ✅ Verificación Local

### 1. Instalar Dependencias

```bash
npm install
```

**Nota:** No se requieren nuevas dependencias. Todo usa las librerías existentes (Next.js, Zod).

### 2. Verificar Compilación

```bash
npm run build
```

Debe compilar sin errores. Si hay errores de TypeScript, revisa los imports.

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

### 4. Probar Headers de Seguridad

Abre el navegador y ve a `http://localhost:3000`. Abre DevTools (F12) → Network → Selecciona cualquier request → Headers.

**Verifica que aparezcan:**
```
content-security-policy: default-src 'self'; ...
strict-transport-security: max-age=63072000; includeSubDomains; preload
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
referrer-policy: strict-origin-when-cross-origin
permissions-policy: camera=(), microphone=(), ...
```

### 5. Probar API de CSRF

```bash
curl http://localhost:3000/api/csrf
```

**Respuesta esperada:**
```json
{
  "token": "abc123..."
}
```

### 6. Probar Rate Limiting

Ejecuta múltiples requests rápidos a cualquier endpoint protegido:

```bash
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/csrf
done
```

Después de varios intentos, deberías recibir un error 429.

---

## 🔧 Configuración de Variables de Entorno

### Desarrollo (.env.local)

```env
NODE_ENV=development

# Supabase (mantener las existentes)
NEXT_PUBLIC_SUPABASE_URL=tu_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_key

# Otras variables existentes...
```

### Producción (.env.production)

```env
NODE_ENV=production

# Asegúrate de que NODE_ENV esté en production para activar:
# - Flag Secure en cookies
# - Otros comportamientos de producción
```

**Importante:** En Vercel, `NODE_ENV=production` se establece automáticamente.

---

## 🌐 Despliegue en Vercel

### Paso 1: Commit y Push

```bash
git add .
git commit -m "feat: implementar medidas de seguridad OWASP

- Añadir módulo de seguridad completo
- Configurar headers de seguridad HTTP
- Implementar protección CSRF
- Añadir rate limiting
- Implementar validación y sanitización
- Configurar cookies seguras
- Añadir documentación completa"

git push origin main
```

### Paso 2: Despliegue Automático

Vercel detectará el push y desplegará automáticamente.

### Paso 3: Verificar Producción

Una vez desplegado, verifica los headers:

```bash
curl -I https://hakadogs.com
```

**O usa herramientas online:**
- [Security Headers](https://securityheaders.com/?q=hakadogs.com)
- [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html?d=hakadogs.com)
- [Mozilla Observatory](https://observatory.mozilla.org/)

**Puntuaciones esperadas:**
- Security Headers: A o A+
- SSL Labs: A o A+
- Mozilla Observatory: B+ o superior

### Paso 4: Verificar HTTPS

Asegúrate de que:
- [x] Todo el tráfico es HTTPS
- [x] No hay advertencias de contenido mixto
- [x] HSTS está activo (verifica header)

---

## 🧪 Testing en Producción

### 1. Test de CSRF

```bash
# Obtener token
TOKEN=$(curl -s https://hakadogs.com/api/csrf | jq -r '.token')

# Intentar sin token (debe fallar)
curl -X POST https://hakadogs.com/api/ejemplo \
  -H "Content-Type: application/json" \
  -d '{"data":"test"}'
# Esperado: 403 Forbidden

# Intentar con token (debe funcionar)
curl -X POST https://hakadogs.com/api/ejemplo \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: $TOKEN" \
  -d '{"data":"test"}'
# Esperado: 200 OK o respuesta válida
```

### 2. Test de Rate Limiting

Usa una herramienta como Apache Bench:

```bash
# Hacer 20 requests rápidos
ab -n 20 -c 5 https://hakadogs.com/api/csrf
```

Deberías ver algunas respuestas 429 después de exceder el límite.

### 3. Test de Cookies

Abre DevTools → Application → Cookies → hakadogs.com

**Verifica que las cookies de sesión tengan:**
- ✅ HttpOnly: true
- ✅ Secure: true
- ✅ SameSite: Lax o Strict

### 4. Test de Headers

```bash
curl -I https://hakadogs.com | grep -i "content-security-policy\|strict-transport\|x-frame\|x-content-type"
```

Todos los headers deben estar presentes.

---

## 🔍 Monitoreo Post-Despliegue

### Primera Semana

Monitorea:
1. **Logs de errores** - ¿Hay errores 403 legítimos?
2. **Rate limiting** - ¿Se están bloqueando usuarios reales?
3. **Formularios** - ¿Funcionan correctamente con CSRF?
4. **Performance** - ¿Impacto en velocidad? (debería ser mínimo)

### Métricas Clave

```bash
# Vercel Analytics - Revisa:
- Errores 403 (CSRF rechazos)
- Errores 429 (rate limit)
- Tiempo de respuesta promedio
- Tasa de conversión de formularios
```

### Ajustes Comunes

Si hay problemas:

1. **Muchos 403 CSRF:**
   - Verifica que los formularios llamen a `fetchCSRFToken()`
   - Asegúrate de que el token se envíe en requests POST

2. **Muchos 429 Rate Limit:**
   - Ajusta los límites en `RATE_LIMIT_PRESETS`
   - Considera identificar por usuario autenticado en vez de IP

3. **CSP bloqueando recursos:**
   - Añade dominios necesarios al CSP en `next.config.js`

---

## 🛠️ Mantenimiento

### Actualizaciones Regulares

```bash
# Actualizar dependencias de seguridad
npm audit
npm audit fix

# Revisar vulnerabilidades conocidas
npm outdated
```

### Auditorías Periódicas

**Cada 3 meses:**
- [ ] Ejecutar escaneo de seguridad (securityheaders.com)
- [ ] Revisar logs de intentos de ataque
- [ ] Actualizar contraseñas comunes bloqueadas
- [ ] Revisar y ajustar rate limits si es necesario

**Cada 6 meses:**
- [ ] Auditoría de seguridad completa
- [ ] Revisar documentación
- [ ] Actualizar políticas de contraseñas si hay nuevos estándares

---

## 🚨 Rollback (Si es necesario)

Si hay problemas críticos después del despliegue:

### Opción 1: Rollback Completo

En Vercel:
1. Ve a tu proyecto → Deployments
2. Encuentra el despliegue anterior (antes de las mejoras)
3. Click en "..." → "Promote to Production"

### Opción 2: Deshabilitar Features Específicas

Si solo un feature causa problemas:

**Deshabilitar CSRF:**
```typescript
// Comentar en API routes:
// const csrf = await validateCSRFToken(request)
// if (!csrf.valid) return ...
```

**Deshabilitar Rate Limiting:**
```typescript
// Comentar en API routes:
// const rate = applyRateLimit(...)
// if (!rate.allowed) return ...
```

**Relajar CSP:**
```javascript
// next.config.js - temporalmente añadir 'unsafe-inline' si es necesario
// NO RECOMENDADO para permanente
```

---

## 📞 Soporte

### Si encuentras problemas:

1. **Revisa la documentación:**
   - [SEGURIDAD.md](./docs/SEGURIDAD.md)
   - [SEGURIDAD_GUIA_RAPIDA.md](./docs/SEGURIDAD_GUIA_RAPIDA.md)

2. **Verifica logs:**
   ```bash
   # Vercel
   vercel logs
   
   # O en Vercel Dashboard → tu proyecto → Logs
   ```

3. **Testing local:**
   Reproduce el problema en desarrollo para debuggear

4. **Contacto:**
   Si es una vulnerabilidad, usa: security@hakadogs.com

---

## ✅ Checklist Final

Antes de considerar el despliegue completo:

### Pre-Despliegue
- [ ] Código compilado sin errores (`npm run build`)
- [ ] Tests manuales pasados en desarrollo
- [ ] Headers verificados localmente
- [ ] CSRF funcionando
- [ ] Rate limiting probado
- [ ] Variables de entorno configuradas

### Post-Despliegue
- [ ] Headers verificados en producción (securityheaders.com)
- [ ] SSL/TLS verificado (ssllabs.com)
- [ ] CSRF funcionando en producción
- [ ] Rate limiting activo
- [ ] Cookies con flags correctos
- [ ] Formularios funcionan correctamente
- [ ] No hay errores en logs
- [ ] Performance sin degradación

### Comunicación
- [ ] Equipo notificado de las mejoras
- [ ] Documentación compartida
- [ ] Plan de monitoreo establecido
- [ ] Política de seguridad publicada

---

## 🎉 ¡Despliegue Exitoso!

Una vez completado el checklist, tu aplicación estará protegida con:

✅ Protección CSRF completa  
✅ Rate limiting contra brute force  
✅ Validación y sanitización de inputs  
✅ Cookies seguras con todos los flags  
✅ Headers de seguridad HTTP óptimos  
✅ Documentación completa  

**¡Felicitaciones! Tu aplicación ahora tiene seguridad de nivel empresarial.**

---

**Versión:** 1.0.0  
**Fecha:** 12 Enero 2026  
**Autor:** HakaDogs Security Team
