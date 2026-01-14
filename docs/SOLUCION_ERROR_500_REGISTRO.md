# 🚨 SOLUCIÓN ERROR 500 EN REGISTRO DE USUARIOS

**Error encontrado:** `Database error saving new user` (Error 500)  
**Fecha:** 14 de enero de 2026  
**Estado:** SOLUCIÓN DISPONIBLE ✅

---

## 🔍 DIAGNÓSTICO DEL PROBLEMA

El error ocurre porque:

1. **Trigger automático** `on_auth_user_created_create_role` intenta insertar en `user_roles`
2. Las **políticas RLS** de `user_roles` bloquean la inserción desde el trigger
3. El trigger **NO tiene los permisos** necesarios para insertar
4. Resultado: **Error 500** y el usuario no se puede registrar

**Stack trace del error:**
```
POST https://pfmqkioftagjnxqyrngk.supabase.co/auth/v1/signup 500
Database error saving new user
```

---

## ✅ SOLUCIÓN RECOMENDADA (OPCIÓN 1 - SIMPLE)

### Eliminar el Trigger Problemático

El sistema **NO necesita** la tabla `user_roles` porque:
- ✅ El rol se guarda en `auth.users.user_metadata.role` (desde el frontend)
- ✅ El código actual lee el rol desde `user_metadata`
- ✅ Funciona perfectamente sin trigger

### Pasos para aplicar la solución:

1. **Ir a Supabase Dashboard**
   - Abre tu proyecto en https://supabase.com
   - Ve a `SQL Editor`

2. **Ejecutar este SQL:**

```sql
-- Eliminar el trigger problemático
DROP TRIGGER IF EXISTS on_auth_user_created_create_role ON auth.users;

-- Eliminar la función del trigger
DROP FUNCTION IF EXISTS create_user_with_role();
```

3. **Verificar que se eliminó:**

```sql
-- Debería retornar 0 filas
SELECT * FROM pg_trigger 
WHERE tgname = 'on_auth_user_created_create_role';
```

4. **Probar el registro:**
   - Ve a https://hakadogs.com/cursos/auth/registro
   - Intenta crear una nueva cuenta
   - ✅ Debería funcionar sin error 500

---

## 🔧 SOLUCIÓN ALTERNATIVA (OPCIÓN 2 - CONSERVAR TABLA)

Si prefieres mantener la tabla `user_roles`:

### Script SQL mejorado:

```sql
-- Función con manejo de errores mejorado
CREATE OR REPLACE FUNCTION public.create_user_with_role_safe()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Intentar insertar el rol, pero si falla, no bloquear
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      -- Si hay error, solo loguearlo pero continuar
      RAISE WARNING 'Could not create user role for %: %', NEW.id, SQLERRM;
  END;
  
  -- CRÍTICO: Siempre retornar NEW
  RETURN NEW;
END;
$$;

-- Recrear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created_create_role ON auth.users;
CREATE TRIGGER on_auth_user_created_create_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_with_role_safe();

-- Desactivar temporalmente RLS para permitir inserción del trigger
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
```

**Nota:** Esta opción es más compleja y puede seguir causando problemas.

---

## 📋 ARCHIVOS DE SOLUCIÓN CREADOS

He creado 3 archivos SQL con las soluciones:

1. **`supabase/FIX_REGISTRO_USUARIOS.sql`** (Solución completa con RLS)
2. **`supabase/FIX_ALTERNATIVO_SIMPLE.sql`** (Solución simple - RECOMENDADA)
3. **`supabase/user_roles_table.sql`** (Script original con el problema)

---

## 🎯 INSTRUCCIONES PASO A PASO

### Método Rápido (5 minutos):

1. **Abrir Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/pfmqkioftagjnxqyrngk
   ```

2. **Ir a SQL Editor**
   - Click en "SQL Editor" en el menú lateral
   - Click en "New query"

3. **Copiar y pegar este código:**
   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created_create_role ON auth.users;
   DROP FUNCTION IF EXISTS create_user_with_role();
   ```

4. **Click en "Run"**

5. **Probar el registro:**
   - Volver a https://hakadogs.com/cursos/auth/registro
   - Intentar crear cuenta con datos de prueba
   - ✅ Debería funcionar

---

## 🔍 VERIFICACIÓN POST-FIX

Después de aplicar la solución, verifica:

### 1. Que el trigger se eliminó:
```sql
SELECT * FROM pg_trigger 
WHERE tgname = 'on_auth_user_created_create_role';
-- Resultado esperado: 0 filas
```

