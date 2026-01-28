# 🔴 SOLUCIÓN: Error "Usuario no existe" al intentar hacer Login

## 📋 Problema Reportado

Un usuario con email **verificado en Supabase** (sin rol admin) intenta hacer login y recibe el mensaje:
- ❌ **"Su usuario no existe"**
- ❌ **"Invalid login credentials"**

## 🔍 Causas Posibles

Cuando un usuario **SÍ existe** en Supabase pero no puede hacer login, puede deberse a:

### 1. **Email no confirmado** (Más común) 🔴
- El usuario existe pero `email_confirmed_at` está en `NULL`
- Supabase requiere confirmación de email por defecto
- **Síntoma:** Error "Email not confirmed" o "Invalid login credentials"

### 2. **Usuario eliminado (soft delete)** ⚠️
- El campo `deleted_at` tiene una fecha
- El usuario técnicamente existe pero está marcado como eliminado
- **Síntoma:** Error "User not found"

### 3. **Usuario baneado** ⚠️
- El campo `banned_until` tiene una fecha futura
- Supabase bloquea el acceso temporalmente
- **Síntoma:** Error "User is banned"

### 4. **Sin rol asignado** ⚠️
- El usuario existe en `auth.users` pero no en `user_roles`
- Puede causar problemas al intentar acceder a ciertas páginas después del login
- **Síntoma:** Login exitoso pero error 403/406 al navegar

### 5. **Configuración de Supabase** ⚙️
- Email confirmation requerido pero el usuario no confirmó su email
- Rate limiting activado (demasiados intentos fallidos)
- **Síntoma:** Error "Too many requests" o "Email not confirmed"

## ✅ Solución Paso a Paso

### **PASO 1: Ejecutar el diagnóstico**

1. Ve a **Supabase Dashboard → SQL Editor**
2. Abre el archivo: `supabase/FIX_ERROR_USUARIO_NO_EXISTE.sql`
3. **Cambia TODAS las ocurrencias de:**
   ```sql
   'email@usuario.com'
   ```
   Por el email del usuario afectado (ejemplo: `'juan.perez@gmail.com'`)

4. **Ejecuta el PASO 1 del script** (líneas 1-70 aproximadamente)
5. Observa los resultados de las 4 verificaciones:
   - ✅ ¿Usuario existe en auth.users?
   - ✅ ¿Email confirmado?
   - ✅ ¿Usuario eliminado?
   - ✅ ¿Tiene rol asignado?

### **PASO 2: Aplicar las soluciones según el diagnóstico**

#### Si el problema es: **Email no confirmado**
```sql
-- SOLUCIÓN A
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW()),
  updated_at = NOW()
WHERE 
  email = 'juan.perez@gmail.com' -- ⚠️ Cambiar email
  AND email_confirmed_at IS NULL;
```

#### Si el problema es: **Usuario eliminado**
```sql
-- SOLUCIÓN B
UPDATE auth.users
SET 
  deleted_at = NULL,
  updated_at = NOW()
WHERE 
  email = 'juan.perez@gmail.com' -- ⚠️ Cambiar email
  AND deleted_at IS NOT NULL;
```

#### Si el problema es: **Usuario baneado**
```sql
-- SOLUCIÓN C
UPDATE auth.users
SET 
  banned_until = NULL,
  updated_at = NOW()
WHERE 
  email = 'juan.perez@gmail.com' -- ⚠️ Cambiar email
  AND banned_until IS NOT NULL;
```

#### Si el problema es: **Sin rol asignado**
```sql
-- SOLUCIÓN D
INSERT INTO public.user_roles (user_id, role)
SELECT 
  id, 
  'user' as role
FROM auth.users
WHERE 
  email = 'juan.perez@gmail.com' -- ⚠️ Cambiar email
  AND id NOT IN (SELECT user_id FROM public.user_roles)
ON CONFLICT (user_id) DO NOTHING;
```

### **PASO 3: Verificación final**

Ejecuta el PASO 3 del script para ver el estado final:

```sql
SELECT 
  u.id,
  u.email,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
    ELSE '❌ Email NO confirmado'
  END as email_status,
  CASE 
    WHEN u.deleted_at IS NULL THEN '✅ Usuario activo'
    ELSE '❌ Usuario eliminado'
  END as deleted_status,
  COALESCE(ur.role, '❌ Sin rol') as role_status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'juan.perez@gmail.com'; -- ⚠️ Cambiar email
```

**Resultado esperado:**
- ✅ Email confirmado
- ✅ Usuario activo
- ✅ Usuario no baneado
- ✅ Tiene rol: user

### **PASO 4: Pedir al usuario que intente login nuevamente**

1. El usuario debe ir a: `/cursos/auth/login`
2. Introducir su email y contraseña
3. Si todo está correcto, debería poder acceder a `/cursos/mi-escuela`

## 🛠️ Función de Diagnóstico Rápido

El script incluye una función para diagnosticar rápidamente cualquier usuario:

```sql
-- Usar en Supabase SQL Editor
SELECT * FROM diagnose_user_login('juan.perez@gmail.com');
```

