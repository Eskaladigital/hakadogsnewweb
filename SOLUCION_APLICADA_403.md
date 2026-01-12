# ✅ SOLUCIÓN APLICADA - Error 403 Forbidden

## 🎯 **PROBLEMA IDENTIFICADO**

Después de analizar las políticas RLS en Supabase, confirmamos que:

✅ **Las políticas RLS están correctamente configuradas**
- `users_can_insert_own_lesson_progress` ✓
- `users_can_update_own_lesson_progress` ✓  
- `users_can_view_own_lesson_progress` ✓

❌ **El problema era la configuración del cliente de Supabase**

El cliente de Supabase NO estaba configurado para:
1. **Persistir la sesión del usuario** en localStorage
2. **Auto-refrescar el token** cuando expira
3. **Usar automáticamente** el token de sesión en cada petición

---

## 🔧 **SOLUCIÓN APLICADA**

### **Archivo Modificado**: `lib/supabase/client.ts`

**ANTES** (sin configuración de auth):
```typescript
supabaseInstance = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
```

**DESPUÉS** (con configuración de auth):
```typescript
supabaseInstance = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,          // Mantiene sesión en localStorage
    autoRefreshToken: true,         // Refresca token automáticamente
    detectSessionInUrl: true,       // Detecta sesión en URL
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})
```

---

## 📋 **LO QUE HACE CADA OPCIÓN**

| Opción | Descripción | Impacto |
|--------|-------------|---------|
| `persistSession: true` | Guarda la sesión en localStorage del navegador | ✅ El usuario NO tiene que volver a iniciar sesión cada vez |
| `autoRefreshToken: true` | Refresca automáticamente el token antes de que expire | ✅ Evita errores 401/403 por token expirado |
| `detectSessionInUrl: true` | Detecta tokens en la URL (útil para magic links) | ✅ Funciona con enlaces de verificación de email |
| `storage: localStorage` | Usa localStorage para guardar tokens | ✅ La sesión persiste entre pestañas |

---

## 🚀 **PASOS PARA PROBAR LA SOLUCIÓN**

### **PASO 1: Hacer Deploy**

Si estás en producción (Vercel/Amplify), necesitas hacer deploy:

```bash
# Commit de los cambios
git add lib/supabase/client.ts
git commit -m "fix: configurar persistencia de sesión en cliente Supabase"
git push origin main
```

### **PASO 2: Limpiar Caché Local** (Si pruebas en desarrollo)

Si estás probando en local (`npm run dev`):

1. **Para el servidor**: `Ctrl+C` en la terminal
2. **Borra `.next`**:
   ```bash
   # Windows
   Remove-Item -Recurse -Force .next

   # Mac/Linux
   rm -rf .next
   ```
3. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```

### **PASO 3: Limpiar Caché del Navegador**

1. Abre tu sitio: https://www.hakadogs.com
2. Presiona `Ctrl+Shift+Delete` (Chrome/Edge) o `Cmd+Shift+Delete` (Mac)
3. Selecciona:
   - ✓ Caché e imágenes
   - ✓ Cookies y datos de sitios
4. Haz clic en **"Borrar datos"**
5. Cierra TODAS las pestañas del sitio
6. Abre de nuevo el sitio

### **PASO 4: Iniciar Sesión de Nuevo**

1. Ve a tu sitio
2. **Inicia sesión** con tus credenciales
3. Ve a **Mi Escuela**
4. Abre un curso
5. Abre una lección
6. Haz clic en **"Marcar como Completada"**

### **PASO 5: Verificar en Consola**

Presiona `F12` → Pestaña **Console**

**ANTES** (con error):
```
❌ POST .../user_lesson_progress 403 (Forbidden)
```

**DESPUÉS** (funcionando):
```
✅ POST .../user_lesson_progress 201 (Created)
✅ Lección marcada como completada
```

---

## 🔍 **POR QUÉ ESTO SOLUCIONA EL PROBLEMA**

### **El Flujo del Problema Original:**

1. Usuario inicia sesión → ✅ Obtiene token de acceso
2. Token se guarda en memoria (NO en localStorage) → ⚠️
3. Usuario navega a una lección → ✅
4. Usuario hace clic en "Marcar como Completada" → ⚠️
5. Cliente Supabase intenta hacer POST sin token → ❌ **403 Forbidden**

### **El Flujo DESPUÉS del Fix:**

1. Usuario inicia sesión → ✅ Obtiene token de acceso
2. Token se guarda en **localStorage** → ✅
3. Usuario navega a una lección → ✅
4. Usuario hace clic en "Marcar como Completada" → ✅
5. Cliente Supabase **usa automáticamente el token de localStorage** → ✅ **201 Created**

---

## 🧪 **VERIFICACIÓN ADICIONAL**

Si después de los pasos anteriores **SIGUE** sin funcionar:

### **Verificar que la sesión está guardada:**

1. Abre la consola del navegador (`F12`)
2. Ve a la pestaña **Application**
3. Expande **Local Storage** → Selecciona tu dominio
4. Busca claves que empiecen con `sb-` (Supabase)
5. **Deberías ver**:
   - `sb-[project-id]-auth-token`
   - Contiene un JSON con `access_token`, `refresh_token`, etc.

**Si NO ves estas claves:**
- Cierra sesión completamente
- Borra todas las cookies y localStorage
- Vuelve a iniciar sesión
- Verifica de nuevo

### **Verificar token en consola:**

Ejecuta esto en la consola del navegador:

```javascript
// Obtener sesión actual
const supabase = window.supabase || createClient()
const { data } = await supabase.auth.getSession()
console.log('Sesión actual:', data.session)
console.log('User ID:', data.session?.user?.id)
console.log('Access Token:', data.session?.access_token?.substring(0, 20) + '...')
```

**Resultado esperado:**
```
Sesión actual: { user: {...}, access_token: "eyJ...", ... }
User ID: "abc-123-def-456"
Access Token: "eyJhbGciOiJIUzI1NiIs..."
```

**Si muestra `null`:**
- El usuario NO está autenticado correctamente
- Necesitas reiniciar sesión

---

## 📊 **RESUMEN DE CAMBIOS**

| Archivo | Cambio | Razón |
|---------|--------|-------|
| `lib/supabase/client.ts` | Añadido objeto `auth` con opciones | Configurar persistencia y auto-refresh de sesión |

---

## ✅ **CHECKLIST FINAL**

Marca cuando completes cada paso:

### Código
- [x] Modificado `lib/supabase/client.ts`
- [ ] Commit realizado
- [ ] Push a repositorio
- [ ] Deploy completado (si aplica)

### Pruebas Locales
- [ ] Borrada carpeta `.next`
- [ ] Servidor reiniciado
- [ ] Sesión cerrada
- [ ] Caché del navegador limpiado
- [ ] Sesión iniciada de nuevo
- [ ] Lección marcada correctamente (201)

### Producción
- [ ] Deploy completado
- [ ] Caché de Vercel/Amplify limpiado
- [ ] Navegador con caché limpia
- [ ] Usuario puede marcar lecciones (201)

---

## 🎉 **RESULTADO ESPERADO**

Después de aplicar estos cambios:

✅ Usuario inicia sesión → Sesión persiste en localStorage
✅ Usuario navega entre páginas → Sesión se mantiene
✅ Usuario marca lección como completada → **200/201 Success**
✅ Token expira → Se refresca automáticamente
✅ Usuario cierra pestaña → Al volver sigue autenticado

---

## 🆘 **SI AÚN NO FUNCIONA**

Ejecuta el script de diagnóstico:

```bash
test-insert.bat
```

Este script:
1. Se autentica con tus credenciales
2. Lista cursos y lecciones
3. Intenta marcar una como completada
4. **Te muestra el error exacto** si falla

Y envíame el output completo para ayudarte.

---

## 📚 **DOCUMENTACIÓN ADICIONAL**

- [Supabase Auth - Client Options](https://supabase.com/docs/reference/javascript/initializing#with-additional-parameters)
- [Supabase Auth - Session Management](https://supabase.com/docs/guides/auth/sessions)
- [Supabase RLS - Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**Fecha de solución**: 2026-01-12
**Problema**: Error 403 al marcar lecciones como completadas
**Causa raíz**: Cliente Supabase sin configuración de persistencia de sesión
**Solución**: Configurar `persistSession`, `autoRefreshToken` y `storage` en el cliente
