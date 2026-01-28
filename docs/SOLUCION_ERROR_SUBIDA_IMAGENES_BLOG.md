# 🔧 Solución: Error al Subir Imágenes Destacadas del Blog

## 📋 Problema

Un usuario administrador intenta subir imágenes destacadas para artículos del blog y recibe el error:

```
Error al subir las imágenes: new row violates row-level security policy
```

## 🔍 Causa Raíz

El problema ocurre porque las políticas RLS (Row Level Security) de Supabase Storage están intentando verificar el rol del usuario consultando directamente la tabla `user_roles`, pero las políticas RLS de `user_roles` pueden estar bloqueando esa lectura, creando un problema circular de permisos.

## ✅ Solución

### Paso 1: Ejecutar Script de Corrección

1. Ve al **Dashboard de Supabase**: https://supabase.com/dashboard
2. Navega a **SQL Editor** en el menú lateral
3. Abre el archivo `supabase/FIX_BLOG_IMAGES_RLS.sql`
4. Copia todo el contenido del script
5. Pégalo en el SQL Editor
6. Haz clic en **Run** (Ejecutar)

Este script:
- ✅ Crea/actualiza la función `is_admin()` con `SECURITY DEFINER` para evitar problemas de permisos
- ✅ Crea el bucket `blog-images` si no existe
- ✅ Actualiza las políticas RLS para usar la función `is_admin()` en lugar de consultar directamente `user_roles`
- ✅ Verifica que todo está configurado correctamente

### Paso 2: Verificar el Usuario Admin

Si el problema persiste después de ejecutar el script, verifica que el usuario tiene rol de administrador:

1. En el **SQL Editor** de Supabase, ejecuta:

```sql
-- Verificar usuarios admin
SELECT 
  u.email,
  ur.role as rol_en_tabla,
  CASE 
    WHEN public.is_admin(u.id) THEN '✅ Verificado como admin'
    ELSE '❌ NO verificado como admin'
  END as verificado,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmado'
    ELSE '❌ Email NO confirmado'
  END as email_status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'EMAIL_DEL_USUARIO';  -- ⚠️ Cambiar por el email del usuario
```

2. Si el usuario **NO tiene rol admin**, ejecuta:

```sql
-- Asignar rol admin a un usuario
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'EMAIL_DEL_USUARIO'  -- ⚠️ Cambiar por el email del usuario
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

3. Si el email **NO está confirmado**, ejecuta:

```sql
-- Confirmar email del usuario
UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
WHERE email = 'EMAIL_DEL_USUARIO';  -- ⚠️ Cambiar por el email del usuario
```

### Paso 3: Diagnóstico Completo (Opcional)

Si necesitas un diagnóstico completo del problema, ejecuta el script `supabase/DIAGNOSTICO_BLOG_IMAGES.sql` en el SQL Editor de Supabase. Este script verificará:

- ✅ Si el bucket `blog-images` existe
- ✅ Si las políticas RLS están configuradas
- ✅ Si la función `is_admin()` está correctamente configurada
- ✅ Si el usuario tiene rol de administrador
- ✅ Si el email del usuario está confirmado

## 🔒 Cambios Técnicos Realizados

### 1. Función `is_admin()` con SECURITY DEFINER

La función ahora usa `SECURITY DEFINER`, lo que significa que ejecuta con los permisos del creador de la función, evitando problemas de permisos circulares con RLS:

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

### 2. Políticas RLS Actualizadas

Las políticas ahora usan la función `is_admin()` en lugar de consultar directamente `user_roles`:

```sql
CREATE POLICY "Admins can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND public.is_admin(auth.uid())
);
```

### 3. Mejoras en el Componente MediaLibrary

El componente `MediaLibrary.tsx` ahora:
- ✅ Verifica la autenticación antes de subir
- ✅ Verifica que el bucket existe
- ✅ Muestra mensajes de error más específicos y útiles
- ✅ Proporciona instrucciones claras para resolver problemas

## 📝 Verificación Post-Solución

Después de aplicar la solución, verifica que:

- [ ] El bucket `blog-images` existe en Supabase Storage
- [ ] El bucket está marcado como **Público**
- [ ] Las 4 políticas RLS están activas:
  - `Admins can upload blog images` (INSERT)
  - `Admins can update blog images` (UPDATE)
  - `Admins can delete blog images` (DELETE)
  - `Everyone can view blog images` (SELECT)
- [ ] La función `is_admin()` existe y tiene `SECURITY DEFINER`
- [ ] El usuario tiene rol `admin` en `user_roles`
- [ ] El email del usuario está confirmado
- [ ] Puedes subir imágenes desde el panel de administración

## 🐛 Troubleshooting

### Error: "Function is_admin does not exist"

**Solución**: Ejecuta el script `FIX_BLOG_IMAGES_RLS.sql` completo.

### Error: "Bucket blog-images does not exist"

**Solución**: El script `FIX_BLOG_IMAGES_RLS.sql` crea el bucket automáticamente. Si no se crea, créalo manualmente en Supabase Dashboard → Storage → Create bucket.

### Error persiste después de aplicar la solución

1. Verifica que ejecutaste el script completo sin errores
2. Ejecuta el script de diagnóstico: `DIAGNOSTICO_BLOG_IMAGES.sql`
3. Verifica que el usuario está autenticado correctamente
4. Verifica que el usuario tiene rol admin en `user_roles`
5. Intenta cerrar sesión y volver a iniciar sesión

## 📚 Archivos Relacionados

- `supabase/FIX_BLOG_IMAGES_RLS.sql` - Script de corrección principal
- `supabase/DIAGNOSTICO_BLOG_IMAGES.sql` - Script de diagnóstico
- `supabase/setup_blog_images_bucket.sql` - Script de configuración inicial (alternativo)
- `components/admin/MediaLibrary.tsx` - Componente que sube las imágenes

## ✅ Checklist Final

- [ ] Script `FIX_BLOG_IMAGES_RLS.sql` ejecutado sin errores
- [ ] Bucket `blog-images` existe y es público
- [ ] Políticas RLS configuradas correctamente
- [ ] Función `is_admin()` existe con SECURITY DEFINER
- [ ] Usuario tiene rol admin verificado
- [ ] Email del usuario confirmado
- [ ] Prueba de subida de imagen exitosa

---

**Nota**: Si después de seguir todos estos pasos el problema persiste, contacta al administrador del sistema con los resultados del script de diagnóstico.