Esta función devuelve:
- **Problema:** Descripción del problema detectado
- **Severidad:** CRÍTICO, ALTO, MEDIO, OK
- **Solución:** Query SQL o instrucciones para resolver el problema

## 📊 Verificar Configuración de Supabase

### Authentication Settings (Dashboard)

Ve a: **Authentication → Settings**

Verifica estas configuraciones:

1. **Enable email confirmations:**
   - ✅ **OFF** = Los usuarios pueden hacer login sin confirmar email (más fácil para testing)
   - ⚠️ **ON** = Requiere confirmación de email (más seguro para producción)

2. **Email templates:**
   - Verifica que el template de confirmación tenga el link correcto
   - Debe apuntar a tu dominio: `https://tudominio.com/auth/callback`

3. **Rate limiting:**
   - Si está muy restrictivo, puede bloquear usuarios legítimos
   - Recomendado: 5-10 intentos por minuto

## 🔄 Soluciones Alternativas

### Opción 1: Enviar email de confirmación nuevamente
Desde **Supabase Dashboard:**
1. Ve a **Authentication → Users**
2. Busca el usuario por email
3. Click en **Actions → Send Magic Link**
4. El usuario recibirá un email para confirmar

### Opción 2: Resetear contraseña
Si el problema es la contraseña:
1. Ve a **Authentication → Users**
2. Busca el usuario
3. Click en **Actions → Send Password Reset**
4. El usuario recibirá un email para cambiar su contraseña

### Opción 3: Deshabilitar confirmación de email (solo para testing)
**⚠️ NO RECOMENDADO PARA PRODUCCIÓN**

En **Supabase Dashboard → Authentication → Settings:**
- Deshabilita "Enable email confirmations"
- Esto permite que los usuarios hagan login sin confirmar su email

Luego confirma todos los usuarios existentes:
```sql
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;
```

## 📝 Prevención Futura

### Trigger automático para confirmar emails

El script incluye un trigger para auto-confirmar usuarios con rol admin:

```sql
CREATE OR REPLACE FUNCTION auto_confirm_admin_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    UPDATE auth.users
    SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_auto_confirm_admin_email
  AFTER INSERT OR UPDATE OF role ON public.user_roles
  FOR EACH ROW
  WHEN (NEW.role = 'admin')
  EXECUTE FUNCTION auto_confirm_admin_email();
```

### Confirmar todos los usuarios automáticamente (testing)

Si quieres que todos los usuarios puedan hacer login sin confirmación:

```sql
-- Confirmar TODOS los usuarios existentes
UPDATE auth.users
SET 
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;
```

## 🐛 Errores Comunes y Sus Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| "Invalid login credentials" | Email no confirmado o contraseña incorrecta | Confirmar email (SOLUCIÓN A) o resetear contraseña |
| "User not found" | Usuario eliminado o no existe | Restaurar usuario (SOLUCIÓN B) o registrarse de nuevo |
| "Email not confirmed" | Email sin verificar | Confirmar email (SOLUCIÓN A) |
| "Too many requests" | Rate limiting activado | Esperar 5-10 minutos e intentar de nuevo |
| "User is banned" | Usuario baneado | Desbanear usuario (SOLUCIÓN C) |

## 📞 Soporte

Si ninguna de estas soluciones funciona:

1. **Verificar en Supabase Dashboard:**
   - Authentication → Users → Buscar usuario
   - Ver si aparece en la lista
   - Ver el campo "Confirmed At"

2. **Ver logs de Supabase:**
   - Logs → Auth logs
   - Buscar intentos de login del usuario
   - Ver el error exacto

3. **Verificar contraseña:**
   - Pedir al usuario que resetee su contraseña
   - Usar "Send Password Reset" desde Dashboard

## ✅ Checklist de Verificación

Antes de decir que está resuelto, verifica:

- [ ] Usuario existe en `auth.users`
- [ ] `email_confirmed_at` tiene una fecha (no NULL)
- [ ] `deleted_at` es NULL
- [ ] `banned_until` es NULL o fecha pasada
- [ ] Usuario tiene rol en `user_roles`
- [ ] Usuario puede hacer login desde `/cursos/auth/login`
- [ ] Usuario puede acceder a `/cursos/mi-escuela`

## 🎯 Resumen Ejecutivo

**Para resolver rápidamente:**

1. Abre `supabase/FIX_ERROR_USUARIO_NO_EXISTE.sql`
2. Reemplaza `'email@usuario.com'` por el email real del usuario
3. Ejecuta el script completo en Supabase SQL Editor
4. Verifica el resultado de la verificación final
5. Pide al usuario que intente login nuevamente

**Solución más común (90% de casos):**
```sql
UPDATE auth.users
SET email_confirmed_at = NOW(), confirmed_at = NOW()
WHERE email = 'email.del.usuario@gmail.com';
```

---

**Fecha:** 28 enero 2026  
**Estado:** ✅ SCRIPT DE SOLUCIÓN CREADO  
**Archivo SQL:** `supabase/FIX_ERROR_USUARIO_NO_EXISTE.sql`