### 2. Probar registro de usuario:
- Ve a `/cursos/auth/registro`
- Crea una cuenta de prueba
- Verifica que NO aparece error 500
- Verifica que redirige a `/cursos/mi-escuela`

### 3. Verificar que el rol se guardó:
```sql
-- Ver el nuevo usuario en auth.users
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'role' as role,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
-- Debe mostrar role = 'user'
```

### 4. Probar funcionalidad:
- ✅ Acceder a `/cursos/mi-escuela`
- ✅ Ver el curso gratuito
- ✅ Completar una lección
- ✅ Ver progreso guardado

---

## 🤔 ¿POR QUÉ ESTA SOLUCIÓN FUNCIONA?

### Problema Original:
```
Usuario se registra 
  ↓
Supabase crea en auth.users
  ↓
Trigger intenta insertar en user_roles
  ↓
❌ RLS bloquea la inserción (no hay usuario autenticado en contexto del trigger)
  ↓
Error 500: "Database error saving new user"
```

### Solución Aplicada:
```
Usuario se registra 
  ↓
Supabase crea en auth.users con user_metadata.role='user'
  ↓
✅ No hay trigger, no hay bloqueo
  ↓
✅ Usuario creado exitosamente
  ↓
Frontend lee el rol desde user_metadata
```

---

## 🔐 SEGURIDAD

**Pregunta:** ¿Es seguro eliminar la tabla `user_roles`?

**Respuesta:** ✅ SÍ, porque:

1. El código actual **no usa** la tabla `user_roles`
2. El rol se guarda en `auth.users.user_metadata.role` (controlado por Supabase)
3. El frontend **siempre** asigna `role: 'user'` en el registro
4. Solo el admin puede cambiar roles (desde el panel de admin)

**Verificación en el código:**

```typescript
// lib/supabase/auth.ts - línea 82-84
options: {
  data: {
    name,
    role: 'user', // ⬅️ SIEMPRE 'user' para nuevos registros
  },
}
```

```typescript
// lib/supabase/auth.ts - línea 146-158
// getSession() lee desde user_metadata, NO desde user_roles
const userMetadataRole = data.session.user.user_metadata?.role
if (userMetadataRole === 'admin') {
  role = 'admin'
}
```

---

## ✅ CHECKLIST DE SOLUCIÓN

- [ ] Abrir Supabase Dashboard
- [ ] Ir a SQL Editor
- [ ] Ejecutar `DROP TRIGGER IF EXISTS on_auth_user_created_create_role ON auth.users;`
- [ ] Ejecutar `DROP FUNCTION IF EXISTS create_user_with_role();`
- [ ] Verificar que el trigger se eliminó (query de verificación)
- [ ] Probar registro desde la web
- [ ] Confirmar que NO hay error 500
- [ ] Confirmar que redirige a `/cursos/mi-escuela`
- [ ] Verificar que el curso gratuito aparece
- [ ] ✅ SOLUCIÓN COMPLETA

---

## 📞 SI EL PROBLEMA PERSISTE

Si después de aplicar la solución el error continúa:

1. **Limpiar caché del navegador:**
   - Ctrl + Shift + R (Windows/Linux)
   - Cmd + Shift + R (Mac)

2. **Verificar en Supabase Dashboard > Authentication:**
   - Ir a "Settings" > "Authentication"
   - Verificar que "Enable email confirmations" está configurado como prefieras
   - Si está activado, el usuario recibirá un email de confirmación

3. **Revisar logs de Supabase:**
   - Ir a "Logs" > "Auth Logs"
   - Buscar el error específico
   - Compartir el mensaje de error completo

4. **Probar con configuración permisiva temporal:**
   ```sql
   -- SOLO PARA PRUEBAS
   ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
   ```
   - Intentar registrarse
   - Si funciona, el problema es RLS
   - Reactivar RLS después: `ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;`

---

## 🎓 APRENDIZAJE

**Lección importante:** Los triggers de base de datos en Supabase deben tener `SECURITY DEFINER` y manejar excepciones correctamente, o pueden bloquear operaciones críticas como el registro de usuarios.

**Mejor práctica:** Para datos no críticos como roles, es mejor:
- Guardar en `user_metadata` (más simple)
- Sincronizar con tabla externa solo si es necesario (con lógica de aplicación)
- No usar triggers que puedan fallar y bloquear operaciones core

---

**Última actualización:** 14 de enero de 2026  
**Estado:** SOLUCIÓN LISTA PARA APLICAR ✅  
**Tiempo estimado:** 5 minutos
