-- =====================================================
-- CONFIGURACIÓN COMPLETA DE STORAGE PARA BLOG
-- Ejecutar como admin en Supabase SQL Editor
-- =====================================================

-- Crear bucket para imágenes del blog
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5 MB límite
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) 
DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- =====================================================
-- POLÍTICAS DE ACCESO (RLS)
-- =====================================================

-- Eliminar políticas anteriores si existen
DROP POLICY IF EXISTS "Blog images public read" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin insert" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin update" ON storage.objects;
DROP POLICY IF EXISTS "Blog images admin delete" ON storage.objects;

-- 1. Permitir lectura pública de todas las imágenes del blog
CREATE POLICY "Blog images public read"
ON storage.objects 
FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- 2. Solo admins pueden subir imágenes
CREATE POLICY "Blog images admin insert"
ON storage.objects 
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 3. Solo admins pueden actualizar imágenes
CREATE POLICY "Blog images admin update"
ON storage.objects 
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 4. Solo admins pueden eliminar imágenes
CREATE POLICY "Blog images admin delete"
ON storage.objects 
FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images'
  AND EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- =====================================================
-- VERIFICACIÓN
-- =====================================================

-- Verificar que el bucket se creó correctamente
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE id = 'blog-images';

-- Verificar las políticas creadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%Blog images%'
ORDER BY policyname;

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

COMMENT ON TABLE storage.buckets IS 'Storage buckets - blog-images añadido para imágenes de artículos del blog';
