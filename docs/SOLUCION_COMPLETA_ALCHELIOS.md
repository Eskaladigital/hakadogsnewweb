# 🚨 SOLUCIÓN URGENTE: Problema con alchelios@gmail.com

## 📋 Problema

El usuario **alchelios@gmail.com** no puede:
1. ❌ Subir imágenes destacadas en el blog
2. ❌ Cambiar roles de usuarios desde `/administrator/usuarios`

Debe tener **exactamente los mismos permisos** que **contacto@eskaladigital.com**.

---

## ✅ Solución en 3 Pasos

### Paso 1: Asignar Rol Admin a alchelios@gmail.com

Ejecuta este script en **Supabase Dashboard → SQL Editor**:

```
supabase/FIX_ALCHELIOS_SIMPLE.sql
```

**¿Qué hace?**
- ✅ Asigna rol `admin` en la tabla `user_roles`
- ✅ Actualiza el rol en `metadata` de `auth.users`
- ✅ Confirma el email si no está confirmado
- ✅ Verifica que todo está correcto

**Resultado esperado:**
```
✅✅✅ TODO OK para alchelios@gmail.com
```

---

### Paso 2: Corregir Políticas RLS de Storage

Ejecuta este script en **Supabase Dashboard → SQL Editor**:

```
supabase/FIX_BLOG_IMAGES_RLS.sql
```

**¿Qué hace?**
- ✅ Crea la función `is_admin()` con `SECURITY DEFINER`
- ✅ Crea el bucket `blog-images` si no existe
- ✅ Actualiza las políticas RLS de storage para usar la función
- ✅ Evita problemas de permisos circulares

---

### Paso 3: Crear Función para Cambiar Roles

Ejecuta este script en **Supabase Dashboard → SQL Editor**:

```
supabase/FUNCION_UPDATE_USER_ROLE.sql
```

**¿Qué hace?**
- ✅ Crea la función `admin_update_user_role()`
- ✅ Actualiza el rol en AMBOS lugares (`user_roles` Y `metadata`)
- ✅ Solo admins pueden ejecutarla
- ✅ Usa `SECURITY DEFINER` para evitar problemas de permisos

---

## 🔄 Paso Final: Cerrar y Volver a Iniciar Sesión

**MUY IMPORTANTE:** Después de ejecutar los scripts, el usuario **alchelios@gmail.com** debe:

1. **Cerrar sesión** completamente en https://www.hakadogs.com
2. **Volver a iniciar sesión**
3. Probar:
   - ✅ Subir una imagen en el blog
   - ✅ Cambiar el rol de un usuario desde `/administrator/usuarios`

**¿Por qué?** Los cambios en metadata solo se reflejan en la sesión después de volver a iniciar sesión.

---

## 🧪 Verificación

Después de ejecutar los 3 scripts, verifica en **Supabase SQL Editor**:

```sql
-- Verificar estado de ambos admins
SELECT 
  u.email,
  ur.role as rol_tabla,
  u.raw_user_meta_data->>'role' as rol_metadata,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅' 
    ELSE '❌' 
  END as email_confirmado,
  CASE 
    WHEN public.is_admin(u.id) = TRUE THEN '✅' 
    ELSE '❌' 
  END as funcion_is_admin,
  CASE 
    WHEN ur.role = 'admin' 
      AND u.raw_user_meta_data->>'role' = 'admin' 
      AND u.email_confirmed_at IS NOT NULL 
      AND public.is_admin(u.id) = TRUE 
    THEN '✅✅✅ TODO OK'
    ELSE '❌ HAY PROBLEMAS'
  END as estado
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email IN ('alchelios@gmail.com', 'contacto@eskaladigital.com')
ORDER BY u.email;
```

**Resultado esperado:**

| email | rol_tabla | rol_metadata | email_confirmado | funcion_is_admin | estado |
|-------|-----------|--------------|------------------|------------------|---------|
| alchelios@gmail.com | admin | admin | ✅ | ✅ | ✅✅✅ TODO OK |
| contacto@eskaladigital.com | admin | admin | ✅ | ✅ | ✅✅✅ TODO OK |

---

## 📝 Resumen de Scripts

### Scripts Principales (Ejecutar en orden):

1. **`FIX_ALCHELIOS_SIMPLE.sql`** - Asigna rol admin a alchelios@gmail.com
2. **`FIX_BLOG_IMAGES_RLS.sql`** - Corrige políticas RLS de storage
3. **`FUNCION_UPDATE_USER_ROLE.sql`** - Crea función para cambiar roles

### Scripts de Diagnóstico (Opcional):

- **`DIAGNOSTICO_BLOG_IMAGES.sql`** - Diagnostica problemas con storage
- **`FIX_ADMIN_ALCHELIOS_URGENTE.sql`** - Versión detallada (usa el simple)

---

## 🔧 Cambios Técnicos Realizados

### 1. Función `is_admin()` con SECURITY DEFINER

Evita problemas de permisos circulares con RLS:

```sql
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_uuid
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Función `admin_update_user_role()`

Actualiza el rol en ambos lugares:

```sql
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  target_user_id UUID,
  new_role TEXT
)
RETURNS JSON AS $$
BEGIN
  -- Verifica que quien llama es admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Solo los administradores pueden cambiar roles';
  END IF;
  
  -- Actualiza en user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id) DO UPDATE SET role = new_role;
  
  -- Actualiza en auth.users metadata
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', new_role)
  WHERE id = target_user_id;
  
  RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Código TypeScript Actualizado

Usa la nueva función RPC:

```typescript
export async function updateUserRole(
  userId: string,
  newRole: 'admin' | 'user' | 'instructor'
): Promise<UserRole> {
  const { data, error } = await supabase.rpc('admin_update_user_role', {
    target_user_id: userId,
    new_role: newRole
  })
  
  if (error) throw new Error(error.message)
  if (data?.success === false) throw new Error(data.message)
  
  return { user_id: userId, role: newRole } as UserRole
}
```

---

## ⚠️ Importante

- **AMBOS administradores** deben tener exactamente los mismos permisos
- Después de los cambios, **cerrar sesión y volver a entrar**
- Los cambios en metadata NO se reflejan hasta el próximo login
- Si persiste el problema, ejecutar el script de diagnóstico

---

## 📚 Archivos Relacionados

### Scripts SQL:
- `supabase/FIX_ALCHELIOS_SIMPLE.sql` ⭐ **Ejecutar primero**
- `supabase/FIX_BLOG_IMAGES_RLS.sql` ⭐ **Ejecutar segundo**
- `supabase/FUNCION_UPDATE_USER_ROLE.sql` ⭐ **Ejecutar tercero**
- `supabase/DIAGNOSTICO_BLOG_IMAGES.sql` (diagnóstico)

### Código TypeScript:
- `lib/supabase/users.ts` - Función `updateUserRole()` actualizada
- `components/admin/MediaLibrary.tsx` - Manejo de errores mejorado
- `app/administrator/usuarios/page.tsx` - Página de gestión de usuarios

### Documentación:
- `docs/SOLUCION_ERROR_SUBIDA_IMAGENES_BLOG.md`

---

**¿Necesitas ayuda?** Si después de seguir estos pasos el problema persiste, ejecuta el script de diagnóstico y comparte los resultados.
