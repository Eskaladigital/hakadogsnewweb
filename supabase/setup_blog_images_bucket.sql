-- =====================================================
-- CONFIGURACIÓN DEL BUCKET BLOG-IMAGES
-- =====================================================
-- Este script crea el bucket para imágenes del blog
-- y configura las políticas RLS necesarias
-- =====================================================

-- 1. CREAR BUCKET SI NO EXISTE
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

-- 2. ELIMINAR POLÍTICAS EXISTENTES (si las hay)
-- =====================================================
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Everyone can view blog images" ON storage.objects;

-- 3. POLÍTICAS DE ACCESO
-- =====================================================

-- Política: Los administradores pueden subir imágenes
CREATE POLICY "Admins can upload blog images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Política: Los administradores pueden actualizar imágenes
CREATE POLICY "Admins can update blog images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Política: Los administradores pueden eliminar imágenes
CREATE POLICY "Admins can delete blog images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Política: Cualquiera puede ver las imágenes del blog (público)
CREATE POLICY "Everyone can view blog images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- 4. VERIFICACIÓN
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

-- Verificar políticas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE '%blog images%'
ORDER BY policyname;

-- =====================================================
-- NOTAS:
-- =====================================================
-- 1. Este script debe ejecutarse en el SQL Editor de Supabase
-- 2. El bucket será público para que las imágenes sean accesibles sin autenticación
-- 3. Solo administradores pueden subir/modificar/eliminar imágenes
-- 4. El límite de tamaño es 10MB por archivo
-- 5. Solo se permiten archivos de imagen (JPEG, PNG, WEBP, GIF)
-- =====================================================
