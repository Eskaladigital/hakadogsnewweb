-- =====================================================
-- FIX: ERROR RLS AL SUBIR IMÁGENES DEL BLOG
-- =====================================================
-- Problema: Las políticas RLS consultan directamente user_roles
--           lo que puede causar problemas de permisos circulares
-- Solución: Usar función SECURITY DEFINER is_admin() 
-- =====================================================

-- PASO 1: Asegurar que la función is_admin existe y tiene permisos correctos
-- =====================================================

-- Crear o reemplazar función is_admin con SECURITY DEFINER
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

-- Dar permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO anon;

COMMENT ON FUNCTION public.is_admin(UUID) IS 
'Verifica si un usuario tiene rol admin. Usa SECURITY DEFINER para evitar problemas de permisos RLS.';

-- PASO 2: Crear o verificar que el bucket existe
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true, -- Bucket público para que las imágenes sean accesibles
  10485760, -- 10MB límite de tamaño de archivo
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- PASO 3: Eliminar políticas existentes (si las hay)
-- =====================================================

DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Blog images public read" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin insert" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin update" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin delete" ON storage.objects;

-- PASO 4: Crear políticas usando la función is_admin()
-- =====================================================

-- Política: Los administradores pueden subir imágenes
CREATE POLICY "Admins can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND public.is_admin(auth.uid())
);

-- Política: Los administradores pueden actualizar imágenes
CREATE POLICY "Admins can update blog images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND public.is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND public.is_admin(auth.uid())
);

-- Política: Los administradores pueden eliminar imágenes
CREATE POLICY "Admins can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND public.is_admin(auth.uid())
);

-- Política: Cualquiera puede ver las imágenes del blog (público)
CREATE POLICY "Everyone can view blog images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- PASO 5: Verificación
-- =====================================================

-- Verificar que el bucket existe
SELECT 
  id,
  name,
  public as is_public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'blog-images';

-- Verificar políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'objects'
AND (policyname LIKE '%blog images%' OR policyname LIKE '%blog-images%')
ORDER BY policyname;

-- Verificar función is_admin
SELECT 
  proname as function_name,
  prosecdef as is_security_definer,
  proacl as permissions
FROM pg_proc
WHERE proname = 'is_admin';

-- =====================================================
-- DIAGNÓSTICO: Verificar usuario admin actual
-- =====================================================
-- Ejecuta esto con el email del usuario que tiene problemas
-- para verificar que tiene rol admin

-- ⚠️ CAMBIAR EL EMAIL POR EL DEL USUARIO QUE TIENE PROBLEMAS
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  ur.role as role_en_tabla,
  CASE 
    WHEN public.is_admin(u.id) THEN '✅ Es admin'
    ELSE '❌ NO es admin'
  END AS verificado_con_funcion,
  CASE 
    WHEN u.raw_user_meta_data->>'role' = 'admin' THEN '✅ Rol en metadata'
    ELSE '❌ Sin rol en metadata'
  END AS metadata_status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'CAMBIAR_POR_EMAIL_DEL_USUARIO';  -- ⚠️ CAMBIAR AQUÍ

-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 1. Este script usa la función is_admin() con SECURITY DEFINER
--    para evitar problemas de permisos circulares con RLS
-- 
-- 2. La función is_admin() ejecuta con permisos del creador,
--    por lo que puede leer user_roles sin problemas de RLS
--
-- 3. Si un usuario sigue teniendo problemas después de ejecutar esto:
--    a) Verifica que el usuario tiene rol 'admin' en user_roles
--    b) Verifica que el email está confirmado (email_confirmed_at IS NOT NULL)
--    c) Verifica que está autenticado correctamente
--
-- 4. Para asignar rol admin a un usuario:
--    INSERT INTO public.user_roles (user_id, role)
--    SELECT id, 'admin'
--    FROM auth.users
--    WHERE email = 'email@ejemplo.com'
--    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
-- =====================================================
